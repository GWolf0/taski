import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { requestAuthUser, requestAuthUserProfile, requestSignInWithPassword, requestSignOut, requestSignUpWithPassword, syncProfile } from "@/services/requests/authRequests";
import { DOE } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { User } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { requestDeleteProfile, requestGetProfile, requestUpdateProfile } from "@/services/requests/profileRequests";
import { cleanDB, loginAs } from "../helpers/testHelpers";
import { requestCreateProject, requestDeleteProject, requestGetUserProjects, requestGetUserProjectsCount, requestUpdateProject } from "@/services/requests/taskRequests";
import { canCreateProject } from "@/helpers/policies";
import { TaskService } from "@/services/systems/taskService";

describe("auth requests", () => {
    let start: Date;

    beforeAll(async () => {
        start = new Date();
    });

    afterAll(async () => {
        await cleanDB();
    });

    it("can get the auth user's projects", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();

        if (authUserProfile) {
            const { data: projects, error: projectsError } = await requestGetUserProjects(authUserProfile.id, authUserProfile);
            expect(projects).toBeTruthy();
            expect(projectsError).toBeNull();
        }
    });

    it("cannot get other user's projects", async () => {
        const { data: bobProfile, error: bobProfileError } = await loginAs("bob@example.com", "Password123!");
        expect(bobProfile).toBeTruthy();

        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();

        if (authUserProfile && bobProfile) {
            const { data: projects, error: projectsError } = await requestGetUserProjects(bobProfile.id, authUserProfile);
            expect(projects).not.toBeTruthy();
            expect(projectsError).not.toBeNull();
        }
    });

    it("allow auth user to create a new project", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();

        if (authUserProfile) {
            const { data: project, error: projectError } = 
                await requestCreateProject(TaskService.makeNewProjectInstance(authUserProfile.id, "Alice new project"), authUserProfile);
            expect(projectError).toBeNull();
            expect(project).toBeTruthy();
            expect(project?.title).toEqual("Alice new project");
            expect(projectError).toBeNull();
        }
    });

    it("doesn't allow auth user to create more than the limited amount of projects", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();

        if (authUserProfile) {
            let _canCreateProject = canCreateProject(authUserProfile, 1);
            expect(_canCreateProject).toBeTruthy();

            _canCreateProject = canCreateProject(authUserProfile, 4);
            expect(_canCreateProject).not.toBeTruthy();
        }
    });

    it("allow auth user to update his projects", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();


        if (authUserProfile) {
            const {data: projectToUpdate, error: projectToUpdateError} = 
                await supabaseAdmin.from("projects").select("id").eq("user_id", authUserProfile.id).limit(1).single();
            expect(projectToUpdateError).toBeNull();
            expect(projectToUpdate).toBeTruthy();

            if(!projectToUpdateError && projectToUpdate) {
                const { data: updatedProject, error: updatedProjectError } = 
                    await requestUpdateProject(projectToUpdate.id, {title: "Alice new project (updated)"}, authUserProfile);
                expect(updatedProjectError).toBeNull();
                expect(updatedProject).toBeTruthy();
                expect(updatedProject?.title).toEqual("Alice new project (updated)");
            }
        }
    });

    it("doesn't allow auth user to update other's projects", async () => {
        const { data: aliceProfile, error: aliceProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(aliceProfile).toBeTruthy();

        const { data: bobProfile, error: bobProfileError } = await loginAs("bob@example.com", "Password123!");
        expect(bobProfile).toBeTruthy();

        if (aliceProfile && bobProfile) {
            const {data: projectToUpdate, error: projectToUpdateError} = 
                await supabaseAdmin.from("projects").select("id").eq("user_id", aliceProfile.id).limit(1).single();
            expect(projectToUpdate).toBeTruthy();
            expect(projectToUpdateError).not.toBeTruthy();

            if(!projectToUpdateError && projectToUpdate) {
                const { data: updatedProject, error: updatedProjectError } = 
                    await requestUpdateProject(projectToUpdate.id, {title: "Bob new project (updated)"}, bobProfile);
                expect(updatedProjectError).not.toBeNull();
                expect(updatedProject).not.toBeTruthy();
            }
        }
    });

    it("doesn't allow auth user to delete other's projects", async () => {
        const { data: aliceProfile, error: aliceProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(aliceProfile).toBeTruthy();

        const { data: bobProfile, error: bobProfileError } = await loginAs("bob@example.com", "Password123!");
        expect(bobProfile).toBeTruthy();


        if (aliceProfile && bobProfile) {
            const {data: projectToDelete, error: projectToDeleteError} = 
                await supabaseAdmin.from("projects").select("id").eq("user_id", aliceProfile.id).limit(1).single();
            expect(projectToDelete).toBeTruthy();
            expect(projectToDeleteError).not.toBeTruthy();

            if(!projectToDeleteError && projectToDelete) {
                const { data: success, error: deletedProjectError } = await requestDeleteProject(projectToDelete.id, bobProfile);
                expect(success).not.toBeTruthy();
                expect(deletedProjectError).not.toBeNull();
            }
        }
    });

    it("allow auth user to delete his projects", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("alice@example.com", "Password123!");
        expect(authUserProfile).toBeTruthy();


        if (authUserProfile) {
            const {data: projectToDelete, error: projectToDeleteError} = 
                await supabaseAdmin.from("projects").select("id").eq("user_id", authUserProfile.id).limit(1).single();
            expect(projectToDeleteError).not.toBeTruthy();
            expect(projectToDelete).toBeTruthy();

            if(!projectToDeleteError && projectToDelete) {
                const { data: success, error: deletedProjectError } = await requestDeleteProject(projectToDelete.id, authUserProfile);
                expect(deletedProjectError).toBeNull();
                expect(success).toBeTruthy();
            }
        }
    });

});
