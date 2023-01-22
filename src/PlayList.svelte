<script>
  import { getContext, hasContext } from 'svelte'
  import { slide } from 'svelte/transition'
  import { formatTime, contextStores as CS, trackTitle, showOptions, hideOptions } from './lib.js'
  const tracks = getContext(CS.TRACKS)
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const currentTime = getContext(CS.CURRENT_TIME)
  const paused = getContext(CS.PAUSED)
  const playWhenReady = getContext(CS.PLAY_WHEN_READY)
  const background = getContext(CS.BACKGROUND)
	
  export let expand = 'false'
  export let atTop = false
  export let showbutton = 'true'

	let expanded = showOptions.includes(expand)
  let always = expand === 'always'
  let never = expand === 'never'
  const chooseTrack = (i) => {
    playWhenReady.set(true)
    // console.log('chooseTrack',i,{$playWhenReady})
    if (i === $currentIndex) {
      currentTime.set(0)
      paused.set(false)
    }
    else currentIndex.set(i)
  }
  $: accordionTitle = (expanded ? 'Close' : 'Show') + ' Playlist'
  const playlistTitle = (track) => (track.error ? 'Cannot ' : '') + 'Play ' + trackTitle(track)
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
      {#if expanded && !always}<span class="close">✖</span>{/if}
  </button>
  {/if}

  {#if always || expanded}
  <ul transition:slide class:atTop>
    {#each $tracks as track,i}
    <li data-track-id={i} class:current={i===$currentIndex} >
      <button title={playlistTitle(track)} on:click={() => chooseTrack(i)} disabled={track.error} class:error={track.error}>
        {#if 'duration' in track || track.error}<span class="duration">{
          track.error ? '--:--' : formatTime(track.duration) }</span>{:else if track.error}{/if}
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
    right: 0.5rem;
  }
  button {
    padding: 0.1em 0.5em;
    display: block;
    width: 100%;
    background: var(--audio-player-background,transparent);
    color: var(--audio-player-color,#222);
    text-align: left;
    cursor: pointer;
  }
  .atTop {
    bottom: 1.75em;
  }
  .error {
    color: var(--color-error,red);
    cursor: not-allowed;
  }

  /* Style the buttons that are used to open and close the accordion panel */
  button.accordion {
    background: var(--audio-player-background);
    color: var(--audio-player-color, #333);
    margin: 0;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.4s;
  }

  /* Add a background color to the button if it is clicked on (add the .expanded class with JS), and when you move the mouse over it (hover) */
  button.expanded {
    background: var(--audio-player-background-semi,#0001);
    /* background: var(--audio-player-playlist-expand-button-expanded-background,#0001);
    color: var(--audio-player-playlist-expand-button-expanded-color,#333); */
  }
  button.always {
    cursor: default;
  }
  .duration,
  .track-count {
    background: var(--audio-player-background-semi,#FFF4);
    padding: 0.1em 0.5em;
  }
  .error .duration {
    background: var(--color-error,#d00c);
  }
  .duration {
    float: right;
    margin: -0.15em -0.75em 0 0.2em;
  }
  ul {
    list-style-type: none;
    background: var(--background-playlist,#FFFe);
    color: var(--audio-player-color,#ddd);
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden auto;
    max-height: var(--audio-player-playlist-max-h,6rem);
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
  
  button {
    border: none;
    background: none;
  }

  li.current button {
    font-weight: bold;
  }

</style>