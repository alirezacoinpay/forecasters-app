/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            
            // Don't retry on certain errors
            if (error instanceof Error) {
                // Don't retry on client errors (4xx) except 429 (rate limit)
                if (error.message.includes('status') && 
                    error.message.match(/40[0-8]/) && 
                    !error.message.includes('429')) {
                    throw error;
                }
            }
            
            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Calculate delay with exponential backoff
            const delay = initialDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
}
