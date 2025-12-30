import MainLayout from "@/components/layout/MainLayout";
import React from "react";

function AboutPage() {
    return (
        <MainLayout authUser={undefined}>
            <section className="max-w-4xl mx-auto px-4 pt-24 pb-20">
                <h1 className="text-3xl font-semibold mb-6">About Taski</h1>

                <p className="text-muted-foreground leading-relaxed mb-8">
                    Taski is a lightweight task management application built with a focus
                    on clarity, performance, and maintainability. The goal is not to offer
                    every possible feature, but to provide a solid and thoughtful
                    foundation for managing tasks without unnecessary complexity.
                </p>

                <h2 className="text-xl font-semibold mt-12 mb-4">
                    Why Taski was built
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-6">
                    Taski was created as a practical project to explore modern full-stack
                    development patterns. It emphasizes clean architecture, explicit data
                    modeling, and real-world concerns such as authentication, access
                    control, and scalability.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    Rather than optimizing for feature count, Taski prioritizes clear
                    trade-offs, readable code, and predictable behavior — the same
                    principles expected in production software.
                </p>

                <h2 className="text-xl font-semibold mt-12 mb-4">
                    Technical overview
                </h2>

                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                    <li>Next.js App Router with Server Actions</li>
                    <li>Supabase for authentication and data storage</li>
                    <li>PostgreSQL with JSONB for flexible data modeling</li>
                    <li>Role-aware access patterns and secure APIs</li>
                    <li>Deployed on Vercel</li>
                </ul>

                <h2 className="text-xl font-semibold mt-12 mb-4">
                    About the author
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    Taski is developed by a solo full-stack developer as part of a broader
                    effort to build maintainable, production-ready applications and
                    continuously improve engineering fundamentals.
                </p>
            </section>
        </MainLayout>
    );
}

export default AboutPage;
