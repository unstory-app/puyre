// Utility functions for the Puyre application

/**
 * Extract the first image from markdown content
 */
export function extractFirstImage(markdown: string): string | null {
  const imgRegex = /<img.*?src=['"](.*?)['"]/;
  const match = imgRegex.exec(markdown);
  return match ? match[1] : null;
}

/**
 * Generate a summary from markdown content
 */
export function generateSummary(markdown: string, maxLength: number = 200): string {
  // Remove code blocks
  const codeRegex = /<code>(.*?)<\/code>/g;
  const withoutCode = markdown.replace(codeRegex, "");
  
  // Remove HTML tags
  const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
  const plainText = withoutCode.replace(htmlRegex, "");
  
  // Trim and truncate
  const trimmed = plainText.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  
  return trimmed.slice(0, maxLength).trim() + "...";
}

/**
 * Parse comma-separated tags
 */
export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 5); // Max 5 tags
}

/**
 * Format tags array back to string
 */
export function formatTags(tags: string[]): string {
  return tags.join(", ");
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const words = markdown.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Validate post data before saving
 */
export function validatePost(title: string, content: string, tags: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (title.trim().length < 5) {
    errors.push("Title must be at least 5 characters");
  }

  if (content.trim().length < 15) {
    errors.push("Content must be at least 15 characters");
  }

  if (tags.trim().length === 0) {
    errors.push("At least one tag is required");
  }

  const tagArray = parseTags(tags);
  if (tagArray.length > 5) {
    errors.push("Maximum 5 tags allowed");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
