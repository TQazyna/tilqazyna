import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

type BoardMember = {
    name: string;
    role: string;
    bio: string[];
    photoUrl?: string;
    profileUrl: string;
};

const members: BoardMember[] = [
    
    {
        name: 'Тлешов Ербол Ердембекұлы',
        role: 'ДИРЕКТОРЛАР КЕҢЕСІНІҢ ТӨРАҒАСЫ. Тіл саясаты комитетінің төрағасы',
        bio: [
            'Жалпы ақпарат, білім',
            'Ербол Тілешов 1965 жылы Қарағанды облысында дүниеге келген.',
            'Абай атындағы педагогикалық университетін бітірген.',
            'Мансап',
            '1992-2001 жылдары С. Сейфуллин атындағы Ақмола университетінің қазақ әдебиеті кафедрасында оқытушы, аға оқытушы болып жұмыс істеді.',
            '2001-2002 жылдары Л. Гумилев атындағы Еуразия ұлттық университетінің қазақ әдебиеті кафедрасының доценті қызметін атқарды.',
            '2002-2004 жылдары Л. Гумилев атындағы Еуразия университеті Гуманитарлық институты директоры орынбасарының міндетін атқарушы, директорының орынбасары болды.',
            '2004-2007 жылдары «Республикалық мемлекеттік тілді жеделдетіп оқыту орталығы» РМҚК директорының орынбасары, директоры болып жұмыс істеді.',
            '2007 жылдан 2012 жылға дейін жеке коммерциялық құрылымдарда еңбек етті.',
            '2012-2015 жылдары – Астана қаласы Тілдерді дамыту басқармасы бастығының міндетін атқарушы, басшысы.',
            '2015-2022 жылдары – «Шайсұлтан Шаяхметов атындағы тілдерді дамытудың республикалық үйлестіру-әдістемелік орталығы» РМҚК директорының міндетін атқарушы, директоры, атқарушы директоры.',
            '2022 жылғы наурыздан 2023 жылға дейін «Шайсұлтан Шаяхметов атындағы ұлттық ғылыми-практикалық орталығы» КеАҚ бас директоры қызметін атқарды.',
            '2023 жылдың 27 наурыз айынан бастап Қазақстан Республикасы Ғылым және жоғары білім министрлігі Тіл саясаты комитетінің төрағасы лауазымын атқарады.'
        ],
        profileUrl: 'https://tilqazyna.kz/directors',
        photoUrl: 'https://tilqazyna.kz/img/directors/Tleshov.jpg',
    },
    {
        name: 'Асанғазы Оразкүл Асанғазықызы',
        role: 'Директорлар кеңесінің мүшесі - тәуелсіз директор',
        bio: [
            'Асанғазы Оразкүл Асанғазықызы - 1952 жылы 22 ақпанда Жамбыл облысы Шу ауданының «Ақтөбе» ұжымшарында туған. Қазақ.',
            '«Керегем саған айтам» кітабының (1998); мемлекеттік тіл саясаты туралы, оны ендіру, қолдану туралы, жас ұрпақты тәрбиелеудегі, ұлттық дәстүрді сақтаудағы тілдің рөлі туралы, отбасының, әйелдің қоғамдағы рөлі туралы, жарнама туралы, «Қазақстан Республикасындағы тілдер туралы» ҚР Заңына және «Әкімшілік құқық бұзулар туралы» ҚР Кодексіне өзгертулер енгізу туралы 53 мақаланың авторы.',
            'Қазақ және орыс тілдерін біледі.',
            '«Құрмет» орденімен, «Еңбектегі Ерлігі үшін», «Белсенді қызметі үшін», «Қазақстан Республикасының тәуелсіздігіне 10 жыл», «Қазақстан Республикасының тәуелсіздігіне 20 жыл» мерекелік медальдарымен марапатталған, «Қазақ КСР оқу ісінің үздігі» белгісі, Астана қаласы әкімінің Алғыс хаты, Оңтүстік Қазақстан облысы Сарыағаш және Бәйдібек аудандарының және Жамбыл облысы Шу ауданының «Құрметті азаматы» атақтары бар.'
        ],
        profileUrl: 'https://tilqazyna.kz/directors',
        photoUrl: 'https://tilqazyna.kz/img/directors/Asangazy.jpg',
    },
    {
        name: 'Құрманәлиев Кәрімбек Арыстанбекұлы',
        role: 'Директорлар кеңесінің мүшесі — тәуелсіз директор',
        bio: [
            '1962 жылы 20 сәуірде ОҚО Бәйдібек ауданы, Жамбыл ауылында дүниеге келген. Филология ғылымдарының докторы (2002), профессор (1998).',
            'Қазақстан Ұлттық жаратылыстану ғылымдары академиясының академигі (2000). ҚР Білім беру саласының құрметті қызметкері (2002).',
            'Алматы шет тілдері институтын тәмамдаған (1986). Қыздар педагогикалық институтында оқытушыдан профессорға дейін қызмет еткен.',
            '«Қайнар» университетінің вице-президенті – ректоры (2000–2003), ҚР БҒМ ЖОО департаменті директоры (2003–2007), ЕҰУ проректоры (2007–2008).',
            '80-нен астам ғылыми жарияланымның, 4 монографияның авторы.'
        ],
        profileUrl: 'https://tilqazyna.kz/directors',
        photoUrl: 'https://tilqazyna.kz/img/directors/Kurmangaliev.jpg',
    },
    {
        name: 'Жақып Жантас Алтайұлы',
        role: 'Директорлар кеңесінің мүшесі',
        bio: [
            'Қарағанды мемлекеттік университеті, қазақ тілі мен әдебиеті (1977–1982).',
            'Аспиранттан профессорға дейін: ҚарМУ қазақ тіл білімі кафедрасында оқытушы, доцент, кафедра меңгерушісі, профессор.',
            'Оқулықтарды сараптау кеңесінің мүшесі (ҚР БҒМ), әртүрлі тіл білімі пәндерін жүргізген.',
            '«Қазақстан Республикасының тәуелсіздігіне 20 жыл» медалімен марапатталған.'
        ],
        profileUrl: 'https://tilqazyna.kz/directors',
        photoUrl: 'https://tilqazyna.kz/img/directors/Zhakupov.jpg',
    },
    {
        name: 'Есен Қазыбек Мәлікұлы',
        role: 'Директорлар кеңесінің мүшесі',
        bio: [
            'Директорлар кеңесінің мүшесі. Қосымша ақпарат түпнұсқа парақта.'
        ],
        profileUrl: 'https://tilqazyna.kz/directors',
    },
];

function MemberCard({ m }: { m: BoardMember }) {
    const isIndependent = m.role.toLowerCase().includes('тәуелсіз');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card role="button" tabIndex={0} className="group cursor-pointer overflow-hidden rounded-xl border-muted/70 bg-gradient-to-b from-background to-muted/30 ring-1 ring-border/60 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="flex flex-col gap-0 sm:flex-row">
                        <div className="relative w-full sm:w-44">
                            {m.photoUrl ? (
                                <img src={m.photoUrl} alt={m.name} loading="lazy" decoding="async" className="h-44 w-full object-cover sm:h-full" />
                            ) : (
                                <div className="relative h-44 w-full sm:h-full">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/15 dark:stroke-neutral-100/15" />
                                </div>
                            )}
                            <div className="absolute inset-y-0 right-0 hidden w-px bg-border/80 sm:block" />
                        </div>
                        <CardContent className="flex-1 p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="space-y-1">
                                    <div className="text-xl font-semibold leading-tight tracking-tight">{m.name}</div>
                                    <div className="text-sm text-muted-foreground">{m.role}</div>
                                </div>
                            
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </DialogTrigger>

            <DialogContent className="w-[92vw] max-w-3xl max-h-[90vh] overflow-auto p-0">
                <div className="flex h-full flex-col md:flex-row">
                    <div className="shrink-0 w-full md:w-60 bg-muted">
                        <div className="relative aspect-[3/4] w-full">
                            {m.photoUrl ? (
                                <img src={m.photoUrl} alt={m.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                            ) : (
                                <div className="absolute inset-0">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/15 dark:stroke-neutral-100/15" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 p-5 sm:p-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold leading-tight sm:text-xl">{m.name}</h2>
                            <div className="text-sm text-muted-foreground">{m.role}</div>
                        </div>
                        <Separator className="my-4" />
                        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1 space-y-3 text-sm leading-6 sm:text-[15px]">
                            {m.bio.map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function Directors() {
    return (
        <>
            <Head title="Директорлар кеңесі" />
            <AppHeaderLayout breadcrumbs={[{ title: 'Басты бет', href: '/' }, { title: 'Директорлар кеңесі', href: '/directors' }]}>
                <div className="mx-auto w-full max-w-6xl space-y-6 md:space-y-8">
                    <div className="space-y-2 text-center">
                        <Badge variant="secondary">Құрам</Badge>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Директорлар кеңесі</h1>
                        <p className="text-muted-foreground">Қоғамның стратегиялық басқару органы</p>
                        <p className="text-xs text-muted-foreground">Карточканы басып, биографияны қараңыз</p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {members.map((m) => (
                            <MemberCard key={m.name} m={m} />
                        ))}
                    </div>
                </div>
            </AppHeaderLayout>
        </>
    );
}


