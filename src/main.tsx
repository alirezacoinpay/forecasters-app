import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner";
import { BottomSheetProvider } from "./contexts/BottomSheetContext";
import 'uno.css';
import "./index.css";
import "./styles/animations.css";
import { getTelegramThemeParams, waitForTelegramWebApp } from "./utils/telegram";

// Initialize Telegram WebApp if available (loaded via <script> in index.html)
waitForTelegramWebApp(3000).then((tgApp) => {
  if (tgApp) {
    console.log('[Telegram] WebApp ready, expanding...');
    try {
      tgApp.ready();
      tgApp.expand();
    } catch (e) {
      console.warn('[Telegram] ready/expand failed:', e);
    }

    // Apply Telegram theme CSS variables
    const theme = getTelegramThemeParams();
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--tg-theme-${key}`, value);
      });
      console.log('[Telegram] Theme applied:', theme);
    }
  } else {
    console.log('[Telegram] No WebApp found, running as web app');
  }
});

createRoot(document.getElementById("root")!).render(
  <BottomSheetProvider>
    <App />
    <Toaster 
      position="top-right" 
      richColors
      duration={3000}
      closeButton
      toastOptions={{
        style: {
          fontSize: '13px',
          padding: '10px 14px',
          maxWidth: '300px',
        },
      } as any}
    />
  </BottomSheetProvider>
);
