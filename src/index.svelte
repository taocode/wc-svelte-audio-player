<svelte:options tag="taocode-audio-player" />

<script>
	import { onMount, setContext } from 'svelte'
	import { writable, derived } from 'svelte/store'
  import { fly } from 'svelte/transition'
	// TODO: use jsmediatags to load ID3
	// https://github.com/aadsm/jsmediatags

	import { contextStores as CS, advanceOptions, hideOptions, showOptions } from './lib.js'
  	
	import TrackHeading from './TrackHeading.svelte'
	import ProgressBarTime from './ProgressBarTime.svelte'
	import Controls from './Controls.svelte'
	import PlayList from './PlayList.svelte'
  import VolumeSlider from './VolumeSlider.svelte'
  import VolumeIcon from './svg/volume.svg.svelte'
  import XIcon from './svg/x.svg.svelte'
  import RepeatIcon from './svg/repeat.svg.svelte'
  import PlayControl from './PlayControl.svelte';

	export let playlist
	export let skiptime = 10
	export let showskiptime = 'hide'
	export let showskip = 'hide'
	export let advance = 'auto'
	export let playlistlocation = 'bottom'
	export let expandplaylist = 'false'
	export let showplaylist = 'show'
	export let showplaylistbutton = 'true'
	export let showadvance = 'hide'
	export let showcontrols = 'show'
	export let showheading = 'show'
	export let randomhue = 'false'
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
			if (checkURL.host && /^https?:/.test(checkURL.protocol)) parsedTracks.push(playlist)
			else console.warn(`Playlist URL: "${playlist}" is malformed, it must be a full URL that starts with https:// or http:// and is otherwise properly shaped`)
		} catch (err) {
			console.warn(`Playlist URL: "${playlist}" is malformed, see docs`,err.message)
		}
	}
	tracks.set(parsedTracks.map(c => c.src ? c 
															: Array.isArray(c) 
																? ({ src: c[0], title: c[1] }) 
																	: ({ src: c })))
	setContext(CS.TRACKS,tracks)
	
	const currentIndex = writable(-2)
	setContext(CS.CURRENT_INDEX,currentIndex)

	const currentTime = writable(0)
	setContext(CS.CURRENT_TIME,currentTime)
	
	const currentTrack = derived([currentIndex, tracks], ([$i, $t]) => $i < $t.length && $i >= 0 ? $t[$i] : false)
	setContext(CS.CURRENT_TRACK,currentTrack)
	
	const trackDuration = writable(0.0000001)
	setContext(CS.TRACK_DURATION,trackDuration)
	
	const progress = derived([currentTime,trackDuration], ([$t,$d]) => $t / ($d || 0.000001))
	progress.set = (val) => currentTime.set(val * $trackDuration) 
	setContext(CS.PROGRESS,progress)
	
	const buffered = writable([])
	setContext(CS.BUFFERED,buffered)

	const isReady = writable(false)
	setContext(CS.READY,isReady)

	const paused = writable(true)
	setContext(CS.PAUSED,paused)

	const isError = writable(false)
	setContext(CS.ERROR,isError)

	const playWhenReady = writable(false)
	setContext(CS.PLAY_WHEN_READY,playWhenReady)

	const skipTimeStore = writable(skiptime)
	setContext(CS.SKIP_TIME,skipTimeStore)

	const advanceStore = writable(advance)
	setContext(CS.ADVANCE,advanceStore)

	const showSkipTime = writable(showOptions.includes(showskiptime))
	setContext(CS.SHOW_SKIP_TIME,showSkipTime)

	const volume = writable(0.8)
	setContext(CS.VOLUME, volume)

	const reverseDirection = writable(false)
	setContext(CS.REVERSE_DIRECTION, reverseDirection)

	// when track data changes onload or onerror,
	// notify the store of the change
	const updateTrackList = () => {
		tracks.set($tracks)
	}

	// const audioTag = writable(new Audio())
	
	let audioPlayer
	
	const setAudioFrom = (track) => {
		// console.log('setAudioFrom',track,typeof track.loaded === undefined)
		if (! track ) return
		paused.set(true)
		currentTime.set(0)
		audioPlayer.src = track.src
		// console.log('setAudio',audioPlayer.src)
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
			if (index < -1) return // -2 indicates 1st load, ignore
			const newIndex = index < 0 ? lastIndex : 0
			console.log(`invalid autoLoad(${index}), reseting to ${newIndex}`,index,'/',$tracks.length,track)
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
	
	onMount(() => {
		audioPlayer.preload = "metadata"

		audioPlayer.addEventListener('canplay', () => {
			// console.log('canplay',{$currentIndex,$playWhenReady})
			isReady.set(true)
			isError.set(false)
			reverseDirection.set(false)
		})
		audioPlayer.addEventListener('canplaythrough', () => {
			// console.log('canplaythrough',{$currentIndex,$playWhenReady})
			if ($playWhenReady) {
				paused.set(false)
			}
		})
		const autoAdvance = () => {
			if ($advanceStore === 'repeat') {
				currentTime.set(0)
			} else if ($advanceStore === 'loop' 
				|| ($advanceStore === 'auto' && $currentIndex < $tracks.length-1)
				|| $reverseDirection) { // = previous track desired via button so ignore advance rules
				playWhenReady.set(true)
				currentIndex.update(n => n+($reverseDirection ? -1 : 1))
			}
		}
		audioPlayer.addEventListener('ended', () => { 
			// console.log('ended track ',$currentIndex,$tracks.length)
			currentTime.set($trackDuration)
			autoAdvance()
		})
		audioPlayer.addEventListener('error', () => {
			const t = $currentTrack
			t.error = true
			t.loading = false
			// t.duration = 0
			isError.set(true)
			updateTrackList()
			// audioPlayer.pause()
			paused.set(true)
			currentTime.set( 0 )
			console.error(`Audio error track: ${$currentIndex} - ${$currentTrack.src}`,$currentTrack)
			autoAdvance()
		})
		currentIndex.set(0)
	})

	$: autoLoad($currentIndex)

	let showVolume = false
	let showAdvance = true

	$: showAdvance = showOptions.includes(showadvance)
	
	const advanceNext = () => {
    advanceStore.set(advanceOptions[nextAdvanceOptionIndex])
  }

  let advanceOptionIndex = advanceOptions.indexOf($advanceStore)
  let nextAdvanceOptionIndex = 0 
  $: {
    advanceOptionIndex = advanceOptions.indexOf($advanceStore)
    nextAdvanceOptionIndex = (advanceOptionIndex+1 >= advanceOptions.length) ? 0
    : advanceOptionIndex + 1
  }

	$: adjustVolumeTitle = (showVolume ? 'Close' : 'Open') + ' Volume Adjustment'
	const showPlay = hideOptions.includes( showcontrols )
	const rHue = 360*Math.random()
	const randomHueStyle = showOptions.includes(randomhue)
		? `--ap-theme-h: ${rHue};` : ''
</script>

{#if $tracks < 1} <div class="error-no-playlist">
	<h2>No Playlist!</h2>
	<p>You must provide a valid playlist attribute.</p>
	<pre>
		&lt;taocode-audio-player playlist='["url-to-audio","second-url"]'&gt;&lt;/taocode-audio-player&gt;
		&lt;taocode-audio-player playlist='[["url-to-audio","title 1"],["second-url","title 2"]]'&gt;&lt;/taocode-audio-player&gt;
	</pre>
	</div>
	{:else}
	<main class="audio-player" class:playlistAtTop style="
--color-error: hsl(0,75%,50%);
{randomHueStyle}">
		<audio bind:this={audioPlayer} bind:currentTime={$currentTime} bind:duration={$trackDuration} bind:paused={$paused}
			bind:volume={$volume} bind:buffered={$buffered}></audio>
		<section id="player-cont" class="container">
			{#if ! hideOptions.includes(showheading)}
			<TrackHeading />
			{/if}
			<div class="vol-prog-rep" class:showPlay>
				{#if showPlay}
				<PlayControl />
				{/if}
				<button title={adjustVolumeTitle} on:click={()=>showVolume = !showVolume}>
					<span class="icon">
						<VolumeIcon volume={$volume} />
					</span>
				</button>
				<ProgressBarTime />
				{#if showVolume}
				<div transition:fly={{ y: 20, duration: 300}} class="show-volume">
					<button on:click={()=>showVolume = false} title={adjustVolumeTitle}>
						<span class="icon">
							<XIcon />
						</span>
					</button>
					<VolumeSlider />
				</div>
				{/if}
				{#if showAdvance}
				<button title={`Advance is: ${advanceOptions[advanceOptionIndex]}.\nChange Advance to: ${advanceOptions[nextAdvanceOptionIndex]}?`} on:click={advanceNext}>
					<span class="icon">
						<RepeatIcon variant={$advanceStore} />
					</span>
				</button>
				{/if}

			</div>

			{#if ! hideOptions.includes( showcontrols )}
			<Controls {showskip} />
			{/if}
		</section>
		{#if ! hideOptions.includes(showplaylist)}
		<section class="container">
			<PlayList expand={expandplaylist} showbutton={showplaylistbutton} atTop={playlistAtTop} />
		</section>
		{/if}
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

		* {
			box-sizing: border-box;
		}

	main {
		display: flex;
		margin: 0 auto;
		min-width: 15em;
		flex-direction: column;
		align-items: center;
		width: fit-content;
		border-radius: var(--audio-player-border-radius, 0);
	}
	.container {
		--audio-player-color: hsl( var(--ap-theme-h, 220), var(--ap-theme-s, 75%), var(--ap-theme-l, 25%) );
		--audio-player-background-semi: hsla( var(--ap-theme-h, 220), var(--ap-theme-s, 75%), var(--ap-theme-l, 25%), 0.12 );
		background: var(--audio-player-background, transparent);
		color: var(--audio-player-color);
		width: 100%;
	}

	.vol-prog-rep {
		display: flex;
		position: relative;
		align-items: center;
		height: 2.5em;
	}

	.vol-prog-rep.showPlay {
		margin-bottom: 0.5em;
	}

		.vol-prog-rep button {
			border: none;
			background: var(--audio-player-background, transparent);
			padding: 0.5em 0.25em;
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
			background-color: #FFF;
			opacity: 0.7;
			padding: 0 0.25ch;
			box-shadow: 0 0 5px #0002;
			transition: opacity 0.2s ease-out;
		}
		.show-volume:hover,
		.show-volume:focus-within {
			opacity: 0.9;
		}

		.icon {
			color: var(--audio-player-color, #222);
		}
	</style>