<script>
  import { getContext } from 'svelte'
  import { contextStores as CS } from './lib' 
  import PlayIcon from './svg/play.svg.svelte'
  import PauseIcon from './svg/pause.svg.svelte'
  import FastForwardIcon from './svg/fast-forward.svg.svelte'
  import SkipForwardIcon from './svg/skip-forward.svg.svelte'
  import SkipBackIcon from './svg/skip-back.svg.svelte'
	// import {  } from './stores'
  import LoaderIcon from './svg/loader.svg.svelte'
  import SlashIcon from './svg/slash.svg.svelte'

  const audioTag = getContext(CS.AUDIO_TAG)
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const currentTrack = getContext(CS.CURRENT_TRACK)
  const currentTime = getContext(CS.CURRENT_TIME)
  const trackDuration = getContext(CS.TRACK_DURATION)
  const isPlaying = getContext(CS.IS_PLAYING)
  const isReady = getContext(CS.IS_READY)
  const isError = getContext(CS.IS_ERROR)
  const skip = getContext(CS.SKIP)
  const showSkipTime = getContext(CS.SHOW_SKIP_TIME)
  const tracks = getContext(CS.TRACKS)
  const playWhenReady = getContext(CS.PLAY_WHEN_READY)
  
  let audioPlayer = $audioTag
  
  const playPauseAudio = () => {
		try {
			if (audioPlayer.paused) {
				if ($isReady) audioPlayer.play()
        else playWhenReady.set(true)
			} else {
				audioPlayer.pause();
			}
		}	catch(err) {
			audioPlayer.error = true
			console.error('playPause',err)
		}
	}
  const rewindAudio = () => {
    audioPlayer.currentTime -= parseInt($skip)
  }
  const forwardAudio = () => {
    audioPlayer.currentTime += parseInt($skip)
  }
  const previousAudio = () => {
    playWhenReady.set(true)
    if ($tracks.length > 1 && audioPlayer.currentTime < 5) {
      // console.log('prev: near start, choosing prior track',audioPlayer.currentTime)
      if ($currentIndex < 1) currentIndex.set($tracks.length-1)
      else currentIndex.update(n => n - 1)
    } else {
      // console.log('prev: resetting to start of track')
      audioPlayer.currentTime = 0
    }
  }
  const nextAudio = () => {
    // console.log('nextAudio',{$currentIndex,$currentTrack})
    playWhenReady.set(true)
    currentIndex.update(n => n + 1)
  }
	
	let strokeWidth = 3
  let size = "1.75x"

  $: prevTrack = $tracks.length > 1 && $currentTime < 5
  // $: console.log({prevTrack},$currentTime)
  $: includeSkip = $skip > 0 && $skip < $trackDuration
  $: includeNext = $tracks.length > 1

</script>


<div id="btn-cont" class:$isError>
  <button id="prev" class:prevTrack on:click={previousAudio}>
    <span class="icon">
      <SkipBackIcon title="Skip Back" />
    </span>
	</button>

  {#if includeSkip}
  <button id="rewind" title="Skip back {$skip}s" on:click={rewindAudio}>
		<span class="icon invert-h">
      <FastForwardIcon />
    </span>
    {#if $showSkipTime}<span class="skip-time">{$skip}</span>{/if}
	</button>
  {/if}

  {#if $isError}
    <span class="icon icon-error">
      <SlashIcon />
    </span>
  {:else}
    {#if !$isReady}
    <div class="loading">
      <div class="loader add-animate-beacon animate-pulse">
        <LoaderIcon />
      </div>
    </div>
    {:else}
    <button id="play" on:click={playPauseAudio}>
      <span class="icon">
        {#if $isPlaying}
        <PauseIcon />
        {:else}
        <PlayIcon />
        {/if}
      </span>
    </button>
    {/if}
  {/if}

  {#if includeSkip}
  <button id="forward" title="Skip forward {$skip}s" on:click={forwardAudio}>
    <span class="icon">
      <FastForwardIcon />
    </span>
    {#if $showSkipTime}<span class="skip-time">{$skip}</span>{/if}
	</button>
  {/if}

  {#if includeNext}
  <button id="next" on:click={nextAudio}>
    <span class="icon">
      <SkipForwardIcon title="Next track" />
    </span>
	</button>
  {:else}
  <div class="button-placeholder"></div>
  {/if}
</div>

<style>
  #prev {
    --fill: currentColor;
  }
  #prev.prevTrack {
    --fill: none;
  }

  #btn-cont {
    display: flex;
    justify-content: space-between;
  }
  .icon {
    display: inline-block;
    /* position: absolute; */
  }
  /* button, */
  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: baseline;
    /* width: 1ch; */
    border: none;
    padding: 0;
    cursor: pointer;
    margin: 0;
    background-color: transparent;
  }
  .\$isError {
    color: var(--color-error,red);
  }
  .\$isError .icon-error {
    cursor: not-allowed;
  }
  .button-placeholder {
    width: 2ch;
  }
  .loading {
    position: relative;
    width: 1.5rem;
    --animate-seconds: 2s;
    --animate-function: cubic-bezier(.4,0,.6,1);
  }
  .loader {
    position: absolute;
  }

  .add-animate-beacon::after {
    content: '';
    position: absolute;
    font-size: 8px;
    top: 1em;
    left: 1em;
    border-radius: 999em;
    height: 1em;
    width: 1em;
    animation: beacon var(--animate-seconds,2s) var(--animate-function, ease-in-out) infinite;
  }
  .animate-pulse {
    animation: pulse var(--animate-seconds,2s) var(--animate-function, ease-in-out) infinite;
  }
  @keyframes pulse {
    50% {
      opacity:0.4;
    }
  }
  @keyframes beacon {
    50% {
      box-shadow: 0 0 0 1em rgba(0, 0, 0, 0.33);
    }
  }

  button:active {
    /* font-size: 2.2rem; */
    background-color: transparent;
  }
  .invert-h {
    display: inline-block;
    scale: -1 1;
  }
  .skip-time {
    font-size: 0.66em;
    opacity: 0.7;
    align-self: bottom;
  }
  #forward .skip-time {
    order: -1;
  }
  /* #forward .skip-time::after {
    content:'s';
  } */
  .skip-time::after {
    content: 's';
  }

</style>