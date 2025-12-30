import MainLayout from "@/components/layout/MainLayout";
import React from "react";

function TermsPage() {
    return (
        <MainLayout authUser={undefined}>
            <section className="max-w-3xl mx-auto px-4 pt-24 pb-20">
                <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>

                <p className="text-muted-foreground mb-8">
                    By using Taski, you agree to the following terms.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Use of the service
                </h2>
                <p className="text-muted-foreground">
                    Taski is provided on an “as is” basis for personal and professional
                    task management. You are responsible for the content you create and
                    manage within the application.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Availability
                </h2>
                <p className="text-muted-foreground">
                    The service may be updated, modified, or discontinued at any time
                    without notice. No guarantee is made regarding uptime or data
                    availability.
                </p>

                <h2 className="text-lg font-semibold mt-8 mb-2">
                    Limitation of liability
                </h2>
                <p className="text-muted-foreground">
                    Taski is not liable for any loss of data or damages resulting from the
                    use or inability to use the service.
                </p>

                <p className="text-sm text-muted-foreground mt-12">
                    These terms may be updated as the project evolves.
                </p>
            </section>
        </MainLayout>
    );
}

export default TermsPage;
