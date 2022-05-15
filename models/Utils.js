class Utils {
    generateCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i += 1) {
          code += characters[this.generateRandomNumber(0, characters.length-1)];
        }
        return code;
    }

    //max not included
    //return type number test, integer and not decimal
    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = { Utils };