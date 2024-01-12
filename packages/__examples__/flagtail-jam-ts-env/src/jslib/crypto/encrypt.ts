export default function(plain:string) {
    return plain.split('').reverse().join('$');
}