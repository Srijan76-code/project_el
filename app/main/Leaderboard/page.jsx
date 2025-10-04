import React from 'react'
import LeaderboardComp from './_components/LeaderboardComp'
import { getLeaderboard } from '@/actions/userProfile'

const page = async() => {
  const {leaderboard}=await getLeaderboard()
  return (
    <div>
        
        <LeaderboardComp leaderboard={leaderboard}/>
    </div>
  )
}

export default page