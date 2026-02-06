import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Build absolute URL for API calls in Server Actions
 * In Next.js, relative URLs don't work in Server Actions running in Node.js
 * This function uses NEXT_PUBLIC_API_URL or falls back to VERCEL_URL or localhost
 */
export function buildApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  
  return `${baseUrl}${path}`
}
