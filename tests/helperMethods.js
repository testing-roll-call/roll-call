// returns a string representing a datetime on the same day
const getDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + String((today.getMonth() + 1)).padStart(2, '0') + '-' + String((today.getDate())).padStart(2, '0');
    const time = String(today.getHours() + 1).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0');
    return `${date} ${time}`;
}

module.exports = {
    getDateTime,
}
