/**
 * Helper function to generate consistent userId from email
 * This ensures email auth users have the same userId across sessions
 */
export function emailToUserId(email: string): string {
  // Remove special characters and convert to lowercase
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Get the consistent userId for a user based on their auth type
 * For email auth: use email-based ID
 * For Google OAuth: use the Alchemy userId
 */
export function getConsistentUserId(userId: string, email: string, hasIdToken: boolean): string {
  const isEmailAuth = !hasIdToken;
  
  if (isEmailAuth) {
    return emailToUserId(email);
  }
  
  return userId;
}

