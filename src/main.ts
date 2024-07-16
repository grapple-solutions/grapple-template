import "./main.css";

import { addMessages, init } from "svelte-i18n";

import en from "./i18n/translation.json";

addMessages("en", en);

init({
  fallbackLocale: "en",
  initialLocale: "en",
});

import App from "./App.svelte";
new App({
  target: document.getElementById("app")!,
});

// window.app = app;

// export default app;
