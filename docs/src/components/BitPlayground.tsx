import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Player } from '@remotion/player';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { transform } from 'sucrase';
import type { Bit } from '../bits';

interface BitPlaygroundProps {
  bit: Bit;
  defaultTab?: 'preview' | 'code';
}

export const BitPlayground: React.FC<BitPlaygroundProps> = ({
  bit,
  defaultTab = 'preview'
}) => {
  const [editedCode, setEditedCode] = useState(bit.sourceCode);
  const [error, setError] = useState<string | null>(null);
  const [CompiledComponent, setCompiledComponent] = useState<React.FC | null>(null);

  const { Component: OriginalComponent } = bit;
  const { duration, width = 1920, height = 1080 } = bit.metadata;

  // Choose which component to display
  const DisplayComponent = CompiledComponent || OriginalComponent;

  // Compile the code whenever it changes
  useEffect(() => {
    const compileCode = async () => {
      try {
        // Transform TypeScript/JSX to JavaScript
        const result = transform(editedCode, {
          transforms: ['typescript', 'jsx'],
          production: false,
        });

        // Create a function that returns the component
        // We need to provide React and remotion imports
        const componentFactory = new Function(
          'React',
          'remotion',
          `
          const { useCurrentFrame, interpolate, spring, Easing, AbsoluteFill } = remotion;
          ${result.code}
          return Component;
          `
        );

        // Import remotion dynamically
        const remotion = await import('remotion');
        const NewComponent = componentFactory(React, remotion);

        setCompiledComponent(() => NewComponent);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to compile code');
        setCompiledComponent(null);
      }
    };

    // Only compile if the code has changed from the original
    if (editedCode !== bit.sourceCode) {
      compileCode();
    } else {
      setCompiledComponent(null);
      setError(null);
    }
  }, [editedCode, bit.sourceCode]);

  const handleCodeChange = useCallback((value: string) => {
    setEditedCode(value);
  }, []);

  const handleReset = useCallback(() => {
    setEditedCode(bit.sourceCode);
    setError(null);
  }, [bit.sourceCode]);

  return (
    <div className="bit-playground">
      <div className="bit-playground-header">
        <h3 className="bit-playground-title">Interactive Playground</h3>
        <button
          className="bit-playground-action-btn"
          onClick={handleReset}
          type="button"
          title="Reset to original code"
        >
          ↺ Reset
        </button>
      </div>

      <div className="bit-playground-content">
        <div className="bit-playground-code-section">
          <div className="bit-playground-code-header">
            <span>Code Editor</span>
          </div>
          {error && (
            <div className="bit-playground-error">
              <strong>⚠️ Compilation Error:</strong>
              <pre>{error}</pre>
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
              component={DisplayComponent}
              durationInFrames={duration}
              compositionWidth={width}
              compositionHeight={height}
              fps={30}
              style={{
                width: '100%',
                aspectRatio: `${width}/${height}`,
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

        .bit-playground-action-btn:hover {
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
        }

        .bit-playground-error {
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border-bottom: 2px solid rgb(239, 68, 68);
          color: rgb(252, 165, 165);
          font-size: 0.875rem;
        }

        .bit-playground-error strong {
          display: block;
          margin-bottom: 0.5rem;
        }

        .bit-playground-error pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .bit-playground-preview {
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--sl-color-black);
          min-height: 500px;
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
