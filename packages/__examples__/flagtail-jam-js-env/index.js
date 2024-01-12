const jam = require("flagtail-jam");

jam.load();

const encrypt = require("@/crypto/encrypt");
const decrypt = require("@/crypto/decrypt");

let math = require("@/utils/math");
const plain = "123123asdfasdf!@#!@#"
const encryptedMsg = encrypt(plain);
console.log(encryptedMsg);
console.log(plain === decrypt(encryptedMsg));
console.log(math.add(10, 20));