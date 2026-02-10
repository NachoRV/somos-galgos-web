import * as React from 'react';
import { LexicalContent } from '@/components/LexicalContent';
import { isLexicalContent } from './lexical';

/**
 * Safely renders content that could be:
 * - Lexical JSON object ({root: {children: [...]}})
 * - Plain string
 * - Invalid/unknown format (returns null)
 * 
 * @example
 * ```tsx
 * {renderContent(dog.web_description)}
 * {renderContent(value.description, 'text-sm text-gray-600')}
 * ```
 */
export function renderContent(
  content: any,
  className?: string
): React.ReactNode {
  if (!content) {
    return null;
  }

  // If it's a string, render it as plain text or paragraph
  if (typeof content === 'string') {
    return className ? (
      <span className={className}>{content}</span>
    ) : (
      <p>{content}</p>
    );
  }

  // If it's Lexical content, use LexicalContent component
  if (isLexicalContent(content)) {
    return <LexicalContent content={content} className={className} />;
  }

  // Otherwise, return null (can't render unknown types)
  return null;
}
