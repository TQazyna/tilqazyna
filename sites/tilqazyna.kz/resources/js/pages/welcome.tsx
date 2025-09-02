import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';

import { Head } from '@inertiajs/react';
import { ExternalLink, Book, GraduationCap, FlaskConical } from 'lucide-react';



export default function Welcome() {
    // News removed per request

    const projects = [
        { title: 'Тіл әлемі', href: 'https://tilalemi.kz/', description: 'Қазақ тілі туралы мақалалар, жаңалықтар және мультимедиа. Бөлімдер: «Әдіс», «Тіл райы», «Кітапхана», «Толғаныс», «Орталықтар».' },
        { title: 'Termincom', href: 'https://termincom.kz/', description: '390 000+ термин. Терминдер талқыланады, сарапшылар пікірі жарияланады, ресми бекіту үдерістері жүреді.' },
        { title: 'Tilqural', href: 'https://tilqural.kz/', description: 'Өз бетімен үйренуге арналған интерактивті курстар: сабақтар, бейнелер, сөздік, фразалар, прогресс.' },
        { title: 'Qazcorpora', href: 'https://qazcorpora.kz/', description: 'Қазақ тілі ұлттық корпусы: жазбаша және ауызша мәтіндер, субкорпустар, іздеу және статистика.' },
        { title: 'Abai Institute', href: 'https://abai.institute/', description: 'Шетелде қазақ тілін оқытуға арналған курстар мен оқу-әдістемелік материалдар.' },
        { title: 'Сөздікқор', href: 'https://sozdikqor.kz/', description: 'Ұлттық сөздік дерекқоры: сөздер, терминдер, қолданыс үлгілері және ыңғайлы іздеу.' },
        { title: 'Bala Tili', href: 'http://balatili.kz/', description: 'Балаларға арналған қазақ тілі: ойын элементтері бар сабақтар, жаттығулар, иллюстрациялар.' },
        { title: 'Emle', href: 'https://emle.kz/', description: 'Орфографиялық нормалар мен жазу үлгілері. Жиі қателесетін ережелердің түсіндірмелері.' },
        { title: 'Qazlatyn', href: 'https://qazlatyn.kz/', description: 'Латын графикасына көшуге арналған әліпби, ережелер, түсіндірмелер және құралдар.' },
        { title: 'Qujat', href: 'https://qujat.kz/', description: 'Ресми құжаттар үлгілері мен хаттарды қазақша рәсімдеу бойынша нұсқаулықтар.' },
        { title: 'Tilmedia', href: 'https://tilmedia.kz/', description: 'Білім беру мультимедиасы: бейнелер, подкасттар, түсіндірмелер және оқу материалдары.' },
        { title: 'Atau', href: 'https://atau.kz/', description: 'Ономастика: географиялық және кісі аттары бойынша деректер, нормалар және ұсыныстар.' },
    ];

    const filteredProjects = projects;
 
    return (
        <>
            <Head title="Басты бет" />
            <AppHeaderLayout>
                <section id="home" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
                    <div className="space-y-6 text-center">
                        <Badge variant="secondary" className="rounded-full">Ұлттық орталық</Badge>
                        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                            «Тіл-Қазына» ұлттық ғылыми‑практикалық орталығы
                        </h1>
                        <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
                            Қазақстандағы тіл саясатын қолдайтын зерттеу, әдістемелік және ағартушылық бастамалардың платформасы.
                        </p>
                        <div className="flex justify-center gap-2">
                            <a href="#projects">
                                <Button size="lg" variant="outline">Жобалар</Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* News section removed */}

                <section id="projects" className="space-y-4 py-10">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Жобалар</Badge>
                        <h2 className="text-xl font-medium">Біздің жобалар</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((p, idx) => {
                            const color = ['bg-emerald-500','bg-indigo-500','bg-amber-500'][idx % 3];
                            const Icon = [Book, GraduationCap, FlaskConical][idx % 3];
                            return (
                                <a key={p.title} href={p.href} target="_blank" rel="noreferrer" className="block h-full" aria-label={p.title}>
                                    <Card className="group h-full min-h-[240px] overflow-hidden rounded-xl border-muted/70 ring-1 ring-border/60 bg-gradient-to-b from-background to-muted/30 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20">
                                        <div className={`h-1.5 w-full ${color}`} />
                                        <CardHeader className="pb-1">
                                            <CardTitle className="flex items-center justify-between gap-2 text-base">
                                                <span className="flex items-center gap-2">
                                                    <span className={`inline-flex size-6 items-center justify-center rounded-md text-white ${color} shadow-xs`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="text-foreground transition group-hover:text-primary">{p.title}</span>
                                                </span>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                                            </CardTitle>
                                            <div className="mt-1" />
                                        </CardHeader>
                                        <CardContent className="flex-1 text-sm text-muted-foreground">{p.description}</CardContent>
                                        
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                </section>

                <section id="youtube" className="space-y-4 py-10">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Медиа</Badge>
                        <h2 className="text-xl font-medium">YouTube</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="overflow-hidden rounded-xl shadow-sm">
                            <div className="relative aspect-video w-full">
                                <iframe className="absolute left-0 top-0 h-full w-full" src="https://www.youtube.com/embed/2GULoyhaPtE" title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </Card>
                        <Card className="overflow-hidden rounded-xl shadow-sm">
                            <div className="relative aspect-video w-full">
                                <iframe className="absolute left-0 top-0 h-full w-full" src="https://www.youtube.com/embed/17dEoUBq3KA" title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </Card>
                        <Card className="overflow-hidden rounded-xl shadow-sm">
                            <div className="relative aspect-video w-full">
                                <iframe className="absolute left-0 top-0 h-full w-full" src="https://www.youtube.com/embed/Vb5XphdK8Gc" title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </Card>
                    </div>
                </section>

                <section id="partners" className="space-y-4 py-10">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Серіктестер</Badge>
                        <h2 className="text-xl font-medium">Серіктестер</h2>
                    </div>
                    <Card className="rounded-xl shadow-xs">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-6">
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/Adm.jpg" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/GJBM.png" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/MSM.jpg" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/TIL.png" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/Tbi.png" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <img src="https://tilqazyna.kz/img/carousel/AltynsarinAkademiasy.png" alt="Партнёр" className="h-16 w-16 rounded-full object-cover ring-1 ring-border" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Footer now global via AppHeaderLayout */}
            </AppHeaderLayout>
        </>
    );
}
