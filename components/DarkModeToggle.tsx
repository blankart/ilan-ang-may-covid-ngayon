import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("is-dark-mode") === "true");

  useEffect(() => {
    if (!window) {
      return;
    }

    if (localStorage.getItem("is-dark-mode")) {
      localStorage.getItem("is-dark-mode") === "true" &&
        document.querySelector("html")?.classList.add("dark");
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.querySelector("html")?.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!window) {
      return;
    }

    const _isDarkMode = (localStorage.getItem("is-dark-mode") ?? "false") === "true";
    if (_isDarkMode !== isDarkMode) {
      localStorage.setItem("is-dark-mode", isDarkMode ? "true" : "false");
      isDarkMode
        ? document.querySelector("html")?.classList.add("dark")
        : document.querySelector("html")?.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <button
      type="button"
      className="dark:bg-gray-800 py-1 px-6 hover:opacity-90 flex items-center justify-center rounded-full"
      onClick={() => {
        setIsDarkMode(!isDarkMode);
      }}>
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default DarkModeToggle;
