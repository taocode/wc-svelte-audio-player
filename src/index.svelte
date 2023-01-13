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
	
	const trackDuration = derived(currentTrack, ($t) => $t ? $t.duration : false)
	setContext(CS.TRACK_DURATION,trackDuration)
	
	const progress = derived([currentTime,trackDuration], ([$t,$d]) => $t * (100 / $d))
	setContext(CS.PROGRESS,progress)
	
	const isReady = writable(false)
	setContext(CS.IS_READY,isReady)

	const isPlaying = writable(false)
	setContext(CS.IS_PLAYING,isPlaying)

	const isError = writable(false)
	setContext(CS.IS_ERROR,isError)

	const playWhenReady = writable(false)
	setContext(CS.PLAY_WHEN_READY,playWhenReady)

	const updateCurrentTime = () => {
		currentTime.set(audioPlayer.currentTime)
	}

	const updateTrackList = (index,track) => {
		const newTracks = $tracks
		newTracks[index] = track
		tracks.set(newTracks)
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
			currentIndex.update(n => n+1)
		}
	})
	audioPlayer.addEventListener('error', () => {
		const t = $currentTrack
		t.error = true
		isError.set(true)
		updateTrackList($currentIndex,t)
		console.error(`Audio error with: ${$currentTrack.src}`,$currentTrack)
		audioPlayer.pause()
		audioPlayer.currentTime = 0
		updateCurrentTime()
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

	let progressTracker
	const trackProgress = (watch) => {
		clearInterval(progressTracker)
		if (watch) {
			progressTracker = setInterval(updateCurrentTime, 100)
		}
	}
	
	const setAudioFrom = (track) => {
		console.log('setAudioFrom',track,typeof track.loaded === undefined)
		if (! track ) return
		audioPlayer.pause()
		audioPlayer.title = track.title
		audioPlayer.currentTime = 0
		isError.set(track.error)
		audioPlayer.src = track.error ? '' : track.src
		console.log('about to load',audioPlayer.src,audioPlayer.title)
		updateCurrentTime()
	}
	const loadTrack = (index, track) => {
		console.info(`loadTrack()`,index,track)
		if (!audioPlayer) {
			console.warn('loadTrack() odd condition',{audioPlayer,$currentTrack})
			return
		}
		track.loading = true
		isReady.set(false)
		audioPlayer.onloadedmetadata = () => {
			console.log(`metadata loaded for ${$currentIndex}: ${track.title} `)
			track.loaded = true
			track.loading = false
			track.duration = audioPlayer.duration
			updateTrackList(index,track)
		}
		setAudioFrom(track)
		audioPlayer.load()
	}
	const loadCurrentTrack = () => {
		loadTrack($currentIndex,$currentTrack)
	}
	// auto-load track on every track change
	function autoLoadPlay(index,track) {
		if ( ! track || index < 0 && index >= $tracks.length-1 ) {
			// illegal value, reset to 0 and trigger refresh
			currentIndex.set(0)
			console.warn('invalid autoPlayLoad track, reseting to 0',index,'/',$tracks.length,track)
			return
		}
		if ( track.loaded || track.error) {
			console.log('alp',track)
			// setAudioFrom(track)

		} else if ( ! track.loaded && ! track.loading) {
			loadCurrentTrack()
			console.log('lct',index,track)
		} else {
			console.log('fell through')
		}
		// if (  
		// 		&& (! ct || ! ct.loaded)
		// 		&& (ct && ! ct.loading)) {
		// 		loadCurrentTrack()
		// 	} else if (ct && ! ct.error && ! ct.loading) {
		// 		setAudioFrom($currentTrack)
		// 		console.log('saf',$currentIndex)
		// 	}
	}
	// currentIndex.set(2)
	$: autoLoadPlay($currentIndex,$currentTrack)
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