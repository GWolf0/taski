"use server";

import { DOE } from "@/types/common";
import { AuthUser, ProjectModel } from "@/types/models";
import { projectSchema, partialProjectSchema } from "@/helpers/validators";
import { supabase } from "@/helpers/supabase";
import { convertToProjectModel } from "@/helpers/converters";
import {
  canCreateProject,
  canDeleteProject,
  canGetProject,
  canUpdateProject,
} from "@/helpers/policies";
import { filterQuery, PaginatedData } from "@/helpers/query";

/* --------------------------------------------------------
   CREATE PROJECT
---------------------------------------------------------*/
export async function requestCreateProject(formData: FormData, authUser: AuthUser): Promise<DOE<ProjectModel>> {
  try {
    if (!authUser) return { data: null, error: { message: "Unauthorized" } };

    const projectsCount = await requestGetUserProjectsCount(authUser.id, authUser);
    if (!canCreateProject(authUser, projectsCount)) {
      return { data: null, error: { message: "Unauthorized" } };
    }

    const newProjectData = Object.fromEntries(formData.entries());
    const parsed = projectSchema.safeParse(newProjectData);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return { data: null, error: { message: "Validation failed", errors } };
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({ ...parsed.data, user_id: authUser.id })
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
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) return { data: null, error: { message: error.message } };
    if (!data) return { data: null, error: { message: "Project not found" } };

    const project = convertToProjectModel(data);

    if (project && !canGetProject(authUser, project)) {
      return { data: null, error: { message: "You don't have access to this project" } };
    }

    return { data: project, error: null };
  } catch (error: any) {
    console.error("[getProject] Unexpected error:", error);
    return { data: null, error: { message: error.message || "Failed to get project" } };
  }
}

/* --------------------------------------------------------
   GET ALL PROJECTS FOR USER
---------------------------------------------------------*/
export async function requestGetUserProjects(userId: string, authUser: AuthUser): Promise<DOE<ProjectModel[]>> {
  try {
    if (userId !== authUser?.id) {
      return { data: null, error: { message: "Unauthorized operation" } };
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId);

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
    if (userId !== authUser?.id) return 0;

    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("[getProjectsCount] Error fetching count:", error);
      return 0;
    }

    return count ?? 0;
  } catch (error: any) {
    console.error("[getProjectsCount] Unexpected error:", error);
    return 0;
  }
}

/* --------------------------------------------------------
   UPDATE PROJECT
---------------------------------------------------------*/
export async function requestUpdateProject(projectId: string, formData: FormData, authUser: AuthUser): Promise<DOE<ProjectModel>> {
  try {
    const projectResp = await requestGetProject(projectId, authUser);
    if (!projectResp.data) return { data: null, error: { message: "Project not found" } };

    const project = projectResp.data;

    if (!canUpdateProject(authUser, project)) {
      return { data: null, error: { message: "You don't have access to this project" } };
    }

    const updates = Object.fromEntries(formData.entries());
    const parsed = partialProjectSchema.safeParse(updates);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return { data: null, error: { message: "Validation failed", errors } };
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", projectId)
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
    const projectResp = await requestGetProject(projectId, authUser);
    if (!projectResp.data) return { data: false, error: { message: "Project not found" } };

    const project = projectResp.data;

    if (!canDeleteProject(authUser, project)) {
      return { data: false, error: { message: "You don't have access to this project" } };
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

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
    const filteredData = await filterQuery(supabase.from("projects"), queryParams, defaultSelect);
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
