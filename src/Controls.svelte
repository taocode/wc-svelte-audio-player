<script>
  import { getContext } from 'svelte'
  
  import VolumeSlider from './VolumeSlider.svelte'

  import { contextStores as CS, advanceOptions } from './lib' 
  const audioTag = getContext(CS.AUDIO_TAG)
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const currentTime = getContext(CS.CURRENT_TIME)
  const trackDuration = getContext(CS.TRACK_DURATION)
  const isPlaying = getContext(CS.IS_PLAYING)
  const isReady = getContext(CS.IS_READY)
  const isError = getContext(CS.IS_ERROR)
  const advance = getContext(CS.ADVANCE)
  const skip = getContext(CS.SKIP)
  const showSkipTime = getContext(CS.SHOW_SKIP_TIME)
  const tracks = getContext(CS.TRACKS)
  const playWhenReady = getContext(CS.PLAY_WHEN_READY)
  const reverseDirection = getContext(CS.REVERSE_DIRECTION)

  import PlayIcon from './svg/play.svg.svelte'
  import PauseIcon from './svg/pause.svg.svelte'
  // import FastForwardIcon from './svg/fast-forward.svg.svelte'
  import SkipForwardIcon from './svg/skip-forward.svg.svelte'
  import SkipBackIcon from './svg/skip-back.svg.svelte'
	import RotateCWIcon from './svg/rotate-cw.svg.svelte'
  import Volume2Icon from './svg/volume-2.svg.svelte'
  import RepeatLoopIcon from './svg/repeat-loop.svg.svelte'
  import RepeatAutoIcon from './svg/repeat-auto.svg.svelte'
  import RepeatNoneIcon from './svg/repeat-none.svg.svelte'
  import LoaderIcon from './svg/loader.svg.svelte'
  import SlashIcon from './svg/slash.svg.svelte'

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
    if (prevTrack) {
      playWhenReady.set(true)
      reverseDirection.set(true)
      currentIndex.update(n => n - 1)
    } else {
      audioPlayer.currentTime = 0
      audioPlayer.play()
    }
  }
  const nextAudio = () => {
    // console.log('nextAudio',{$currentIndex,$currentTrack})
    playWhenReady.set(true)
    currentIndex.update(n => n + 1)
  }

  const advanceNext = () => {
    advance.set(advanceOptions[nextStateIndex])
  }

  let stateIndex = advanceOptions.indexOf($advance)
  let nextStateIndex = 0 
  $: {
    stateIndex = advanceOptions.indexOf($advance)
    nextStateIndex = (stateIndex+1 >= advanceOptions.length) ? 0
    : stateIndex + 1
  }

  let showVolume = false

  $: prevTrack = $tracks.length > 1 && $currentTime < 5
  // $: console.log({prevTrack},$currentTime)
  $: includeSkip = $skip > 0 && $skip < $trackDuration
  $: includeNext = $tracks.length > 1

</script>

<div id="btn-cont" class:$isError>

  <button title="Adjust volume">
    <span class="icon">
      <Volume2Icon />
    </span>
  </button>

  <button id="prev" title="Previous Track" class:prevTrack on:click={previousAudio}>
    <span class="icon">
      <SkipBackIcon />
    </span>
	</button>

  {#if includeSkip}
  <button id="rewind" title="Skip back {$skip}s" on:click={rewindAudio}>
		<span class="icon invert-h">
      <RotateCWIcon />
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
    <button id="play" title={$isPlaying ? 'Pauste' : 'Play'} on:click={playPauseAudio}>
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
      <RotateCWIcon />
    </span>
    {#if $showSkipTime}<span class="skip-time">{$skip}</span>{/if}
	</button>
  {/if}

  {#if includeNext}
  <button id="next" title="Next Track" on:click={nextAudio}>
    <span class="icon">
      <SkipForwardIcon />
    </span>
	</button>
  {:else}
  <div class="button-placeholder"></div>
  {/if}

  <button title={`Change auto advance to ${advanceOptions[nextStateIndex]}`} on:click={advanceNext}>
    <span class="icon">
      {#if $advance === 'loop'}
      <RepeatLoopIcon />
      {:else if $advance === 'auto'}
      <RepeatAutoIcon />
      {:else}
      <RepeatNoneIcon />
      {/if}
    </span>
  </button>
</div>
{#if showVolume}
<div class="show-volume">
  <VolumeSlider />
</div>
{/if}

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
    position: relative;
    justify-content: center;
    align-items: baseline;
    /* width: 1ch; */
    border: none;
    padding: 0;
    cursor: pointer;
    margin: 0;
    height: 1.5rem;
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
    position: absolute;
    font-size: 0.5rem;
    bottom: 0.4rem;
    z-index: 1;
    letter-spacing: -0.05em;
    text-shadow: 0 0 1px #FFF, 0 0 2px #FFF, 0 0 3px #FFF,0 0 1.2em #FFF, 0 0 2em #FFF;
    transform: scaleX(0.8);
  }
  .skip-time::after {
    content: 's';
  }

  .show-volume {
    position: relative;
  }
</style>