<script>
  export let currTimeDisplay;
	export let totalTimeDisplay;
	export let progress;
</script>


<div id="time">
  <span id="progress-time">{currTimeDisplay}</span>
  <span id="track-duration">{totalTimeDisplay}</span>
</div>

<div id="progress-bar-cont">
  <span id="bar" style="width: {progress}%"></span>
</div>


<style>
  #time {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  #progress-bar-cont {
    width: 100%;
    height: 10px;
    margin: .5rem 0 .5rem;
    display: flex;
    align-items: center;
    border: 1px solid #888;
    cursor: pointer;
  }

  #bar {
    width: 0%;
    height: 10px;
    background-color: goldenrod;
  }
</style>