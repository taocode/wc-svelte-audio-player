```js script
import './src/index.svelte'
```

# Playlist Audio Player Web Component

```html preview-story
<taocode-audio-player skip="15" skiptime="show" advance="loop" playlistshow="show" 
urlonlyplaylist='["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3",
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"]'
playlist='[
    ["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3","Lumbini"],
    ["https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3","The Practice of Giving"],
    ["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3","Great Compassion"]
]'></taocode-audio-player>
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
