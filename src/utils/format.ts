/**
 * Format a number to a compact string (e.g., 4000 -> "4K", 1200 -> "1.2K")
 */
export function formatCount(count: number): string {
    if (count < 0) {
        return '0';
    }
    if (count >= 1000) {
        const thousands = count / 1000;
        // If it's a whole number, return without decimal
        if (thousands % 1 === 0) {
            return `${thousands}K`;
        }
        // Otherwise, return with one decimal place
        return `${thousands.toFixed(1)}K`;
    }
    return count.toString();
}

/**
 * Calculate days until a date and return formatted string (e.g., "starts in 2 days")
 */
export function getDaysUntilStart(startsAt: string): string {
    if (!startsAt) {
        return '';
    }
    
    try {
        const startDate = new Date(startsAt);
        const now = new Date();
        const diffTime = startDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return 'شروع شده';
        } else if (diffDays === 0) {
            return 'امروز شروع می‌شود';
        } else if (diffDays === 1) {
            return 'starts in 1 day';
        } else {
            return `starts in ${diffDays} days`;
        }
    } catch (error) {
        console.error('Error calculating days until start:', error);
        return '';
    }
}
