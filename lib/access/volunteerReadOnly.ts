// Reusable access control: volunteers can only read, others have full access
import type { Access } from 'payload';

/**
 * Returns an access control object for Payload collections:
 * - Volunteers (role: 'voluntario') can only read (read: true, all else: false)
 * - Any authenticated user can create/update/delete (including API key users)
 * - Unauthenticated users cannot do anything
 */
export const volunteerReadOnlyAccess: Access = async ({ req }) => {
  const user = req.user as any;
  // If no user, deny
  if (!user) return false;
  // If user is volunteer, deny create/update/delete
  if (user.role === 'voluntario') return false;
  // All other authenticated users (admin, user, API key users) can proceed
  return true;
};

export const volunteerReadOnlyCollectionAccess = {
  read: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    // Volunteers can read
    if (user.role === 'voluntario') return true;
    // Others can read
    return true;
  },
  create: volunteerReadOnlyAccess,
  update: volunteerReadOnlyAccess,
  delete: volunteerReadOnlyAccess,
};
