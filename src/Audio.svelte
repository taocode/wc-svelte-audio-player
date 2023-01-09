<svelte:options tag="taocode-audio" />
<script>
  import { getContext } from 'svelte'
  import { contextStores as cs } from './lib.js'
  console.log('Audio:',cs,cs.CURRENT_INDEX)
	// import { tracks, currentIndex } from './stores.js'
  const tracks = getContext(cs.TRACKS)
  const currentIndex = getContext(cs.CURRENT_INDEX)
	export let title
  export let src
  let index = $currentIndex+1
  let track = { title, src, index }
  console.log(`Adding track: "${title}" ${src}`,{tracks,$tracks})
  tracks.set([...$tracks,track])
  if (index === 0) currentIndex.set(index)
</script>