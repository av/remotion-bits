import React, { useState, useCallback, useMemo } from 'react';
import { Player } from '@remotion/player';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { getBit, type BitName } from '../bits';
import { transform } from 'sucrase';
import * as RemotionBits from 'remotion-bits';
import * as Remotion from 'remotion';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { jsx } from 'react/jsx-runtime';

interface BitPlaygroundProps {
  bitName: BitName;
  defaultTab?: 'preview' | 'code';
}

// Helper function to compile and evaluate user code
const compileUserCode = (code: string): { Component: React.FC | null; error: string | null } => {
  try {
    // Strip all import statements from the code (including multiline imports)
    // This removes lines like:
    // - import { AbsoluteFill } from 'remotion';
    // - import * as React from 'react';
    // - import type { Something } from 'somewhere';
    // Handle both single-line and multi-line imports
    let codeWithoutImports = code
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')  // Multi-line imports
      .replace(/import\s+['"][^'"]+['"];?/g, '')                  // Side-effect imports
      .split('\n')
      .filter(line => !line.trim().startsWith('import '))         // Any remaining import lines
      .join('\n')
      .trim();

    console.log('Original code:', code);
    console.log('After import removal:', codeWithoutImports);

    // Transpile TypeScript/JSX to JavaScript
    const { code: transpiledCode } = transform(codeWithoutImports, {
      transforms: ['typescript', 'jsx'],
      production: false,
      jsxRuntime: 'automatic',
    });

    console.log('After transpilation:', transpiledCode);

    // Remove any import/export statements that might remain after transpilation
    // Sucrase adds imports inline, so we need to handle them anywhere in the code
    const cleanedTranspiled = transpiledCode
      .replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/g, '')  // Remove imports anywhere
      .replace(/export\s+(const|let|var|function|class|default)\s+/g, '$1 ')  // Remove export keywords
      .trim();

    console.log('Final cleaned code:', cleanedTranspiled);

    // Create a function that returns the component
    // We'll wrap the user's code and extract any exported component or the last expression
    const wrappedCode = `
      const React = arguments[0];
      const Remotion = arguments[1];
      const RemotionBits = arguments[2];
      const _jsxDEV = arguments[3];
      const _jsx = arguments[4];

      // Destructure common exports for convenience
      const { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } = Remotion;
      const { TextTransition, MotionTransition, BackgroundTransition, Particles } = RemotionBits;

      ${cleanedTranspiled}

      // Try to find and return the component
      // Look for exports like: export const FadeIn = () => ...
      // Or return the last defined component/function
      if (typeof FadeIn !== 'undefined') return FadeIn;
      if (typeof Component !== 'undefined') return Component;

      // If nothing exported, try to find the last defined function
      throw new Error('No component found. Please export a component named "FadeIn" or "Component".');
    `;

    // Execute the code
    const componentFactory = new Function(wrappedCode);
    const Component = componentFactory(React, Remotion, RemotionBits, jsxDEV, jsx);

    if (!Component || typeof Component !== 'function') {
      return {
        Component: null,
        error: 'The code did not return a valid React component.'
      };
    }

    return { Component, error: null };
  } catch (err) {
    return {
      Component: null,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

export const BitPlayground: React.FC<BitPlaygroundProps> = ({
  bitName,
  defaultTab = 'preview'
}) => {
  // Get the bit from the registry using the name
  const bit = getBit(bitName);

  const [editedCode, setEditedCode] = useState(bit.sourceCode);
  const [hasEdits, setHasEdits] = useState(false);

  const { Component: OriginalComponent } = bit;
  const { duration, width = 1920, height = 1080 } = bit.metadata;

  // Compile the edited code to get a live component
  const { Component: LiveComponent, error: compileError } = useMemo(() => {
    if (!hasEdits) {
      return { Component: OriginalComponent, error: null };
    }
    return compileUserCode(editedCode);
  }, [editedCode, hasEdits, OriginalComponent]);

  // Use the live component if available, otherwise fall back to original
  const ActiveComponent = LiveComponent || OriginalComponent;

  const handleCodeChange = useCallback((value: string) => {
    setEditedCode(value);
    setHasEdits(value !== bit.sourceCode);
  }, [bit.sourceCode]);

  const handleReset = useCallback(() => {
    setEditedCode(bit.sourceCode);
    setHasEdits(false);
  }, [bit.sourceCode]);

  return (
    <div className="bit-playground not-content">
      <div className="bit-playground-header">
        <h3 className="bit-playground-title">Interactive Playground</h3>
        <button
          className="bit-playground-action-btn"
          onClick={handleReset}
          type="button"
          title="Reset to original code"
          disabled={!hasEdits}
        >
          ↺ Reset
        </button>
      </div>

      <div className="bit-playground-content">
        <div className="bit-playground-code-section">
          <div className="bit-playground-code-header">
            <span>Code Editor</span>
            {hasEdits && (
              <span className="bit-playground-edit-badge">✏️ Modified</span>
            )}
          </div>
          <div className="bit-playground-info">
            💡 Edit the code to experiment and learn. The preview updates live with your changes.
          </div>
          {compileError && (
            <div className="bit-playground-error">
              ⚠️ Compilation Error: {compileError}
            </div>
          )}
          <CodeMirror
            value={editedCode}
            height="500px"
            theme={oneDark}
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={handleCodeChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>

        <div className="bit-playground-preview-section">
          <div className="bit-playground-preview-header">
            <span>Live Preview</span>
          </div>
          <div className="bit-playground-preview">
            <Player
              component={ActiveComponent}
              durationInFrames={duration}
              compositionWidth={width}
              compositionHeight={height}
              fps={30}
              style={{
                width: '100%',
                maxWidth: '100%',
              }}
              controls
              loop
            />
          </div>
        </div>
      </div>

      <div className="bit-playground-metadata">
        <div className="bit-playground-meta-item">
          <strong>Duration:</strong> {duration} frames ({(duration / 30).toFixed(1)}s at 30fps)
        </div>
        <div className="bit-playground-meta-item">
          <strong>Tags:</strong> {bit.metadata.tags.join(', ')}
        </div>
      </div>

      <style>{`
        .bit-playground {
          border: 1px solid var(--sl-color-gray-5);
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 2rem 0;
        }

        .bit-playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: var(--sl-color-gray-6);
          border-bottom: 1px solid var(--sl-color-gray-5);
        }

        .bit-playground-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--sl-color-white);
        }

        .bit-playground-action-btn {
          padding: 0.5rem 1rem;
          background: var(--sl-color-gray-5);
          border: 1px solid var(--sl-color-gray-4);
          border-radius: 0.25rem;
          color: var(--sl-color-white);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .bit-playground-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bit-playground-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bit-playground-action-btn:not(:disabled):hover {
          background: var(--sl-color-gray-4);
          border-color: var(--sl-color-gray-3);
        }

        .bit-playground-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: var(--sl-color-bg);
        }

        .bit-playground-code-section,
        .bit-playground-preview-section {
          display: flex;
          flex-direction: column;
        }

        .bit-playground-code-section {
          border-right: 1px solid var(--sl-color-gray-5);
        }

        .bit-playground-code-header,
        .bit-playground-preview-header {
          padding: 0.75rem 1rem;
          background: var(--sl-color-gray-6);
          border-bottom: 1px solid var(--sl-color-gray-5);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--sl-color-gray-2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bit-playground-edit-badge {
          background: rgba(59, 130, 246, 0.2);
          color: rgb(147, 197, 253);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .bit-playground-info {
          padding: 0.75rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          color: rgb(147, 197, 253);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .bit-playground-error {
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
          color: rgb(252, 165, 165);
          font-size: 0.875rem;
          line-height: 1.5;
          font-family: 'Courier New', 'Consolas', monospace;
        }

        .bit-playground-preview {
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--sl-color-black);
          min-height: 500px;
          overflow: hidden;
        }

        .bit-playground-metadata {
          padding: 1rem 1.5rem;
          background: var(--sl-color-gray-6);
          border-top: 1px solid var(--sl-color-gray-5);
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
        }

        .bit-playground-meta-item {
          color: var(--sl-color-gray-2);
        }

        .bit-playground-meta-item strong {
          color: var(--sl-color-white);
          margin-right: 0.5rem;
        }

        /* Responsive: Stack vertically on mobile */
        @media (max-width: 1024px) {
          .bit-playground-content {
            grid-template-columns: 1fr;
          }

          .bit-playground-code-section {
            border-right: none;
            border-bottom: 1px solid var(--sl-color-gray-5);
          }

          .bit-playground-preview {
            padding: 1rem;
            min-height: 300px;
          }

          .bit-playground-metadata {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        /* Override CodeMirror styles to fit our theme */
        .bit-playground-code-section .cm-editor {
          font-size: 0.875rem;
        }

        .bit-playground-code-section .cm-scroller {
          font-family: 'Courier New', 'Consolas', monospace;
        }
      `}</style>
    </div>
  );
};
