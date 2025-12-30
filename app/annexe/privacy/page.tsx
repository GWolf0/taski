import MainLayout from "@/components/layout/MainLayout";
import React from "react";

function PrivacyPage() {
    return (
        <MainLayout authUser={undefined}>
            <section className="max-w-3xl mx-auto px-4 pt-24 pb-20">
                <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>

                <p className="text-muted-foreground mb-8">
                    Your privacy matters. This page explains what data Taski collects and
                    how it is used.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Information we collect
                </h2>
                <p className="text-muted-foreground">
                    When you create an account, Taski stores basic account information such
                    as your email address, authentication provider, and task-related data
                    you choose to create.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    How your data is used
                </h2>
                <p className="text-muted-foreground">
                    Your data is used solely to provide and improve the Taski service.
                    Taski does not sell or share your personal data with third parties.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Data storage
                </h2>
                <p className="text-muted-foreground">
                    Data is securely stored using trusted third-party infrastructure,
                    including Supabase and PostgreSQL.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Your rights
                </h2>
                <p className="text-muted-foreground">
                    You may request access to or deletion of your data at any time by
                    deleting your account or contacting the project maintainer.
                </p>

                <p className="text-sm text-muted-foreground mt-12">
                    This policy may be updated as the project evolves.
                </p>
            </section>
        </MainLayout>
    );
}

export default PrivacyPage;
