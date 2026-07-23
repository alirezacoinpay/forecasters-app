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
    import("@telegram-apps/sdk").then(({ init, ready, expand }) => {
      init();
      ready();
      expand();
      
      // Apply Telegram theme CSS variables
      const theme = getTelegramThemeParams();
      if (theme) {
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
          root.style.setProperty(`--tg-theme-${key}`, value);
        });
      }
    });
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
  