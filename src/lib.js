export const contextStores = {
  CURRENT_INDEX: 'currentIndex',
  CURRENT_TRACK: 'currentTrack',
  CURRENT_TIME: 'currentTime',
  BUFFERED: 'buffered',
  TRACKS: 'tracks',
  VOLUME: 'volume',
  SKIP_TIME: 'skipTime',
  ADVANCE: 'advance',
  SHOW_SKIP_TIME: 'showSkipTime',
  TRACK_DURATION: 'trackDuration',
  PLAY_WHEN_READY: 'playWhenReady',
  PAUSED: 'paused',
  READY: 'ready',
  PROGRESS: 'progress',
  ERROR: 'error',
  REVERSE_DIRECTION: 'reverseDirection',
  BACKGROUND: 'background',
}
export const formatTime = (seconds) => {
  if (isNaN(seconds)) return ''
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(':');
}
export const nameFromURL = (url) => {
  if (!url) return 'Loading...'
  const urlObj = new URL(url)
  var filename = urlObj.pathname.split('/').pop().split('#')[0].split('?')[0]
  return filename.split('.')[0].split(/_|-/).join(' ')
}
export const trackTitle = (track) => {
  return track.title || nameFromURL(track.src)
}

export const advanceOptions = ['auto','loop','repeat','none']

export const hideOptions = ['0','false','hide','no','none']
export const showOptions = ['1','true','show','yes','please']