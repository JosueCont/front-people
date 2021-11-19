import React from 'react'
import {Layout, Row, Col, Avatar, Menu, Image, Input } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useRouter } from "next/router";
import { css, Global } from "@emotion/core";

const NewHeader = ({hideSearch, mainLogo, hideLogo, ...props}) => {

      const router = useRouter();
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;


    return (
        <>
            <Global 
                styles={css`
                    .ant-layout-header{
                        background-color: transparent !important;        
                    }
                    .overlay{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        height: 100%;
                        background: var(--primaryColor) !important;
                        opacity: 0.9;
                    }
                `}
            />
        <Header style={{position:'relative', backgroundColor:'transparent !important'}}>
            <div className="overlay" />
            <div className="container-fluid">
                <Row justify="space-between">
                    <Col style={{width:250,  display:'flex'}}>

                        <img style={{width:100, margin:'auto'}} src={!hideLogo ? mainLogo : "https://static.wixstatic.com/media/b7da22_cc388dc977e043299b98c607e2deced5~mv2.png/v1/fill/w_170,h_84,al_c,q_85,usm_0.66_1.00_0.01/Khor035_Color.webp" } /> 
                    </Col>
                    <Col>
                        {!hideSearch && <Input className="search_header" size="large" placeholder="Search" prefix={<SearchOutlined style={{color:'white'}} />} />}
                    </Col>
                    <Col style={{width:250, textAlign:'end'}}>
                        <Avatar
                        style={{margin:'0 20px'}}
                            key="avatar_key"
                            icon={<UserOutlined />}
                            src={'https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg'}
                        />
                    </Col>
                </Row>
            </div>
        </Header>
        </>
    )
}

export default NewHeader
