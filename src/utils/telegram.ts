export function isTelegramMiniApp(): boolean {
  return !!(window as any).Telegram?.WebApp;
}

export function getTelegramInitData(): string | null {
  if (!isTelegramMiniApp()) return null;
  return (window as any).Telegram.WebApp.initData || null;
}

export function getTelegramThemeParams(): Record<string, string> | null {
  if (!isTelegramMiniApp()) return null;
  const app = (window as any).Telegram.WebApp;
  return app.themeParams || null;
}
