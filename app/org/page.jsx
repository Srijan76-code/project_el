
import React from 'react'
import AddRepo from './_components/AddRepo'
import { getGithubReposForUser } from '@/actions/orgProfile'


const page = async() => {
  const {repos}=await getGithubReposForUser()
  console.log("repos: ", repos)
  return (
    <div>
        <AddRepo repositories={repos}/> 

    </div>
  )
}

export default page

