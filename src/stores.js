import { writable, derived } from 'svelte/store'

export const currentIndex = writable(-1)
export const tracks = writable([])
export const currentTrack = derived([currentIndex, tracks], ([$i, $t]) => $i < $t.length && $i >= 0 ? $t[$i] : false)
export const volume = writable(0.8)
export const skip = writable(10)
export const showSkipTime = writable(false)
export const isPlaying = writable(false)
export const isReady = writable(false)
export const playWhenReady = writable(false)
export const advance = writable('auto')
export const currentTime = writable(0)
export const trackDuration = derived(currentTrack, ($t) => $t ? $t.duration : false)
export const progress = derived([currentTime,trackDuration], ([$t,$d]) => $t * (100 / $d))
export const audioTag = writable(new Audio())
// TODO: audioTag as readable?