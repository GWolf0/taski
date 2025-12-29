import { z } from "zod";
import { AccountPlan } from "@/constants/limits";
import { ProjectData, TaskItem } from "@/types/tasks";
import { ProfileModel } from "@/types/models";
import { Provider } from "@supabase/supabase-js";

const TRUSTED_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
];

// Zod schema for AuthProvider
const authProviderSchema = z.union([z.literal("google"), z.literal("github"), z.literal("email")]);

// Zod schema for AccountPlan
const accountPlanSchema = z.union([z.literal("free"), z.literal("pro")]);

// Zod schema for ProfileModel
export const profileSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.email().refine((email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return TRUSTED_EMAIL_DOMAINS.includes(domain);
  }, {
    message: "Please use a supported email provider",
  }),
  auth_provider: authProviderSchema.default("email"),
  plan: accountPlanSchema.default("free"),
  meta: z.record(z.string(), z.any()).optional(),
  last_auth: z.coerce.date().default(() => new Date()),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
});

// Partial Zod schema for ProfileModel (for updates)
export const partialProfileSchema = profileSchema.partial();

export const taskItemSchema: z.ZodType<TaskItem> = z.object({
  id: z.string(),
  text: z.string(),
  created_at: z.number(),
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

// auth credentials
export const credentialsSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8),
  name: z.string().trim().optional()
});


// helper fns
export function zodGetFirstErrorMessage(err: z.ZodError | undefined): string {
  if (err === undefined || err.issues.length < 1) return `Unkown input validation error`;
  return err.issues[0].path + " : " + err.issues[0].message;
}