<script>
  import { getContext, hasContext } from 'svelte'
  import { slide } from 'svelte/transition'
  // import { tracks, currentIndex, playWhenReady, audioTag } from './stores.js'
  import { formatTime, contextStores as CS, nameFromURL } from './lib.js'
  const tracks = getContext(CS.TRACKS)
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const playWhenReady = getContext(CS.PLAY_WHEN_READY)
  const audioTag = getContext(CS.AUDIO_TAG)
	
  export let show = false
  export let atTop = false
	let showing = show === 'true' || show === 'show'
  let always = show === 'always'
  const chooseTrack = (i) => {
    playWhenReady.set(true)
    // console.log('chooseTrack',i,{$playWhenReady,$audioTag})
    if (i === $currentIndex) {
      $audioTag.currentTime = 0
      $audioTag.play()
    }
    else currentIndex.set(i)
  }
</script>

<section class="playlist-container" class:always>
  {#if $tracks.length > 1}
  <button class="accordion"
      class:showing class:always
      disabled={always}
      on:click={() => showing = !showing && !always}>
      ☰ Playlist 
      <span class="track-count">{$tracks.length}</span>
      {#if showing && !always}<span class="close">✖</span>{/if}
  </button>
  {/if}

  {#if always || showing}
  <ul transition:slide class:atTop>
    {#each $tracks as track,i}
    <li data-track-id={i} class:current={i===$currentIndex} >
      <button on:click={() => chooseTrack(i)} disabled={track.error} class:error={track.error}>
        {#if 'duration' in track || track.error}<span class="duration">{
          track.error ? '--:--' : formatTime(track.duration) }</span>{:else if track.error}{/if}
        {track.title || nameFromURL(track.src)} 
      </button></li>
    {/each}
  </ul>
  {/if}
</section>


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
    padding: 5px 15px;
    width: 100%;
    background: var(--audio-player-playlist-background,#dddc);
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
    background: var(--audio-player-playlist-show-button-background,var(--audio-player-background,#EEE));
    color: var(--audio-player-color, #333);
    margin: 0;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.4s;
  }

  /* Add a background color to the button if it is clicked on (add the .showing class with JS), and when you move the mouse over it (hover) */
  button.showing {
    background: var(--audio-player-playlist-show-button-showing-background,#0003);
    color: var(--audio-player-playlist-show-button-showing-color,#333);
  }
  button.always {
    cursor: default;
  }
  .duration,
  .track-count {
    background: var(--audio-player-track-count-background,#333a);
    color: var(--audio-player-track-count-color,#FFF);
    padding: 0.1em 0.5em;
  }
  .error .duration {
    background: var(--color-error,#d00c);
  }
  .duration {
    float: right;
  }
  ul {
    list-style-type: none;
    background: var(--audio-player-background,#eee);
    color: var(--audio-player-color,#bad);
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-y: auto;
    max-height: 5.1rem;
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
  }

  li {
    line-height: 125%;
    padding: 0;
    border-bottom: 1px solid var(--audio-player-color,#ddd);
    /* cursor: pointer; */
  }

  li:active,
  li:hover {
    background-color: var(--audio-player-track-active,#FFF6);
  }
  
  button {
    border: none;
    background: none;
  }

  li.current button {
    font-weight: bold;
  }

</style>