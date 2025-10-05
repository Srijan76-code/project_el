

import React from 'react'
import MainProfile from './_components/MainProfile'
import { getUserProfileData } from '@/actions/userProfile'

const page =async () => {
  const {user,stats} = await getUserProfileData()
  console.log("inside profile page,getUserProfileData: ", user,stats)
  let totalEarned=0
  let contributedRepos=[]
  let contributionCount=0
  if (stats){
    totalEarned=stats.totalEarned
    contributedRepos=stats.contributedRepos
    contributionCount=stats.contributionCount


  }
  return (
    <div>
        <MainProfile user={user} totalEarned={totalEarned } contributedRepos={contributedRepos} contributionCount={contributionCount} />
    </div>
  )
}

export default page

