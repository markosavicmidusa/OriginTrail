import React, {Component} from "react";
import { Container, Header, List, Menu, Select, Message} from 'semantic-ui-react'
import Link from 'next/link'
import { ethers } from 'ethers'

import etherAPI from '../../utils/ethersAPI';
import Layout from '../../components/Layout'

class TransactionHash extends Component {
    
        state = {
            currency: 'ether',
        }
       
    static getInitialProps = async (props) =>{
        let errorMessage
        let data
        let dataReceipt

        try{
           
           data = await etherAPI.getTransaction(props.query.transactionHash)
           dataReceipt = await etherAPI.getTransactionReceipt(props.query.transactionHash)
           errorMessage = ''
        }catch(err){
           errorMessage = err.message
        }
        
        return { data , dataReceipt, errorMessage}
    }

    currencyOptions = [
        
        { key: 'wei', value: 'wei', text: 'Wei' },
        { key: 'gwei', value: 'gwei', text: 'Gwei' },
        { key: 'ether', value: 'ether', text: 'Ether' },
    ]

    render(){
        return(    
            <Layout>
                <Menu style={{height:'30px'}}>
                    <Menu.Item active >
                        <Link href='/'>EthersTransactionCrawler</Link>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Select placeholder='Select currency' options={this.currencyOptions} onChange={(event,data) => this.setState({currency: data.value})}/>         
                    </Menu.Menu>
                </Menu>
                
                {typeof this.props.data !== 'undefined' && typeof this.props.dataReceipt !== 'undefined' ? <Container style={{marginTop: '50px', padding:'30px', borderRadius:'7px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                    <Header as='h3'>Transaction Hash</Header>
                    <p>{this.props.data.hash}</p>
                    <Header as='h3'>Block Hash</Header>
                    <p>{this.props.data.blockHash}</p>
                    <Header as='h3'>Block Number</Header>
                    <p>{this.props.data.blockNumber}</p>
                    <Header as='h3'>Address Info</Header>
                    <List>
                        <List.Item>AddressFrom:  {this.props.data.from}</List.Item>
                        <List.Item>AddressTo:  {this.props.data.to}</List.Item>
                    </List>
                    <Header as='h3'>TransactionValue</Header>
                    <p>{ethers.utils.formatUnits(this.props.data.value, this.state.currency)} {this.state.currency}</p>
                    <Header as='h3'>Gas Used</Header>
                    <p>{ethers.utils.formatUnits(this.props.dataReceipt.gasUsed, this.state.currency)} {this.state.currency}</p>
                    <Header as='h3'>Gas Info</Header>
                    <List> 
                        <List.Item>Gas price:  {ethers.utils.formatUnits(this.props.data.gasPrice, this.state.currency)} {this.state.currency}</List.Item>
                        <List.Item>MaxPriorityFee / UnitOfGas: {ethers.utils.formatUnits(this.props.data.maxPriorityFeePerGas, this.state.currency)} {this.state.currency}</List.Item>
                        <List.Item>MaxFee / Gas: {ethers.utils.formatUnits(this.props.data.maxFeePerGas, this.state.currency)} {this.state.currency}</List.Item>
                        <List.Item>Gas limit: {ethers.utils.formatUnits(this.props.data.gasLimit, this.state.currency)} {this.state.currency}</List.Item>
                    </List> 
                </Container> :
                <Message
                    error
                    header='Ooops!' 
                    content={this.props.errorMessage}
                    list={[<Link href='/'>Go to home page</Link>]}
                />}
            </Layout>  
        )
    }

}
export default TransactionHash




