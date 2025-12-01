import { ProjectModel, ProfileModel } from "@/types/models";
import { ProjectData } from "@/types/tasks";

// Function to convert raw user data from DB to ProfileModel
export function convertToProfileModel(data: any): ProfileModel | null {
    try {
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            auth_provider: data.auth_provider,
            plan: data.plan,
            meta: data.meta,
            last_auth: new Date(data.last_auth),
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

// convert profile to form data
export function convertProfileToFormData(profile: ProfileModel): FormData {
    let fd = new FormData();

    Object.entries(profile).forEach(([key, val]) => {
        const value = val;
        fd.append(key, value);
    });

    return fd;
}


// Function to convert raw project data from DB to ProjectModel
export function convertToProjectModel(data: any): ProjectModel | null {
    try {
        return {
            id: data.id,
            title: data.title,
            description: data.description || undefined,
            data: data.data as ProjectData, // Assuming data.data is already in ProjectData format
            user_id: data.user_id,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

// convert project to form data
export function convertProjectToFormData(project: ProjectModel): FormData {
    let fd = new FormData();

    Object.entries(project).forEach(([key, val]) => {
        // data is an object, but a TEXT in the database this converting into string
        const value = ["data"].includes(key) ? JSON.stringify(val) : val;
        fd.append(key, value);
    });

    return fd;
}
