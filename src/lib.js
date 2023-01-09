export const contextStores = {
  AUDIO_TAG: 'audioTag',
  CURRENT_INDEX: 'currentIndex',
  CURRENT_TRACK: 'currentTrack',
  CURRENT_TIME: 'currentTime',
  TRACKS: 'tracks',
  VOLUME: 'volume',
  SKIP: 'skip',
  ADVANCE: 'advance',
  SHOW_SKIP_TIME: 'showSkipTime',
  TRACK_DURATION: 'trackDuration',
  PLAY_WHEN_READY: 'playWhenReady',
  IS_PLAYING: 'isPlaying',
  IS_READY: 'isReady',
  PROGRESS: 'progress',
}
export const nameFromURL = (url) => {
  if (!url) return 'Loading...'
  const urlObj = new URL(url)
  var filename = urlObj.pathname.split('/').pop().split('#')[0].split('?')[0]
  return filename.split('.')[0].split('_').join(' ')
}
export function formatTime(seconds) {
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