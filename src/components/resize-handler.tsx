import { useState, useEffect, useRef, useCallback } from 'react';

const Handle = ({ className = "h-2 w-2" }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
  )
}

interface ResizeHandlerProps {
  type?: "horizontal" | "vertical";
  onDrag: (deltaY: number) => void;
}

const ResizeHandler = ({ onDrag, type = "horizontal" }: ResizeHandlerProps) => {
  const handlerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // @ts-ignore
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    // @ts-ignore
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (e.buttons === 1) {
      if (type === "horizontal") onDrag(e.movementY);
      if (type === "vertical") onDrag(e.movementX);
    }
  }, [onDrag, type]);

  useEffect(() => {
    const handler = handlerRef.current;
    if (handler) {
      handler.addEventListener("pointerdown", handlePointerDown);
      handler.addEventListener("pointerup", handlePointerUp);
      handler.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      if (handler) {
        handler.removeEventListener("pointerdown", handlePointerDown);
        handler.removeEventListener("pointerup", handlePointerUp);
        handler.removeEventListener("pointermove", handlePointerMove);
      }
    };
  }, [onDrag, handlePointerMove, handlePointerDown, handlePointerUp]);
  
  switch (type) {
    case "horizontal":
      return (
        <div
          className="w-full cursor-row-resize box-border bg-[#111215]  border-t border-t-[#232838] border-b border-b-[#232838] flex justify-center items-center"
          ref={handlerRef}
        >
          <Handle className="h-4 w-4 text-zinc-500" />
        </div>
      )
    case "vertical":
      return (
        <div
          className="h-auto w-4 cursor-col-resize box-border bg-[#111215]  border-l border-l-[#232838] border-r border-r-[#232838] flex justify-center items-center"
          ref={handlerRef}
        >
          <Handle className="h-4 w-4 text-zinc-500 rotate-90" />
        </div>
      )
    default:
      console.log(`Invalid type: ${type}`);
      return null
  }
};

export default ResizeHandler