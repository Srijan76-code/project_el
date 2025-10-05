import React from 'react'

import RepoIssue from './_components/RepoIsuue'
import { getBountiedIssuesForRepo } from '@/actions/userProfile'

const page = async({params}) => {
  const repoId = params.id
  const {issues}=await getBountiedIssuesForRepo(repoId)
  return (
    <div>

      
      

      <RepoIssue issues={issues}  />
    </div>
  )
}

export default page
