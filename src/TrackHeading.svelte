<script>
  import { getContext } from 'svelte'
  import { contextStores as CS, nameFromURL} from './lib'
  const currentIndex = getContext(CS.CURRENT_INDEX)
  const currentTrack = getContext(CS.CURRENT_TRACK)

  let container = { offsetWidth: 100 }
  let title = "Loading..."
  let heading = { scrollWidth: 100 }
  let animate = false
  let centered = true
  let aniTime = 15
  let panPx = 100
  $: {
    const i = $currentIndex
    const hasTitle = (i >= 0 && $currentTrack && 'title' in $currentTrack)
    title = (hasTitle) ? $currentTrack.title : nameFromURL($currentTrack.src)
    if (hasTitle && heading) {
      panPx = heading.scrollWidth - container.offsetWidth
      animate = panPx > 0
      centered = !animate
      aniTime = panPx / 25
      if (aniTime < 6) aniTime += 6
      if (heading.style) {
        heading.style.animationName = 'none'
        heading.offsetWidth // trigger reflow
        heading.style.animationName = null
      }
    }
  }
</script>

<div bind:this={container} 
 style="
--marquee-width: {panPx}px;
--marquee-time: {aniTime}s;
">
  <h3 bind:this={heading} class:animate class:centered>{title}</h3>
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