import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import etherAPI from '../utils/ethersAPI'
import { ethers } from 'ethers'
import Link from 'next/link'


class TableRows extends Component{
    
    state = {
        singleTransactionValue: 0.0,
        errorMessage: '',
        currency: 'ether'
    }
    //let dataArray =  await transactionAPI.getAllTransactions('0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f', 15591010);
    async componentDidMount(){
        
        // This try and catch block is not necessary.
        // It will handle state, for example if we lost network during API call  
        try{
            
            const singleTransaction = await etherAPI.getTransaction(this.props.data.transaction.transactionHash)
            const singleTransactionFormated = ethers.utils.formatUnits(singleTransaction.value, this.props.data.currency)
            this.setState({singleTransactionValue: singleTransactionFormated})
            this.setState({errorMessage: '', currency: this.props.data.currency})

        }catch(err){
            this.setState({errorMessage: err.message})
        }
    }

    render(){
        const {Row, Cell} = Table

        return(
                <>
                     <Row>
                        <Cell>{this.props.data.transaction.logIndex}</Cell>
                        <Cell ><Link href={`/transaction/${this.props.data.transaction.transactionHash}`}>{this.props.data.transaction.transactionHash}</Link></Cell>
                        <Cell >{this.props.data.transaction.event}</Cell>
                        <Cell style={{color:'olive'}}>{this.props.data.transaction.blockNumber}</Cell>
                        <Cell>{this.props.data.transaction.args[0].substring(0,20)+'...'}</Cell>
                        <Cell>{this.props.data.transaction.args[1].substring(0,20)+'...'}</Cell>
                        <Cell>{this.state.singleTransactionValue} {this.props.data.currency}</Cell>
                    </Row>
                </>
        )
    }
}
export default TableRows
