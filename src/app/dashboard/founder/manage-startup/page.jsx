import React from 'react';
import ManageStartupProfile from './ManageStartupProfile';
import { getUserSession } from '@/lib/core/session';
import { getFounderStartup } from '@/lib/api/startup';

const ManageStartupPage = async () => {
   const user = await getUserSession()
    const startup = await getFounderStartup(user?.id)
  return (
    <div>
      <ManageStartupProfile founder={user} founderStartup={startup} />
    </div>
  );
};

export default ManageStartupPage;