<script>
  import { getContext } from 'svelte'

  import { contextStores as CS } from './lib' 
  const audioTag = getContext(CS.AUDIO_TAG)
  const isPlaying = getContext(CS.IS_PLAYING)
  const isReady = getContext(CS.IS_READY)
  const isError = getContext(CS.IS_ERROR)

  import PlayIcon from './svg/play.svg.svelte'
  import PauseIcon from './svg/pause.svg.svelte'
  import LoaderIcon from './svg/loader.svg.svelte'
  import SlashIcon from './svg/slash.svg.svelte'

  const audioPlayer = $audioTag
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
</script>

<div class:$isError>
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
</div>

<style>
  .icon {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    color: var(--audio-player-color,#222);
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
</style>