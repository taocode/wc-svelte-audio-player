<svelte:options tag="taocode-audio-player" />

<script>

	import { setContext } from 'svelte'
	import { writable, derived } from 'svelte/store'
  import { fly } from 'svelte/transition'
	// TODO: use jsmediatags to load ID3
	// https://github.com/aadsm/jsmediatags

	import { contextStores as CS, advanceOptions } from './lib.js'
  	
	import TrackHeading from './TrackHeading.svelte'
	import ProgressBarTime from './ProgressBarTime.svelte'
	import Controls from './Controls.svelte'
	import PlayList from './PlayList.svelte'
  import VolumeSlider from './VolumeSlider.svelte'
  import VolumeIcon from './svg/volume.svg.svelte'
  import XSquareIcon from './svg/x-square.svg.svelte'
  import RepeatLoopIcon from './svg/repeat-loop.svg.svelte'
  import RepeatAutoIcon from './svg/repeat-auto.svg.svelte'
  import RepeatNoneIcon from './svg/repeat-none.svg.svelte'

	export let skip = 10
	export let skiptime = 'hide'
	export let advance = 'auto'
	export let playlist
	export let playlistlocation = 'bottom'
	export let playlistshow = false
	export let advancecontrol = false
	let playlistAtTop = playlistlocation === 'top'

	// lots of setup
	const tracks = writable([])
	let parsedTracks = []
	try {
		parsedTracks = JSON.parse(playlist)
	} catch (err) {
		console.warn(`Playlist isn't JSON, will try single URL: ${playlist}`,err.message)
	}
	if (!parsedTracks.length) {
		try {
			const checkURL = new URL(playlist) // throws error if malformed
			// console.log({checkURL})
			if (checkURL.host && /^https?:/.test(checkURL.protocol)) parsedTracks.push(playlist)
			else console.warn(`Playlist URL: "${playlist}" is malformed, it must be a full URL that starts with https:// or http:// and is otherwise properly shaped`)
		} catch (err) {
			console.warn(`Playlist URL: "${playlist}" is malformed, see docs`,err.message)
		}
	}
	tracks.set(parsedTracks.map(c => Array.isArray(c) ? ({ src: c[0], title: c[1] }) : ({ src: c })))
	setContext(CS.TRACKS,tracks)
	
	const currentIndex = writable(-1)
	setContext(CS.CURRENT_INDEX,currentIndex)

	const currentTime = writable(0)
	setContext(CS.CURRENT_TIME,currentTime)
	
	const currentTrack = derived([currentIndex, tracks], ([$i, $t]) => $i < $t.length && $i >= 0 ? $t[$i] : false)
	setContext(CS.CURRENT_TRACK,currentTrack)
	
	const trackDuration = derived(currentTrack, ($t) => $t && 'duration' in $t ? $t.duration : false)
	setContext(CS.TRACK_DURATION,trackDuration)
	
	const progress = derived([currentTime,trackDuration], ([$t,$d]) => $t * 100 / ($d || 0.000001))
	setContext(CS.PROGRESS,progress)
	
	const isReady = writable(false)
	setContext(CS.IS_READY,isReady)

	const isPlaying = writable(false)
	setContext(CS.IS_PLAYING,isPlaying)

	const isError = writable(false)
	setContext(CS.IS_ERROR,isError)

	const playWhenReady = writable(false)
	setContext(CS.PLAY_WHEN_READY,playWhenReady)

	const skipStore = writable(skip)
	setContext(CS.SKIP,skipStore)

	const advanceStore = writable(advance)
	setContext(CS.ADVANCE,advanceStore)

	const showSkipTime = writable(skiptime === "show")
	setContext(CS.SHOW_SKIP_TIME,showSkipTime)

	const volume = writable(80)
	setContext(CS.VOLUME, volume)

	const reverseDirection = writable(false)
	setContext(CS.REVERSE_DIRECTION, reverseDirection)

	const updateCurrentTime = () => {
		currentTime.set(audioPlayer.currentTime)
	}

	// when track data changes onload or onerror,
	// notify the store of the change
	const updateTrackList = () => {
		tracks.set($tracks)
	}

	const audioTag = writable(new Audio())
	
	const audioPlayer = $audioTag
	audioTag.preload = "none"
	audioPlayer.addEventListener('play', () => { 
		isPlaying.set(true)
		// console.log('play!')
		trackProgress(true)
	})
	audioPlayer.addEventListener('pause', () => {
		// console.log("pause!!")
		isPlaying.set(false)
		trackProgress(false)
	})
	audioPlayer.addEventListener('canplay', () => {
		// console.log('canplay',{$currentIndex,$playWhenReady})
		isReady.set(true)
		isError.set(false)
		reverseDirection.set(false)
		updateCurrentTime()
	})
	audioPlayer.addEventListener('canplaythrough', () => {
		updateCurrentTime()
		// console.log('canplaythrough',{$currentIndex,$playWhenReady})
		if ($playWhenReady) {
			audioPlayer.play()
		}
	})
	const autoAdvance = () => {
		if ($advanceStore === 'loop' 
			|| ($advanceStore === 'auto' && $currentIndex < $tracks.length-1)
			|| $reverseDirection) { // = previous track desired via button so ignore advance rules
			playWhenReady.set(true)
			currentIndex.update(n => n+($reverseDirection ? -1 : 1))
		}
	}
	audioPlayer.addEventListener('ended', () => { 
		// console.log('ended track ',$currentIndex,$tracks.length)
		currentTime.set($trackDuration)
		updateCurrentTime()
		autoAdvance()
	})
	audioPlayer.addEventListener('error', () => {
		const t = $currentTrack
		t.error = true
		t.loading = false
		// t.duration = 0
		isError.set(true)
		updateTrackList()
		audioPlayer.pause()
		audioPlayer.currentTime = 0
		console.error(`Audio error track: ${$currentIndex} - ${$currentTrack.src}`,$currentTrack)
		updateCurrentTime()
		autoAdvance()
	})
	setContext(CS.AUDIO_TAG,audioTag)
	

	let progressTracker
	const trackProgress = (watch) => {
		clearInterval(progressTracker)
		if (watch) {
			progressTracker = setInterval(updateCurrentTime, 100)
		}
	}
	
	const setAudioFrom = (track) => {
		// console.log('setAudioFrom',track,typeof track.loaded === undefined)
		if (! track ) return
		audioPlayer.pause()
		audioPlayer.currentTime = 0
		audioPlayer.src = track.src
		// console.log('setAudio',audioPlayer.src)
		updateCurrentTime()
	}
	const loadTrack = (index, track) => {
		// console.info(`loadTrack()`,index,track)
		if (!audioPlayer) {
			console.warn('loadTrack() odd condition: ',{index,audioPlayer,$currentTrack})
			return
		}
		track.loading = true
		isReady.set(false)
		audioPlayer.onloadedmetadata = () => {
			// console.log(`metadata loaded for ${$currentIndex}: ${track.title} `)
			track.loaded = true
			track.loading = false
			track.duration = audioPlayer.duration
			updateTrackList()
		}
		setAudioFrom(track)
		audioPlayer.load()
	}
	const loadCurrentTrack = () => {
		loadTrack($currentIndex,$currentTrack)
	}
	// auto-load track on every $currentIndex change
	function autoLoad(index) {
		const track = $currentTrack
		const lastIndex = $tracks.length-1
		if ( ! track || index < 0 || index > lastIndex ) {
			// illegal value, reset to 0 or last track, try again with first or last
			const newIndex = index < 0 ? lastIndex : 0
			// console.log(`invalid autoLoad(${index}), reseting to ${newIndex}`,index,'/',$tracks.length,track)
			currentIndex.set(newIndex)
			autoLoad(newIndex) 
			return
		}
		if ( ! track.loading) {
			loadCurrentTrack()
		} else {
			console.log('Not loading')
		}
	}
	currentIndex.set(0)
	$: autoLoad($currentIndex)

	let showVolume = false
	let showAdvance = true

	$: showAdvance = advancecontrol === 'show' || advancecontrol === 'true'

	const advanceNext = () => {
    advanceStore.set(advanceOptions[nextStateIndex])
  }

  let stateIndex = advanceOptions.indexOf($advanceStore)
  let nextStateIndex = 0 
  $: {
    stateIndex = advanceOptions.indexOf($advanceStore)
    nextStateIndex = (stateIndex+1 >= advanceOptions.length) ? 0
    : stateIndex + 1
  }

</script>

{#if $tracks < 1}
<div class="error-no-playlist">
	<h2>No Playlist!</h2>
	<p>You must provide a valid playlist attribute.</p>
	<pre>
		&lt;taocode-audio-player playlist='["url-to-audio","second-url"]'&gt;&lt;/taocode-audio-player&gt;
		&lt;taocode-audio-player playlist='[["url-to-audio","title 1"],["second-url","title 2"]]'&gt;&lt;/taocode-audio-player&gt;
	</pre>
	</div>
	{:else}
	<main class="audio-player" class:playlistAtTop
	style="
--color-error: hsl(0,75%,50%);">
		<section id="player-cont">

			<TrackHeading />

			<div class="vol-prog-rep">
				<button title="Adjust volume" on:click={()=>showVolume = !showVolume}>
					<span class="icon">
						<VolumeIcon volume={$volume} />
					</span>
				</button>
				<ProgressBarTime />
				{#if showVolume}
				<div transition:fly={{ y: 20, duration: 300}} class="show-volume">
					<button on:click={()=>showVolume = false}><span class="icon">
						<XSquareIcon />
					</span></button>
					<VolumeSlider />
				</div>
				{/if}
				{#if showAdvance}
				<button title={`Change auto advance to ${advanceOptions[nextStateIndex]}`} on:click={advanceNext}>
					<span class="icon">
						{#if $advanceStore === 'loop'}
						<RepeatLoopIcon />
						{:else if $advanceStore === 'auto'}
						<RepeatAutoIcon />
						{:else}
						<RepeatNoneIcon />
						{/if}
					</span>
				</button>
				{/if}
			
			</div>

			<Controls />

		</section>
		<PlayList show={playlistshow} atTop={playlistAtTop} />
	</main>
	{/if}

<style>
	.error-no-playlist {
		background-color: pink;
		padding: 0.5em;
		text-align: center;
		color: #800E;
	}

	.error-no-playlist h2 {
		margin-top: 0.1em;
	}

	main {
		display: flex;
		margin: 0 auto;
		max-width: 15em;
		flex-direction: column;
		align-items: center;
		/* 		justify-content: center; */
		width: fit-content;
		border-radius: var(--audio-player-border-radius, 0);
	}
	
	#player-cont {
		padding: 0.25rem 0.5rem;
		box-shadow: var(--audio-player-shadow, none);
		background: var(--audio-player-background, #EEE);
		color: var(--audio-player-color, #333);
		border-radius: var(--audio-player-border-radius, 0);
		width: 13em;
	}

	.vol-prog-rep {
		display: flex;
		position: relative;
	}
	.vol-prog-rep button {
		border: none;
		padding: 0.1em 0.25em;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	button:first-child {
		padding-right: 0.5em;
	}
	button:last-child {
		padding-left: 0.5em;
		padding-right: 0;
	}
	.vol-prog-rep .icon {
		display: inline-block;
		height: 1.5em;
		width: 1.5em;
	}
	.show-volume button {
		margin-right: 0.5em;
	}

	.playlistAtTop>:last-child {
		order: -1;
	}

	.show-volume {
    display: flex;
    position: absolute;
    z-index: 10;
    width: 100%;
    top: -1em;
    left: 0em;
    right: -1.5em;
    background-color: #FFFa;
    padding: 0 0.25ch;
    box-shadow: 0 0 5px #0003;
  }

</style>