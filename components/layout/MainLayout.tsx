import React from 'react'
import MainHeader from './MainHeader'
import MainFooter from './MainFooter'
import { AuthUser } from '@/types/models'
import NotificationComp from '../common/NotificationComp'

function MainLayout({ children, header, footer, authUser, innerClasses }: {
    children: React.ReactNode,
    header?: React.ReactNode | null, // if null do not render anything
    footer?: React.ReactNode | null, // if null do not render anything
    authUser: AuthUser,
    innerClasses?: string,
}) {

    return (
        <div className={`w-full min-h-screen bg-background`}>
            {header ?? (header === null ? null : <MainHeader />)}

            <div className={`mx-auto min-h-screen ${innerClasses}`} style={{ width: 'min(100%, 1080px)' }}>
                {/* // notification that gets its text automatically from "?event=value" query param if exists */}
                <NotificationComp textAutoFromQueryParams />

                {children}
            </div>

            {footer ?? (header === null ? null : <MainFooter />)}
        </div>
    )

}

export default MainLayout