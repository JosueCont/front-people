import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
} from 'antd';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TabGeneral from './TabGeneral';
import TabSchool from './TabSchool';
import TabExperience from './TabExperience';
import TabPositions from './TabPositions';
import DocExpedient from './DocExpedient';
//Necesario para la libreria react-pdf
const Expedient = dynamic(()=> import('./Expedient'), { ssr: false });

const DetailsCandidates = ({
    action,
    currentNode,
    newFilters = {},
    isAutoRegister = false
}) => {

    const router = useRouter();
    const [disableTab, setDisabledTab] = useState(true);
    const [infoCandidate, setInfoCandidate] = useState({});
    const [infoEducation, setInfoEducation] = useState({});
    const [infoExperience, setInfoExperience] = useState({});
    const [infoPositions, setInfoPositions] = useState({});

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
                    {!isAutoRegister && (
                        <div>
                            {/* <Expedient
                                infoCandidate={infoCandidate}
                                infoEducation={infoEducation}
                                infoExperience={infoExperience}
                                infoPositions={infoPositions}
                            /> */}
                            <Button
                                onClick={()=> actionBack()}
                                icon={<ArrowLeftOutlined />}
                            >
                                Regresar
                            </Button>
                        </div>
                    )}
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
                                setInfoCandidate={setInfoCandidate}
                                infoCandidate={infoCandidate}
                                isAutoRegister={isAutoRegister}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Educación'
                            disabled={disableTab}
                            forceRender
                            key='2'
                        >
                            <TabSchool
                                action={action}
                                setInfoEducation={setInfoEducation}
                                infoEducation={infoEducation}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Experiencia y especialización'
                            disabled={disableTab}
                            forceRender
                            key='3'
                        >
                            <TabExperience
                                action={action}
                                setInfoExperience={setInfoExperience}
                                infoExperience={infoExperience}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Últimos puestos'
                            disabled={disableTab}
                            forceRender
                            key='4'
                        >
                            <TabPositions
                                action={action}
                                setInfoPositions={setInfoPositions}
                                infoPositions={infoPositions}
                            />
                        </Tabs.TabPane>
                        {/* <Tabs.TabPane tab='Expediente' forceRender key='5'>
                            <DocExpedient
                                infoCandidate={infoCandidate}
                                infoEducation={infoEducation}
                                infoExperience={infoExperience}
                                infoPositions={infoPositions}
                            />
                        </Tabs.TabPane> */}
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