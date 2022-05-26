class Utils {
    generateCode(length) {
        if (typeof (length) !== 'number') {
            throw('Passed parameter is not a number.');
        }
        let code = '';
        //length limit to 100 else empty string
        if (length > 100) {
            return code;
        }
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i += 1) {
          code += characters[this.generateRandomNumber(0, characters.length-1)];
        }
        return code;
    }

    //max not included
    //return type number test, integer and not decimal
    generateRandomNumber(min = 0, max = 1) {
        if (typeof (min) !== 'number' || typeof (max) !== 'number') throw new Error('Passed parameter is not a number.');
        //swap - could be extracted into its own method if it is needed at multiple places
        if (min > max) {
            let temp = max;
            max = min;
            min = temp;
        }
        if (min < 0 || max < 0) {
            return 0;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = { Utils };
