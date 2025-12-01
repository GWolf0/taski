import { AuthUser, ProfileModel, ProjectModel } from "@/types/models";
import { LimitsDef, LIMITS } from "@/constants/limits";

// profile policies
export function canGetProfile(user: AuthUser, model: ProfileModel): boolean {
    return true;
}
export function canCreateProfile(user: AuthUser): boolean {
    return false;
}
export function canUpdateProfile(user: AuthUser, profileId: string): boolean {
    return user?.id === profileId;
}
export function canDeleteProfile(user: AuthUser, profileId: string): boolean {
    return user?.id === profileId;
}

// project policies
export function canGetProject(user: AuthUser, model: ProjectModel): boolean {
    return user?.id === model.user_id;
}
export function canCreateProject(user: AuthUser, projectsCount: number): boolean {
    const limits = LIMITS(user?.plan ?? "free");
    return projectsCount + 1 <= limits.maxProjectsCount;
}
export function canUpdateProject(user: AuthUser, model: ProjectModel): boolean {
    return user?.id === model.id;
}
export function canDeleteProject(user: AuthUser, model: ProjectModel): boolean {
    return user?.id === model.id;
}

export class PolicyService {
    private user: AuthUser;
    private userLimits: LimitsDef;

    constructor(user: AuthUser) {
        this.user = user;
        this.userLimits = LIMITS(user?.plan || "free");
    }

    isLoggedIn(): boolean {
        return !!this.user;
    }

    isProjectOwner(project: ProjectModel): boolean {
        return this.isLoggedIn() && this.user?.id === project.user_id;
    }

    canCreateProject(currentProjectCount: number): boolean {
        return this.isLoggedIn() && currentProjectCount < this.userLimits.maxProjectsCount;
    }

    // Add more policy checks as needed
}
