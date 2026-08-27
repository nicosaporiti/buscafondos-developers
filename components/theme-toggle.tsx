"use client";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  function toggle(): void {
    const isDark = document.documentElement.classList.toggle("dark");
    sessionStorage.setItem("bf-docs-theme", isDark ? "dark" : "light");
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label="Cambiar tema de color">
      <span className="theme-light-icon"><MoonIcon /></span>
      <span className="theme-dark-icon"><SunIcon /></span>
    </button>
  );
}
