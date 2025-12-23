/**
 * Device Fingerprinting Utility
 * 
 * Collects device information and creates a consistent fingerprint
 * for automatic authentication and session recovery.
 */

interface DeviceData {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    timezone: string;
    language: string;
    platform: string;
}

/**
 * Collects device information
 */
function collectDeviceData(): DeviceData {
    return {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
    };
}

/**
 * Creates a simple hash from device data
 * Uses a combination of device properties to create a unique identifier
 */
function createFingerprint(data: DeviceData): string {
    const str = `${data.userAgent}|${data.screenWidth}x${data.screenHeight}|${data.timezone}|${data.language}|${data.platform}`;
    
    // Simple hash function (djb2 algorithm)
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    
    return hash.toString(36);
}

/**
 * Gets or creates a device fingerprint
 * Stores the fingerprint in sessionStorage for consistency across page reloads
 */
export function getDeviceFingerprint(): string {
    const STORAGE_KEY = 'device_fingerprint';
    
    // Try to get existing fingerprint from sessionStorage
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
        return existing;
    }
    
    // Create new fingerprint
    const deviceData = collectDeviceData();
    const fingerprint = createFingerprint(deviceData);
    
    // Store in sessionStorage for consistency
    sessionStorage.setItem(STORAGE_KEY, fingerprint);
    
    return fingerprint;
}

/**
 * Gets device data for sending to backend
 */
export function getDeviceData(): DeviceData {
    return collectDeviceData();
}

/**
 * Clears the stored fingerprint (useful for testing or logout)
 */
export function clearDeviceFingerprint(): void {
    sessionStorage.removeItem('device_fingerprint');
}

