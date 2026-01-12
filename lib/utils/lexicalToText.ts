/**
 * Convert Lexical richText to plain text
 * This function extracts text content from Lexical JSON structure
 * 
 * @param richText - Lexical JSON structure from Payload CMS
 * @returns Plain text string with line breaks
 * 
 * @example
 * ```typescript
 * const text = lexicalToText(payloadDog.webDescription);
 * ```
 */
export function lexicalToText(richText: any): string {
  if (!richText || typeof richText !== 'object') return '';
  
  // If it's a Lexical JSON structure
  if (richText.root && richText.root.children) {
    const extractText = (node: any): string => {
      if (!node) return '';
      
      // If node has text property, return it
      if (node.text) return node.text;
      
      // If node has children, recursively extract text
      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join('');
      }
      
      return '';
    };
    
    return richText.root.children.map(extractText).join('\n');
  }
  
  return '';
}
