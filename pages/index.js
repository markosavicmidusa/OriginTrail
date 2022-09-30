import React, {Component} from 'react';

import { ethers } from 'ethers';
import etherAPI from '../utils/ethersAPI';

import { Button, Input, Form, Message, Menu, Select  } from 'semantic-ui-react'
import Link from 'next/link'
import Router from 'next/router'
import Layout from '../components/Layout'



class Index extends Component{

    state = {
        address: '',
        blockNumber: '',
        errorMessage: '',
        isValidAddress: false,
        isValidBlockNumber: false,
        currency: '',
        isLoading: false
    }
    
  //let dataArray =  await transactionAPI.getAllTransactions('0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f', 15591010);
    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({isLoading: true})
        
        // Input validation -> Err Handling
        try{
            console.log('calling submit TRY')
            let validAddress = ethers.utils.isAddress(this.state.address)

            if(validAddress){
                console.log('calling submit VALID ADDRESS')
                this.setState({isValidAddress: validAddress, errorMessage: ''})
            }else{
                throw new Error('Please enter valid Hash Address !')
            }
            console.log('calling submit blockHasTransactions')
            let blockHasTransactions = await etherAPI.getBlock(this.state.blockNumber)

            if(blockHasTransactions){
                this.setState({errorMessage: '', isValidBlockNumber: true})
            }
            if(this.state.currency === ''){
                throw new Error('Please select the Currency symbol')
            }
            this.setState({isLoading: false})

            Router.push(`/address/${this.state.address}/${this.state.blockNumber}/${this.state.currency}`)
        }catch(err){
            this.setState({errorMessage: err.message})
            this.setState({isLoading: false})
        }

    }

    currencyOptions = [
        
        { key: 'wei', value: 'wei', text: 'Wei' },
        { key: 'gwei', value: 'gwei', text: 'Gwei' },
        { key: 'ether', value: 'ether', text: 'ETH' },
    ]


    render(){
        
        return(
            <Layout>
                <Menu style={{height:'30px'}}>
                    <Menu.Item active >
                        <Link href='/'>EthersTransactionCrawler</Link>
                    </Menu.Item>
                   
                </Menu>
                <div style={{marginTop: '20px',padding:'10px',borderRadius:'7px',boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                    <h3>Search for transactions</h3>
                    <Form  onSubmit={this.onSubmit} error={!!this.state.errorMessage}  >
                        <Form.Group  >
                            <Form.Field width={11}>
                                <label>Hash Address</label>
                                <Input 
                                    labelPosition='right' 
                                    placeholder='' 
                                    label='Address'
                                    value={this.state.address}
                                    onChange={event => this.setState({address: event.target.value})}
                                />
                            </Form.Field> 
                            <Form.Field width={5}>
                                <label>Block Number</label>
                                <Input 
                                    labelPosition='right' 
                                    placeholder='' 
                                    label=' Block '
                                    value={this.state.blockNumber}
                                    onChange={event => this.setState({blockNumber: event.target.value})}
                                />
                            </Form.Field> 
                            <Form.Field width={5}>
                                <label>Select the currency </label>
                                <Select placeholder='Select currency' options={this.currencyOptions} onChange={(event, data)=>{this.setState({currency: data.value})}}/> 
                            </Form.Field> 
                        </Form.Group>
                        <Message
                            error
                            header='Ooops!' 
                            content={this.state.errorMessage}
                        />
                        <Button loading={!!this.state.isLoading} type='submit' primary>Find</Button>
                    </Form> 
                </div>
            </Layout>
            
        )
    }
}

export default Index