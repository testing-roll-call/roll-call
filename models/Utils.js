class Utils {

    //max not included
    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = { Utils };