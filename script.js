"use strict";

const themeToggle = document.getElementById("theme-toggle");
let theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.textContent = theme === "dark" ? "LIGHT" : "DARK";
}
applyTheme();
themeToggle.hidden = false;
themeToggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
  try { localStorage.setItem("primoid-theme", theme); } catch { /* Optional persistence. */ }
});

if (document.getElementById("observation")) initializeObservations();

async function initializeObservations() {
  const article = document.getElementById("observation");
  const body = document.getElementById("observation-text");
  const number = document.getElementById("observation-number");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const copy = document.getElementById("copy-link");
  const status = document.getElementById("status");
  const fallback = document.getElementById("copy-fallback");
  let observations;
  let current;

  function urlFor(id) {
    const url = new URL(location.href);
    url.searchParams.set("obs", id);
    return url;
  }

  function render() {
    const requested = new URL(location.href).searchParams.get("obs");
    let index = observations.findIndex(item => item.id === requested);
    if (index === -1) index = 0;
    current = observations[index];
    // Normalize missing or invalid IDs without adding a history entry.
    if (requested !== current.id) history.replaceState(null, "", urlFor(current.id));
    body.replaceChildren(...current.paragraphs.map(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
    number.textContent = `OBS. ${current.id}`;
    document.title = `PRIMOID42_* — OBS. ${current.id}`;
    previous.href = urlFor(observations[(index - 1 + observations.length) % observations.length].id);
    next.href = urlFor(observations[(index + 1) % observations.length].id);
    status.textContent = "";
    fallback.hidden = true;
    article.setAttribute("aria-busy", "false");
  }

  try {
    const response = await fetch("observations.json");
    if (!response.ok) throw new Error("Could not load observations.");
    observations = await response.json();
    const ids = new Set();
    if (!Array.isArray(observations) || observations.length === 0 || !observations.every(item => {
      if (!item || typeof item.id !== "string" || !/^[0-9]{4,}$/.test(item.id) || ids.has(item.id) ||
          !Array.isArray(item.paragraphs) || item.paragraphs.length === 0 ||
          !item.paragraphs.every(text => typeof text === "string" && text.trim().length > 0)) return false;
      ids.add(item.id);
      return true;
    })) throw new Error("Invalid observation data.");
    render();
    document.getElementById("observation-nav").hidden = false;
    copy.hidden = false;
  } catch {
    body.replaceChildren();
    const message = document.createElement("p");
    message.textContent = "The wall is temporarily quiet. Please reload to try again.";
    body.append(message);
    article.setAttribute("aria-busy", "false");
    return;
  }

  for (const link of [previous, next]) {
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (link.href !== location.href) history.pushState(null, "", link.href);
      render();
    });
  }
  window.addEventListener("popstate", render);
  copy.addEventListener("click", async () => {
    const url = urlFor(current.id).href;
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = "Link copied.";
    } catch {
      fallback.hidden = false;
      const input = document.getElementById("share-url");
      input.value = url;
      input.focus();
      input.select();
      status.textContent = "Select and copy the URL below.";
    }
  });
  document.getElementById("close-copy").addEventListener("click", () => {
    fallback.hidden = true;
    status.textContent = "";
    copy.focus();
  });
}
