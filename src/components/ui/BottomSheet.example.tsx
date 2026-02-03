/**
 * Example usage of the reusable BottomSheet component
 * 
 * This file demonstrates different ways to use the BottomSheet:
 * 1. Direct usage with BottomSheet component
 * 2. Global usage with useBottomSheetContext hook
 */

import { useState } from 'react';
import { Button } from './button';
import { BottomSheet } from './BottomSheet';
import { useBottomSheetContext } from '../../contexts/BottomSheetContext';

// ============================================
// Example 1: Direct Usage (Local Component)
// ============================================
export function ExampleDirectUsage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>
            
            <BottomSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                header={
                    <div className="flex items-center justify-between w-full">
                        <h2 className="font-semibold">Custom Header</h2>
                    </div>
                }
                footer={
                    <Button className="w-full">Action Button</Button>
                }
                options={{
                    collapsedHeight: 40,
                    halfExpandedHeight: 70,
                    fullyExpandedHeight: 90,
                    maxWidth: 'max-w-md',
                }}
            >
                <div className="space-y-4">
                    <p>This is the content area. You can put anything here!</p>
                    <p>It supports scrolling when content is long.</p>
                </div>
            </BottomSheet>
        </>
    );
}

// ============================================
// Example 2: Global Usage (Anywhere in App)
// ============================================
export function ExampleGlobalUsage() {
    const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

    const handleOpen = () => {
        openBottomSheet({
            children: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Global Bottom Sheet</h3>
                    <p>This can be opened from anywhere in your app!</p>
                    <Button onClick={closeBottomSheet}>Close</Button>
                </div>
            ),
            header: (
                <div className="flex items-center justify-between w-full">
                    <h2>Global Sheet</h2>
                </div>
            ),
            options: {
                collapsedHeight: 30,
                halfExpandedHeight: 60,
                fullyExpandedHeight: 85,
            },
        });
    };

    return (
        <Button onClick={handleOpen}>
            Open Global Bottom Sheet
        </Button>
    );
}

// ============================================
// Example 3: Complex Content with Custom Options
// ============================================
export function ExampleComplexUsage() {
    const { openBottomSheet } = useBottomSheetContext();

    const handleOpenComplex = () => {
        openBottomSheet({
            children: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Title</h3>
                        <p className="text-sm text-muted-foreground">
                            This is a more complex example with custom styling.
                        </p>
                    </div>
                    <div className="border-t pt-4">
                        <p>More content here...</p>
                    </div>
                </div>
            ),
            header: (
                <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold">Complex Example</h2>
                    <span className="text-xs text-muted-foreground">Custom</span>
                </div>
            ),
            footer: (
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Cancel</Button>
                    <Button className="flex-1">Confirm</Button>
                </div>
            ),
            options: {
                collapsedHeight: 50,
                halfExpandedHeight: 75,
                fullyExpandedHeight: 95,
                maxWidth: 'max-w-2xl',
                showDragHandle: true,
                showCloseButton: true,
                closeOnBackdropClick: true,
                zIndex: 50,
                backdropOpacity: 0.5,
                dir: 'rtl',
            },
            className: 'custom-bottom-sheet',
            contentClassName: 'pb-24',
            'aria-labelledby': 'complex-sheet-title',
        });
    };

    return (
        <Button onClick={handleOpenComplex}>
            Open Complex Bottom Sheet
        </Button>
    );
}

// ============================================
// Example 4: Recreating PredictionDetail Pattern
// ============================================
export function ExamplePredictionDetailPattern() {
    const { openBottomSheet } = useBottomSheetContext();

    const handleOpenPrediction = (prediction: any) => {
        openBottomSheet({
            children: (
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-semibold leading-relaxed mb-2">
                            {prediction.title}
                        </p>
                        {/* Add your prediction content here */}
                    </div>
                </div>
            ),
            header: (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        {/* Your header content */}
                        <span>{prediction.user?.username}</span>
                    </div>
                </div>
            ),
            footer: (
                <Button className="w-full">
                    Submit
                </Button>
            ),
            options: {
                collapsedHeight: 50,
                halfExpandedHeight: 75,
                fullyExpandedHeight: 95,
                closeThreshold: 30,
                velocityThreshold: 0.5,
            },
            contentClassName: 'pb-24',
        });
    };

    return null; // This is just an example pattern
}

