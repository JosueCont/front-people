import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Tabs, Card, Spin} from 'antd';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { valueToFilter } from '../../../utils/functions';
import TabFacebook from './TabFacebook';
import TabLinkedin from './TabLinkedin';

const TabsConnections = ({
    list_connections,
    load_connections
}) => {

    const connections = {
        FB: {
            name: 'Facebook',
            icon: <FaFacebookSquare/>,
            component: (data) => <TabFacebook infoConnection={data}/>
        },
        LK: {
            name: 'Linkedin',
            icon: <FaLinkedin/>,
            component: (data) => <TabLinkedin infoConnection={data}/>
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

    const appAvailable = (code) =>{
        if(!code) return false;
        const check = item => valueToFilter(item.code) === valueToFilter(code);
        return list_connections.some(check);
    }

    return (
        <Card>
            <Row>
                <Col span={24} className='title-action-content title-action-border'>
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
                <Col span={24} className='tabs-connections'>
                    <Tabs type='card' tabPosition='left'>
                        {/* {list_connections.map(item => (
                            <Tabs.TabPane
                                key={item.code}
                                tab={getNameTab(item.code)}
                            >
                                {connections[item.code].component(item)}
                            </Tabs.TabPane>
                        ))} */}
                        <Tabs.TabPane
                            key='FB'
                            disabled={!appAvailable('FB')}
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