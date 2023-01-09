<svelte:options tag="taocode-audio-player" />

<script>

	import { onMount, getContext, hasContext, setContext } from 'svelte'
	import { writable, derived } from 'svelte/store'
	// TODO: use jsmediatags to load ID3
	// https://github.com/aadsm/jsmediatags

	 import { contextStores as CS } from './lib.js'

	import TrackHeading from './TrackHeading.svelte'
	import ProgressBarTime from './ProgressBarTime.svelte'
	import Controls from './Controls.svelte'
	import VolumeSlider from './VolumeSlider.svelte'
	import PlayList from './PlayList.svelte'

	export let skip = 10
	export let skiptime = 'hide'
	export let advance = 'auto'
	export let playlistlocation = 'bottom'
	export let playlistshow = false
	export let playlist
	let playlistAtTop = playlistlocation === 'top'

	// lots of setup
	const tracks = writable([])
	try {
		tracks.set(JSON.parse(playlist).map(c => Array.isArray(c) ? ({ src: c[0], title: c[1] }) : ({ src: c })))
	} catch (err) {
		console.error('Playlist error:',err)
	}
	setContext(CS.TRACKS,tracks)
	
	const currentIndex = writable(-1)
	setContext(CS.CURRENT_INDEX,currentIndex)

	const currentTime = writable(0)
	setContext(CS.CURRENT_TIME,currentTime)
	
	const currentTrack = derived([currentIndex, tracks], ([$i, $t]) => $i < $t.length && $i >= 0 ? $t[$i] : false)
	setContext(CS.CURRENT_TRACK,currentTrack)
	
	const trackDuration = derived(currentTrack, ($t) => $t ? $t.duration : false)
	setContext(CS.TRACK_DURATION,trackDuration)
	
	const progress = derived([currentTime,trackDuration], ([$t,$d]) => $t * (100 / $d))
	setContext(CS.PROGRESS,progress)
	
	const isReady = writable(false)
	setContext(CS.IS_READY,isReady)

	const isPlaying = writable(false)
	setContext(CS.IS_PLAYING,isPlaying)

	const audioTag = writable(new Audio())
	
	const audioPlayer = $audioTag
	audioTag.preload = "metadata"
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
		updateCurrentTime()
	})
	audioPlayer.addEventListener('canplaythrough', () => {
		updateCurrentTime()
		// console.log('canplaythrough',{$currentIndex,$playWhenReady})
		if ($playWhenReady) {
			audioPlayer.play()
		}
	})
	audioPlayer.addEventListener('ended', () => { 
		// console.log('ended track ',$currentIndex,$tracks.length)
		currentTime.set($trackDuration)
		if (advance === 'loop' || (advance === 'auto' && $currentIndex < $tracks.length-1)) {
			playWhenReady.set(true)
			if ($currentIndex >= $tracks.length-1) currentIndex.set(0)
			else currentIndex.update(n => n+1)
		}
	})
	setContext(CS.AUDIO_TAG,audioTag)
	
	const skipStore = writable(skip)
	setContext(CS.SKIP,skipStore)

	const advanceStore = writable(advance)
	setContext(CS.ADVANCE,advanceStore)

	const showSkipTime = writable(skiptime === "show")
	setContext(CS.SHOW_SKIP_TIME,showSkipTime)

	const volume = writable(80)
	setContext(CS.VOLUME, volume)

	const playWhenReady = writable(false)
	setContext(CS.PLAY_WHEN_READY,playWhenReady)

	let progressTracker
	const trackProgress = (watch) => {
		clearInterval(progressTracker)
		if (watch) {
			progressTracker = setInterval(updateCurrentTime, 100)
		}
	}
	const updateCurrentTime = () => {
		currentTime.set(audioPlayer.currentTime)
	}

	// auto-load track on every track change
	$: if ($currentIndex <= $tracks.length-1 
			&& $currentTrack !== false
			&& typeof $currentTrack.loaded === 'undefined'
			&& !$currentTrack.loading) loadCurrentTrack()
	
	const loadCurrentTrack = () => {
		// nope, return to this with first item (index 0) on update trigger
		if ($currentIndex > $tracks.length-1) currentIndex.set(0)
		else loadTrack($currentIndex,$currentTrack)
	}
	const loadTrack = (index, track) => {
		// console.info(`loadTrack()`,{index,track})
		if (!audioPlayer) {
			console.warn('loadTrack() odd condition',{audioPlayer,$audioTag,$currentTrack})
			return
		}
		audioPlayer.title = track.title
		audioPlayer.src = track.src
		track.loading = true
		isReady.set(false)
		audioPlayer.load()
		audioPlayer.onloadedmetadata = () => {
			// console.log(`metadata loaded for ${track.title} `)
			track.loaded = true
			track.loading = false
			track.duration = audioPlayer.duration
			const newTracks = $tracks
			newTracks[index] = track
			tracks.set(newTracks)
		}
	}
	
	$: audioTracks =	$tracks
	$: {
		if ($currentIndex > -1) loadCurrentTrack()
	}
	if ($currentIndex < 0) currentIndex.set(0)
//$: 
</script>

{#if audioTracks < 1}
<div class="error-no-playlist">
	<h2>No Playlist!</h2>
	<p>You must provide a valid playlist attribute.</p>
	<pre>
		&lt;taocode-audio-player playlist='["url-to-audio","second-url"]'&gt;&lt;/taocode-audio-player&gt;
		&lt;taocode-audio-player playlist='[["url-to-audio","title 1"],["second-url","title 2"]]'&gt;&lt;/taocode-audio-player&gt;
	</pre>
	</div>
	{:else}
	<main class="audio-player" class:playlistAtTop>
		<section id="player-cont">

			<TrackHeading />

			<ProgressBarTime />

			<Controls />

			<VolumeSlider />

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

		audio {
			display: block;
			margin: 0.5em auto;
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

		.playlistAtTop>:last-child {
			order: -1;
		}

		#player-cont {
			padding: 0.5rem 1rem;
			box-shadow: var(--audio-player-shadow, none);
			background: var(--audio-player-background, #EEE);
			color: var(--audio-player-color, #333);
			border-radius: var(--audio-player-border-radius, 0);
			width: 13em;
		}
	</style>