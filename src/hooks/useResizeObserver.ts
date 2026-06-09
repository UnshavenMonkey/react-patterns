import { useLayoutEffect, useState, type RefObject } from "react";

type Size = {
  width: number;
  height: number;
};

const emptySize: Size = {
  width: 0,
  height: 0,
};

export function useResizeObserver<TElement extends Element>(
  ref: RefObject<TElement | null>,
) {
  const [size, setSize] = useState<Size>(emptySize);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const updateSize = (nextSize: Size) => {
      setSize((currentSize) => {
        if (
          currentSize.width === nextSize.width &&
          currentSize.height === nextSize.height
        ) {
          return currentSize;
        }

        return nextSize;
      });
    };

    const frameId = { current: 0 };
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      cancelAnimationFrame(frameId.current);
      frameId.current = requestAnimationFrame(() => {
        updateSize({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        });
      });
    });

    const rect = element.getBoundingClientRect();
    updateSize({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frameId.current);
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
