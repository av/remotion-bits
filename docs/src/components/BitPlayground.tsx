import React, { useState, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { flexoki } from '../lib/editor-theme';
import { getBit, type BitName } from '@bits';
import { ShowcasePlayer, withShowcaseFill } from './ShowcasePlayer';
import { transform } from 'sucrase';
import * as RemotionBits from 'remotion-bits';
import * as Remotion from 'remotion';

interface BitPlaygroundProps {
  bitName: BitName;
}

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className="sl-badge default small">{label}</span>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    style={{ width: '1.25em', height: '1.25em' }}
  >
    <path d="M3 19a2 2 0 0 1-1-2V2a2 2 0 0 1 1-1h13a2 2 0 0 1 2 1" />
    <rect x="6" y="5" width="16" height="18" rx="1.5" ry="1.5" />
  </svg>
);

// Helper function to compile and evaluate user code
const compileUserCode = (
  code: string,
  defaultProps: Record<string, any> = {},
  inputProps: Record<string, any> = {}
): { Component: React.FC | null; error: string | null } => {
  try {
    // Strip all import statements from the code (including multiline imports)
    let codeWithoutImports = code
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')  // Multi-line imports
      .replace(/import\s+['"][^'"]+['"];?/g, '')                  // Side-effect imports
      .split('\n')
      .filter(line => !line.trim().startsWith('import '))         // Any remaining import lines
      .join('\n')
      .trim();

    // Check if the code is just JSX (no component definition)
    // We specifically look for the main Component, ignoring metadata objects
    const hasComponentDefinition = /(?:export\s+)?(?:const|let|var|function)\s+Component\b/.test(codeWithoutImports);

    if (!hasComponentDefinition) {
      // Determine if code is an expression (e.g. <Div />) or a function body (has statements/return)
      const isExpression = !/return\b/.test(codeWithoutImports) && !/(?:const|let|var)\s/.test(codeWithoutImports);

      if (isExpression) {
        // Wrap bare JSX in a component automatically
        codeWithoutImports = `const BitComponent = () => {
          return (
            <>
              ${codeWithoutImports}
            </>
          );
        }`;
      } else {
        // Wrap statements in a function body
        codeWithoutImports = `const BitComponent = () => {
          ${codeWithoutImports}
        }`;
      }
    }

    // Transpile TypeScript/JSX to JavaScript
    const { code: transpiledCode } = transform(codeWithoutImports, {
      transforms: ['typescript', 'jsx'],
      production: false,
      jsxRuntime: 'classic',
      jsxPragma: 'React.createElement',
      jsxFragmentPragma: 'React.Fragment',
    });

    // Remove export keywords
    const cleanedTranspiled = transpiledCode
      .replace(/export\s+(const|let|var|function|class|default)\s+/g, '$1 ')
      .trim();

    // Determine the component name to return
    let componentName = 'BitComponent';
    if (hasComponentDefinition) {
      // Expecting 'Component' based on convention
       componentName = 'Component';
    }

    const wrappedCode = `
      const React = arguments[0];
      const Remotion = arguments[1];
      const RemotionBits = arguments[2];
      const __BIT_DEFAULT_PROPS__ = arguments[3] || {};
      const __BIT_PROPS__ = arguments[4] || {};

      // Inject magic props
      const props = { ...__BIT_DEFAULT_PROPS__, ...__BIT_PROPS__ };

      // Destructure common exports for convenience
      const { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, random } = Remotion;
      const {
        AnimatedText,
        StaggeredMotion,
        GradientTransition,
        Particles,
        Spawner,
        Behavior,
        useViewportRect,
        resolvePoint,
        Scene3D,
        Step,
        Element3D,
        useScene3D,
        useCamera,
        useActiveStep,
        randomInt,
        randomFloat,
        anyElement,
      } = RemotionBits;

      ${cleanedTranspiled}

      return ${componentName};
    `;

    // Execute the code
    const componentFactory = new Function(wrappedCode);
    const Component = componentFactory(React, Remotion, RemotionBits, defaultProps, inputProps);

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
  bitName
}) => {
  // Get the bit from the registry using the name
  const bit = getBit(bitName);

  const [editedCode, setEditedCode] = useState(bit.sourceCode);
  const [bitProps, setBitProps] = useState<Record<string, any>>(bit.props || {});

  const { Component: OriginalComponent } = bit;
  const { duration, width = 1920, height = 1080 } = bit.metadata;

  // Compile the edited code to get a live component
  const { Component: LiveComponent, error: compileError } = useMemo(() => {
    return compileUserCode(editedCode, bit.props || {}, bitProps);
  }, [editedCode, bit.props, bitProps]);

  // Use the live component if available, otherwise fall back to original
  const BaseComponent = LiveComponent || OriginalComponent;

  const ActiveComponent = withShowcaseFill(BaseComponent);

  const isModified = editedCode !== bit.sourceCode;

  const handleCodeChange = useCallback((value: string) => {
    setEditedCode(value);
  }, []);

  const handleReset = useCallback(() => {
    setEditedCode(bit.sourceCode);
  }, [bit.sourceCode]);

  const handlePropChange = useCallback((key: string, value: any) => {
    setBitProps(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCopyBit = useCallback(() => {
    const hasBlockBody = /return\b/.test(editedCode) || /(?:const|let|var)\s/.test(editedCode);
    const componentBody = hasBlockBody
      ? editedCode
      : `return (\n    ${editedCode}\n  );`;

    const currentProps = { ...bit.props, ...bitProps };
    const propsDeclaration = bit.props
      ? `\nconst props = { ...props };\n`
      : '';

    const generated = `import React from "react";
import { GradientTransition } from "remotion-bits";

export const metadata = ${JSON.stringify(bit.metadata, null, 2)};

${bit.props ? `export const props = ${JSON.stringify(currentProps, null, 2)};\n` : ''}
${bit.controls ? `export const controls = ${JSON.stringify(bit.controls, null, 2)};\n` : ''}
export const Component: React.FC = () => {${propsDeclaration}
  ${componentBody}
};
`;

    navigator.clipboard.writeText(generated).then(() => {
      alert('Bit code copied to clipboard!');
    });
  }, [editedCode, bit, bitProps]);

  return (
    <div className="bit-playground not-content">
      {bit.controls && bit.controls.length > 0 && (
        <div className="bit-playground-controls">
          <div className="bit-playground-controls-header">Controls</div>
          <div className="bit-playground-controls-grid">
            {bit.controls.map((control) => {
              const value = bitProps[control.key] ?? bit.props?.[control.key];

              return (
                <div key={control.key} className="bit-playground-control">
                  <label className="bit-playground-control-label">
                    {control.label || control.key}
                  </label>
                  {control.type === 'string' && (
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => handlePropChange(control.key, e.target.value)}
                      className="bit-playground-control-input"
                    />
                  )}
                  {control.type === 'number' && (
                    <input
                      type="number"
                      value={value ?? 0}
                      min={control.min}
                      max={control.max}
                      step={control.step ?? 1}
                      onChange={(e) => handlePropChange(control.key, parseFloat(e.target.value))}
                      className="bit-playground-control-input"
                    />
                  )}
                  {control.type === 'color' && (
                    <input
                      type="color"
                      value={value || '#000000'}
                      onChange={(e) => handlePropChange(control.key, e.target.value)}
                      className="bit-playground-control-color"
                    />
                  )}
                  {control.type === 'boolean' && (
                    <input
                      type="checkbox"
                      checked={value ?? false}
                      onChange={(e) => handlePropChange(control.key, e.target.checked)}
                      className="bit-playground-control-checkbox"
                    />
                  )}
                  {control.type === 'select' && control.options && (
                    <select
                      value={value}
                      onChange={(e) => {
                        const option = control.options?.find(o => String(o.value) === e.target.value);
                        handlePropChange(control.key, option?.value);
                      }}
                      className="bit-playground-control-input"
                    >
                      {control.options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bit-playground-content">
        <div className="bit-playground-preview-section">
          <div className="bit-playground-preview">
            <div
              className="bit-playground-player-container"
            >
              <ShowcasePlayer
                component={ActiveComponent}
                duration={duration}
                width={width}
                height={height}
                fps={30}
                controls={true}
                loop={true}
                autoPlay={true}
                autoResize={true}
              />
            </div>
          </div>
        </div>

        <div className="bit-playground-code-section">
          {compileError && (
            <div className="bit-playground-error">
              ⚠️ Compilation Error: {compileError}
            </div>
          )}
          <CodeMirror
            value={editedCode}
            height="200px"
            theme={flexoki}
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

          {isModified && (
            <button
              className="bit-playground-action-btn"
              onClick={handleReset}
              type="button"
              title="Reset to original code"
            >
              ↺
            </button>
          )}
          <button
            className="bit-playground-action-btn"
            onClick={handleCopyBit}
            type="button"
            title="Copy full Bit code"
          >
            <CopyIcon />
          </button>
        </div>
      </div>

      <div className="bit-playground-metadata">
        <div className="bit-playground-meta-item">
          <strong>Duration:</strong> {duration} frames ({(duration / 30).toFixed(1)}s at 30fps)
        </div>
        <div className="bit-playground-meta-item">
          <strong>Tags:</strong>
          <span className="bit-playground-badges">
            {bit.metadata.tags.map((tag) => (
              <a
                key={tag}
                href={`/docs/bits-catalog?tag=${encodeURIComponent(tag)}`}
                className="bit-playground-tag-link"
              >
                <Badge label={tag} />
              </a>
            ))}
          </span>
        </div>
      </div>

      <style>{`
        .bit-playground {
          border: 1px solid var(--sl-color-gray-5);
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 2rem 0;
        }

        .bit-playground-controls {
          padding: 1rem 1.5rem;
          background: var(--sl-color-gray-6);
          border-bottom: 1px solid var(--sl-color-gray-5);
        }

        .bit-playground-controls-header {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--sl-color-white);
          margin-bottom: 0.75rem;
        }

        .bit-playground-controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .bit-playground-control {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .bit-playground-control-label {
          font-size: 0.75rem;
          color: var(--sl-color-gray-2);
          font-weight: 500;
        }

        .bit-playground-control-input {
          padding: 0.375rem 0.5rem;
          background: var(--sl-color-gray-5);
          border: 1px solid var(--sl-color-gray-4);
          border-radius: 0.25rem;
          color: var(--sl-color-white);
          font-size: 0.875rem;
        }

        .bit-playground-control-input:focus {
          outline: none;
          border-color: var(--sl-color-accent);
        }

        .bit-playground-control-color {
          width: 100%;
          height: 2.5rem;
          padding: 0.25rem;
          background: var(--sl-color-gray-5);
          border: 1px solid var(--sl-color-gray-4);
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .bit-playground-control-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
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
          position: absolute;
          top: 1rem;
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

        .bit-playground-action-btn:first-of-type {
          right: 5rem;
        }

        .bit-playground-action-btn:last-of-type {
          right: 1rem;
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
          display: flex;
          flex-direction: column;
          gap: 0;
          background: var(--sl-color-bg);
        }

        .bit-playground-code-section,
        .bit-playground-preview-section {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }

        .bit-playground-code-section {
          border-right: 1px solid var(--sl-color-gray-5);
          overflow: hidden;
        }

        .bit-playground-preview-section {
          overflow: hidden;
          aspect-ratio: 16 / 9;
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
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--sl-color-black);
          min-height: 200px;
          flex: 1;
          overflow: hidden;
          width: 100%;
          max-width: 100%;
        }

        .bit-playground-player-container {
          width: 100%;
          max-width: 100%;
          max-height: 100%;
          height: 100%;
        }

        .bit-playground-player-container .showcase-player {
          width: 100%;
          height: 100%;
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

        .bit-playground-tag-link {
          text-decoration: none;
          color: inherit;
        }

        .bit-playground-tag-link:hover {
          opacity: 0.8;
          text-decoration: none;
        }

        .bit-playground-badges {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .bit-playground-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          border: 1px solid var(--sl-color-gray-4);
          background: var(--sl-color-gray-5);
          color: var(--sl-color-gray-2);
          font-size: 0.75rem;
          font-weight: 600;
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
            padding: 0;
            min-height: 100px;
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
