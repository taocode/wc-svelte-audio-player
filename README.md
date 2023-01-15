```js script
import './src/index.svelte'
```

# Playlist Audio Player Web Component

```html preview-story
<taocode-audio-player skiptime="show" skip="30" 
playlist='[
    "https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
    ["fail-https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3","Fail: The Practice of Giving"],
    "https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"
]'></taocode-audio-player>
```
## Attributes

### `playlist`

Playlist attribute is required. It can be 1 of 3 options:

#### Playlist Option 1: Single URL

`playlist="url-to-audio.mp3"` - must be a full URL starting with https:// or http://

You can use a relative URL if you include only 1 track in an array, options 2 and 3 don't have this restriction.

#### Playlist Option 2: Array of URLs

The playlist attribute should be a JSON formatted array. 

Use single quotes for this attribute to be able to use double quotes inside.
Double quotes are required for JSON compatibility.

```json
playlist='[
  "https://.../file.mp3",
  "https://.../file2.mp3",
  "https://.../file3.mp3"
]'
```

#### Playlist Option 3: Array of Arrays

JSON formatted `[url,title]` entries.

```json
playlist='[
  ["https://.../file.mp3","Title 1"],
  ["https://.../file2.mp3","Title 2"],
  ["https://.../file3.mp3","Title 3"]
]'
```

### Title of Tracks

Next release: ID3 data will be considered the best source for track title.

1. Title value provided via Playlist Option 3
1. Filename with some standard clean-up, '_' -> ' ' and the extension is removed

### `advance`

Options on how to advance at the end of a track. `auto` | `loop` | `none`

default: `auto`

```html
<taocode-audio-player advance="loop"
  playlist='[
    "./path/to/track1",
    "./path/to/track2"
  ]'></taocode-audio-player>
```

### `playlistlocation`

Playlist location has 2 options: `top` | `bottom`

default: `bottom`

### `playlistshow`

Playlistshow location has 3 options: `false` | (`show` | `true`) | `always` | `never`

- `false` - start with playlist closed, user can expand the list
- (`show` | `true`) - start with playlist expanded, user can close it
- `always` - always show playlist, takes up space
- `never` - hide the playlist forever

default: `false`

### `skip`

The number of seconds to skip ahead (fastforward) and skip back (rewind).

default: 10

### `skiptime`

Show or hide the amount of time next to the skip buttons. Options: ``

default: `hide`

## Theming via CSS Vars

Add the style attribute with your custom styles

```html
<div style="
  --audio-player-color: #333;
  --audio-player-background: linear-gradient(0, hsl(248, 66%, 75%) 5%, hsl(246, 65%, 80%) 33%, hsl(255, 65%, 70%) 66%, hsl(250, 70%, 65%) 95%);
  --audio-player-background-accordion: #ddd;
  --audio-player-volume-background: linear-gradient(90deg, hsl(120, 86%, 30%) 10%, hsl(60, 95%, 40%) 50%, hsl(30, 95%, 70%) 80%, hsl(8, 86%, 50%) 99%);
  --audio-player-border-radius: 0;
  --audio-player-shadow: none;
">...</div>
```

## Feature Summary for v1.0.0 release

Player now can show loading errors via the playlist and skips over bad tracks depending upon advance="auto" or "loop" in whatever direction you were going.