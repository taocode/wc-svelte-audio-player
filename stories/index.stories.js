import "../src/index.svelte";
import { html } from "lit-html";

export default {
  parameters: {
    layout: "centered",
  },
};

export const story1 = () => html` <my-counter></my-counter> `;
