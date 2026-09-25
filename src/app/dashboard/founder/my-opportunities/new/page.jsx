import React from 'react';
import AddOpportunityForm from './AddOpportunityForm';
import { getLoggedInFounderStartup } from '@/lib/api/startup';
import { getOpportunityById } from '@/lib/api/opportunities';

const AddOpportunityPage = async () => {
  const startup = await getLoggedInFounderStartup()
  
  // const opportunity = await getOpportunityById(user.id);
  // console.log('opportunity length', opportunity.length)
  return (
    <div>
      <AddOpportunityForm founderStartup ={startup}/>
    </div>
  );
};

export default AddOpportunityPage;