// Direct access to the Telegram WebApp object injected by Telegram's WebView
// The official SDK script (telegram-web-app.js) sets window.Telegram.WebApp
function getTelegramWebApp(): any {
  return (window as any).Telegram?.WebApp || null;
}

export function isTelegramMiniApp(): boolean {
  const app = getTelegramWebApp();
  const result = !!app && !!app.initData;
  console.log('[Telegram] isTelegramMiniApp check:', {
    hasWindow: typeof window !== 'undefined',
    hasTelegram: !!(window as any).Telegram,
    hasWebApp: !!app,
    hasInitData: !!app?.initData,
    result,
  });
  return result;
}

export function getTelegramInitData(): string | null {
  const app = getTelegramWebApp();
  if (!app) {
    console.log('[Telegram] getTelegramInitData: no WebApp object');
    return null;
  }
  const data = app.initData || null;
  console.log('[Telegram] getTelegramInitData:', data ? `present (${data.length} chars)` : 'empty');
  return data;
}

export function getTelegramThemeParams(): Record<string, string> | null {
  const app = getTelegramWebApp();
  if (!app) return null;
  return app.themeParams || null;
}

/**
 * Polls for Telegram WebApp to become available.
 * Useful in async contexts where timing is uncertain.
 */
export function waitForTelegramWebApp(timeoutMs = 3000): Promise<any> {
  return new Promise((resolve) => {
    const existing = getTelegramWebApp();
    if (existing) {
      console.log('[Telegram] WebApp already available');
      resolve(existing);
      return;
    }

    console.log('[Telegram] Waiting for WebApp to appear...');
    const start = Date.now();
    const interval = setInterval(() => {
      const app = getTelegramWebApp();
      if (app) {
        clearInterval(interval);
        console.log('[Telegram] WebApp appeared after', Date.now() - start, 'ms');
        resolve(app);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        console.warn('[Telegram] WebApp did not appear within', timeoutMs, 'ms');
        resolve(null);
      }
    }, 100);
  });
}
