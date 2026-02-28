/* eslint-disable @typescript-eslint/no-explicit-any */
const extractTextFromNode = (node: any): string => {
  if (!node || typeof node !== 'object') return ''
  if (node.type === 'text' && node.text) return node.text
  if (Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return ''
}

export const extractHeroText = (content: any): string => {
  if (!content || typeof content !== 'object') return ''
  if (content.root && Array.isArray(content.root.children)) {
    return content.root.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return ''
}