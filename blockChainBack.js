const SHA256 = require ("crypto-js/SHA256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress +this.toAddress + this.amount).toString();
    }

    signTransaction(signInKey){

        if(signInKey.getPublic('hex') !== this.fromAddress){
            throw new Error("No puedes firmar transacciones de otra billetera sapo");
        }

        const hashTx = this.calculateHash();
        const sig = signInKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error("Esta transacción no tiene firma sapo");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor( timeStamp, transactions, prevHash){
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.prevHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            console.log("Minando: " + this.hash+ " intento "+this.nonce);
        }
        console.log("Block Mined: " + this.hash);
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid){
                return false;
            }
        }

        return true;
    }
}

class BlockChain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 30;
    }

    createGenesisBlock(){
        // let genData = {
        //     enviador: "Jesus",
        //     recibidor: "JoseDaniel",
        //     cantidad: 500
        // }
        return new Block(Date.now, "Genesys", "0");
        console.log("creado genesis");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    // addBlock(newBlock){
    //     newBlock.prevHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(2)
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        //debug('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw Error("La transaccion debe tener 'from' y 'to' address");
        }

        if(!transaction.isValid()){
            throw Error("No se puede agregar una trasaccion invalida a la cadena sapo");
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAdress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++ ){
            const currentBlock = this.chain[i];
            const lastBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.prevHash !== lastBlock.calculateHash()){
                return false;
            }
            return true;
        }
    }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
module.exports.Block = Block;