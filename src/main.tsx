
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { Toaster } from "./components/ui/sonner";
  import 'uno.css';
  import "./index.css";
  import "./styles/animations.css";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <Toaster 
        position="top-right" 
        richColors 
        dir="rtl"
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
    </>
  );
  