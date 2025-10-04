"use client"
import React from 'react'
import { SidebarMain } from './_components/SidebarMain'
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from "@clerk/nextjs/server"
const page = async() => {
  const { userId } =await auth()
  if (userId) {
    // Check if the user already exists in your database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If they don't exist, this is their first visit
    if (!dbUser) {
      const clerkUser = await currentUser(); // Get full user details from Clerk

      // Prepare the data and call your server action to create them
      if (clerkUser) {
        await upsertUser({
          id: clerkUser.id,
          githubUsername: clerkUser.username,
          githubAvatarUrl: clerkUser.imageUrl,
        });
      }
    }
  }
  return (
    <div>
      <SidebarMain />
    </div>
  )
}

export default page
