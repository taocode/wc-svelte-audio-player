export const contextStores = {
  AUDIO_TAG: 'audioTag',
  CURRENT_INDEX: 'currentIndex',
  TRACKS: 'tracks',
}
export const getComponentContext = (key) => {
  console.log('gCC:',typeof document, typeof document.componentContext)
  if (typeof document.componentContext === 'undefined') document.componentContexts = {}
  return document.componentContexts[key]
}
export const setComponentContext = (key,val) => {
  if (typeof document.componentContext === 'undefined') document.componentContexts = {}
  document.componentContexts[key] = val
}
export const hasComponentContext = (key) => {
  if (typeof document.componentContext === 'undefined') document.componentContexts = {}
  return document.componentContexts.hasOwnProperty(key)
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