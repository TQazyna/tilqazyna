import { Separator } from '@/components/ui/separator';

export function AppFooter() {
    return (
        <footer id="contacts" className="border-t">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="space-y-1">
                        <div className="font-medium">Байланыс</div>
                        <div className="text-muted-foreground">Астана қаласы, Сауран көшесі, 7А</div>
                        <a className="text-muted-foreground underline" href="mailto:info@tilqazyna.kz">info@tilqazyna.kz</a>
                    </div>
                    <div className="space-y-1">
                        <div className="font-medium">Навигация</div>
                        <nav className="flex flex-col gap-1 text-muted-foreground">
                            <a href="/main-docs">Негізгі құжаттар</a>
                            <a href="/centers">Орталықтар</a>
                            <a href="/departments">Бөлімдер</a>
                            <a href="/contacts">Байланыс</a>
                        </nav>
                    </div>
                    <div className="space-y-1">
                        <div className="font-medium">Біз туралы</div>
                        <nav className="flex flex-col gap-1 text-muted-foreground">
                            <a href="/blogs">Бас директор блогы</a>
                            <a href="/directors">Директорлар кеңесі</a>
                            <a href="/structure">Құрылым</a>
                            <a href="/departments">Бөлімдер</a>
                            <a href="/contacts">Байланыс</a>
                        </nav>
                    </div>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col items-start justify-between gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center">
                    <span>Шайсұлтан Шаяхметов атындағы «Тіл-Қазына» ұлттық ғылыми-практикалық орталығы</span>
                </div>
            </div>
        </footer>
    );
}


