import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';

export default function Contacts() {
    return (
        <>
            <Head title="Байланыс" />
            <AppHeaderLayout>
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Байланыс</h1>
                    <Card>
                        <CardContent className="p-4 text-sm">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-md border bg-card p-1.5"><span className="sr-only">Мекенжай</span>📍</div>
                                    <div>Астана қаласы, Сауран көшесі, 7А</div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md border bg-card p-1.5"><Mail className="h-4 w-4" aria-hidden="true" /></div>
                                    <a href="mailto:info@tilqazyna.kz" className="text-primary underline underline-offset-4">info@tilqazyna.kz</a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppHeaderLayout>
        </>
    );
}


