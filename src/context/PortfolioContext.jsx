import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "./ToastContext";

const PortfolioContext = createContext(null);

const LOCAL_STORAGE_KEY = "portfolioFavorites";

export const PortfolioProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          showInfo("Preferred currencies loaded from local storage");
          console.log("Loaded favorites from local storage:", parsed);
        } else {
          console.warn("Invalid favorites data format in localStorage");
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      showError("Error loading favorite currencies");
    }
  }, [showInfo, showError]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
      showError("Error saving favorite currencies");
    }
  }, [favorites, showError]);

  const isFavorite = (coinId) => favorites.some((c) => c.id === coinId);

  const toggleFavorite = (coin) => {
    setFavorites((prev) => {
      if (!coin || !coin.id) {
        showError("Invalid currency data");
        return prev;
      }

      const exists = prev.some((c) => c.id === coin.id);
      if (exists) {
        showSuccess(`${coin.name} Removed from favorites!`);
        return prev.filter((c) => c.id !== coin.id);
      }

      const minimalCoin = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price ?? null,
        price_change_percentage_24h: coin.price_change_percentage_24h ?? null,
      };

      showSuccess(`${coin.name} Thank you for the favorite!`);
      return [minimalCoin, ...prev];
    });
  };

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return ctx;
};
