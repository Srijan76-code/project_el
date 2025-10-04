import React from 'react'

import RepoIssue from './_components/RepoIsuue'

const page = ({params}) => {
  return (
    <div>
      

      <RepoIssue id={params.id}/>
    </div>
  )
}

export default page
