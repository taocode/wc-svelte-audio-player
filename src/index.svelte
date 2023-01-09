<svelte:options tag="taocode-audio-player" />

<script>
	import { onMount, getContext, setContext } from 'svelte'
	// TODO: use jsmediatags to load ID3
	// https://github.com/aadsm/jsmediatags
	import { 
		audioTag, 
		currentIndex,
		currentTime,
		trackDuration,
		currentTrack,
		isPlaying, 
		isReady,
		playWhenReady,
		showSkipTime,
		tracks,
		advance as advanceStore, 
		skip as skipStore,
        progress,
	 } from './stores.js'

	 import { contextStores as cs } from './lib.js'

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

	let playlistAtTop = playlistlocation === 'top'

	const audioPlayer = $audioTag
	
	// lots of setup
	skipStore.set(skip)
	advanceStore.set(advance)
	showSkipTime.set(skiptime === "show")

	audioPlayer.preload = "metadata"
	setContext(cs.AUDIO_TAG,audioTag)
	setContext(cs.CURRENT_INDEX,currentIndex)
	setContext(cs.TRACKS,tracks)

	onMount(() => {
		if (document) {
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
				console.log('ended track ',$currentIndex,$tracks.length)
				currentTime.set($trackDuration)
				if (advance === 'loop' || (advance === 'auto' && $currentIndex < $tracks.length-1)) {
					playWhenReady.set(true)
					if ($currentIndex >= $tracks.length-1) currentIndex.set(0)
					else currentIndex.update(n => n+1)
				}
			})

			// console.log('/onMount()', {skip, skiptime, advance, $skipStore, $showSkipTime, $advanceStore})
			// setTimeout(function() {
			// 	console.log('timeout:', {skip, skiptime, advance, $skipStore, $showSkipTime, $advanceStore})
			// },50)
		}
	})

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

</script>

{#if audioTracks < 1} <div class="error-no-tracks">
	<h2>No Audio Tracks!</h2>
	<p>You must include at least 1:</p>
	<pre>&lt;taocode-audio src="url-to-audio"&gt;&lt;/taocode-audio&gt;</pre>
	<p>Use the closing tag as shown above (&lt;taocode-audio .../&gt; will fail).</p>
	</div>
	{:else}
	<main class="audio-player" class:playlistAtTop>
		<section id="player-cont">

			<TrackHeading />

			<ProgressBarTime />

			<Controls />

			<VolumeSlider />

		</section>
		<PlayList show={playlistshow} />
	</main>
	{/if}

	<style>
		.error-no-tracks {
			background-color: pink;
			padding: 0.5em;
			text-align: center;
			color: #800E;
		}

		.error-no-tracks h2 {
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