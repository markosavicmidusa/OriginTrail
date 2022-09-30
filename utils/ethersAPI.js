const { ethers } = require('ethers')
const EthDater = require('ethereum-block-by-date')

// Requesting the ERC20 abi 
const ERC20_ABI = require('./abi')

//Setting up the value for Infura id from .env file
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID

// Seting up the provider
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);

//Initializing the new ETHdater object
const dater = new EthDater(
    provider // Ethers provider, required.
);


//Fenction definitions => API Requests

/** Returns the instance of Contract from Contract Address */
const getContract = (contractAddress) => {

    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
    return contract;
}

/** Returns all transactions involved with contract address from dynamic block number */
const getAllTransactions = async (contractAddress, fromBlock) => {

    const contract = getContract(contractAddress)

    let block = await provider.getBlockNumber();
    const transferEvents = await contract.queryFilter("*", fromBlock, block);
    
    return transferEvents
}

/** Returns block from block number -> if exists*/
const getBlock = async (blockNumber) => {
    
    let block = await provider.getBlock(parseInt(blockNumber))
  
    if(block.transactions.length !== 0){
        return true
    }else{
        throw new Error('Enter the valid Block Number')
    }
}

/** Returns transaction by transaction RECEIPT */
const getTransactionReceipt = async (transactionHash) => {
    
    let singleTransaction = await provider.getTransactionReceipt(transactionHash)
    return singleTransaction
}

/** Returns transaction by transaction Hash */
const getTransaction = async (transactionHash) => {
    //console.log('We are here')
    let singleTransaction = await provider.getTransaction(transactionHash)
    //console.log('We are here=RESPONSE')
    return singleTransaction
}

/** Returns the amount of ETH for certain address at the Date in UTC format */
const getBalanceAtDate = async (accountAddress, date) => {

    //console.log(accountAddress)
    //console.log(date)

    const contract = getContract(accountAddress)

    // Getting block by date:
    let blockObject = await dater.getDate(
        date,    //'2022-07-20T13:20:40Z', // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
        false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    );
    //console.log(blockObject)

    const balance= await contract.balanceOf(accountAddress, {blockTag: blockObject.block})
    const balanceETH = ethers.utils.formatEther(balance)
    
    //console.log(balanceETH)
    return balanceETH
}


module.exports = {
    getAllTransactions,
    getTransaction,
    getContract,
    getBalanceAtDate,
    getBlock,
    getTransactionReceipt
}
