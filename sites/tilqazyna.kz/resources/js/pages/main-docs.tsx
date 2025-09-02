import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, Shield, ScrollText, BookOpen } from 'lucide-react';

export default function MainDocs() {
    const links = [
        {
            title: 'Қазақстан Республикасының Конституциясы',
            description: '',
            href: '//adilet.zan.kz/kaz/docs/K950001000_',
            icon: Shield,
        },
        {
            title: 'Қазақстан Республикасындағы Тіл туралы заң',
            description: '',
            href: 'https://adilet.zan.kz/kaz/docs/Z970000151_',
            icon: ScrollText,
        },
        {
            title: 'Қазақстан Республикасындағы тіл саясатын іске асырудың 2020-2025 жылдарға арналған мемлекеттік бағдарламасы',
            description: '',
            href: 'https://adilet.zan.kz/kaz/docs/P1900001045',
            icon: FileText,
        },
        {
            title: 'Қоғамның жарғысы',
            description: '',
            href: '/',
            icon: BookOpen,
        },
    ] as const;

    return (
        <>
            <Head title="Негізгі құжаттар" />
            <AppHeaderLayout breadcrumbs={[{ title: 'Басты бет', href: '/' }, { title: 'Негізгі құжаттар', href: '/main-docs' }]}>
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Негізгі құжаттар</h1>
                        <p className="text-muted-foreground">Қоғамның негізгі құжаттарына жылдам қол жеткізу.</p>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                        {links.map(({ title, description, href, icon: Icon }, idx) => (
                            <a key={idx} href={href} target="_blank" rel="noreferrer" className="group block">
                                <Card className="transition-colors hover:border-primary/40">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-semibold">
                                            <span className="inline-flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                {title}
                                            </span>
                                        </CardTitle>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </AppHeaderLayout>
        </>
    );
}


