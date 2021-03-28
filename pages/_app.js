import Head from 'next/head';
import '../styles/global.css';
import '../styles/tailwind.extend.css';
import 'tailwindcss/tailwind.css';


export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>BEPDPP</title>
            </Head>
            <Component {...pageProps} />
        </div>
    );
}