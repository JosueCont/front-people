import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Tabs, Card, Spin} from 'antd';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { valueToFilter } from '../../../utils/functions';
import useDimensions from '../../../utils/useDimensions';
import TabFacebook from './TabFacebook';
import TabLinkedin from './TabLinkedin';

const TabsConnections = ({
    list_connections,
    load_connections
}) => {

    // const sizeWindow = useDimensions();

    const connections = {
        FB: {
            name: 'Facebook',
            icon: <FaFacebookSquare/>
        },
        LK: {
            name: 'Linkedin',
            icon: <FaLinkedin/>
        } 
    }

    const getNameTab = (code) => {
        return(
            <div className='name-connection'>
                {connections[code].icon}
                <span>{connections[code].name}</span>
            </div>
        )   
    }

    const appInfo = (code) =>{
        if(!code) return {};
        const check = item => valueToFilter(item.code) === valueToFilter(code);
        return list_connections.find(check);
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        Configurar conexiones
                    </p>
                    <Button
                        // onClick={()=> actionBack()}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24} className='tabs-vacancies'>
                    <Tabs type='card' tabPosition='top'>
                        <Tabs.TabPane
                            key='FB'
                            tab={getNameTab('FB')}
                        >
                            <Spin spinning={load_connections}>
                                <TabFacebook infoConnection={appInfo('FB')}/>
                            </Spin>
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            key='LK'
                            forceRender
                            disabled
                            tab={getNameTab('LK')}
                        >
                            <Spin spinning={load_connections}>
                                <TabLinkedin infoConnection={appInfo('LK')}/>
                            </Spin>
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        list_connections: state.jobBankStore.list_connections,
        load_connections: state.jobBankStore.load_connections
    }
}

export default connect(mapState)(TabsConnections);