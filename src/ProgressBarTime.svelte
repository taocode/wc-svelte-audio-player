<script>
  import { getContext } from 'svelte';
  import { formatTime, contextStores as CS } from './lib'

  const progress = getContext(CS.PROGRESS)
  const currentTime = getContext(CS.CURRENT_TIME)
  const trackDuration = getContext(CS.TRACK_DURATION)
  const currentTrack = getContext(CS.CURRENT_TRACK)
  const paused = getContext(CS.PAUSED)
  const buffered  = getContext(CS.BUFFERED)
  const isError = getContext(CS.ERROR)
  
	let totalTimeDisplay = 'Loading...'
	let currTimeDisplay = "0:00:00"
  let bufferedPercent = 0
	
  $: totalTimeDisplay = $isError ? 'Error' 
      : isNaN($trackDuration) ? 'Loading...'
      : formatTime($trackDuration)
  $: currTimeDisplay = isNaN($currentTime) ? `0:00` : formatTime($currentTime)
  $: {
    const lastBuff = $buffered.slice(-1).pop()
    bufferedPercent = (lastBuff ? lastBuff.end : 0) / $trackDuration
  }
</script>

<div class="container">
  <span id="progress-time" class="time-display">{currTimeDisplay}</span>
  <div class="progress-outer">
    <span id="bar-progress" style="width: {$progress*100}%"></span>
    <input class="progrange" type="range" min={0} max={1} step={0.001} bind:value={$progress} />
    <span id="bar-buffered" style="width: {bufferedPercent*100}%"></span>
  </div>
  <span id="track-duration" class="time-display">{totalTimeDisplay}</span>
</div>


<style>
  .container {
    width: 100%;
    position: relative;
    height: 1.66em;
  }
  .progress-outer, #bar-progress, #bar-buffered {
    height: 0.2em;
    position: absolute;
    top: auto;
    bottom: auto;
    left: 0;
    right: 0;
  }
  .progress-outer {
    width: 100%;
    box-shadow: 0 0 1px 1px var(--audio-player-background-semi, #2222);
    z-index: 1;
    bottom: 0.75em;
  }
  
  #bar-progress {
    width: 0%;
    display: block;
    background: var(--audio-player-color, 
    rgba(0, 0, 0, 0.1));
    background-attachment: fixed;
  }
  #bar-buffered {
    width: 0%;
    background: var(--audio-player-background-semi);
    background-attachment: fixed;
  }
  .time-display {
    position: absolute;
    bottom: auto;
    top: 1.5em;
    opacity: 0.7;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 12;
    text-shadow: 0 0 1px #FFF, 0 0 2px #FFF, 0 0 3px #FFF, 0 0 2px #FFF, 0 0 2px #FFF;
    /* background-color: #FFF9; */
    transition: opacity 0.2s ease-out;
  }
  .container:hover .time-display {
    opacity: 1;
  }
  #progress-time {
    left: 0;
  }
  #track-duration {
    right: 0;
  }

.progrange {
  --track-color: transparent;
  --thumb-color: var(--audio-player-color,#607d8b);

  --track-color-light: #46d;
  --track-color-dark: #dfe9fb;
  --thumb-radius: 100%;
  --thumb-height: 1em;
  --thumb-width: 1em;
  --thumb-shadow-size: 0;
  --thumb-shadow-blur: 0;
  --thumb-shadow-color: transparent;
  --thumb-border-width: 0;
  --thumb-border-color: #eceff1;
  
  --track-width: 100%;
  --track-height: 1em;
  --track-shadow-size: 0;
  --track-shadow-blur: 0;
  --track-shadow-border: 0;
  --track-shadow-color: transparent;
  --track-shadow-focus-color: #cfd8dc;
  --track-border-width: 0;
  --track-border-color: transparent;

  --track-radius: 0;
  --contrast: 5%;

  --ie-bottom-track-color: var(--track-color-dark);

  -webkit-appearance: none;
  background: none;
  /* margin: calc(var(--thumb-height) / 2) 0; */
  margin: 0;
  /* width: var(--track-width); */
  z-index: 11;
  position: absolute;
  top: 0.1em;
  bottom: 0;
  right: 0;
  left: 0;
}
.progrange::-moz-focus-outer {
  border: 0;
}

.progrange:focus {
  outline: 0;
}
.progrange:focus::-webkit-slider-runnable-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
.progrange:focus::-ms-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
.progrange:focus::-moz-range-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
.progrange:focus::-ms-fill-lower {
  background: var(--track-color);
}
.progrange:focus::-ms-fill-upper {
  background: var(--track-color-light);
}


.progrange::-webkit-slider-runnable-track {
  cursor: default;
  height: var(--track-height);
  transition: all .2s ease;
  width: var(--track-width);
  border-radius: 100%;
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  height: calc(var(--track-height) / 2);
  background: var(--track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: var(--track-radius);
}

.progrange::-webkit-slider-thumb {
  box-shadow: var(--thumb-shadow-size) var(--thumb-shadow-blur) var(--track-shadow-border) var(--thumb-shadow-color);
  background: var(--thumb-color);
  border: var(--thumb-border-width) solid var(--thumb-border-color);
  border-radius: var(--thumb-radius);
  box-sizing: border-box;
  cursor: default;
  height: var(--thumb-height);
  width: var(--thumb-width);
  -webkit-appearance: none;
  margin-top: calc( (-1*var(--track-border-width) * 2) + var(--track-height) - var(--thumb-height));
  /* margin-top: (math.div((-$track-border-width * 2 + $track-height), 2) - math.div($thumb-height, 2)); */
  margin-top: calc( var(--track-height) / 5 + var(--thumb-height) / -2 );
}

.progrange::-moz-range-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  cursor: default;
  height: var(--track-height);
  transition: all .2s ease;
  width: var(--track-width);
  border-radius: 100%;
  background: var(--track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: var(--track-radius);
  height: calc(var(--track-height) / 2);
}

.progrange::-moz-range-thumb {
  box-shadow: var(--thumb-shadow-size) var(--thumb-shadow-blur) var(--track-shadow-border) var(--thumb-shadow-color);
  background: var(--thumb-color);
  border: var(--thumb-border-width) solid var(--thumb-border-color);
  border-radius: var(--thumb-radius);
  box-sizing: border-box;
  cursor: default;
  height: var(--thumb-height);
  width: var(--thumb-width);
}

.progrange::-ms-track {
  cursor: default;
  height: var(--track-height);
  transition: all .2s ease;
  width: var(--track-width);
  border-radius: 100%;
  color: #fad;
}

.prog-range::-ms-fill-lower {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  background: var(--ie-bottom-track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: (var(--track-radius) * 2);
}

.progrange::-ms-fill-upper {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  background: var(--track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: (var(--track-radius) * 2);
}

.progrange::-ms-thumb {
  box-shadow: var(--thumb-shadow-size) var(--thumb-shadow-blur) var(--track-shadow-border) var(--thumb-shadow-color);
  background: var(--thumb-color,yellow);
  border: var(--thumb-border-width) solid var(--thumb-border-color);
  border-radius: var(--thumb-radius);
  box-sizing: border-box;
  cursor: default;
  height: var(--thumb-height);
  width: var(--thumb-width);
  margin-top: calc(var(--track-height) / 4);
}

.progrange:disabled::-webkit-slider-thumb,
.progrange:disabled::-moz-range-thumb,
.progrange:disabled::-ms-thumb,
.progrange:disabled::-webkit-slider-runnable-track,
.progrange:disabled::-ms-fill-lower,
.progrange:disabled::-ms-fill-upper {
  cursor: not-allowed;
}

</style>