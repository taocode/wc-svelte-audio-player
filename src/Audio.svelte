<svelte:options tag="taocode-audio" />
<script>
	import { tracks, currentIndex } from './stores.js'
	export let title
  export let src
  let index = $currentIndex+1
  let track = { title, src, index }
  // console.log(`Adding track: "${title}" ${src}`)
  tracks.set([...$tracks,track])
  if (index === 0) currentIndex.set(index)
</script>
