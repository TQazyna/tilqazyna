import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type Row = { name: string; role: string; contact: string };

function DepartmentSection({ id, title, rows, defaultOpen = false }: { id: string; title: string; rows: Row[]; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card id={id} className="overflow-hidden border-border/60 transition-colors hover:border-primary/30">
                <CollapsibleTrigger asChild>
                    <div
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-expanded={open}
                    >
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold leading-none tracking-tight">{title}</h2>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <CardContent className="pb-4">
                        {rows.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Мәліметтер жақында жаңартылады.</p>
                        ) : (
                            <div className="relative w-full overflow-x-auto">
                                <table className="min-w-[720px] w-full table-fixed border-collapse text-sm">
                                    <thead>
                                        <tr className="sticky top-0 z-10 bg-card/95 text-left backdrop-blur supports-[backdrop-filter]:bg-card/75">
                                            <th className="border-b p-3 font-medium w-[32%]">Аты-жөні</th>
                                            <th className="border-b p-3 font-medium w-[38%]">Атқаратын қызметі</th>
                                            <th className="border-b p-3 font-medium w-[30%]">Байланыс телефоны</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r, i) => (
                                            <tr key={i} className="even:bg-muted/30 hover:bg-muted/40">
                                                <td className="p-3 align-top font-medium text-foreground">{r.name || '-'}</td>
                                                <td className="p-3 align-top text-muted-foreground">{r.role || '-'}</td>
                                                <td className="p-3 align-top whitespace-pre-wrap break-words">{r.contact || '-'}</td>
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

export default function Departments() {
    const admin: Row[] = [
        { name: '', role: 'Әкімшілік-қаржы директоры', contact: '+7 (7172) 27-71-40' },
        { name: 'Лиза Қожаққызы Есбосын', role: 'Атқарушы директор', contact: '+7 (7172) 27-30-47, e.liza@tilqazyna.kz' },
        { name: 'Гүлшат Бақытжанқызы Түсіпова', role: 'Ғалым хатшы', contact: '' },
        { name: 'Нұрбол Қасқырбайұлы Бәшіров', role: 'Корпоративтік хатшы', contact: '' },
        { name: '', role: 'Комплаенс-офицер', contact: '' },
    ];

    const pmo: Row[] = [
        { name: 'Сандуғаш Баймаханқызы Кенжебаева', role: 'Орталық басшысы', contact: '+7 (7172) 27-71-40' },
        { name: 'Әйгерім Берікқызы Әмірхан', role: 'Жоба менеджері', contact: 'a.aigerim@tilqazyna.kz' },
        { name: 'Лаура Юсупқызы Жанұзақова', role: 'Жоба менеджері', contact: '' },
        { name: 'Мәдина Дайырбекқызы Дайырбекова', role: 'Жоба менеджері', contact: '' },
    ];

    const abai: Row[] = [
        { name: 'Айгүл Әділбекқызы Орманова', role: 'Жетекші', contact: 'o.aigul@tilqazyna.kz' },
        { name: 'Серікбай Әбілмәжін', role: 'Аға ғылыми қызметкер', contact: 'a.serikbay@tilqazyna.kz' },
    ];

    const pr: Row[] = [
        { name: '', role: 'Бөлім басшысы', contact: '' },
        { name: 'Әділбек Күнесханұлы Қабаев', role: 'Бас редактор', contact: 'aden_kz@bk.ru' },
        { name: 'Жазира Әкімқызы Әшірбек', role: 'Халықаралық байланыс менеджері', contact: '' },
        { name: 'Жарқынбек Жұмаділұлы', role: 'Медиасарапшы', contact: '' },
        { name: 'Сания Ержанқызы Баубек', role: 'Дизайнер', contact: 'b.saniya@tilqazyna.kz' },
        { name: '', role: 'SMM менеджер', contact: '' },
    ];

    const digital: Row[] = [];

    const tilhub: Row[] = [
        { name: 'Мөлдір Бақытқызы', role: 'Жетекші', contact: 'b.moldir@tilqazyna.kz' },
        { name: 'Жанар Бейбітқызы Байділда', role: 'Менеджер', contact: 'b.zhanar@tilqazyna.kz' },
    ];

    const ai: Row[] = [
        { name: 'Әсел Амангелдіқызы Исмайлова', role: 'Деректерді жинақтау, өңдеу маманы', contact: 'i.asel@tilqazyna.kz' },
        { name: 'Серікбай Бауыржан', role: '', contact: '' },
    ];

    const appliedLing: Row[] = [
        { name: 'София Қажыақпарқызы Омарова', role: 'Бөлім басшысы', contact: 'o.sofia@tilqazyna.kz' },
        { name: 'Гүлназ Төкенқызы', role: 'Жетекші ғылыми қызметкер', contact: 'tgulnaz@tilqazyna.kz' },
        { name: 'Мадина Серікболсынқызы Алшынбекова', role: 'Ғылыми қызметкер', contact: '' },
    ];

    const terminology: Row[] = [
        { name: 'Дана Жаңабекқызы Оспанова', role: 'Бөлім басшысы', contact: '' },
        { name: 'Нұрзия Абдікәрім', role: 'Жетекші ғылыми қызметкер', contact: 'a.nurziya@tilqazyna.kz' },
        { name: 'Оразгүл Жәдігерқызы Мақсұт', role: 'Аға ғылыми қызметкер', contact: 'm.orazgul@tilqazyna.kz' },
        { name: 'Қарлығаш Қабай', role: 'Ғылыми қызметкер', contact: '' },
        { name: 'Айнұр Пәрімбекқызы Бодаубек', role: 'Зертханашы', contact: 'ainurbodaubek@tilqazyna.kz' },
    ];

    const methodLab: Row[] = [
        { name: 'Жазира Мақсұтқызы Ысқақова', role: 'Жетекші', contact: 'i.zhazira@tilqazyna.kz' },
        { name: 'Ләйла Мұратқызы Демесінова', role: 'Ғылыми қызметкер', contact: 's.nurzhan@tilqazyna.kz' },
        { name: 'Жұлдызай Қабдұлмажитқызы Ербатырова', role: 'Ғылыми қызметкер', contact: '' },
        { name: 'Меруерт Ерғазықызы Ермахан', role: 'Әдіскер', contact: '' },
        { name: 'Айерке Сағынғалиқызы Зинедина', role: '', contact: '' },
    ];

    const finance: Row[] = [
        { name: '', role: 'Бөлім басшысы-бас бухгалтер', contact: '' },
        { name: 'Бақытжамал Мұқышқызы Есімсейіт', role: 'Бухгалтер', contact: 'e.bakytzhamal@tilqazyna.kz' },
        { name: 'Алтынай Алтайқызы Ақан', role: 'Бухгалтер', contact: 'a.altynai@tilqazyna.kz' },
        { name: '', role: 'Экономист', contact: '' },
        { name: '', role: 'Шаруашылық маманы', contact: '' },
    ];

    const legalHr: Row[] = [
        { name: 'Гүлнар Сеиілханқызы Омарова', role: 'Бөлім басшысы', contact: '+7 (7172) 27-71-38, o.gulnara@tilqazyna.kz' },
        { name: '', role: 'Заңгер', contact: '' },
        { name: 'Балқия Әбілтайқызы Сұлейменова', role: 'HR менеджер', contact: 's.balhiya@tilqazyna.kz' },
        { name: 'Нұрсұлтан Әлібекұлы Еламанов', role: 'Жүйе әкімшісі', contact: 'e.nursultan@tilqazyna.kz' },
    ];

    const sections = [
        { id: 'admin', title: 'Әкімшілік', rows: admin },
        { id: 'pmo', title: 'Жобаларды басқару орталығы', rows: pmo },
        { id: 'abai', title: 'Абай институты', rows: abai },
        { id: 'pr', title: 'Халықаралық байланыс және PR бөлімі', rows: pr },
        { id: 'digital', title: 'Цифрлық трансформация орталығы', rows: digital },
        { id: 'tilhub', title: 'Til HUB', rows: tilhub },
        { id: 'ai', title: 'AI бөлімі', rows: ai },
        { id: 'applied', title: 'Қолданбалы лингвистика бөлімі', rows: appliedLing },
        { id: 'terminology', title: 'Терминология бөлімі', rows: terminology },
        { id: 'methodlab', title: 'Әдістеме LAB', rows: methodLab },
        { id: 'finance', title: 'Қаржы бөлімі', rows: finance },
        { id: 'legalhr', title: 'Құқықтық қамтамасыз ету және HR бөлімі', rows: legalHr },
    ] as const;

    // Removed counters per request

    return (
        <>
            <Head title="Бөлімдер" />
            <AppHeaderLayout>
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Бөлімдер</h1>
                        <p className="text-muted-foreground">Қоғамның құрылымындағы бөлімдер мен басқармалар туралы ақпарат.</p>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                        {sections.map((s) => (
                            <DepartmentSection key={s.id} id={s.id} title={s.title} rows={s.rows} defaultOpen={false} />
                        ))}
                    </div>
                </div>
            </AppHeaderLayout>
        </>
    );
}


