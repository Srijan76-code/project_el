

import React from 'react'
import MainProfile from './_components/MainProfile'
import { getUserProfileData } from '@/actions/userProfile'

const page =async () => {
  const {user,stats} = await getUserProfileData()
  console.log("inside profile page,getUserProfileData: ", user,stats)
  if (stats){
    const {totalEarned,contributedRepos,contributionCount}=stats

  }else{
    const totalEarned=0
    const contributedRepos=[]
    const contributionCount=0
  }
  return (
    <div>
        <MainProfile user={user} totalEarned={totalEarned } contributedRepos={contributedRepos} contributionCount={contributionCount} />
    </div>
  )
}

export default page

