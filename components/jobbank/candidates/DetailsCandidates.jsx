import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TabGeneral from './TabGeneral';
import TabSchool from './TabSchool';
import TabExperience from './TabExperience';
import TabPositions from './TabPositions';

const DetailsCandidates = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const router = useRouter();
    const [disableTab, setDisabledTab] = useState(true);

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/candidates',
            query: newFilters
        })
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nuevo candidato'
                            : 'Información del candidato'
                        }
                    </p>
                    <Button
                        onClick={()=> actionBack()}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24} className='tabs-vacancies'>
                    <Tabs type='card'>
                        <Tabs.TabPane
                            tab='Datos generales'
                            key='1'
                        >
                            <TabGeneral
                                action={action}
                                setDisabledTab={setDisabledTab}
                                newFilters={newFilters}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Educación'
                            disabled={disableTab}
                            key='2'
                        >
                            <TabSchool action={action}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Experiencia y especialización'
                            disabled={disableTab}
                            key='3'
                        >
                            <TabExperience action={action}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Últimas posiciones'
                            disabled={disableTab}
                            key='4'
                        >
                            <TabPositions action={action}/>
                        </Tabs.TabPane>
                    </Tabs>    
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsCandidates);