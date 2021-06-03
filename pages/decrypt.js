import React, { Component } from 'react';
import { withIronSession } from 'next-iron-session';
import Layout from '@/layouts/layout';
import cookieConfig from '@/constants/serverSideCookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';


export default class Decrypter extends Component {
    constructor(props) {
        super(props);

        this.downloadRef = React.createRef();

        this.state = {
            disabled: false,
            file: undefined,
            privateKey: '',
            download: false,
            downloadData: ''
        };
    }

    _decrypt = async (e) => {
        e.preventDefault();

        const { file, privateKey } = this.state;
        if (!file || !privateKey) {
            alert('請選擇要解碼的檔案及輸入私鑰');
            return;
        }

        const content = await this._getFileContent(file);

        this.setState({ disabled: true });
        const res = await fetch('/api/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                privateKey,
                fileContent: content
            })
        });
        const { decryptedResult } = await res.json();

        if (decryptedResult) {
            alert('解碼成功!');
            this.setState({
                disabled: false,
                download: true,
                downloadData: decryptedResult
            });

            this.downloadRef.current.click();
        }
    };

    _getFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
            reader.readAsText(file);
        })
    };

    render() {
        const { disabled, file, privateKey, download, downloadData } = this.state;
        const fieldStyle = 'shadow appearance-none border rounded w-full py-2 px-3 ' +
            'text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

        return (
            <Layout user={this.props.user} selectedIdx={3}>
                <div className="rounded-3xl vertical-center">
                    <div className="border-4 rounded-3xl w-2/3 bg-white">
                        <form className="px-8 py-10 w-2/3 m-center" onSubmit={this._decrypt}>
                            <span className="block text-gray-700 font-bold mb-4 text-2xl text-center">
                                資料集解碼服務
                            </span>
                            <br />

                            <div className="mb-8">
                                <label className="text-gray-700 font-bold mb-2" htmlFor="private-key">
                                    檔案
                                </label>
                                <div className="mt-2 font-semibold">
                                    <label className="btn btn-primary w-max">
                                        <input id="private-key" name="private-key" className="hidden"
                                            type="file" onChange={({ target }) => this.setState({ file: target.files[0] })}
                                        />
                                        <FontAwesomeIcon icon={faFile} className="mr-2" />
                                    上傳檔案
                                    </label>
                                    <span className="inline-block ml-5">
                                        {file && file.name}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-gray-700 font-bold mb-2" htmlFor="private-key">
                                    私鑰
                                </label>
                                <input id="private-key" name="private-key" className={fieldStyle + ' mt-2 font-semibold'}
                                    type="text" value={privateKey} autocomplete="off"
                                    onChange={({ target }) => this.setState({ privateKey: target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <button type="submit" className={'btn btn-lg ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}>
                                    {disabled ? '解碼中...' : '解碼'}
                                </button>
                                {
                                    download ?
                                        <div className="btn btn-lg btn-danger ml-6">
                                            <a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(downloadData)}
                                                download={`${file.name.replace('.' + file.name.split('.').pop(), '')}_decrypted`}
                                                ref={this.downloadRef}>
                                                下載檔案
                                            </a>
                                        </div>
                                        : null
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </Layout >
        );
    }
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get('user');

        if (!user) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/'
                }
            };
        }

        return {
            props: { user }
        };
    },
    cookieConfig
);