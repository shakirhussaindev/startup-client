import React from 'react';
import AddOpportunityForm from './AddOpportunityForm';
import { getLoggedInFounderStartup } from '@/lib/api/startup';

const AddOpportunityPage = async () => {
  const startup = await getLoggedInFounderStartup()
  return (
    <div>
      <AddOpportunityForm founderStartup ={startup}/>
    </div>
  );
};

export default AddOpportunityPage;