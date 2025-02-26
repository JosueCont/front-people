import React, { useState, useMemo, useEffect } from 'react';
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
const OptionsExpedient = dynamic(()=> import('./reports/OptionsExpedient'), { ssr: false });
// const ReportExpedient = dynamic(()=> import('./reports/ReportExpedient'), { ssr: false });

const DetailsCandidates = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const router = useRouter();
    const [disableTab, setDisabledTab] = useState(true);
    const [currenKey, setCurrentKey] = useState('1');
    const [infoCandidate, setInfoCandidate] = useState({});
    const [infoEducation, setInfoEducation] = useState([]);
    const [infoExperience, setInfoExperience] = useState([]);
    const [infoPositions, setInfoPositions] = useState([]);

    const actionBack = () =>{
        let url = router.query?.back
            ? `/jobbank/${router.query?.back}`
            : '/jobbank/candidates';
        router.push({
            pathname: url,
            query: newFilters
        })
    }

    const onChangeTab = (tab) =>{
        if(action == 'add'){
            setCurrentKey(tab)
            return;
        }
        router.replace({
            pathname: '/jobbank/candidates/edit',
            query: {...router.query, tab}
        }, undefined, { shallow: true})
    }
    
    const activeKey = useMemo(()=>{
        let tab = router.query?.tab;
        return action == 'edit'
            ? tab ? tab : '1'
            : currenKey;
    },[router.query, currenKey, action])

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
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        {action == 'edit' && (
                            <OptionsExpedient
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
                </Col>
                <Col span={24} className='tabs-vacancies'>
                    <Tabs
                        type='card'
                        activeKey={activeKey}
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
                                actionBack={actionBack}
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
                                type='1'
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Estudio socioeconómico'
                            disabled={disableTab}
                            forceRender
                            key='6'
                        >
                            <TabReferences
                                action={action}
                                type='2'
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab='Otros documentos'
                            disabled={disableTab}
                            forceRender
                            key='7'
                        >
                            <TabReferences
                                action={action}
                                type='3'
                            />
                        </Tabs.TabPane>
                        {/* <Tabs.TabPane
                            tab='Expediente'
                            forceRender
                            key='8'
                        >
                            <ReportExpedient
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