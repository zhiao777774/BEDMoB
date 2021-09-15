export class BERLE {
    constructor(boundedError = undefined) {
        this._boundedError = boundedError;
    }

    /**
     * @param {number} value
     */
    set boundedError(value) {
        if (typeof value !== 'number')
            throw new Error('Bounded-Error value must be a Number');
        this._boundedError = value;
    }

    get boundedError() {
        return this._boundedError || 0.0;
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

        return this._execute(upperBounded, lowerBounded, data.length, postfix);
    }

    _execute(upperBounded, lowerBounded, dataSize, postfix) {
        let upperBound = upperBounded[0];
        let lowerBound = lowerBounded[0];
        let counter = 0;
        let index = 0;

        const precisionRLE = [];
        const precisionResult = [];

        while (true) {
            if (index == dataSize) {
                precisionRLE.push(Math.round(lowerBound, 3));
                precisionRLE.push(counter);

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
                precisionRLE.push(Math.round(lowerBound, 3));
                precisionRLE.push(counter);

                for (let i = 0; i < counter; i++)
                    precisionResult.push(Math.round(lowerBound, 3));
                counter = 1;
                upperBound = upperBounded[index];
                lowerBound = lowerBounded[index];
            }

            index += 1;
        }

        let berleResult = '';
        for (let i = 0; i < precisionRLE.length; i += 2) {
            berleResult += precisionRLE[i + 1] + ' ' + precisionRLE[i] + postfix;
        }

        return berleResult;
    }
}

export class WatermarkBERLE extends BERLE {
    constructor(boundedError = undefined, watermark) {
        super(boundedError);
        this._watermark = watermark;
    }

    static convertBinary(data) {
        return data.split('').map((c) =>
            c.charCodeAt().toString(2).padStart(8, '0'));
    }

    execute(data, postfix = ' ') {
        const wmBinary = WatermarkBERLE.convertBinary(this._watermark);
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

        return this._execute(upperBounded, lowerBounded, data.length, postfix)
            .split(postfix).map((el, idx) => {
                if (memoize.hasOwnProperty(idx)) {
                    let [count, val] = el.split(' ');

                    if (memoize[idx] === '1') { // 1 -> odd
                        if (val % 2 === 0) val -= 1;
                    } else { // 0 -> even
                        if (val % 2 === 1) val -= 1;
                    }

                    return count + ' ' + val;
                }

                return el;
            }).join(postfix);
    }

    static decodeData(data) {
        let counter = 1;
        let binaryData = '';

        let old = '';
        for (const val of data) {
            if (val === old) continue;

            if (!(counter % 9)) {
                if (Number(val) % 2 !== 0) break;
            } else {
                if (Number(val) % 2 === 0) binaryData += '0';
                else binaryData += '1';
            }

            old = val;
            counter++;
        }

        return String.fromCharCode(
            ...binaryData.match(/[01]{8}/g).map((c) => parseInt(c, 2))
        );
    }
}