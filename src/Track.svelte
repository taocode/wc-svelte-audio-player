<svelte:options tag="taocode-track" />
<script>
  import { getContext, getAllContexts, hasContext, setContext, onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { contextStores as CS, getComponentContext, hasComponentContext, setComponentContext } from './lib.js'
	// import { tracks, currentIndex } from './stores.js'
  export let title
  export let src
  let tracks = getComponentContext(CS.TRACKS)
  let currentIndex = getComponentContext(CS.CURRENT_INDEX)
  if (!hasComponentContext(CS.TRACKS)) {
    tracks = writable([])
    setComponentContext(CS.TRACKS,tracks)
    console.log('TRACK: creating tracks',tracks)
  } else {
    console.log('TRACK: found tracks',tracks)
  }
  if (!hasComponentContext(CS.CURRENT_INDEX)) {
    currentIndex = writable(-1)
    setComponentContext(CS.currentIndex,currentIndex)
    console.log('TRACK: created currentIndex',currentIndex)
  }
  console.log("TRACK:",{$tracks,$currentIndex})
  console.dir(getAllContexts())
  onMount(() => {
    console.log('Track:',{currentIndex,$currentIndex})
    let index = $currentIndex+1
    let track = { title, src, index }
    console.log(`Adding track: "${title}" ${src}`,{tracks,$tracks})
    tracks.set([...$tracks,track])
    if (index === 0) currentIndex.set(index)
  })
</script>