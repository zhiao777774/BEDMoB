import { BERLE } from './BERLE';


export function calculateBE(data, boundedError) {
    const calculator = new BERLE(boundedError);
    return calculator.execute(data);
}