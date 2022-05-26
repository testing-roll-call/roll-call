const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date) => {
    const dateString = date.toString();
    return `${dateString.substr(11, 4)}-${String(monthNames.indexOf(dateString.substr(4, 3)) + 1).padStart(2, '0')}-${dateString.substr(8, 2)} ${dateString.substr(16, 8)}`;
}

module.exports = {
    formatDate,
}
