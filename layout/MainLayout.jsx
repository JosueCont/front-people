import React, { useEffect, useState,useContext } from "react";
import { Form, Row, Col, Input, Button, notification, Card,Layout, Menu } from "antd";
import {useRouter} from "next/router";
import HeaderCustom from "../components/Header";
import { Global, css } from '@emotion/core'

const { Header, Content, Footer } = Layout;

const MainLayout = ({...props}) => {

    const router = useRouter();
    
    useEffect(()=>{

        
    },[])


  return (
        /* <IntlProvider locale={state.lang} messages={langMessages[state.lang]}> */
             <Layout className="layout">
                <HeaderCustom currentKey={props.currentKey}/>
                <Content style={{ padding: '30px 50px' }}>
                    {props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        /* </IntlProvider> */
  );
};

export default MainLayout;
