import React, { useMemo } from "react";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { random } from "remotion";
import {
  useMotionTiming,
  buildMotionStyles,
  interpolateKeyframes,
  type AnimatedValue,
  type TransformProps,
  type VisualProps,
  type TimingProps,
} from "../utils/motion";
import { useViewportRect } from "../hooks/useViewportRect";

export type CodeBlockProps = {
  // Content
  code: string;
  language?: string;
  highlight?: any[];
  focus?: any;
  transition?: any;
  theme?: "dark" | "light" | "custom";
  customTheme?: any;
  showLineNumbers?: boolean;
  lineNumberColor?: string;
  fontSize?: number;
  lineHeight?: number;
  padding?: number;
  className?: string;
  style?: React.CSSProperties;
};

// --- Helpers ---
const normalizeRange = (lines: number | [number, number]): [number, number] => {
  if (Array.isArray(lines)) return lines;
  return [lines, lines];
};

const isLineInRegion = (lineIndex: number, regionLines: number | [number, number]) => {
  const [start, end] = normalizeRange(regionLines);
  const currentLineNumber = lineIndex + 1;
  return currentLineNumber >= start && currentLineNumber <= end;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "tsx",
  highlight,
  focus,
  transition,
  theme = "dark",
  customTheme,
  showLineNumbers,
  lineNumberColor = "#666",
  fontSize: fontSizeProp,
  lineHeight: lineHeightProp,
  padding: paddingProp,
  className,
  style,
}) => {
  const rect = useViewportRect();
  
  // Defaults
  const fontSize = fontSizeProp ?? rect.width * 0.015;
  const lineHeight = lineHeightProp ?? 1.5;
  const padding = paddingProp ?? fontSize;

  const prismTheme = useMemo(() => {
    if (theme === "custom" && customTheme) return customTheme;
    if (theme === "light") return themes?.vsLight || {};
    return themes?.vsDark || {};
  }, [theme, customTheme]);

  // Safety check for dependency
  if (!Highlight) {
    return <pre style={{ color: 'red' }}>prism-react-renderer not loaded properly</pre>;
  }

  // Highlight Timing
  const highlightProgress = useMotionTiming({
    delay: transition?.highlightDelay ?? 0,
    duration: transition?.highlightDuration ?? 30,
    easing: "linear", 
  });

  return (
    <div
      className={className}
      style={{
        padding,
        fontSize,
        lineHeight,
        fontFamily: 'monospace',
        position: 'relative',
        ...style,
      }}
    >
      <Highlight
        theme={prismTheme}
        code={code ? code.trim() : ""}
        language={language as Language}
      >
        {({ className: prismClassName, style: prismStyle, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={prismClassName}
            style={{
              ...prismStyle,
              margin: 0,
              padding: 0,
              background: 'transparent',
              overflow: 'visible',
            }}
          >
            {tokens.map((line, i) => {
              // Calculate stagger index
              let staggerIndex = i;
              const totalLines = tokens.length;
              const direction = transition?.lineStaggerDirection ?? "forward";
              
              if (direction === "reverse") {
                staggerIndex = totalLines - 1 - i;
              } else if (direction === "center") {
                const center = (totalLines - 1) / 2;
                staggerIndex = Math.abs(i - center);
              } else if (direction === "random") {
                staggerIndex = random(`codeblock-line-${i}`) * (totalLines - 1);
              }

              // 1. Line Reveal Animation
              const lineProgress = useMotionTiming({
                stagger: transition?.lineStagger ?? 0,
                unitIndex: staggerIndex,
                duration: transition?.duration ?? 30,
                delay: transition?.delay ?? 0,
                easing: transition?.easing,
              });

              const revealStyle = buildMotionStyles({
                progress: lineProgress,
                transforms: transition,
                styles: transition,
                duration: transition?.duration ?? 30,
              });

              // 2. Focus Logic
              let focusOpacity = 1;
              let focusBlur = 0;

              if (focus && focus.lines) {
                const isFocused = isLineInRegion(i, focus.lines);
                if (!isFocused) {
                  focusOpacity = focus.dimOpacity ?? 0.3;
                  focusBlur = focus.dimBlur ?? 2;
                }
              }

              // Combine reveal and focus
              const finalOpacity = (Number(revealStyle.opacity ?? 1)) * focusOpacity;
              const revealFilter = revealStyle.filter || ''; 
              const extraBlur = focusBlur > 0 ? `blur(${focusBlur}px)` : '';
              const finalFilter = [revealFilter, extraBlur].filter(Boolean).join(' ');

              // 3. Highlight Logic
              const activeHighlight = highlight?.find((h: any) => h && isLineInRegion(i, h.lines));
              
              let highlightBg = 'transparent';
              let lineHighlightFilter = '';
              
              if (activeHighlight) {
                // Determine highlight background color/opacity
                if (activeHighlight.color) {
                    highlightBg = activeHighlight.color;
                }
                
                if (activeHighlight.blur) {
                    const hBlur = interpolateKeyframes(
                        activeHighlight.blur, 
                        highlightProgress, 
                        undefined, 
                        transition?.highlightDuration ?? 30
                    );
                    if (hBlur > 0) {
                        lineHighlightFilter = `blur(${hBlur}px)`;
                    }
                }
              }

              // Safety check for activeHighlight opacity logic
              const highlightOpacity = activeHighlight ? interpolateKeyframes(
                  activeHighlight.opacity ?? 1, 
                  highlightProgress, 
                  undefined, 
                  transition?.highlightDuration ?? 30
              ) : 0;

              const lineProps = getLineProps({ line, key: i });

              return (
                <div
                  {...lineProps}
                  style={{
                    ...lineProps.style,
                    ...revealStyle,
                    opacity: finalOpacity,
                    filter: finalFilter || undefined,
                    position: 'relative',
                    width: '100%',
                    display: 'flex', 
                  }}
                >
                  {/* Highlight Background Layer */}
                  {activeHighlight && (
                      <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: -padding,
                            right: -padding,
                            bottom: 0,
                            backgroundColor: highlightBg,
                            opacity: highlightOpacity,
                            filter: lineHighlightFilter,
                            zIndex: -1,
                            pointerEvents: 'none',
                        }}
                      />
                  )}

                  {showLineNumbers && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '2.5em',
                        textAlign: 'right',
                        paddingRight: '1em',
                        userSelect: 'none',
                        opacity: 0.5,
                        color: lineNumberColor,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                  )}

                  <span className="code-line-content" style={{ display: 'block', width: '100%' }}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
