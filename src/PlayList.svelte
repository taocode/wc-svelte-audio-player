<script>
  import { getContext } from 'svelte'
  import { slide } from 'svelte/transition'
  import { formatTime, contextStores as CS, trackTitle, showOptions, hideOptions } from './lib.js'
  const tracks = getContext(CS.TRACKS)
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const currentTime = getContext(CS.CURRENT_TIME)
  const paused = getContext(CS.PAUSED)
  const playWhenReady = getContext(CS.PLAY_WHEN_READY)
  const background = getContext(CS.BACKGROUND)
  const totalDuration = getContext(CS.TOTAL_DURATION)
  const maxTries = getContext(CS.MAX_TRIES)
  const retry = getContext(CS.RETRY)
	
  export let expand = 'false'
  export let atTop = false
  export let showbutton = 'true'

	let expanded = showOptions.includes(expand)
  let always = expand === 'always'
  let never = expand === 'never'
  const chooseTrack = (i) => {
    playWhenReady.set(true)
    const track = $tracks[i]
    if (track.error && track.tryCount < $maxTries) {
      currentIndex.set(i)
      retry.set(true)
      return
    }
    if (track.error) return
    // console.log('chooseTrack',i,{$playWhenReady})
    if (i === $currentIndex) {
      currentTime.set(0)
      paused.set(false)
    }
    else currentIndex.set(i)
  }
  $: accordionTitle = (expanded ? 'Close' : 'Show') + ' Playlist'
  const playlistTitle = (track) => ((track.error && track.tryCount < $maxTries) ? 'Retry'
                  : track.error ? 'Cannot Load' : 'Play') + ' ' + trackTitle(track)
  $: style = `--background-playlist: ${$background};`
</script>

{#if !never}
<section class="playlist-container" class:always {style}>
  {#if ! hideOptions.includes(showbutton) && $tracks.length > 1}
  <button class="accordion"
    title={accordionTitle}
      class:expanded class:always
      disabled={always}
      on:click={() => expanded = !expanded && !always}>
      ☰ Playlist 
      <span class="track-count">{$tracks.length}</span>
      {#if $totalDuration}
      <span class="total-duration">{formatTime($totalDuration)}</span>
      {/if}
      {#if expanded && !always}<span class="close">✖</span>{/if}
  </button>
  {/if}

  {#if always || expanded}
  <ul transition:slide class:atTop>
    {#each $tracks as track,i}
    <li data-track-id={i} class:current={i===$currentIndex} >
      <button title={playlistTitle(track)} on:click={() => chooseTrack(i)} disabled={track.error && track.tryCount > $maxTries} class:error={track.error} class:canretry={track.tryCount < $maxTries}>
        {#if 'duration' in track || track.error}<span class="duration" title={track.duration+' seconds'}>{
          track.error ? '--:--' : formatTime(track.duration) }</span>{/if}
        {trackTitle(track)} 
      </button></li>
    {/each}
  </ul>
  {/if}
</section>
{/if}


<style>
  .playlist-container {
    width: 100%;
    position: relative;
    z-index: 10;
  }
  .close {
    position: absolute;
    left: 0.5rem;
  }
  button {
    padding: 0.33em 0.5em;
    display: block;
    width: 100%;
    color: var(--audio-player-color,#222);
    text-align: left;
    cursor: pointer;
    border: none;
    background: none;
    font-family: var(--ap-font-family-playlist);
  }

  .atTop {
    bottom: 1.75em;
  }
  .error {
    color: var(--color-error,#ea0000);
    cursor: not-allowed;
    background: var(--background-error,hsla(0, 90%, 50%, 0.2))
  }
  .canretry {
    color: var(--color-warn,#ea8000);
    cursor: pointer;
    background: var(--background-warn, hsla(33, 90%, 50%, 0.2));
  }

  /* Style the buttons that are used to open and close the accordion panel */
  button.accordion {
    background: var(--audio-player-background);
    color: var(--audio-player-color, #333);
    margin: 0;
    padding: 0.25em 0.5em;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    overflow: hidden;
  }
  button.accordion:hover,
  button.accordion:focus {
    background: var(--audio-player-background-semi);
    box-shadow: 0 0 0px 1px var(--audio-player-background-semi), 0 0 0px 1px var(--audio-player-background-semi);
  }
  button.accordion:focus-visible {
    outline: var(--audio-player-color, -webkit-focus-ring-color) auto 1px;
    outline-offset: 1px;
  }

  /* Add a background color to the button if it is clicked on (add the .expanded class with JS), and when you move the mouse over it (hover) */
  button.expanded {
    background: var(--audio-player-background-semi,var(--background,#0001));
    /* background: var(--audio-player-playlist-expand-button-expanded-background,#0001);
    color: var(--audio-player-playlist-expand-button-expanded-color,#333); */
  }
  button.always {
    cursor: default;
  }
  .total-duration,
  .duration,
  .track-count {
    background: var(--audio-player-background-semi,#FFF4);
    padding: 0.1em 0.5em;
  }
  .error .duration {
    background: var(--background-error,#d002);
  }
  .canretry .duration {
    background: var(--background-warn,#f802)
  }
  .total-duration {
    position: absolute;
    right: 0;
    text-align: right;
  }
  .duration {
    float: right;
    margin: -0.15em -0.5em 0 0.2em;
  }
  ul {
    list-style-type: none;
    background: var(--background-playlist,#FFFe);
    color: var(--audio-player-color,#ddd);
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden auto;
    max-height: var(--ap-playlist-max-h,6rem);
    position: absolute;
  }
  ul::-webkit-scrollbar {
    width: 1.2ch;
  }
  ul::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      border-radius: 10px;
  }

  ul::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }
  .always ul {
    position: static;
    background: transparent;
  }

  li {
    line-height: 125%;
    padding: 0;
    border-bottom: 1px solid var(--audio-player-color,#222);
    /* cursor: pointer; */
  }

  li:active,
  li:hover {
    background-color: var(--audio-player-track-active,#FFF2);
  }
  
  li.current button {
    font-weight: bold;
  }

</style>