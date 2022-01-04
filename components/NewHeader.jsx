import React, {useState, useEffect} from 'react'
import {Layout, Row, Col, Avatar, Menu, Image, Input, Dropdown, Card, Button, Typography, Divider, Modal } from 'antd'
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
import CardUser from './CardUser';
import Cookie from "js-cookie";
import WebApi from "../api/webApi";
import { logoutAuth } from "../libs/auth";

const NewHeader = ({hideSearch, mainLogo, hideLogo, ...props}) => {

    const {Title, Text} =Typography
    const router = useRouter();
    const {pathname} = router
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;
    const [logOut, setLogOut] = useState(false);
    const [person, setPerson] = useState({});
    const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    useEffect(() => {
        console.log('getPerson');
        getPerson();
    }, []);

    const actionEvent = (data) => {
        console.log('actionEvent');
    };

    const getPerson = async () => {
        
    try {
      const user = JSON.parse(Cookie.get("token"));
      let response = await WebApi.personForKhonnectId({ id: user.user_id });
      if (!response.data.photo) response.data.photo = defaulPhoto;
      let personName = response.data.first_name + " " + response.data.flast_name;
      if (response.data.mlast_name)
        personName = personName + " " + response.data.mlast_name;
      response.data.fullName = personName;
      setPerson(response.data);
      console.log('response.data',response.data);
    } catch (error) {
        console.log('error',error);
      setPerson({ photo: defaulPhoto });
    }
  };


    const userCardDisplay = () => (
    <>
        <Card className="card_menu">
            <div style={{paddingTop:20, paddingLeft:20, paddingRight:20}}>
            <Row gutter={[20]}>
                <Col style={{display:'flex'}}>
                    <Avatar
                        key="avatar_key"
                        icon={<UserOutlined />}
                        src={person.photo}
                        style={{margin:'auto'}}
                        />
                </Col>
                <Col>
                    <Text strong >{person.fullName}</Text><br/>
                    <Text>{person.email}</Text>
                </Col>
                {/* <Col span={24}>
                    <Divider className="divider-primary" />
                </Col> */}
            </Row>
            <Divider className="divider-primary" style={{margin:'10px 0px'}} />
            </div>
            <Row>
                <Col span={24}>
                    <p className="text-menu" onClick={() => {
                        !person.nodes && props.currentNode
                        ? router.push(`/ac/urn/${props.currentNode.permanent_code}`)
                        : router.push(`/home/${person.id}`);
                    }}>
                        <Text >
                            Editar perfil
                        </Text>
                    </p>
                    {pathname !== "/select-company" &&
                        <p className="text-menu" onClick={() => router.push('/select-company') }>
                            <Text>
                                Cambiar de empresa
                            </Text>
                        </p>
                     }
                    <p className="text-menu" onClick={() => setLogOut(true)}>
                        <Text>
                            Cerrar sesión
                        </Text>
                    </p>
                    {/* <Menu style={{background:'none', border:'none', boxShadow:'none', width:'100%', padding:0, textAlign:'center'}}>
                        <Menu.Item>
                            <Text>1st menu item</Text>
                        </Menu.Item>
                        <Menu.Item>
                            <Text>1st menu item</Text>
                        </Menu.Item>
                    </Menu> */}
                </Col>
            </Row>
        </Card>
      
    </>
  );


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
                    .ant-menu{
                        width: 100%;
                        text-align: center;
                    }
                    .ant-menu .ant-menu-item{
                        margin:0px !important;
                        padding: 0px !important;
                    }
                    .text-menu{
                        text-align:center;
                        padding-bottom:5px;
                        padding-top:5px;
                        margin:0px;
                        cursor:pointer;
                    }
                    .text-menu:hover{
                        background-color: var(--primaryColor);
                        opacity: 0.6;
                    }
                    .text-menu:hover span{
                        color: var(--fontSpanColor);
                    }
                    .card_menu .ant-card-body{
                        padding: 0px;
                    }
                `}
            />
        <Header style={{position:'relative', backgroundColor:'transparent !important'}}>
            <div className="overlay" />
            <div className="container-fluid">
                <Row justify="space-between">
                    <Col style={{width:250,  display:'flex'}}>

                        <img style={{maxWidth:100, margin:'auto', maxHeight:50 }} src={!hideLogo ? mainLogo : "/images/LogoKhorconnect.svg" } /> 
                    </Col>
                    <Col>
                        {!hideSearch && <Input className="search_header" size="large" placeholder="Search" prefix={<SearchOutlined style={{color:'white'}} />} />}
                    </Col>
                    <Col style={{width:250, textAlign:'end'}}>

                        <div
                            className={"pointer"}
                            style={{ float: "right" }}
                            key={"menu_user_" + props.currentKey}
                        >
                            <Dropdown overlay={userCardDisplay} key="dropdown_user">
                            <div key="menu_user_content">
                                <Avatar
                                key="avatar_key"
                                icon={<UserOutlined />}
                                src={person.photo}
                                />
                            </div>
                            </Dropdown>
                        </div>

                        {/* <Avatar
                        style={{margin:'0 20px'}}
                            key="avatar_key"
                            icon={<UserOutlined />}
                            src={'https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg'}
                        /> */}
                    </Col>
                </Row>
            </div>
        </Header>
        
        <Modal
          title="Cerrar sesión"
          centered
          visible={logOut}
          onOk={() => logoutAuth()}
          onCancel={() => setLogOut(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setLogOut(false)}
              style={{ padding: "0 10px", marginLeft: 15 }}
            >
              Cancelar
            </Button>,
            <Button
              key="submit_modal"
              type="primary"
              onClick={logoutAuth}
              style={{ padding: "0 10px", marginLeft: 15 }}
            >
              Cerrar sesión
            </Button>,
          ]}
        >
          ¿Está seguro de cerrar sesión?
        </Modal>
        </>
    )
}

export default NewHeader
