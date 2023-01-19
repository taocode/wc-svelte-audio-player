<script>
  import { getContext } from 'svelte';
  import { formatTime, contextStores as CS } from './lib'

  const progress = getContext(CS.PROGRESS)
  const currentTime = getContext(CS.CURRENT_TIME)
  const trackDuration = getContext(CS.TRACK_DURATION)
  const currentTrack = getContext(CS.CURRENT_TRACK)
  const paused = getContext(CS.PAUSED)
  const isReady  = getContext(CS.READY)
  const isError = getContext(CS.ERROR)
  
	let totalTimeDisplay = 'Loading...'
	let currTimeDisplay = "0:00:00"
	
  $: totalTimeDisplay = $isError ? 'Error' 
      : isNaN($trackDuration) ? 'Loading...'
      : formatTime($trackDuration)
  $: currTimeDisplay = isNaN($currentTime) ? `0:00` : formatTime($currentTime)

  import './slider.css'
</script>

<div class="container">
  <span id="progress-time" class="time-display">{currTimeDisplay}</span>
  <div>
    <div class="progress-outer"><span id="bar" style="width: {$progress*100}%"></span></div>
    <input type="range" min={0} max={1} step={0.001} bind:value={$progress} />
  </div>
  <span id="track-duration" class="time-display">{totalTimeDisplay}</span>
</div>


<style>
  .container {
    width: 100%;
    margin: .5rem 0 .5rem;
    position: relative;
  }
  .progress-outer, #bar {
    height: 1rem;
    overflow: hidden;
  }
  .progress-outer {
    width: 100%;
    box-shadow: 0 0 1px 1px var(--audio-player-background-semi, #2222);
  }
  
  #bar {
    width: 0%;
    display: block;
    background: var(--audio-player-background-semi, 
    rgba(0, 0, 0, 0.1));
    background-attachment: fixed;
  }

  .time-display {
    position: absolute;
    top: 0;
    bottom: 0;
    opacity: 0.8;
    font-size: 10pt;
    display: flex;
    align-items: center;
  }
  #progress-time {
    left: 0.25rem;
  }
  #track-duration {
    right: 0.25rem;
  }

[type='range'] {
  --track-color: #eceff1;
  --thumb-color: #607d8b;

  --track-color-light: #f6f9fe;
  --track-color-dark: #dfe9fb;
  --thumb-radius: 12px;
  --thumb-height: 24px;
  --thumb-width: 24px;
  --thumb-shadow-size: 4px;
  --thumb-shadow-blur: 4px;
  --thumb-shadow-color: rgba(0, 0, 0, .2);
  --thumb-border-width: 2px;
  --thumb-border-color: #eceff1;
  
  --track-width: 100%;
  --track-height: 8px;
  --track-shadow-size: 0;
  --track-shadow-blur: 0;
  --track-shadow-border: 0;
  --track-shadow-color: rgba(0, 0, 0, .2);
  --track-shadow-focus-color: #cfd8dc;
  --track-border-width: 2px;
  --track-border-color: #cfd8dc;

  --track-radius: 5px;
  --contrast: 5%;

  --ie-bottom-track-color: var(--track-color-dark);

  -webkit-appearance: none;
  background: transparent;
  margin: calc(var(--thumb-height) / 2) 0;
  width: var(--track-width);
}
[type='range']::-moz-focus-outer {
  border: 0;
}

[type='range']:focus {
  outline: 0;
}
[type='range']:focus::-webkit-slider-runnable-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
[type='range']:focus::-ms-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
[type='range']:focus::-moz-range-track {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-focus-color);
}
[type='range']:focus::-ms-fill-lower {
  background: var(--track-color);
}
[type='range']:focus::-ms-fill-upper {
  background: var(--track-color-light);
}


[type='range']::-webkit-slider-runnable-track {
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

[type='range']::-webkit-slider-thumb {
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
  margin-top: calc( var(--track-height) / 4 + var(--thumb-height) / -2 );
}

[type='range']::-moz-range-track {
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

[type='range']::-moz-range-thumb {
  box-shadow: var(--thumb-shadow-size) var(--thumb-shadow-blur) var(--track-shadow-border) var(--thumb-shadow-color);
  background: var(--thumb-color);
  border: var(--thumb-border-width) solid var(--thumb-border-color);
  border-radius: var(--thumb-radius);
  box-sizing: border-box;
  cursor: default;
  height: var(--thumb-height);
  width: var(--thumb-width);
}

[type='range']::-ms-track {
  cursor: default;
  height: var(--track-height);
  transition: all .2s ease;
  width: var(--track-width);
  border-radius: 100%;
  background: transparent;
  border-color: transparent;
  border-width: calc(var(--thumb-height) / 2) 0;
  color: transparent;
}

[type='range']::-ms-fill-lower {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  background: var(--ie-bottom-track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: (var(--track-radius) * 2);
}

[type='range']::-ms-fill-upper {
  box-shadow: var(--track-shadow-size) var(--track-shadow-blur) var(--track-shadow-border) var(--track-shadow-color);
  background: var(--track-color);
  border: var(--track-border-width) solid var(--track-border-color);
  border-radius: (var(--track-radius) * 2);
}

[type='range']::-ms-thumb {
  box-shadow: var(--thumb-shadow-size) var(--thumb-shadow-blur) var(--track-shadow-border) var(--thumb-shadow-color);
  background: var(--thumb-color);
  border: var(--thumb-border-width) solid var(--thumb-border-color);
  border-radius: var(--thumb-radius);
  box-sizing: border-box;
  cursor: default;
  height: var(--thumb-height);
  width: var(--thumb-width);
  margin-top: calc(var(--track-height) / 4);
}

[type='range']:disabled::-webkit-slider-thumb,
[type='range']:disabled::-moz-range-thumb,
[type='range']:disabled::-ms-thumb,
[type='range']:disabled::-webkit-slider-runnable-track,
[type='range']:disabled::-ms-fill-lower,
[type='range']:disabled::-ms-fill-upper {
  cursor: not-allowed;
}

</style>