import { useTheme } from "../context/ThemeContext";

export function ThemePhoto({
  light,
  dark,
  className = "",
  alt = "",
  eager = false,
}: {
  light: string;
  dark: string;
  className?: string;
  alt?: string;
  eager?: boolean;
}) {
  const { theme } = useTheme();
  const src = theme === "light" ? light : dark;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "low"}
      draggable={false}
    />
  );
}
