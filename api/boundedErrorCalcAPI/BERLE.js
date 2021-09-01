import { RLE } from './RLE';

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

    execute(data) {
        if (!data.every((d) => { return typeof d === 'number' }))
            throw new Error('data must be Number Array.');
        else if (typeof this._boundedError === 'undefined')
            throw new Error('Please set the Bounded-Error value.');
        
        const [upperBounded, lowerBounded] = [
            data.map((d) => d + this._boundedError),
            data.map((d) => d - this._boundedError)
        ];

        let upperBound = upperBounded[0];
        let lowerBound = lowerBounded[0];
        let counter = 0;
        let index = 0;
        let dataSize = data.length;

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

        return RLE.compressText(precisionResult.join('\r\n'));
    }
}