import { getOpportunities, getOpportunityById } from '@/lib/api/opportunities';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import React from 'react';
import ApplyForm from './ApplyForm';

const OpportunityApplyPage = async ({params}) => {
  const {id} = await params

  const user = await getUserSession()

  if(!user){
    redirect(`/login?redirect=/opportunities/${id}/apply`)
  }



if(user.role !== 'collaborator') {
return (
  <div className=" text-white p-6" >
    <p className="text-zinc-400 text-lg">
      Only collaborator can apply for positions. Please sign in with a
      collaborator account to proceed{" "}
    </p>
  </div>
);}

const opportunity = await getOpportunityById(id)
console.log(opportunity)
  
  return (
    <div>
       
       <ApplyForm applicant={user} opportunity={opportunity}/>
    </div>
  );
};

export default OpportunityApplyPage;