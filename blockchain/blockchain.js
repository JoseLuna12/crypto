// let hash = require('object-hash');

// class BlockChain {

//     constructor() {
//         //Create
//         this.chain = [];
//         //Transaction
//         this.curr_transactions = [];
//     }

//     addNewBlock(prevHash){
//         let block = {
//             index: this.chain.length + 1,
//             timestamp: Date.now(),
//             transactions: this.curr_transactions,
//             prevHash: prevHash
//         };

//         this.hash = hash(block);

//         this.chain.push(block);
//         this.curr_transactions = [];
//         return block;
//     }

//     addNewTransaction(sender, recipient, amount){
//         this.curr_transactions.push({sender, recipient, amount});
//     }

    
//     lastBock() {
//         return this.chain.slice(-1)[0]; ///< we return and element 0 index (since the has only one)
//     }

//     isEmpty() {
//         return this.chain.length == 0; ///< returns true if empty else false
//     }

// }
// module.exports = BlockChain;