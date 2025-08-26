import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--bg-primary", "#0f172a"); // أغمق قليلاً
      root.style.setProperty("--bg-card", "#1e293b"); // أغمق وأكثر تبايناً
      root.style.setProperty("--text-primary", "#f8fafc"); // أبيض نقي للتباين الأفضل
      root.style.setProperty("--text-secondary", "#cbd5e1"); // رمادي فاتح للنصوص الثانوية
      root.style.setProperty("--accent-color", "#60a5fa"); // أزرق فاتح أكثر
      root.style.setProperty("--border-color", "#334155"); // حدود أكثر وضوحاً
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg-primary", "#f7fafc");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--text-primary", "#1e293b"); // أغمق قليلاً للتباين الأفضل
      root.style.setProperty("--text-secondary", "#64748b"); // رمادي للنصوص الثانوية
      root.style.setProperty("--accent-color", "#3b82f6");
      root.style.setProperty("--border-color", "#e2e8f0");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
