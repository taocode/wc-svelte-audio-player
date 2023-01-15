<script>
  import { getContext } from 'svelte'
  import { contextStores as CS, trackTitle } from './lib'
  const currentTrack = getContext(CS.CURRENT_TRACK)
  const isError = getContext(CS.IS_ERROR)

  import AlertCircleIcon from './svg/alert-circle.svg.svelte'

  let container = { offsetWidth: 100 }
  let title = "Loading..."
  let heading = false
  let animate = false
  let centered = true
  let aniTime = 15
  let panPx = 100
  let error = false
  $: {
    error = $isError
    title = trackTitle($currentTrack)
    // console.log('title-in:','title' in $currentTrack, {$currentTrack}, $currentTrack.title ,{hasTitle,heading,container})
    if (heading) {
      panPx = heading.scrollWidth - container.offsetWidth + (error ? 20 : 0)
      animate = panPx > 0
      centered = !animate
      aniTime = panPx / 25
      if (aniTime < 5) aniTime += 5
      if (heading.style) {
        heading.style.animationName = 'none'
        heading.offsetWidth // trigger reflow
        heading.style.animationName = null
      }
    }
  }
</script>

<div bind:this={container} class:error
 style="
--marquee-width: {panPx}px;
--marquee-time: {aniTime}s;
">
  <h3 bind:this={heading} class:animate class:centered>
    {#if error}
    <span class="error-icon">
      <AlertCircleIcon />
    </span>
    {/if}
    {title}
  </h3>
</div>

<style>
  div {
    text-align: center;
    overflow: hidden;
    max-width: 20em;
    position: relative;
    height: 2em;
    padding: 0.2em 0;
  }
  .error {
    color: var(--color-error, red);
  }
  .error-icon {
    display: inline-block;
    width: 1rem;
    height: 1rem;
  }
  h3 {
    white-space: nowrap;
    margin: 0;
    position: absolute;
    left: 0;
  }
  h3.animate {
    animation: marquee var(--marquee-time, 15s) linear 1s infinite;
  }
  h3.centered {
    right: 0;
  }
  @keyframes marquee {
    5% {
      left: 0
    }
    46% {
      left: calc(-1 * var(--marquee-width, 100%));
    }
    54% {
      left: calc(-1 * var(--marquee-width, 100%));
    }
    95% {
      left: 0;
    }
  }
</style>