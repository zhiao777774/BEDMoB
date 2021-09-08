export class RLE {
    static encode(text) {
        return text.replace(/([ \w])\1+/g, (group, chr) => group.length + chr);
    }

    static compressText(text) {
        let result = '';

        if (text.length > 0) {
            let count = 1;
            let value = text[0];

            for (let i = 1; i < text.length; ++i) {
                var entry = text[i];

                if (entry == value) {
                    count += 1;
                } else {
                    result += count + '' + value;

                    count = 1;
                    value = entry;
                }
            }

            result += count + '' + entry;
        }

        return result;
    }

    static compressArray(array) {
        const result = [];

        if (array.length > 0) {
            let count = 1;
            let value = array[0];

            for (let i = 1; i < array.length; ++i) {
                var entry = array[i];

                if (entry == value) {
                    count += 1;
                } else {
                    result.push(count);
                    result.push(value);

                    count = 1;
                    value = entry;
                }
            }

            result.push(count);
            result.push(value);
        }

        return result;
    }

    static decode(text, withNumbers = false, separator = '') {
        if (withNumbers) return RLE.decodeArray(text.split(separator));
        return text.replace(/(\d+)([ \w])/g, (_, count, chr) => chr.repeat(count));
    }

    static decodeArray(array, postfix = '\n') {
        let result = '';
        for (let i = 0; i < array.length; i += 2)
            result += (array[i + 1] + postfix).repeat(Number(array[i]));

        return result;
    }
}