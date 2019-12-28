const {BlockChain, Transaction} = require('./blockChainBack');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('b50c462388a529236354cc8f5580f7fcc68e0db16a910a0bcc8c0790bc196722');
const myWhalletAddres = myKey.getPublic('hex');

let coin  = new BlockChain();

const tx1 = new Transaction(myWhalletAddres, "public key", 100);
tx1.signTransaction(myKey);
coin.addTransaction(tx1);

console.log("Minando");
coin.minePendingTransactions(myWhalletAddres);
//coin.minePendingTransactions(myWhalletAddres);

console.log("el balance de jose es", coin.getBalanceOfAdress(myWhalletAddres));