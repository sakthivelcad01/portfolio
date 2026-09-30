import { Moon, Sun } from "lucide-react";
import gsap from "gsap";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  const handleClick = () => {
    onToggle();

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        ".theme-toggle svg",
        { rotate: -28, scale: 0.78 },
        { rotate: 0, scale: 1, duration: 0.78, ease: "power3.out", overwrite: true }
      );
    }
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={handleClick}
    >
      <Sun className="sun-icon" aria-hidden="true" />
      <Moon className="moon-icon" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
