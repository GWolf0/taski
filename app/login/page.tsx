// app/login/page.tsx

import MainLayout from "@/components/layout/MainLayout";
import {
    requestSignInWithPassword,
    requestSignUpWithPassword,
    requestSignInWithOAuth,
} from "@/services/requests/authRequests";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Provider } from "@supabase/supabase-js";
import LoginComp from "@/components/auth/LoginComp";

export default async function LoginPage() {
    

    return (
        <MainLayout authUser={null}>
            
        <LoginComp />

        </MainLayout>
    );
}
