"use client"

import { AuthUser } from '@/types/models'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LOGIN_REDIRECT } from '@/constants/routes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { requestSignOut } from '@/services/requests/authRequests'
import { useRouter } from 'next/navigation'
import UserAvatar from './UserAvatar'

// if there is an auth user then render the dropdown, else render the login button
function HeaderActions({ authUser }: {
    authUser: AuthUser,
}) {
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const router = useRouter();

    async function onLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        await requestSignOut();
        setIsLoggingOut(false);

        router.replace("/");
    }

    function renderDropdown(): React.ReactNode {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none">
                        <UserAvatar authUser={authUser} />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem disabled className="opacity-80">
                            Welcome {authUser?.name}
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault(); // prevent menu from closing before click
                            onLogout();
                        }}
                        disabled={isLoggingOut}
                    >
                        <i className="bi bi-door-open mr-2"></i>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    function renderLoginButton(): React.ReactNode {
        return (
            <Link href={`${LOGIN_REDIRECT}`}>
                <Button>Login</Button>
            </Link>
        )
    }

    if (authUser) {
        return renderDropdown();
    } else {
        return renderLoginButton();
    }

}

export default HeaderActions