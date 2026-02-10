import { lexicalToText } from './lexicalToText';

/**
 * Utility functions for handling Lexical editor content
 */

// Re-export for convenience
export { lexicalToText } from './lexicalToText';

/**
 * Check if content is valid Lexical format
 */
export function isLexicalContent(content: any): boolean {
  return !!(
    content &&
    typeof content === 'object' &&
    !Array.isArray(content) &&
    'root' in content &&
    content.root &&
    typeof content.root === 'object' &&
    'children' in content.root &&
    Array.isArray(content.root.children) &&
    content.root.children.length > 0
  );
}

/**
 * Get plain text excerpt from Lexical content
 */
export function getLexicalExcerpt(content: any, maxLength: number = 200): string {
  const text = lexicalToText(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
