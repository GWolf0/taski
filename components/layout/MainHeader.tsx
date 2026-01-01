import React from 'react'
import Logo from './Logo'
import { AuthUser } from '@/types/models'
import HeaderActions from './HeaderActions'

function MainHeader({ authUser }: {
    authUser: AuthUser,
}) {


    return (
        <header className='flex items-center px-2 md:px-4' style={{height: "60px"}}>
            <Logo size={24} linkToHome />

            <div className='ml-auto flex items-center'>
                <HeaderActions authUser={authUser} />
            </div>
        </header>
    )

}

export default MainHeader