import React from 'react'
import Logo from './Logo'

function MainHeader() {


    return (
        <header className='flex items-center px-2 md:px-4' style={{height: "60px"}}>
            <Logo size={64} />
        </header>
    )

}

export default MainHeader