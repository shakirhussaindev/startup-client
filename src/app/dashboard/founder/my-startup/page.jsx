import React from 'react';
import StartupProfile from './StartupProfile';
import { getUserSession } from '@/lib/core/session';
import { getFounderStartup } from '@/lib/api/startup';

const MyStartupPage = async () => {
  const user = await getUserSession()
  const startup = await getFounderStartup(user?.id)
  return (
    <div>
     <div><StartupProfile founder={user} founderStartup={startup}/></div>
    </div>
  );
};

export default MyStartupPage;