import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContextProvider";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("petPrepTheme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("petPrepTheme", theme);
    
    // Apply theme to document root
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider };
