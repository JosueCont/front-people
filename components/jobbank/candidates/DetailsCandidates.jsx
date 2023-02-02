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
import TabReferences from './TabReferences';

//*Necesario para la libreria react-pdf
const Expedient = dynamic(()=> import('./Expedient'), { ssr: false });

const DetailsCandidates = ({
    action,
    currentNode,
    newFilters = {},
    isAutoRegister = false
}) => {

    const router = useRouter();
    const [disableTab, setDisabledTab] = useState(true);
    const [currenKey, setCurrentKey] = useState('1');
    const [infoCandidate, setInfoCandidate] = useState({});
    const [infoEducation, setInfoEducation] = useState([]);
    const [infoExperience, setInfoExperience] = useState([]);
    const [infoPositions, setInfoPositions] = useState([]);
    const [infoReferences, setInfoReferences] = useState([]);

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/candidates',
            query: newFilters
        })
    }

    const onChangeTab = (tab) =>{
        if(action == 'add'){
            setCurrentKey(tab)
            return;
        }
        let querys = {...router.query, tab};
        if(querys['tab'] == '1') delete querys['tab'];
        if(querys['uid']) delete querys['uid'];
        router.replace({
            pathname: router.asPath.split('?')[0],
            query: querys
        }, undefined, {shallow: true})
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
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            {action == 'edit' && (
                                <Expedient
                                    infoCandidate={infoCandidate}
                                    infoEducation={infoEducation}
                                    infoExperience={infoExperience}
                                    infoPositions={infoPositions}
                                />
                            )}
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
                    <Tabs
                        type='card'
                        activeKey={action == 'edit'
                            ? router.query?.tab ?? '1'
                            : currenKey
                        }
                        onChange={onChangeTab}
                    >
                        <Tabs.TabPane
                            tab='Datos generales'
                            forceRender
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
                        <Tabs.TabPane
                            tab='Referencias'
                            disabled={disableTab}
                            forceRender
                            key='5'
                        >
                            <TabReferences
                                action={action}
                                setInfoReferences={setInfoReferences}
                                infoReferences={infoReferences}
                            />
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