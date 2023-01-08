<script>
  export let vol;
</script>

<div class="slidecontainer">
  <label for="volume-slider">0</label>

  <input id="myRange"
				 class="slider"
				 type="range"
				 min="0"
				 max="100"
				 step="1"
				 name="volume"
				 bind:value={vol}
				 on:input
				 >

  <label for="volume-slider">{vol}</label>
</div>

<style>
  .slidecontainer {
    width: 100%;
    /* Width of the outside container */
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .slidecontainer label {
    width: 20px;
    text-align: center
  }

  /* The slider itself */
  .slider {
    -webkit-appearance: none;
    /* Override default CSS styles */
    appearance: none;
    width: 200px;
    /* Full-width */
    height: 3px;
    /* Specified height */
    margin: 0 10px;
    padding: 0;
    background: #d3d3d3;
    /* Grey background */
    outline: none;
    /* Remove outline */
    opacity: 0.7;
    /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s;
    /* 0.2 seconds transition on hover */
    transition: opacity .2s;
  }

  /* Mouse-over effects */
  .slider:hover {
    opacity: 1;
    /* Fully shown on mouse-over */
  }

  /* The thumb slider handle */
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    /* Override default look */
    appearance: none;
    width: 15px;
    /* Set a specific slider handle width */
    height: 15px;
    /* Slider handle height */
    border-radius: 50%;
    background: #888;
    /* Green background */
    cursor: pointer;
    /* Cursor on hover */
    transition: background .2s;
  }

  .slider::-moz-range-thumb {
    width: 15px;
    /* Set a specific slider handle width */
    height: 15px;
    /* Slider handle height */
    background: #4CAF50;
    /* Green background */
    cursor: pointer;
    /* Cursor on hover */
  }
</style>