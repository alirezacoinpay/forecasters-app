export function isTelegramMiniApp(): boolean {
  return !!(window as any).Telegram?.WebClient;
}

export function getTelegramInitData(): string | null {
  if (!isTelegramMiniApp()) return null;
  return (window as any).Telegram.WebClient.initData || null;
}

export function getTelegramThemeParams(): Record<string, string> | null {
  if (!isTelegramMiniApp()) return null;
  const client = (window as any).Telegram.WebClient;
  return client.themeParams || null;
}
