import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';

export default function Structure() {
    return (
        <>
            <Head title="Құрылым" />
            <AppHeaderLayout>
                <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-0">
                    <img
                        src="https://tilqazyna.kz/img/schema5.png"
                        alt="Ұйымның құрылымдық сызбасы"
                        className="w-full h-auto rounded-lg shadow"
                    />
                </div>
            </AppHeaderLayout>
        </>
    );
}


