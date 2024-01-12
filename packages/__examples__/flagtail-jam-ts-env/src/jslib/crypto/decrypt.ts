export default function(encryptedData:string) {
    return encryptedData.split('$').reverse().join('');
}