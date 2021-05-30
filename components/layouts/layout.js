import Head from 'next/head';
import Navbar from '@/components/navbar';
import PageTopButton from '@/components/pagetop';


export default function Layout({ children, title = 'BEPDPP' }) {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar />
            <main id="page-top">
                {children}
            </main>
            <PageTopButton />
            <Footer />
        </div>
    );
}