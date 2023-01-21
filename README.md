```js script
import './src/index.svelte'
```

# Playlist Audio Player Web Component

```html preview-story
<taocode-audio-player skiptime="5" showskip="show" showadvance="show" expandplaylist="always"
 showcontrols="hide" showplaylistbutton="hide"
 showheading="hide"
 style="
 --audio-player-primary-hue: 120;
 --audio-player-background: transparent;
 --audio-player-color: #0d650d;
 --audio-player-background-semi: #0d650d22;
 "
playlist='[{"src":"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3","title":"Lumbini"}]'
  ></taocode-audio-player>
```
## Attributes

### `playlist`

Playlist attribute is required. It can be 1 of 4 options:

#### Playlist Option 1: Single URL

`playlist="url-to-audio.mp3"` - must be a full URL starting with https:// or http://

You can use a relative URL if you include only 1 track in an array, options 2, 3 and 4 don't have this restriction.

#### Playlist Option 2: Array of JSON Objects

`playlist='[{"src":"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3","title":"Lumbini"},{"src":"https://www.jqueryscript.net/dummy/1.mp3","title":"Dummy 1"}]'`

This can be handiest from Hugo, use `jsonify objPlaylist` if you have matching keys `src` and `title` on each entry in that array/slice of objects.

#### Playlist Option 3: Array of URLs

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

#### Playlist Option 4: Array of Arrays

JSON formatted `[url,title]` entries.

```json
playlist='[
  ["https://.../file.mp3","Title 1"],
  ["https://.../file2.mp3","Title 2"],
  ["https://.../file3.mp3","Title 3"]
]'
```

You can also mix & match Options 2, 3 & 4 like:

```json
playlist='[
  "https://.../file.mp3",
  ["https://.../file2.mp3","Title 2"],
  [{"src":"https://.../file3.mp3","title":"Title 3"}]
]'
```

I'm not really sure how handy this would be but hey, it can be done.

### Title of Tracks

Next release: ID3 data will be considered the best source for track title.

1. Title value provided via Playlist Option 3
1. Filename with some standard clean-up, '_' -> ' ' and the extension is removed

### `advance`

Options on how to advance at the end of a track. `auto` | `loop` | `repeat` | `none`

- `auto` - advance to the end of the playlist and stop
- `loop` - advance to the end of the playlist and restart with first track
- `repeat` - repeat the current track
- `none` - do not automatically advance

default: `auto`

```html
<taocode-audio-player advance="loop"
  playlist='[
    "./path/to/track1",
    "./path/to/track2"
  ]'></taocode-audio-player>
```

### `showadvance`

Show or hide the advance control. Options: `show` | `hide`

default: `hide`

### `playlistlocation`

2 options: `top` | `bottom`

default: `bottom`

### `expandplaylist`

3 options: `false` | `true` | `always`

- `false` - start with playlist closed, user can expand the list
- `true` - start with playlist expanded, user can close it
- `always` - always show playlist, takes up space vertical space, it isn't an absolute positioned fly-out

default: `false`

### `skiptime`

The number of seconds to skip ahead (fastforward) and skip back (rewind).

default: 10

### `showskip`

Show the skip controls? Options: `show` | `hide`

default: `hide`

### `showskiptime`

Show or hide the amount of time next to the skip buttons. Options: `show` | `hide`

default: `hide`

## Show Attributes

The show attributes all accept any of these expressions that override their default:

### Show - Start Showing/Expanded

- ['1','true','show','yes','please']

### Hide - Start Hidden 

- ['0','false','hide','no','none']

*Note that invalid values will fallback on their default.

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
