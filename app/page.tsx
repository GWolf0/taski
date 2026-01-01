import MainLayout from "@/components/layout/MainLayout";
import PWDResetAuthRedirectHandler from "@/components/misc/PWDResetAuthRedirectHandler";
import { requestAuthUserProfile } from "@/services/requests/authRequests";
import { AuthUser } from "@/types/models";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

async function HomePage() {
  const authUser: AuthUser = await requestAuthUserProfile();

  return (
    <MainLayout authUser={authUser}>
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Task management, <span className="text-primary">done right</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Taski is a minimal, fast, and developer-friendly task manager built to
          stay out of your way while keeping you focused.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {authUser &&
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Dashboard
              <i className="bi bi-box-arrow-in-up-right ml-1"></i>
            </Link>
          }

          {!authUser &&
            <Link
              href="/tasks/temp"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Try without signing up
            </Link>
          }

          {!authUser && (
            <Link
              href="/login"
              className="px-6 py-3 rounded-md border font-medium hover:bg-muted transition"
            >
              Create account
            </Link>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
        <Feature
          title="Simple by design"
          description="No unnecessary complexity. Just tasks, priorities, and focus."
        />
        <Feature
          title="Fast & modern"
          description="Built with Next.js, Supabase, and modern React patterns."
        />
        <Feature
          title="Auth you can trust"
          description="Secure authentication with support for multiple providers."
        />
      </section>

      {/* DEVLOG / TECH FOCUS */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Development log
        </h2>

        <ul className="space-y-4 text-muted-foreground rounded-lg p-4 border">
          <span className="italic underline mb-2 block text-foreground">Version 1 — (Nov 2025 → Jan 2026)</span>

          <li>• Kanban-style task organization (To Do, Doing, Done)</li>
          <li>• Temporary access for unauthenticated users</li>
          <li>• Simple dashboard (project list, navigation, deletion)</li>
          <li>• Profile page (view info, edit metadata, delete account)</li>
          <li>• Authentication providers (email/password, GitHub, Google)</li>
          <li>• Password reset flow</li>
          <li>• Light / dark theme toggle</li>
          <li>• Additional utility pages</li>
        </ul>
      </section>

      {/* // Notice */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Notice
        </h2>

        <blockquote className="bg-muted rounded-lg p-4 flex flex-col gap-4 items-center justify-center">
          <InfoIcon />
          <p className="text-center text-muted-foreground">
            This project was built primarily for learning and experimentation.
            User data may be reset or removed at any time.
          </p>

          <Link
            href={process.env.NEXT_PUBLIC_GH_PROJECT_LINK!} target="_blank"
            className="text-blue-500"
          >
            View the GitHub repository
          </Link>
        </blockquote>
      </section>

      {/* // handle correct redirecting for password update (maybe not needed anymore since 127.0.0.1 is replaced with localhost for local dev env) */}
      <PWDResetAuthRedirectHandler />
    </MainLayout>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-background">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

export default HomePage;
