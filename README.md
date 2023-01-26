```js script
import './src/index.svelte'
```
<div style="background: transparent;">

# Playlist Audio Player Web Component

```html preview-story
<div style="max-width: 400px; margin: 0 auto;">
<taocode-audio-player skiptime="15" showskip="show" showskiptime="show" showadvance="show"
 style="
 --ap-theme-h: 130;
 --ap-theme-s: 85%;
 --ap-theme-l: 20%;"
playlist='[
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3",
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"]'>
</taocode-audio-player></div>
```

</div>

## Attributes

### `playlist`

Playlist attribute is required. It can be 1 of 4 options:

#### Playlist Option 1: Single URL

`playlist="url-to-audio.mp3"` - must be a full URL starting with https:// or http://

You can use a relative URL if you include only 1 track in an array, options 2, 3 and 4 don't have this restriction.

#### Playlist Option 2: Array of JSON Objects

```json
playlist='[
  {"src":"url-to-audio-src","title":"Track 1"},
  {"src":"url-to-audio2-src","title":"Track 2"}
]'
```

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

1. Title value provided via Playlist Option 3
1. Filename - what comes after the last '/' in the src URL, with some standard clean-up: remove extension (.mp3,.mp4,.aac,...) and query string, #hash, convert `(_|%20|-)` -> ' '

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

### `randomhue`

Provide a random hue, from 0-360 for HSL color. Useful for those lit html stories that don't allow a `style` attribute.

default: `false`

## Theming via CSS Vars

Add the style attribute with your favorite HSL overrides. Boom, color. 

defaults:

- `--ap-theme-h: 220;` 
- `--ap-theme-s: 75%;` 
- `--ap-theme-l: 25%;`
- `--ap-playlist-max-h: 6em;`

The max-h option could be 'none' which may be helpful if you wanted to show all tracks with no scroller. 6em will usually show 3 tracks unless they've word-wrapped into 2+ lines.

```html
<taocode-audio-player style="
  --ap-theme-h: 120;
  --ap-theme-s: 50%;
  --ap-theme-l: 33%;
  --ap-playlist-max-h: none;
"></taocode-audio-player>
```

You can achieve a lot of different looks just by hiding different parts. Enjoy!
