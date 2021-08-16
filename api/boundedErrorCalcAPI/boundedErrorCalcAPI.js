// import Bindings from 'bindings';
// import Wasm from '@/utils/wasm-utils.js';
// import Module from '@/utils/NIBEC.js';
import { BERLE } from './BERLE';


/*
export async function calculateBE(data, rawDataNum, boundedError, windowSize, traineeNum) {
    const sMax = 4095;
    const error = Math.round(sMax * boundedError * 0.01);
    
    // const wasmInstance = await new Wasm('../web/wasm/NIBEC.wasm').getInstance();
    // wasmInstance.exports
    //     ._Z16parameterSettingiiiiNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE(
    //         windowSize, error, rawDataNum, traineeNum, data
    //     );
    // wasmInstance.exports._Z10experimentv();
    // const result = wasmInstance.exports._Z7getDatav();

    const NIBEC = Bindings('NIBEC');
    NIBEC.parameterSetting(windowSize, error, rawDataNum, traineeNum, data);
    NIBEC.experiment();
    const result = NIBEC.parameterSetting(getData);

    return result;
}
*/

export function calculateBE(data, boundedError) {
    const calculator = new BERLE(boundedError);
    return calculator.execute(data);
}