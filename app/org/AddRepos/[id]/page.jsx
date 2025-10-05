import React from 'react'

import RepoIssue from './_components/RepoIsuue'
import { getBountiedIssuesForRepo } from '@/actions/userProfile'

const page = async() => {
  // const repoId = params.id
  // const {issues}=await getBountiedIssuesForRepo(repoId)
  return (
    <div>

      
      

      <RepoIssue   />
    </div>
  )
}

export default page
