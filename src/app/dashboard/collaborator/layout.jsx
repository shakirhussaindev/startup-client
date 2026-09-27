import { requireRole } from '@/lib/core/session';
import React from 'react';

const CollaboratorLayout = async ({children}) => {
  await requireRole("collaborator");
  return children
};

export default CollaboratorLayout;