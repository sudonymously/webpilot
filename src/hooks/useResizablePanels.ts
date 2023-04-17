import { useState, useCallback } from 'react';

const maxEditorHeight = 86.2;
const minEditorHeight = 0;
const minLeftPanelWidth = 30;
const maxLeftPanelWidth = 100;

const useResizablePanels = (initialHeight: string, initialWidth: string) => {
    const [editorHeight, setEditorHeight] = useState(initialHeight);
    const [leftPanelWidth, setLeftPanelWidth] = useState(initialWidth);

    const handleHorizontalResize = useCallback(
        (deltaY: number) => {
            const newHeight = parseFloat(editorHeight) + deltaY / window.innerHeight * 100;
            if (newHeight < maxEditorHeight && newHeight > minEditorHeight) setEditorHeight(`${newHeight}vh`);
        },
        [editorHeight]
    );

    const handleVerticalResize = useCallback(
        (deltaX: number) => {
            const newWidth = parseFloat(leftPanelWidth) + deltaX / window.innerWidth * 100;
            if(newWidth < maxLeftPanelWidth && newWidth > minLeftPanelWidth) setLeftPanelWidth(`${newWidth}vw`);
        },
        [leftPanelWidth]
    );
    
    return {
        editorHeight,
        chatHeight: `calc(100vh - ${editorHeight} - 4rem - 1rem - 2px)`,
        leftPanelWidth,
        rightPanelWidth: `calc(100vw - ${leftPanelWidth})`,
        handleHorizontalResize,
        handleVerticalResize,
    };
};

export default useResizablePanels;