import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const flexokiTheme = EditorView.theme({
  "&": {
    color: "var(--color-base-200)",
    backgroundColor: "var(--color-black)",
  },
  ".cm-content": {
    caretColor: "var(--color-base-200)",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--color-base-200)",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--color-base-850)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-black)",
    color: "var(--color-base-500)",
    borderRight: "1px solid var(--color-base-850)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--color-base-950)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-base-950)",
    color: "var(--color-base-200)",
  }
}, { dark: true });

const flexokiHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--color-green-400)" },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: "var(--color-base-200)" },
  { tag: [t.propertyName], color: "var(--color-blue-400)" },
  { tag: [t.variableName], color: "var(--color-base-200)" },
  { tag: [t.function(t.variableName), t.labelName], color: "var(--color-orange-400)" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "var(--color-purple-400)" },
  { tag: [t.definition(t.name), t.separator], color: "var(--color-base-200)" },
  { tag: [t.typeName, t.className], color: "var(--color-yellow-400)" },
  { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "var(--color-purple-400)" },
  { tag: [t.operator, t.operatorKeyword], color: "var(--color-red-400)" },
  { tag: [t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "var(--color-cyan-400)" },
  { tag: [t.meta, t.comment], color: "var(--color-base-500)" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "var(--color-base-500)", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "var(--color-red-400)" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "var(--color-yellow-400)" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "var(--color-cyan-400)" },
  { tag: t.invalid, color: "var(--color-red-400)" },
  { tag: t.tagName, color: "var(--color-blue-400)" },
]);

// Export as a single extension or individual parts?
// CodeMirror theme prop usually expects an Extension.
export const flexoki = [flexokiTheme, syntaxHighlighting(flexokiHighlightStyle)];
