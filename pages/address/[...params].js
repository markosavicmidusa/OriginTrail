import React, { Component } from "react"
import etherAPI from '../../utils/ethersAPI'
import { Table, Form, Button, Statistic, Menu, Message} from 'semantic-ui-react'
import TableRows from "../../components/TableRows"
import Link from 'next/link'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import Layout from "../../components/Layout"

class Transactions extends Component{

  
      state = {
        selectedDate: '',
        ethBalanceOnDate: '',
        loading: false
    }
    
    static getInitialProps = async (props) =>{
        
        let transactionsData
        let transactionHash
        let currency
        let errorMessage
        
        try{
            let dataParams = props.query.params
            transactionHash = dataParams[0]
            let blockNumber = parseInt(dataParams[1])
            currency = dataParams[2]

            transactionsData = await etherAPI.getAllTransactions(transactionHash, blockNumber)
        }catch(err){
            errorMessage = err.message
            console.log(errorMessage)
        }
        return { transactionsData, currency, transactionHash, errorMessage}
    }

    renderTableRows = () =>{
        //I have used let index = 0; because function retrieved two children with same logs and hashes ??? 

        let index = 0;
        return this.props.transactionsData.map((txn) => {
            
                index++;
            return (
                 <TableRows key={index} id={txn.logIndex} data={{transaction: txn, currency: this.props.currency}}/>
                
            );
        });
    }

    handleDateChange = async (event) => {
    
        event.preventDefault();
        this.setState({loading: true})
        let ethBalance = await etherAPI.getBalanceAtDate(this.props.transactionHash, this.state.selectedDate)
        this.setState({ethBalanceOnDate: ethBalance /*, currency: 'ETH'*/})
        this.setState({loading: false})
    };

    render(){
        const { Header, Row, Body, HeaderCell} = Table;
        return (
            
            <Layout>
                {!this.props.errorMessage ? <>
                    <Menu style={{height:'30px'}}>
                        <Menu.Item active >
                            <Link href='/'>EthersTransactionCrawler</Link>
                        </Menu.Item>
                    </Menu>
                    <div style={{marginTop: '20px',padding:'10px',width:'50%',borderRadius:'7px',boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                        <h3>Checkout the sum of ETH on specific date</h3>
                        
                        <Form onSubmit={this.handleDateChange} >
                            
                                <Form.Field >
                                    <label>Pick a date</label>
                                    <SemanticDatepicker onChange={(event, data) => this.setState({selectedDate: data.value})}/>
                                    <Button loading={!!this.state.loading} type='submit' primary>Calculate</Button>
                                </Form.Field>    
                            
                        </Form>
                        
                    </div>
                    
                        <Statistic  size='tiny' horizontal color='olive'>
                            <Statistic.Value style={{fontSize: '10px'}} >{this.state.ethBalanceOnDate}</Statistic.Value>
                            <Statistic.Label>{this.props.currency}</Statistic.Label>
                        </Statistic>
                    <Table celled style={{marginTop: '20px',padding:'10px', borderRadius:'7px',boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                        <Header>
                            <Row>
                                <HeaderCell>LogID</HeaderCell>
                                <HeaderCell>Transaction Hash</HeaderCell>
                                <HeaderCell>Method</HeaderCell>
                                <HeaderCell>Block Number</HeaderCell>
                                <HeaderCell>From</HeaderCell>
                                <HeaderCell>To</HeaderCell>
                                <HeaderCell>Value</HeaderCell>
                            </Row>
                        </Header>
                        <Body style={{fontSize:'11px'}}>
                            {/** HERE WE NEED TO RENDER DATA */}
                            {this.renderTableRows()}
                        </Body>
                    </Table>
                </>: <><Message
                            error
                            header='Ooops!' 
                            content={this.props.errorMessage}
                        />
                        <Link href='/'>Go back to Home Page</Link>
                     </>}
            </Layout>
        )
    }

}

export default Transactions