import MainLayout from "@/components/layout/MainLayout";
import { requestAuthUserProfile } from "@/services/requests/authRequests";
import { AuthUser } from "@/types/models";
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
          <Link
            href="/tasks/temp"
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Try without signing up
          </Link>

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
          Built with care
        </h2>

        <ul className="space-y-4 text-muted-foreground">
          <li>• Server Actions & App Router architecture</li>
          <li>• JSONB modeling for flexible data structures</li>
          <li>• Supabase Auth with provider synchronization</li>
          <li>• Clean separation of domain logic & UI</li>
        </ul>
      </section>
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
