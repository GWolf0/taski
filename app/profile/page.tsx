import MainLayout from '@/components/layout/MainLayout';
import { requestAuthUserProfile } from '@/services/requests/authRequests';
import { MError } from '@/types/common';
import { AuthUser } from '@/types/models';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import React from 'react';
import AccountDeleteButton from '@/components/auth/AccountDeleteButton';
import ProfileUpdateButton from '@/components/auth/ProfileUpdateButton';

async function ProfilePage() {
    const authUser: AuthUser = await requestAuthUserProfile();
    if (!authUser) throw new Error(JSON.stringify({ message: "Unauthenticated", code: "401" } as MError));

    return (
        <MainLayout authUser={authUser}>

            <div className="space-y-8">

                {/* Page Title */}
                <div className='text-center'>
                    <h1 className="text-2xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and preferences.</p>
                </div>

                {/* Profile Info Card */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Name</span>
                            <span className="font-semibold">{authUser.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <span className="font-semibold">{authUser.email}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Auth Provider</span>
                            <Badge variant="secondary" className="capitalize">
                                {authUser.auth_provider}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Plan</span>
                            <Badge className="capitalize">
                                {authUser.plan}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Last Login</span>
                            <span className="text-sm">
                                {new Date(authUser.last_auth).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                            <span className="text-sm">
                                {new Date(authUser.created_at).toLocaleDateString()}
                            </span>
                        </div>

                    </CardContent>
                </Card>

                {/* Actions */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* Update Profile Button */}
                        <ProfileUpdateButton authUser={authUser} />

                        {/* Delete Account Button */}
                        <AccountDeleteButton authUser={authUser} />

                    </CardContent>
                </Card>

            </div>

        </MainLayout>
    );
}

export default ProfilePage;
