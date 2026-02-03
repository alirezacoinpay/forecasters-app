import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { BottomSheet, BottomSheetOptions } from '../components/ui/BottomSheet';

interface BottomSheetContent {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    options?: BottomSheetOptions;
    className?: string;
    contentClassName?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

interface BottomSheetContextValue {
    openBottomSheet: (content: BottomSheetContent) => void;
    closeBottomSheet: () => void;
    isOpen: boolean;
}

const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<BottomSheetContent | null>(null);

    const openBottomSheet = useCallback((newContent: BottomSheetContent) => {
        setContent(newContent);
        setIsOpen(true);
    }, []);

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        // Clear content after animation completes
        setTimeout(() => {
            setContent(null);
        }, 300);
    }, []);

    return (
        <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet, isOpen }}>
            {children}
            {content && (
                <BottomSheet
                    isOpen={isOpen}
                    onClose={closeBottomSheet}
                    header={content.header}
                    footer={content.footer}
                    options={content.options}
                    className={content.className}
                    contentClassName={content.contentClassName}
                    aria-labelledby={content['aria-labelledby']}
                    aria-describedby={content['aria-describedby']}
                >
                    {content.children}
                </BottomSheet>
            )}
        </BottomSheetContext.Provider>
    );
}

export function useBottomSheetContext() {
    const context = useContext(BottomSheetContext);
    if (context === undefined) {
        throw new Error('useBottomSheetContext must be used within a BottomSheetProvider');
    }
    return context;
}

