import React from 'react'
import styled from '@emotion/styled';
import { Card, Row, Col, Space, Button, Divider } from 'antd';
import { logoutAuth } from '../../libs/auth';
import {
    MenuUnfoldOutlined,
    UserOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const ContentApps = styled.div`
    & .ant-card{
        background: #403F44;
        border-radius: 12px;
    }
    & .ant-card-body{
        max-width: 300px;
        width: 300px;
        padding: 24px 12px;
    }
    & .ant-row{
        max-height: 300px;
        overflow-y: auto;
        ::-webkit-scrollbar {
            width: 16px;
        }
        ::-webkit-scrollbar-track {
            background: none;
            border: none;
        }
        ::-webkit-scrollbar-thumb {
            background: #5f6368;
            background-clip: padding-box;
            border: 4px solid transparent;
            border-radius: 8px;
            box-shadow: none;
            min-height: 50px;
        }
    }
    & .ant-col{
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 12px;
        transition: all 0.2s ease-in-out;
        display: flex;
        justify-content: center;
        :hover{
            background-color: rgba(25, 25, 25, 0.5);
        }
    }
    & .ant-space{
        cursor: pointer;
    }
    & img{
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: transparent;
    }
    & .ant-space-item{
        max-width: 70px;
    }
    & p{
        color: white;
        margin-bottom: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const CardApps = ({...props}) => {
    const defaultPhoto =
    "https://cdn-icons-png.flaticon.com/512/219/219986.png";

    const imgPsicometria =
    "https://www.nicepng.com/png/full/197-1975724_research-icon-png-marketing.png";

    const imgNomina =
    "https://www.masadmin.net/imgs/icon12.png";

  return (
    <ContentApps>
        <Card bordered={false}>
            <Row gutter={[8,16]}>
                <Col span={8} >
                    <Space
                        direction='vertical'
                        align='center'
                        onClick={() => props.profile()}
                    >
                        <img src={defaultPhoto}/>
                        <p style={{marginBottom: '0px'}}>Mi perfil</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgPsicometria}/>
                        <p style={{marginBottom: '0px'}}>Psicometría</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgNomina}/>
                        <p style={{marginBottom: '0px'}}>Nómina</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space
                        direction='vertical'
                        align='center'
                    >
                        <img src={defaultPhoto}/>
                        <p style={{marginBottom: '0px'}}>Mi perfil</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgPsicometria}/>
                        <p style={{marginBottom: '0px'}}>Psicometría</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgNomina}/>
                        <p style={{marginBottom: '0px'}}>Nómina</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space
                        direction='vertical'
                        align='center'
                    >
                        <img src={defaultPhoto}/>
                        <p style={{marginBottom: '0px'}}>Mi perfil</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgPsicometria}/>
                        <p style={{marginBottom: '0px'}}>Psicometría</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgNomina}/>
                        <p style={{marginBottom: '0px'}}>Nómina</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space
                        direction='vertical'
                        align='center'
                    >
                        <img src={defaultPhoto}/>
                        <p style={{marginBottom: '0px'}}>Mi perfil</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgPsicometria}/>
                        <p style={{marginBottom: '0px'}}>Psicometría</p>
                    </Space>
                </Col>
                <Col span={8} >
                    <Space direction='vertical' align='center'>
                        <img src={imgNomina}/>
                        <p style={{marginBottom: '0px'}}>Nómina</p>
                    </Space>
                </Col>
            </Row>
            {/* <Divider style={{background: '#5f6368'}}/>
            <Row justify='center'>
                <Button
                    icon={<LogoutOutlined/>}
                    size={'small'}
                    onClick={()=>logoutAuth()}
                >
                    Cerrar sesión
                </Button>
            </Row> */}
        </Card>
    </ContentApps>
  )
}

export default CardApps