import { BERLE } from './BERLE';


export function calculateBE(data, boundedError) {
    const calculator = new BERLE(data[0] * boundedError);
    return calculator.execute(data);
}