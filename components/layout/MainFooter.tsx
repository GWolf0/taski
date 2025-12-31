import React from "react";
import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import FooterThemeToggler from "../common/FooterThemeToggler";

function MainFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
                    {/* Links */}
                    <div className="flex gap-4">
                        <Link href="/annexe/about" className="hover:text-foreground">
                            About
                        </Link>
                        <Link href="/annexe/privacy" className="hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/annexe/terms" className="hover:text-foreground">
                            Terms
                        </Link>

                        <FooterThemeToggler />
                    </div>

                    {/* Copyright */}
                    <p className="text-center">
                        © {year}{" "}
                        <span className="font-medium text-foreground capitalize">{APP_NAME}</span>. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default MainFooter;
