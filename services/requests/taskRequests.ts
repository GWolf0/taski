"use server";

import { DOE, JSONType } from "@/types/common";
import { AuthUser, ProjectModel } from "@/types/models";
import { projectSchema, partialProjectSchema } from "@/helpers/validators";
import { convertToProjectModel } from "@/helpers/converters";
import {
  canCreateProject,
  canDeleteProject,
  canGetProject,
  canUpdateProject,
} from "@/helpers/policies";
import { filterQuery, PaginatedData } from "@/helpers/query";
import { supabaseClient } from "@/helpers/supabaseClient";

/* --------------------------------------------------------
   CREATE PROJECT
---------------------------------------------------------*/
export async function requestCreateProject(jsonData: JSONType, authUser: AuthUser): Promise<DOE<ProjectModel>> {
  try {
    if (!authUser) return { data: null, error: { message: "Unauthorized", code: "403" } };

    const projectsCount = await requestGetUserProjectsCount(authUser.id, authUser);
    if (!canCreateProject(authUser, projectsCount)) {
      return { data: null, error: { message: "Unauthorized, maximum allowed project reached", code: "403" } };
    }

    const newProjectData = jsonData;
    const parsed = projectSchema.omit({ user_id: true, id: true, created_at: true, updated_at: true }).safeParse(newProjectData);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return { data: null, error: { message: "Validation failed", errors } };
    }
    
    const { data, error } = await supabaseClient
      .from("projects")
      .insert({ ...parsed.data, user_id: authUser.id, updated_at: new Date().toISOString(), created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      console.error("[createProject] Error creating project:", error);
      return { data: null, error: { message: error.message } };
    }

    return { data: convertToProjectModel(data), error: null };
  } catch (error: any) {
    console.error("[createProject] Unexpected error:", error);
    return { data: null, error: { message: error.message || "Failed to create project" } };
  }
}

/* --------------------------------------------------------
   GET PROJECT BY ID
---------------------------------------------------------*/
export async function requestGetProject(projectId: string, authUser: AuthUser): Promise<DOE<ProjectModel>> {
  try {
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) return { data: null, error: { message: "Project not found." } };

    const project = convertToProjectModel(data);

    if (project && !canGetProject(authUser, project)) {
      return { data: null, error: { message: "You don't have access to this project", code: "403" } };
    }

    return { data: project, error: null };
  } catch (error: any) {
    console.error("[getProject] Unexpected error:", error);
    return { data: null, error: { message: "Failed to get project" } };
  }
}

/* --------------------------------------------------------
   GET ALL PROJECTS FOR USER
---------------------------------------------------------*/
export async function requestGetUserProjects(userId: string, authUser: AuthUser): Promise<DOE<ProjectModel[]>> {
  try {
    if (userId !== authUser?.id) {
      return { data: null, error: { message: "Unauthorized operation", code: "403" } };
    }

    const { data, error } = await supabaseClient.from("projects").select("*").eq("user_id", userId);

    if (error) return { data: null, error: { message: error.message } };

    const projects = data
      .map(convertToProjectModel)
      .filter((p): p is ProjectModel => !!p);

    return { data: projects, error: null };
  } catch (error: any) {
    console.error("[getUserProjects] Unexpected error:", error);
    return { data: null, error: { message: error.message || "Failed to get user projects" } };
  }
}

/* --------------------------------------------------------
   GET USER PROJECT COUNT
---------------------------------------------------------*/
export async function requestGetUserProjectsCount(userId: string, authUser: AuthUser): Promise<number> {
  try {
    if (userId !== authUser?.id) return -1;

    const { count, error } = await supabaseClient
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("[getProjectsCount] Error fetching count:", error);
      return -1;
    }

    return count ?? -1;
  } catch (error: any) {
    console.error("[getProjectsCount] Unexpected error:", error);
    return -1;
  }
}

/* --------------------------------------------------------
   UPDATE PROJECT
---------------------------------------------------------*/
export async function requestUpdateProject(projectId: string, jsonData: JSONType, authUser: AuthUser): Promise<DOE<ProjectModel>> {
  try {
    const projectResp = await requestGetProject(projectId, authUser);
    if (!projectResp.data) return { data: null, error: { message: "Project not found" } };

    const project = projectResp.data;

    if (!canUpdateProject(authUser, project)) {
      return { data: null, error: { message: "You don't have access to this project", code: "403" } };
    }

    const updates = jsonData;
    const parsed = partialProjectSchema.omit({updated_at: true, created_at: true, id: true}).safeParse(updates);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return { data: null, error: { message: "Validation failed", errors } };
    }

    const { data, error } = await supabaseClient
      .from("projects")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", projectId).eq("user_id", authUser?.id)
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };

    return { data: convertToProjectModel(data), error: null };
  } catch (error: any) {
    console.error("[updateProject] Unexpected error:", error);
    return { data: null, error: { message: error.message || "Failed to update project" } };
  }
}

/* --------------------------------------------------------
   DELETE PROJECT
---------------------------------------------------------*/
export async function requestDeleteProject(projectId: string, authUser: AuthUser): Promise<DOE<boolean>> {
  try {
    console.log(`Try deleting project ${projectId}`);
    const projectResp = await requestGetProject(projectId, authUser);
    if (!projectResp.data) return { data: false, error: { message: `Project not found | ${projectResp.error?.message}`, code: "404" } };

    const project = projectResp.data;

    if (!canDeleteProject(authUser, project)) {
      return { data: false, error: { message: "You don't have access to this project" } };
    }

    const { error } = await supabaseClient
      .from("projects")
      .delete()
      .eq("id", projectId).eq("user_id", authUser?.id);

    if (error) return { data: false, error: { message: error.message } };

    return { data: true, error: null };
  } catch (error: any) {
    console.error("[deleteProject] Unexpected error:", error);
    return { data: false, error: { message: error.message || "Failed to delete project" } };
  }
}

// request filtered
export async function requestFilteredProfiles(queryParams: URLSearchParams, authUser: AuthUser, defaultSelect: string = "*"):
  Promise<DOE<PaginatedData<ProjectModel>>> {
  try {
    const filteredData = await filterQuery(supabaseClient.from("projects"), queryParams, defaultSelect);
    const profiles: ProjectModel[] = filteredData.data.map(entry => convertToProjectModel(entry)).
      filter(entry => !!entry).filter(entry => canGetProject(authUser, entry));
    return {
      data: { ...filteredData, data: profiles },
      error: null
    };
  } catch (error: any) {
    console.error("[requestFilteredProjects] Unexpected error:", error);
    return { data: null, error: { message: error.message } };
  }
}
