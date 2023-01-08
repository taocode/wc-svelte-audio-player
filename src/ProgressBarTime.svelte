<script>
  import { progress, currentTime, currentTrack, isPlaying, isReady } from './stores'
  import { formatTime } from './lib'
  
	let totalTimeDisplay = "Loading..."
	let currTimeDisplay = "0:00:00"
	
  $: if ($isReady) updateTime()
  $: timeUpdater($isPlaying)

	function updateTime() {
    const ct = $currentTime
    const dt = $currentTrack.duration
		currTimeDisplay = (isNaN(ct))?`0:00`:formatTime(ct);
		totalTimeDisplay = (isNaN(dt)) ?'Loading...':formatTime(dt);
	}
	
	let trackTimer;
  const timeUpdater = (run) => {
    clearInterval(trackTimer)
    if (run) trackTimer = setInterval(updateTime,100)
  }
</script>

<div class="container">
  <span id="progress-time" class="time-display">{currTimeDisplay}</span>
  <div class="progress-outer"><span id="bar" style="width: {$progress}%"></span></div>
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
    border: var(--audio-player-border, 1px solid #22222299);
  }
  
  #bar {
    width: 0%;
    display: block;
    background: var(--audio-player-progress-background, 
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
</style>