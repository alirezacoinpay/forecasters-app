  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { Toaster } from "./components/ui/sonner";
  import { BottomSheetProvider } from "./contexts/BottomSheetContext";
  import 'uno.css';
  import "./index.css";
  import "./styles/animations.css";
  import { isTelegramMiniApp, getTelegramThemeParams } from "./utils/telegram";

  // Initialize Telegram SDK if in Telegram Mini App
  if (isTelegramMiniApp()) {
    console.log('[Telegram] Mini App detected, initializing SDK...');
    import("@telegram-apps/sdk").then(({ init, ready, expand }) => {
      init();
      ready();
      expand();
      console.log('[Telegram] SDK initialized');
      
      // Apply Telegram theme CSS variables
      const theme = getTelegramThemeParams();
      if (theme) {
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
          root.style.setProperty(`--tg-theme-${key}`, value);
        });
        console.log('[Telegram] Theme applied:', theme);
      }
    });
  } else {
    console.log('[Telegram] Not a Mini App, using web auth');
  }

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
  