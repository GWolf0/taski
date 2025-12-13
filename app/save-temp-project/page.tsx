import SaveTempProjectClientPage from '@/components/clientPages/SaveTempProjectClientPage'
import { MError } from '@/types/common';
import { AuthUser } from '@/types/models';
import React from 'react'

async function SaveTempProjectPage() {
    // retreive auth user
    // const authUser: AuthUser = await requestAuthUserProfile();
    const authUser: AuthUser = undefined;
    // throw error if not auth
    if (!authUser) throw new Error(JSON.stringify({ code: "401", message: "Unauthorized operation (unauthenticated" } as MError));

    return (
        <SaveTempProjectClientPage authUser={authUser} />
    )

}

export default SaveTempProjectPage