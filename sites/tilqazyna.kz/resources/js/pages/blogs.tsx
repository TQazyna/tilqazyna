import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function Blogs() {
    return (
        <>
            <Head title="Бас директор блогы" />
            <AppHeaderLayout breadcrumbs={[{ title: 'Басты бет', href: '/' }, { title: 'Бас директор блогы', href: '/blogs' }]}>
                <div className="mx-auto w-full max-w-4xl">
                    <Card className="border-muted/70">
                        <CardContent className="p-6 sm:p-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Бас директор блогы</h1>
                                    <p className="text-base text-muted-foreground">Құрметті блог пайдаланушылары!</p>
                                </div>
                                <div className="space-y-4 text-sm leading-7 text-foreground sm:text-base sm:leading-8">
                                    <p>Менің дербес парақшама қош келдіңіздер!</p>
                                    <p>Жарғыға сәйкес, Қоғам қызметінің негізгі нысанасы ғылыми зерттеулер, білім беру технологиялары мен қосымша білім беру әзірлемелері саласындағы қызметті жүзеге асыру болып табылады.</p>
                                    <p>Біздің жұмысымыздың негізгі басымдықтары – мемлекеттік тілдің мәртебесін асқақтату, азаматтардың осы бағытта Қоғаммен атқарылып жатқан жұмыстармен жан-жақты таныс болуына жағдай тудыру.</p>
                                    <p>Мен үшін Сізбен арадағы диалог, Сіздердің Қоғам жұмысы туралы пікірлеріңіз, оны жетілдіруге қатысты ұсыныстарыңыз өте маңызды.</p>
                                    <div className="space-y-1 pt-4">
                                        <div className="text-sm text-muted-foreground">Құрметпен,</div>
                                        <div>Шайсұлтан Шаяхметов атындағы</div>
                                        <div>«Тіл-Қазына» ұлттық ғылыми-практикалық орталығы</div>
                                        <div className="font-medium">Бас директор Мақпал Құрманжанқызы ЖҰМАБАЙ</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppHeaderLayout>
        </>
    );
}


