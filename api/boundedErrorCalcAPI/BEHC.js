import fs from 'fs';
import { HuffmanTree } from './huffman.js';

export class BEHC {
    constructor(boundedError) {
        if (typeof boundedError !== 'number')
            throw new Error('Bounded-Error value must be a Number');
        this._boundedError = boundedError;
    }

    get boundedError() {
        return this._boundedError || 0.0;
    }

    get huffmanTree() {
        return this._huffmanTree;
    }

    _binaryStringToBuffer(string, pad = true, padding = '0') {
        if (pad && (string.length % 8)) {
            const d1 = string.slice(0, string.length - string.length % 8);
            const d2 = string.slice(string.length - string.length % 8).padEnd(8, padding);

            string = d1 + d2;
        }

        const groups = string.match(/[01]{8}/g);
        const numbers = groups.map(binary => parseInt(binary, 2));

        return Buffer.from(new Uint8Array(numbers).buffer);
    }

    _buildHuffmanTree(data) {
        this._huffmanTree = new HuffmanTree(data);
    }

    execute(data, postfix = ' ') {
        if (!data.every((d) => { return typeof d === 'number' }))
            throw new Error('data must be Number Array.');
        else if (typeof this._boundedError === 'undefined')
            throw new Error('Please set the Bounded-Error value.');

        const [upperBounded, lowerBounded] = [
            data.map((d) => d + d * this._boundedError),
            data.map((d) => d - d * this._boundedError)
        ];

        const beResult = this._execute(upperBounded, lowerBounded, data.length);
        this._buildHuffmanTree(beResult.join(postfix));
    }

    _execute(upperBounded, lowerBounded, dataSize) {
        let upperBound = upperBounded[0];
        let lowerBound = lowerBounded[0];
        let counter = 0;
        let index = 0;

        const precisionResult = [];

        while (true) {
            if (index == dataSize) {
                for (let i = 0; i < counter; i++)
                    precisionResult.push(Math.round(lowerBound, 3))
                break;
            }

            // 上下界都在範圍內
            if (upperBounded[index] <= upperBound && lowerBounded[index] >= lowerBound) {
                upperBound = upperBounded[index];
                lowerBound = lowerBounded[index];
                counter += 1;
            }
            // 只有上界在範圍內
            else if (upperBounded[index] > lowerBound && upperBounded[index] <= upperBound) {
                upperBound = upperBounded[index];
                counter += 1;
            }
            // 只有下界在範圍內
            else if (lowerBounded[index] >= lowerBound && lowerBounded[index] < upperBound) {
                lowerBound = lowerBounded[index];
                counter += 1;
            }
            else if (upperBounded[index] > upperBound && lowerBounded[index] < lowerBound) {
                counter += 1;
            }
            else {
                for (let i = 0; i < counter; i++)
                    precisionResult.push(Math.round(lowerBound, 3));
                counter = 1;
                upperBound = upperBounded[index];
                lowerBound = lowerBounded[index];
            }

            index += 1;
        }

        return precisionResult;
    }

    saveFile(path) {
        const huffman = this._huffmanTree;

        const nodeData = huffman.codeBookEncoded;
        const contentData = huffman.binaryStr;
        const dataByteSizeBuf = Buffer.allocUnsafe(4);
        dataByteSizeBuf.writeInt32LE(Math.ceil(contentData.length / 8));

        const buffer = Buffer.concat([
            dataByteSizeBuf,
            Buffer.from(nodeData),
            this._binaryStringToBuffer(contentData)
        ]);
        const fd = fs.openSync(path, 'w');
        fs.write(fd, buffer, 0, buffer.length, 0, function (err) {
            if (err) console.log(err);
            else console.log('The file was saved!');
        });
    }
}

export class WatermarkBEHC extends BEHC {
    constructor(boundedError, sm) {
        super(boundedError);

        if (typeof sm !== 'string')
            throw new Error('Message value must be a String');
        this._secretMessage = sm;
    }

    static convertBinary(data) {
        return data.split('').map((c) =>
            c.charCodeAt().toString(2).padStart(8, '0'));
    }

    execute(data, postfix = ' ') {
        const wmBinary = WatermarkBEHC.convertBinary(this._secretMessage);
        const wmSize = wmBinary.length * 8 + wmBinary.length;

        const BE = {};
        const memoize = {};
        const wmData = data.slice(0, wmSize).map((val, idx) => {
            const bin = (idx && !((idx + 1) % 9)) ? (idx === wmSize - 1 ? '1' : '0')
                : wmBinary[Math.floor(idx / 9)][idx % 9];

            let encoded = val;
            if (bin === '1') { // 1 -> odd
                if (val % 2 === 0) encoded -= 1;
            } else { // 0 -> even
                if (val % 2 === 1) encoded -= 1;
            }

            memoize[idx] = bin;
            BE[idx] = 1 - encoded / val;

            return val;
        });

        const upperBounded = wmData.map((val, idx) => val + val * (this._boundedError - BE[idx]))
            .concat(data.slice(wmSize).map((d) => d + d * this._boundedError));

        const lowerBounded = wmData.map((val, idx) => val - val * (this._boundedError - BE[idx]))
            .concat(data.slice(wmSize).map((d) => d - d * this._boundedError));

        // TODO: 目前不考量計算完Bounded-Error後連續值的情形
        const beResult = this._execute(upperBounded, lowerBounded, data.length)
            .map((el, idx) => {
                if (memoize.hasOwnProperty(idx)) {
                    let val = el;

                    if (memoize[idx] === '1') { // 1 -> odd
                        if (val % 2 === 0) val -= 1;
                    } else { // 0 -> even
                        if (val % 2 === 1) val -= 1;
                    }

                    return val;
                }

                return el;
            });

        this._buildHuffmanTree(beResult.join(postfix));
    }

    static decodeData(binary) {
        const huffman = new HuffmanTree().decodeNode(binary);
        const decoded = huffman.decode(huffman.binaryStr);

        let counter = 1;
        let binaryData = '';

        let old = '';
        // TODO: 目前預設使用換行作為資料切割符號，之後可以在HC檔案前加入切割符號，並在HC decodeNode中做判斷
        for (const val of decoded.split('\n')) {
            // TODO: 目前不考量計算完Bounded-Error後連續值的情形
            // if (val === old) continue;

            if (!(counter % 9)) {
                if (Number(val) % 2 !== 0) break;
            } else {
                if (Number(val) % 2 === 0) binaryData += '0';
                else binaryData += '1';
            }

            old = val;
            counter++;
        }

        const secretMessage = String.fromCharCode(
            ...binaryData.match(/[01]{8}/g).map((c) => parseInt(c, 2))
        );

        return {
            data: decoded,
            message: secretMessage
        };
    }
}