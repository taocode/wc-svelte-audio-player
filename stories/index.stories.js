import "../src/index.svelte"
import "../src/Track.svelte"
import { html } from "lit-html"

export default {
  parameters: {
    layout: "centered",
  },
  title: 'Single & Multiple Track Examples',
};

export const singleTrack = () => html` <taocode-audio-player><taocode-audio src="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3" title="Mixkit mystwrious bass pulse"></taocode-audio-player> `;

export const multipleTracks = () => html` <taocode-audio-player><taocode-audio src="https://assets.mixkit.co/sfx/preview/mixkit-mystwrious-bass-pulse-2298.mp3" title="Mixkit mystwrious bass pulse"></taocode-audio-player> `;
