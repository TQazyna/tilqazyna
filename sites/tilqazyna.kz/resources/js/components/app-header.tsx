import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { dashboard, home } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Негізгі құжаттар',
        href: '/main-docs',
        icon: null,
    },
    {
        title: 'Орталықтар',
        href: '/centers',
        icon: null,
    },
];

// Right-side items removed per design

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="relative mx-auto flex h-16 items-center px-3 md:max-w-5xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={(auth.user ? dashboard() : home())} prefetch className="flex items-center space-x-2 px-2 md:px-3 mr-4">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation - centered */}
                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex h-full items-center">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {/* "Біз туралы" dropdown */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), 'h-9 px-3')}>Біз туралы</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[480px] grid-cols-1 gap-1 p-2 sm:w-[560px] sm:grid-cols-2">
                                            <Link href="/blogs" prefetch className="rounded-sm">
                                                <NavigationMenuLink className="w-full">
                                                    <div className="text-sm font-medium">Бас директор блогы</div>
                                                    <div className="text-xs text-muted-foreground">Жарияланымдар және хабарламалар</div>
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/directors" prefetch className="rounded-sm">
                                                <NavigationMenuLink className="w-full">
                                                    <div className="text-sm font-medium">Директорлар кеңесі</div>
                                                    <div className="text-xs text-muted-foreground">Құрам және құзыреттер</div>
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/structure" prefetch className="rounded-sm">
                                                <NavigationMenuLink className="w-full">
                                                    <div className="text-sm font-medium">Құрылым</div>
                                                    <div className="text-xs text-muted-foreground">Ұйымдастырушылық құрылым</div>
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/departments" prefetch className="rounded-sm">
                                                <NavigationMenuLink className="w-full">
                                                    <div className="text-sm font-medium">Бөлімдер</div>
                                                    <div className="text-xs text-muted-foreground">Бөлімдер мен бағыттар</div>
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/contacts" prefetch className="rounded-sm">
                                                <NavigationMenuLink className="w-full">
                                                    <div className="text-sm font-medium">Байланыс</div>
                                                    <div className="text-xs text-muted-foreground">Мекенжай</div>
                                                </NavigationMenuLink>
                                            </Link>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === (typeof item.href === 'string' ? item.href : item.href.url) && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right-side controls removed per design */}
                </div>
            </div>
            {/* Breadcrumbs removed globally */}
        </>
    );
}
