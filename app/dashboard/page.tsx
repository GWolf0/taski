import NewProjectButton from '@/components/dashboard/NewProjectButton';
import MainLayout from '@/components/layout/MainLayout';
import { LIMITS, LimitsDef } from '@/constants/limits';
import { requestAuthUserProfile } from '@/services/requests/authRequests';
import { requestGetUserProjects } from '@/services/requests/taskRequests';
import { DOE, MError } from '@/types/common';
import { AuthUser, ProjectModel } from '@/types/models';
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteProjectButton from '@/components/dashboard/DeleteProjectButton';
import Link from 'next/link';

async function DashboardPage() {
    const authUser: AuthUser = await requestAuthUserProfile();
    if (!authUser)
        throw new Error(JSON.stringify({ message: "Unauthenticated", code: "401" } as MError));

    const projectsDoe: DOE<ProjectModel[]> = await requestGetUserProjects(authUser.id, authUser);
    if (!projectsDoe.data)
        throw new Error(JSON.stringify({ message: "Error retrieving projects", code: "400" } as MError));

    const projects: ProjectModel[] = projectsDoe.data;

    const limits: LimitsDef = LIMITS(authUser.plan);
    const canCreateNewProject = projects.length < limits.maxProjectsCount;

    return (
        <MainLayout authUser={authUser}>
            {/* Top Bar */}
            <section className="flex items-center gap-4 mb-6">
                <h1 className="text-xl font-semibold">
                    Projects <span className="text-muted-foreground">({projects.length})</span>
                </h1>

                <div className="ml-auto">
                    <NewProjectButton authUser={authUser} disabled={!canCreateNewProject} />
                </div>
            </section>

            {/* Projects Table */}
            <Card className="border rounded-xl shadow-sm">
                <CardContent className="p-0">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <i className='bi bi-folder w-32 mb-4'></i>
                            <p className="text-lg font-medium">No projects yet</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create a new project to get started
                            </p>
                            <NewProjectButton authUser={authUser} disabled={!canCreateNewProject} />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Title</TableHead>
                                    <TableHead>Last Modified</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        {/* Title */}
                                        <TableCell className="font-medium">
                                            <Link href={`/tasks/${project.id}`} target='_blank' className='block hover:underline'>
                                                {project.title}
                                            </Link>
                                        </TableCell>

                                        {/* Updated At */}
                                        <TableCell>
                                            {new Date(project.updated_at).toLocaleString()}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge variant="secondary">
                                                Active
                                            </Badge>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <DeleteProjectButton project={project} authUser={authUser} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </MainLayout>
    );
}

export default DashboardPage;
