import Link from 'next/link'
import Layout from '../components/Layout'
import { Menu } from 'semantic-ui-react'

const PageNotFound = () =>{

    return (
        <Layout>
            <Menu style={{height:'30px'}}>
                    <Menu.Item active >
                        <Link href='/'>EthersTransactionCrawler</Link>
                    </Menu.Item>
                   
            </Menu>
            <h1>Oooops !</h1>
            <h3>Page not found</h3>
            <Link href='/'>Go back to home</Link>
        </Layout>
    )
}
export default PageNotFound