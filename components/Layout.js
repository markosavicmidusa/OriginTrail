import React from "react";
import { Container } from 'semantic-ui-react'
import Head from 'next/head'

const Layout = (props) => {
///transaction/0x5b73e239c55d790e3c9c3bbb84092652db01bb8dbf49ccc9e4a318470419d9a0
    return(

        <Container  style={{marginTop: '10px'}}>
            <Head>
            <link
                async
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
            />
            </Head>
            {props.children}
        </Container>
    )

}

export default Layout