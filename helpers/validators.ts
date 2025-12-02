import { z } from "zod";
import { AccountPlan } from "@/constants/limits";
import { ProjectData } from "@/types/tasks";
import { ProfileModel } from "@/types/models";
import { Provider } from "@supabase/supabase-js";

// Zod schema for AuthProvider
const authProviderSchema = z.union([z.literal("google"), z.literal("github"), z.literal("email")]);

// Zod schema for AccountPlan
const accountPlanSchema = z.union([z.literal("free"), z.literal("pro")]);

// Zod schema for ProfileModel
export const profileSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  auth_provider: authProviderSchema,
  plan: accountPlanSchema.default("free"),
  meta: z.record(z.string(), z.any()).optional(),
  last_auth: z.coerce.date().default(() => new Date()),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
});

// Partial Zod schema for ProfileModel (for updates)
export const partialProfileSchema = profileSchema.partial();

export const taskItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  created_at: z.coerce.date(),
});

export const projectDataSchema: z.ZodType<ProjectData> = z.object({
  v: z.number(),
  columns: z.object({
    todo: z.array(taskItemSchema),
    doing: z.array(taskItemSchema),
    done: z.array(taskItemSchema),
  }),
});

// Zod schema for ProjectModel
export const projectSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, "Title is required").max(128),
  description: z.string().optional(),
  data: projectDataSchema,
  user_id: z.uuid(),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
});

// Partial Zod schema for ProjectModel (for updates)
export const partialProjectSchema = projectSchema.partial();
