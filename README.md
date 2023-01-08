```js script
import './src/index.svelte'
import './src/Audio.svelte'
```

# Playlist Audio Player Web Component

```html preview-story
<taocode-audio-player skip="15" skiptime="show" advance="loop">
  <taocode-audio title="Blurble 1" src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-46416/zapsplat_cartoon_bubble_001_46810.mp3"></taocode-audio>
  <taocode-audio title="Ascend mallet 3" src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-84577/zapsplat_cartoon_fast_climb_ascend_soft_synth_mallets_003_92028.mp3"></taocode-audio>
  <taocode-audio title="Walking in Tall Grass" src="https://assets.mixkit.co/sfx/preview/mixkit-footsteps-on-tall-grass-532.mp3"></taocode-audio>
  <taocode-audio title="AudioJungle Funk" src="https://audio-previews.elements.envatousercontent.com/files/285771709/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22J6UNLJF-funk.mp3%22"></taocode-audio>
  <taocode-audio title="Lumbini" src="https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3"></taocode-audio>
  <taocode-audio title="Mixkit Mystwrious Keyboard Typing" src="https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3"></taocode-audio> 
  <taocode-audio title="Mixkit Mystwrious Bass Pulse" src="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3"></taocode-audio>
  <taocode-audio title="Mixkit Knobs" src="https://assets.mixkit.co/music/preview/mixkit-knobs-636.mp3"></taocode-audio>
  <taocode-audio title="Practice of Giving" src="https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3"></taocode-audio>
  <taocode-audio title="Lumbini" src="https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3"></taocode-audio>
</taocode-audio-player>
```

## Advanced Usage

### Theme Style Options

```html
<taocode-audio-player advance="auto"
  style="
    --audio-player-color: #333;
    --audio-player-background: linear-gradient(0, hsl(248, 66%, 75%) 5%, hsl(246, 65%, 80%) 33%, hsl(255, 65%, 70%) 66%, hsl(250, 70%, 65%) 95%);
    --audio-player-background-accordion: #ddd;
    --audio-player-volume-background: linear-gradient(90deg, hsl(120, 86%, 30%) 10%, hsl(60, 95%, 40%) 50%, hsl(30, 95%, 70%) 80%, hsl(8, 86%, 50%) 99%);
    --audio-player-border-radius: 0;
    --audio-player-shadow: none;
  ">
  <audio title="First Track" src="./path/to/track1"></audio>
  <audio title="Second Track" src="./path/to/track2"></audio>
</taocode-audio-player>
```

### Build Tracks from `<taocode-audio>` Tags

Use the web standard audio tag: `<audio [title="Optional, fallback: ID3 title then filename"] src="https://.../file.mp3">` (without controls attribute) to wrap them all in this player.

### `title` prop

Title will fallback on ID3 data or the filename if the title isn't included in the ID3.

### Links

- [Official website (svelte.dev)](https://svelte.dev)
- [Tutorials](https://svelte.dev/tutorial/basics)
- [Docs](https://svelte.dev/docs)
- [Chat](https://svelte.dev/chat)
- [GitHub](https://github.com/sveltejs/svelte)
- [Issues](https://github.com/sveltejs/svelte/issues)
