import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video w-full rounded-md border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Traffic</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video w-full rounded-md border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Conversions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video w-full rounded-md border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative min-h-[40vh] w-full rounded-md border md:min-h-[30vh]">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
