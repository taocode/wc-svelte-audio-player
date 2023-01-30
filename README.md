```js script
import './src/index.svelte'
```
<div style="background: transparent;">

# Playlist Audio Player Web Component

```html preview-story
<div style="max-width: 300px; margin: 0 auto;">
<taocode-audio-player skiptime="15" showskip="show" showskiptime="show" showadvance="show"
preload="none"
 style="
 --ap-theme-h: 130;
 --ap-theme-s: 85%;
 --ap-theme-s-dark: 55%;
 --ap-theme-l: 20%;
 --ap-theme-l-dark: 45%;
 --ap-font-family-heading: fantasy;
 --ap-font-family-playlist: system-ui;"
playlist='[
["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3","Great Compassion",150],
["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3","Lumbini",5],
{"src":"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3", "duration": 9375.6},
{"src":"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"}]'>
</taocode-audio-player></div>
```

</div>

## Features

Introduces `<taocode-audio-player>` Web Component, a playlist audio player featuring a simple, clean and flexible design with useful customization options:

- Custom Color via CSS variables in style attribute
- Dark mode reactive attribute
- Custom Font for Heading and Playlist
- Auto advance, loop entire list, repeat 1 track or none
  - User can control this when Advance Control is shown
- Show/Hide:
  - Heading (title above player)
  - Controls Row (previous, skip back, play/pause, skip forward, next)
    - skip back and forward can be hidden
    - skip time is hidden by default
  - Advance Control
  - Playlist and Playlist Expand Control
- Playlist can appear at the top or bottom

### Built With Svelte and WebComponents.dev

Svelte makes this a trivial task without adding overhead. 

## Attributes

### `playlist`

Playlist attribute is required. It can be 1 of 4 options:

#### Playlist Option 1: Single URL

`playlist="url-to-audio.mp3"` - must be a full URL starting with https:// or http://

You can use a relative URL if you include only 1 track in an array, options 2, 3 and 4 don't have this restriction.

#### Playlist Option 2: Array of JSON Objects

```json
playlist='[
  {"src":"url-to-audio","title":"Track 1","duration":"60"},
  {"src":"url-to-audio2","title":"Track 2"},
  {"src":"url-to-audio3"}
]'
```

This option can be handiest from Hugo, use `jsonify objPlaylist` if you have matching keys `src` and optional `title` and `duration` on each entry in that slice (array) of objects.

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

JSON formatted `[src,title?,duration?]` entries.

```json
playlist='[
  ["https://.../file.mp3","Title 1","60"],
  ["https://.../file2.mp3","Title 2"],
  ["https://.../file3.mp3"]
]'
```

You can also mix & match Playlist Options* like:

```json
playlist='[
  "https://.../file.mp3",
  ["https://.../file2.mp3","Title 2","60"],
  [{"src":"https://.../file3.mp3","title":"Title 3"}]
]'
```

*This option has dubious value beyond testing.

### Title of Tracks

1. Title value provided via Playlist Option 3
1. Filename - what comes after the last '/' in the src URL, with some standard clean-up: remove extension (.mp3,.mp4,.aac,...) and query string, #hash, convert `(_|%20|-)` -> ' '

### Duration of Tracks

Providing the duration of each track is highly recommended. It is only a placeholder value until the file is actually loaded.

If you do not supply the duration of the track the player will fetch the audio files on initialization and load the metadata. The  duration of each track is updated with the actual value from the file upon successful load. Providing the initial duration can save `n` requests and 100s of kilobytes of bandwidth where `n` is the number of tracks.

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

### `mode`

Mode attribute is reactive, when you change it from your script's theme switcher hook, it will update the player. This is mostly necessary for the popover playlist as the background is otherwise transparent and may be unreadable without a light or dark opaque background.

2 options `light` | `dark`

default: `light`

In your theme switcher do something like:

```js
Array.from(document.querySelectorAll('taocode-audio-player')).forEach((el) => {
  el.mode = darkMode ? 'dark' : 'light'
})
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

Provide a random hue, from 0-360 for HSL color. Useful for those lit html stories that ignore/strip the `style` attribute.

default: `false`

## Theming via CSS Vars

Add the style attribute with your favorite HSL overrides.

defaults:

- `--ap-theme-h: 220;` 
- `--ap-theme-h-dark: var(--ap-theme-h);` 
- `--ap-theme-s: 75%;`
- `--ap-theme-s-dark: 65%;` 
- `--ap-theme-l: 25%;`
- `--ap-theme-s-dark: 45%;` 
- `--ap-playlist-max-h: 6em;`

The max-h option could be 'none' which may be helpful if you wanted to show all tracks with no scroller. 6em will usually show 3 tracks unless they've word-wrapped into 2+ lines.

```html
<taocode-audio-player style="
  --ap-theme-h: 120;
  --ap-theme-s: 50%;
  --ap-theme-l: 33%;
  --ap-theme-l-dark: 50%;
  --ap-playlist-max-h: none;
  --ap-font-family-heading: fantasy, cursive;
  --ap-font-family-playlist: system-ui;
  --ap-playlist-max-h: none;
"></taocode-audio-player>
```

You can achieve a lot of different looks just by hiding different parts. Enjoy!
