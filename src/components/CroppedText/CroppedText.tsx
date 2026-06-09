import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import "./CroppedText.css";

type CroppedTextProps = {
  children: string;
  opened?: boolean;
  rows?: number;
  ellipsis?: string;
  onCropChange?: (cropped: boolean) => void;
} & ComponentPropsWithoutRef<"div">;

const getLineHeight = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const parsedLineHeight = Number.parseFloat(styles.lineHeight);

  if (Number.isFinite(parsedLineHeight)) {
    return parsedLineHeight;
  }

  return Number.parseFloat(styles.fontSize) * 1.2;
};

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

export const CroppedText = ({
  children,
  opened = false,
  rows = 3,
  ellipsis = "...",
  className,
  onCropChange,
  ...props
}: CroppedTextProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const measurerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(rootRef);
  const [visibleText, setVisibleText] = useState(children);
  const [cropped, setCropped] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const measurer = measurerRef.current;
    let frameId = 0;

    const commitResult = (nextText: string, nextCropped: boolean) => {
      frameId = requestAnimationFrame(() => {
        setVisibleText(nextText);
        setCropped(nextCropped);
        onCropChange?.(nextCropped);
      });
    };

    if (!root || !measurer || opened || rows < 1 || width === 0) {
      commitResult(children, false);
      return () => cancelAnimationFrame(frameId);
    }

    const maxHeight = Math.ceil(getLineHeight(root) * rows);
    const source = Array.from(children);

    const fits = (value: string) => {
      measurer.textContent = value;
      return measurer.scrollHeight <= maxHeight;
    };

    if (fits(children)) {
      commitResult(children, false);
      return () => cancelAnimationFrame(frameId);
    }

    let min = 0;
    let max = source.length;
    let best = ellipsis;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      const candidate = `${source.slice(0, mid).join("").trimEnd()}${ellipsis}`;

      if (fits(candidate)) {
        best = candidate;
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }

    commitResult(best, true);

    return () => cancelAnimationFrame(frameId);
  }, [children, ellipsis, onCropChange, opened, rows, width]);

  return (
    <div
      {...props}
      ref={rootRef}
      className={joinClassNames("cropped-text", className)}
      data-cropped={cropped}
    >
      <div className="cropped-text-visible">{opened ? children : visibleText}</div>
      <div className="cropped-text-measurer" ref={measurerRef} aria-hidden="true" />
    </div>
  );
};

export type { CroppedTextProps };
