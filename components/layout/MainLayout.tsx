import React from 'react'
import MainHeader from './MainHeader'
import MainFooter from './MainFooter'
import { AuthUser } from '@/types/models'

function MainLayout({ children, header, footer, authUser, innerClasses }: {
    children: React.ReactNode, 
    header?: React.ReactNode | null, // if null do not render anything
    footer?: React.ReactNode | null, // if null do not render anything
    authUser: AuthUser, 
    innerClasses?: string,
}) {

    return (
        <div className={`w-full min-h-screen bg-background ${innerClasses}`}>
            {header ?? (header != null ? <MainHeader /> : null)}

            <div className='mx-auto min-h-screen' style={{ width: 'min(100%, 1080)' }}>
                {children}
            </div>

            {footer ?? (header != null ? <MainFooter /> : null)}
        </div>
    )

}

export default MainLayout