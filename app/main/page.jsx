"use client"
import React, { useEffect } from 'react'
import { SidebarMain } from './_components/SidebarMain'

import { useUser } from "@clerk/nextjs"
import { initializeUser } from '@/actions/userProfile'

const Page = () => {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      initializeUser()
    }
  }, [user])

  return (
    <div>
      <SidebarMain />
    </div>
  )
}

export default Page