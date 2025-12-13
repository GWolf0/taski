import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AuthUser } from '@/types/models'

function UserAvatar({ authUser }: {
    authUser: AuthUser,
}) {
    const AVATAR_FALLBACK_URL = "https://github.com/shadcn.png";

    return (
        <Avatar>
            <AvatarImage src={authUser?.meta?.avatar_url ?? AVATAR_FALLBACK_URL} alt="user avatar" />
            <AvatarFallback className='text-xs font-semibold9'>
                {authUser?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )

}

export default UserAvatar