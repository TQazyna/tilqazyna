import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type CenterRow = {
    name: string;
    address: string;
    contact: string;
    siteOrEmail: string;
    director: string;
};

function RegionSection({ id, title, rows, defaultOpen = false }: { id: string; title: string; rows: CenterRow[]; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card id={id} className="overflow-hidden border-border/60 transition-colors hover:border-primary/30">
                <CollapsibleTrigger asChild>
                    <div
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-expanded={open}
                    >
                        <h2 className="text-base font-semibold leading-none tracking-tight">{title}</h2>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <CardContent className="pb-4">
                        {rows.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Мәліметтер жақында жаңартылады.</p>
                        ) : (
                            <div className="relative w-full overflow-x-auto">
                                <table className="min-w-[920px] w-full table-fixed border-collapse text-sm">
                                    <thead>
                                        <tr className="sticky top-0 z-10 bg-card/95 text-left backdrop-blur supports-[backdrop-filter]:bg-card/75">
                                            <th className="border-b p-3 font-medium w-[28%]">Орталық</th>
                                            <th className="border-b p-3 font-medium w-[26%]">Мекенжайымыз</th>
                                            <th className="border-b p-3 font-medium w-[18%]">Байланыс</th>
                                            <th className="border-b p-3 font-medium w-[18%]">Сайт / эл. пошта</th>
                                            <th className="border-b p-3 font-medium w-[10%]">Директор</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r, i) => (
                                            <tr key={i} className="even:bg-muted/30 hover:bg-muted/40">
                                                <td className="p-3 align-top font-medium text-foreground">{r.name || '-'}</td>
                                                <td className="p-3 align-top">{r.address || '-'}</td>
                                                <td className="p-3 align-top whitespace-pre-wrap break-words">{r.contact || '-'}</td>
                                                <td className="p-3 align-top break-words">
                                                    {r.siteOrEmail?.startsWith('http') || r.siteOrEmail?.startsWith('//') ? (
                                                        <a className="text-primary underline" href={r.siteOrEmail.startsWith('http') ? r.siteOrEmail : `https:${r.siteOrEmail}`} target="_blank" rel="noreferrer">
                                                            {r.siteOrEmail}
                                                        </a>
                                                    ) : (
                                                        r.siteOrEmail || '-'
                                                    )}
                                                </td>
                                                <td className="p-3 align-top">{r.director || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export default function Centers() {
    const astana: CenterRow[] = [
        {
            name: 'Астана қаласы тілдерді оқытудың «Руханият» орталығы ММ',
            address: 'Р.Қошқарбаев көшесі 50-үй',
            contact: '+7 775 394 61 30',
            siteOrEmail: 'Oku_ruh2019@mail.ru',
            director: 'Еркебұлан Ерболатұлы',
        },
    ];

    const almatyCity: CenterRow[] = [
        {
            name: 'Алматы қаласы әкімі аппараты Тілдерді дамыту және латын графикасына көшу орталығы',
            address: '',
            contact: '8 (7272) 63-15-27, 63-23-05, 63-15-25, 8 707 812 03 33',
            siteOrEmail: 'http://www.anatili-almaty.kz',
            director: 'Мамай Қаниұлы Ахетов, Бақыт Қалымбет – директордың орынбасары',
        },
    ];

    const shymkent: CenterRow[] = [
        {
            name: 'Шымкент қаласының мәдениет, тілдерді дамыту және архивтер басқармасының "Шымкент қалалық тілдерді оқыту-әдістемелік орталығы" КМКМ',
            address: 'Гагарин көшесі 122 үй',
            contact: '8-7252-31-86-77, 8 702 743 71 77, Center_kaz@mail.ru',
            siteOrEmail: '',
            director: 'Дәурен Әуелбекұлы Дүйсебеков',
        },
    ];

    const akmola: CenterRow[] = [
        {
            name: 'Шортанды ауданы мәдениет және тілдерді дамыту бөлімі «Тілдерді оқыту орталығы» КММ',
            address: 'Ақмола облысы, Шортанды кенті, 50 лет Октября көшесі № 91',
            contact: '8 71631 3 51 79',
            siteOrEmail: 'shortmtoo@mail.ru',
            director: 'Шырын Адамжанқызы Бабаханова',
        },
        {
            name: 'Целиноград ауданы әкімдігінің «Тілдерді оқыту орталығы» КММ',
            address: 'Ақмола облысы, Целиноград ауданы, Гагарин көшесі 12 үй',
            contact: '8 71651 3 05 71',
            siteOrEmail: 'til-ortalyk@mail.ru',
            director: 'Жылқыбаев Жахия Абайұлы',
        },
        {
            name: 'Көкшетау қаласының мәдениет және тілдерді дамыту бөлімінің «Тілдерді оқыту орталығы» КММ',
            address: 'Көкшетау қаласы, Горький көшесі 29 Б, 3-қабат',
            contact: '8 71622 5 12 89',
            siteOrEmail: 'Cyaz.kokshe.kz / Instagram: Kokshetay_til_ortalyq',
            director: 'Есмурзина Гулдан Алмухановна',
        },
    ];

    const aktobe: CenterRow[] = [
        {
            name: '"Ақтөбе облысының тілдерді дамыту басқармасы" ММ жанындағы "Тілдерді оқыту орталығы" КММ',
            address: 'Ақтөбе қаласы, Жұбановтар көшесі, 257 Б',
            contact: '8 702 379 05 65, 8 777 660 74 36',
            siteOrEmail: 'https://til-aktobe.kz',
            director: 'Сергазина Клара Хакимгалиевна',
        },
    ];

    const almatyRegion: CenterRow[] = [
        {
            name: '«Алматы облысының «Тіл» оқу-әдістемелік орталығы» КММ',
            address: 'Талдықорған қаласы І. Жансүгіров көшесі №36/Б',
            contact: '+7 7282 40-04-56, +7 701 374 53 12',
            siteOrEmail: 'aomtoo@mail.ru',
            director: 'Жеңіс Хамитұлы',
        },
    ];

    const atyrau: CenterRow[] = [
        {
            name: 'Атырау облысы әкімі аппаратының «ҚПКБ, біліктілігін арттыру және тілдерді оқыту өңірлік орталығы» КМҚК',
            address: 'Атырау қаласы, Әйтеке би көшесі, 79а',
            contact: 'info@rco-atyrau.kz, 8 (7122) 27-17-54',
            siteOrEmail: 'http://www.anatili-almaty.kz',
            director: '',
        },
        {
            name: 'Атырау облысы әкімдігінің Тілдерді дамыту жөніндегі басқармасы',
            address: 'Атырау қаласы, Айтеке би, 77',
            contact: 'til_atb@mail.ru, 35-45-36',
            siteOrEmail: 'http://atyrau.gov.kz',
            director: '',
        },
    ];

    const westKaz: CenterRow[] = [
        {
            name: 'Батыс Қазақстан облыстық тілдерді дамыту басқармасы ММ',
            address: 'Орал қаласы, Х. Чурин көшесі, 116 үй',
            contact: '8 (7112) 50 74 66, 51 54 47',
            siteOrEmail: 'zko-uralsk@mail.ru',
            director: 'Мыңбаева Айгүл Әділгерейқызы',
        },
    ];

    const zhambyl: CenterRow[] = [
        {
            name: 'Жамбыл облысы әкімдігінің тілдерді дамыту басқармасының «Тілдерді оқыту орталығы» МКҚК',
            address: 'Тараз қаласы, Төле би даңғылы 35, 6-қабат',
            contact: '8-7262-43-88-72, 43-88-71, 43-88-72, 8 707 347 08 03',
            siteOrEmail: 'til.zhambyl@mail.ru',
            director: 'Гүлхан Мұхтарқызы Әлімбекова',
        },
    ];

    const karaganda: CenterRow[] = [
        {
            name: '«Қарағанды облысының тілдерді дамыту жөніндегі басқармасы» ММ',
            address: 'Қарағанды облысы, Қарағанды қаласы, Гоголь көшесі 34',
            contact: '8/7212/567476',
            siteOrEmail: 'http://www.krgtil.gov.kz, urya_cancelyariya@krg.gov.kz',
            director: 'Гүлнарайым Хасенқызы Қаңтарбекова',
        },
    ];

    const kostanay: CenterRow[] = [
        {
            name: 'Қостанай қаласы, А.Байтұрсынұлы көшесі 67',
            address: 'Қостанай қаласы, А.Байтұрсынұлы көшесі 67',
            contact: '8 (714) 2-54-24-54',
            siteOrEmail: 'tilokytukostanai@mail.ru',
            director: 'Ербатырова Жұлдызай Қабдулмажитовна',
        },
    ];

    const kyzylorda: CenterRow[] = [
        {
            name: '«Қызылорда облысының тілдерді оқыту орталығы» КММ',
            address: 'Қызылорда обл., Қызылорда қ., Әйтеке би көшесі, 2-үй, 3-қабат',
            contact: '8 777 439 80 23',
            siteOrEmail: 'www.kzordatil.kz',
            director: 'Ләззат Абайқызы Ортаева',
        },
    ];

    const mangystau: CenterRow[] = [
        {
            name: 'ИП «Парасат оқу орталығы»',
            address: 'Маңғыстау облысы, Ақтау қаласы, 27 шағын аудан, ғимарат 79, офис 11',
            contact: '',
            siteOrEmail: '',
            director: 'Бисекенова Бану Мирамгалиевна',
        },
    ];

    const turkistan: CenterRow[] = [
        {
            name: 'Түркістан қаласы, "Тілдерді оқыту және дамыту орталығы" КММ',
            address: 'С.Ерубаев №176',
            contact: '8(72533)71157',
            siteOrEmail: '',
            director: 'Джунусов Бақытжан Сулейменұлы',
        },
    ];

    const pavlodar: CenterRow[] = [
        {
            name: '«Ана тілі орталығы» ЖШС',
            address: 'Павлодар қаласы, Желтоқсан көшесі, 129',
            contact: '326237, 8 747 777 16 19',
            siteOrEmail: 'anatilicenter@mail.ru',
            director: 'Кинжикова Шолпан Духтурбаевна',
        },
    ];

    const northKaz: CenterRow[] = [
        {
            name: '«СҚО әкімдігінің мәдениет, тілдерді дамыту, архив ісі басқармасы» КММ «Тілдерді оқыту орталығы» КММ',
            address: 'Петропавл қ., Абай к-сі, 29',
            contact: '8 (715 2) 39 67 76',
            siteOrEmail: 'http://uprkult.sko.gov.kz/',
            director: 'Шынтемірова Үмітжан Шәйкенқызы',
        },
    ];

    const eastKaz: CenterRow[] = [
        {
            name: '«Шығыс Қазақстан лингвистикалық орталығы» КММ',
            address: 'Өскемен қаласы, Қасым Қайсенов к-сі, 121 (070004)',
            contact: '8 771 548 57 61',
            siteOrEmail: '',
            director: 'Әсемгүл Мәдениетқызы Қалтаева',
        },
    ];

    const regions: { id: string; title: string; rows: CenterRow[] }[] = [
        { id: 'astana', title: 'Астана қаласы', rows: astana },
        { id: 'almaty-city', title: 'Алматы қаласы', rows: almatyCity },
        { id: 'shymkent', title: 'Шымкент қаласы', rows: shymkent },
        { id: 'akmola', title: 'Ақмола облысы', rows: akmola },
        { id: 'aktobe', title: 'Ақтөбе облысы', rows: aktobe },
        { id: 'almaty-region', title: 'Алматы облысы', rows: almatyRegion },
        { id: 'atyrau', title: 'Атырау облысы', rows: atyrau },
        { id: 'wko', title: 'Батыс Қазақстан облысы', rows: westKaz },
        { id: 'zhambyl', title: 'Жамбыл облысы', rows: zhambyl },
        { id: 'karaganda', title: 'Қарағанды облысы', rows: karaganda },
        { id: 'kostanay', title: 'Қостанай облысы', rows: kostanay },
        { id: 'kyzylorda', title: 'Қызылорда облысы', rows: kyzylorda },
        { id: 'mangystau', title: 'Маңғыстау облысы', rows: mangystau },
        { id: 'turkistan', title: 'Түркістан облысы', rows: turkistan },
        { id: 'pavlodar', title: 'Павлодар облысы', rows: pavlodar },
        { id: 'sko', title: 'Солтүстік Қазақстан облысы', rows: northKaz },
        { id: 'eko', title: 'Шығыс Қазақстан облысы', rows: eastKaz },
    ];

    return (
        <>
            <Head title="Орталықтар" />
            <AppHeaderLayout>
                <div className="mx-auto w-full max-w-6xl space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Орталықтар</h1>
                        <p className="text-muted-foreground">Республикалық және өңірлік орталықтардың байланыс ақпараты.</p>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                        {regions.map((r) => (
                            <RegionSection key={r.id} id={r.id} title={r.title} rows={r.rows} />
                        ))}
                    </div>
                </div>
            </AppHeaderLayout>
        </>
    );
}


