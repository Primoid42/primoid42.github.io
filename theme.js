// Run before styles and page content so the first paint uses the chosen theme.
"use strict";
document.documentElement.dataset.theme = "dark";
try {
  const savedTheme = localStorage.getItem("primoid-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch { /* Dark remains the default when storage is unavailable. */ }
