const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log(publicKey);     //043ba5716305b984fac8cad41458da17c9ddc601840ced444a07c4211a3a4c79a31af50d72343699ebd0c70565fbb65dd9d2b5702f75604c3fffb08a43daa14089
console.log(privateKey);    //b50c462388a529236354cc8f5580f7fcc68e0db16a910a0bcc8c0790bc196722