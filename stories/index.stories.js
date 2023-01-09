import "../src/index.svelte"
import "../src/Audio.svelte"
import { html } from "lit-html"

export default {
  parameters: {
    layout: "centered",
  },
  title: 'Single & Multiple Track Examples',
};

// export const singleTrack = () => html` 
// <div>
// <h2>Single Track Example:</h2>
// <taocode-audio-player>
// <taocode-audio src="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3" title="Mixkit mystwrious bass pulse">
// </taocode-audio-player>
// </div> `;

export const multipleTracks = () => html` 
<div>
<h2>Multiple Tracks Example:</h2>
<taocode-audio-player>
  <taocode-audio title="Ascend mallet 3" src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-84577/zapsplat_cartoon_fast_climb_ascend_soft_synth_mallets_003_92028.mp3"></taocode-audio>
  <taocode-audio title="Mixkit Mystwrious Keyboard Typing" src="https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3"></taocode-audio> 
  <taocode-audio src="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3" title="Mixkit mystwrious bass pulse">
</taocode-audio-player>
</div> `;
