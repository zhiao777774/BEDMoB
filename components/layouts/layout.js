import Head from 'next/head';
import Navbar from '@/components/navbar';
import PageTopButton from '@/components/pagetop';


export default function Layout(props) {
    const { children, title = 'BEDMoB',
        user = undefined, selectedIdx = undefined } = props;

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar user={user} selectedIdx={selectedIdx} />
            <main id="page-top" className="p-7 pt-28">
                {children}
            </main>
            <PageTopButton />
        </div>
    );
}