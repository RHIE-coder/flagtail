module.exports = function(encryptedData) {
    return encryptedData.split('$').reverse().join('');
}