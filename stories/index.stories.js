import "../src/index.svelte"
import { html } from "lit-html"

export default {
  parameters: {
    layout: "centered",
  },
  title: 'Single & Multiple Track Examples',
};

export const singleTrack = () => html` 
<div>
<h2>Single Track Example:</h2>
<taocode-audio-player playlist="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3">
</taocode-audio-player>
<p>Playlist, previous and next controls hide.</p>
</div> `;

export const multipleTracks = () => html` 
<div>
<h2>Multiple Tracks Example:</h2>
<taocode-audio-player playlist='["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3",
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"]'>
</taocode-audio-player>
<p>A basic player with auto advance and collapsed playlist</p>
</div> `;
