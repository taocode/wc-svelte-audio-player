import "../src/index.svelte"
import { html } from "lit"

export default {
  parameters: {
    layout: "centered",
  }, 
  title: 'Single & Multiple Track Examples',
};

export const singleMinimal = () => html` 
<div>
<h2>Minimal Single Track Example:</h2>
<taocode-audio-player showcontrols="hide" randomhue="true"
playlist="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3"
>
</taocode-audio-player>
<p>This minimal player uses showcontrols="hide".</p>
</div> `;

export const singleTrack = () => html` 
<div>
<h2>Single Track Example with controls:</h2>
<taocode-audio-player randomhue="true" skiptime="5" showskip="show" showskiptime="show" showadvance="show" advance="loop" playlist="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3">
</taocode-audio-player>
<p>This minimal player uses showcontrols="hide".</p>
</div> `;

export const multipleMinimal = () => html` 
<div>
<h2>Minimal Multiple Tracks Example:</h2>
<taocode-audio-player randomhue="true" showcontrols="hide" showheading="hide" expandplaylist="always" showplaylistbutton="hide" playlist='["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3",
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"]'>
</taocode-audio-player>
<p>A minimal player with expandplaylist="always", hidden heading and controls.</p>
</div> `;

export const multipleTracks = () => html` 
<div>
<h2>Multiple Tracks Example:</h2>
<taocode-audio-player randomhue="true" showskip="show" showadvance="show" playlist='["https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Lumbini.mp3",
"https://download.pariyatti.org/free/_moIbLs95/Dana_The_Practice_of_Giving_single.mp3",
"https://download.pariyatti.org/free/_moIbLs95/along_the_path_audio/streaming/Great_Compassion.mp3"]'>
</taocode-audio-player>
<p>A basic player with auto advance and expandable playlist.</p>
</div> `;
