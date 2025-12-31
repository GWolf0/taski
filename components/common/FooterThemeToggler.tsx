"use client"

import ThemeService, { ThemeType } from '@/services/systems/themeService';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

function FooterThemeToggler() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [theme, setTheme] = useState<ThemeType>("light");

    useEffect(() => {
        setTheme(ThemeService.getCurrentThemeType());
        setLoaded(true);
    }, []);

    function onToggleThemeBtn() {
        ThemeService.toggleTheme();
        setTheme(ThemeService.getCurrentThemeType());
    }

    if (!loaded) return null;

    return (
        <span
            className="hover:text-foreground text-sm cursor-pointer"
            onClick={onToggleThemeBtn}
        >
            Toggle Theme ({theme})
        </span>
    )

}

export default FooterThemeToggler;