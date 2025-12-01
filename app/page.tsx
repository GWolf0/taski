import MainLayout from '@/components/layout/MainLayout'
import { AuthUser } from '@/types/models'
import React from 'react'

async function HomePage() {
  // retreive auth user
  const authUser: AuthUser = undefined; 

  return (
    <MainLayout authUser={authUser}>

      <h1>Placeholder</h1>

    </MainLayout>
  )

}

export default HomePage