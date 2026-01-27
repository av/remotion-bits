import React, { useState, useCallback, useMemo } from 'react';
import { Player } from '@remotion/player';
import type { Bit } from '../bits';

interface BitPlaygroundProps {
  bit: Bit;
  defaultTab?: 'preview' | 'code';
}

export const BitPlayground: React.FC<BitPlaygroundProps> = ({
  bit,
  defaultTab = 'preview'
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(defaultTab);
  const [editedCode, setEditedCode] = useState(bit.sourceCode);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { Component } = bit;
  const { duration, width = 1920, height = 1080 } = bit.metadata;

  // Use edited code if editing, otherwise use original
  const displayCode = isEditing ? editedCode : bit.sourceCode;

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCode(e.target.value);
    setError(null);
  }, []);

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // Reset to original when disabling edit mode
      setEditedCode(bit.sourceCode);
      setError(null);
    }
    setIsEditing(!isEditing);
  }, [isEditing, bit.sourceCode]);

  const handleReset = useCallback(() => {
    setEditedCode(bit.sourceCode);
    setError(null);
  }, [bit.sourceCode]);

  return (
    <div className="bit-playground">
      <div className="bit-playground-tabs">
        <button
          className={`bit-playground-tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
          type="button"
        >
          Preview
        </button>
        <button
          className={`bit-playground-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
          type="button"
        >
          Code
        </button>
        {activeTab === 'code' && (
          <div className="bit-playground-tab-actions">
            <button
              className="bit-playground-action-btn"
              onClick={handleEditToggle}
              type="button"
              title={isEditing ? "Disable editing" : "Enable editing"}
            >
              {isEditing ? '🔒 Lock' : '✏️ Edit'}
            </button>
            {isEditing && (
              <button
                className="bit-playground-action-btn"
                onClick={handleReset}
                type="button"
                title="Reset to original code"
              >
                ↺ Reset
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bit-playground-content">
        {activeTab === 'preview' ? (
          <div className="bit-playground-preview">
            <Player
              component={Component}
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
        ) : (
          <div className="bit-playground-code">
            {isEditing ? (
              <>
                {error && (
                  <div className="bit-playground-error">
                    {error}
                  </div>
                )}
                <textarea
                  className="bit-playground-editor"
                  value={editedCode}
                  onChange={handleCodeChange}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
                <div className="bit-playground-hint">
                  💡 Note: Live preview updates are not yet implemented. This is a code editor preview.
                </div>
              </>
            ) : (
              <pre className="astro-code" style={{ padding: '1rem', borderRadius: '0.5rem' }}>
                <code>{displayCode}</code>
              </pre>
            )}
          </div>
        )}
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

        .bit-playground-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--sl-color-gray-5);
          background: var(--sl-color-gray-6);
          align-items: center;
        }

        .bit-playground-tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          color: var(--sl-color-gray-2);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .bit-playground-tab:hover {
          background: var(--sl-color-gray-5);
          color: var(--sl-color-white);
        }

        .bit-playground-tab.active {
          background: var(--sl-color-bg);
          color: var(--sl-color-white);
          border-bottom-color: var(--sl-color-accent);
        }

        .bit-playground-tab-actions {
          margin-left: auto;
          padding: 0.5rem 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .bit-playground-action-btn {
          padding: 0.375rem 0.75rem;
          background: var(--sl-color-gray-5);
          border: 1px solid var(--sl-color-gray-4);
          border-radius: 0.25rem;
          color: var(--sl-color-white);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .bit-playground-action-btn:hover {
          background: var(--sl-color-gray-4);
          border-color: var(--sl-color-gray-3);
        }

        .bit-playground-content {
          background: var(--sl-color-bg);
        }

        .bit-playground-preview {
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--sl-color-black);
        }

        .bit-playground-code {
          padding: 0;
          position: relative;
        }

        .bit-playground-code pre {
          margin: 0;
          background: var(--sl-color-gray-6) !important;
        }

        .bit-playground-editor {
          width: 100%;
          min-height: 300px;
          padding: 1rem;
          background: var(--sl-color-gray-6);
          border: none;
          color: var(--sl-color-white);
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          resize: vertical;
          outline: none;
        }

        .bit-playground-editor:focus {
          background: var(--sl-color-gray-5);
        }

        .bit-playground-error {
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid rgb(239, 68, 68);
          color: rgb(252, 165, 165);
          font-size: 0.875rem;
          font-family: monospace;
        }

        .bit-playground-hint {
          padding: 0.75rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid rgb(59, 130, 246);
          color: rgb(147, 197, 253);
          font-size: 0.875rem;
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

        @media (max-width: 768px) {
          .bit-playground-preview {
            padding: 1rem;
          }

          .bit-playground-metadata {
            flex-direction: column;
            gap: 0.5rem;
          }

          .bit-playground-tab-actions {
            padding: 0.25rem 0.5rem;
          }

          .bit-playground-action-btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};
