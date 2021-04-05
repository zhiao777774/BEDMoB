import Head from 'next/head';
import Link from 'next/link';


export default function Page404() {
    return (
        <div>
            <Head>
                <title>404 - BEPDPP</title>
            </Head>
            <div className="flex flex-col flex-wrap content-center justify-center w-screen h-screen">
                <div className="items-center content-center my-8 text-2xl font-medium text-center">
                    <span className="mx-2 ">404</span>
                    <span className="mx-2 ">|</span>
                    <span className="mx-2 ">您存取的頁面不存在</span>
                </div>
                <div className="inline-flex items-center justify-center object-center my-8 text-center">
                    <Link prefetch href="/">
                        <a className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125 ">
                            <svg
                                className="items-center content-center inline-block object-center w-6 h-6 mx-2 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="items-center content-center underline">返回 BEPDPP主頁</span>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
