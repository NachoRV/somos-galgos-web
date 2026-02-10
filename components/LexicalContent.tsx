'use client';

import * as React from 'react';
import { isLexicalContent } from '@/lib/utils/lexical';

interface LexicalNode {
  text?: string;
  type?: string;
  children?: LexicalNode[];
  format?: number;
  tag?: string;
  url?: string;
}

interface LexicalContentProps {
  content: any;
  className?: string;
}

/**
 * Renders Lexical editor content as HTML
 * Reusable component for all richText fields from Payload CMS
 * 
 * Safely handles:
 * - Lexical JSON objects ({root: {children: [...]}})
 * - Plain strings
 * - Invalid or unknown formats (returns null or plain text)
 * 
 * @example
 * ```tsx
 * <LexicalContent content={dog.web_description} />
 * ```
 */
export function LexicalContent({ content, className = '' }: LexicalContentProps) {
  // Handle null, undefined, or empty content
  if (!content) {
    return null;
  }

  // If it's a string, render it as plain text
  if (typeof content === 'string') {
    return <p className={className}>{content}</p>;
  }

  // If it's not an object, return null (can't render)
  if (typeof content !== 'object' || Array.isArray(content)) {
    return null;
  }

  // Check if content has the expected Lexical structure
  if (!isLexicalContent(content)) {
    return null;
  }

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null;

    // Text node
    if (node.text !== undefined) {
      let text: React.ReactNode = node.text;
      
      // Apply formatting (bold, italic, underline, strikethrough, etc.)
      if (node.format) {
        if (node.format & 1) text = <strong key={`bold-${index}`}>{text}</strong>; // Bold
        if (node.format & 2) text = <em key={`italic-${index}`}>{text}</em>; // Italic
        if (node.format & 4) text = <u key={`underline-${index}`}>{text}</u>; // Underline
        if (node.format & 8) text = <s key={`strikethrough-${index}`}>{text}</s>; // Strikethrough
      }
      
      return text;
    }

    // Element nodes
    const children = node.children?.map((child, i) => renderNode(child, i));

    switch (node.type) {
      case 'paragraph':
        return <p key={index} className="mb-4 last:mb-0"><>{children}</></p>;
      
      case 'heading':
        const HeadingTag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const headingClasses = {
          h1: 'text-3xl font-bold mb-4',
          h2: 'text-2xl font-bold mb-3',
          h3: 'text-xl font-bold mb-3',
          h4: 'text-lg font-bold mb-2',
          h5: 'text-base font-bold mb-2',
          h6: 'text-sm font-bold mb-2',
        };
        return React.createElement(
          HeadingTag,
          { key: index, className: headingClasses[HeadingTag] || '' },
          children
        );
      
      case 'list':
        const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
        return (
          <ListTag 
            key={index} 
            className={node.tag === 'ol' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4'}
          >
            <>{children}</>
          </ListTag>
        );
      
      case 'listitem':
        return <li key={index} className="mb-1"><>{children}</></li>;
      
      case 'link':
        return (
          <a 
            key={index} 
            href={node.url} 
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <>{children}</>
          </a>
        );
      
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
            <>{children}</>
          </blockquote>
        );
      
      case 'linebreak':
        return <br key={index} />;
      
      case 'code':
        return (
          <code key={index} className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
            <>{children}</>
          </code>
        );
      
      default:
        // Render unknown node types as span to avoid breaking
        return <span key={index}><>{children}</></span>;
    }
  };

  // Final render with proper structure check
  try {
    if (Array.isArray(content.root.children) && content.root.children.length > 0) {
      return (
        <div className={`lexical-content ${className}`}>
          {content.root.children.map((node: LexicalNode, index: number) => renderNode(node, index))}
        </div>
      );
    }
  } catch (error) {
    console.error('Error rendering Lexical content:', error);
  }

  return null;
}
