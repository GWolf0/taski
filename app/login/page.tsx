// app/login/page.tsx

import MainLayout from "@/components/layout/MainLayout";
import LoginComp from "@/components/auth/LoginComp";

export default async function LoginPage() {
    

    return (
        <MainLayout authUser={null} innerClasses="flex items-center justify-center">
            
            <LoginComp />

        </MainLayout>
    );
}
