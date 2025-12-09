import { LOGO_NAME } from '@/constants/app'
import Link from 'next/link';
import React from 'react'

function Logo({size, linkToHome}: {
    size?: number, linkToHome?: boolean,
}) {
    const logoPath = "/" + (LOGO_NAME ?? "logo.png");
    size = size ?? 32;

    function renderLogo(): React.ReactNode {
        return (
            <div>
                <img src={logoPath} alt="logo" width={size} />
            </div>
        )
    }

    return linkToHome ? (
        <Link href={'/'}>
            { renderLogo() }
        </Link>
    ) : (
        renderLogo()
    )

}

export default Logo