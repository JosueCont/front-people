import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Tabs,
    Spin
} from 'antd';
import { connect } from 'react-redux';
import TabGeneral from './TabGeneral';
import TabSchool from './TabSchool';
import TabExperience from './TabExperience';
import TabPositions from './TabPositions';
import { useRouter } from 'next/router';
import {
    getInfoCandidate,
    setLoadCandidates
} from '../../../redux/jobBankDuck';

const RegisterCandidate = ({
    currentNode,
    getInfoCandidate,
    setLoadCandidates,
    load_candidates,
    info_candidate
}) => {

    const router = useRouter();
    const [formCandidate] = Form.useForm();

    const onFinish = () =>{
        setLoadCandidates(true)
        setTimeout(()=>{
            const url = `/jobbank/${router.query.uid}/candidate?id=${1}`;
            router.replace(url, undefined, {shallow: true});
            setLoadCandidates(false)
        },2000)
    }

    return (
        <Row gutter={[0,8]} style={{width: '60%'}}>
            <Col span={24} className='content-center'>
                <p style={{
                    marginBottom: 0,
                    fontSize: '1.25rem',
                    fontWeight: 700
                }}>
                    { router.query?.id
                        ? <span>Información del candidato</span>
                        : <span>Registrar nuevo candidato</span>
                    }
                </p>
            </Col>
            <Col span={24}>
                <Card>
                    <Form
                        className='tabs-vacancies'
                        id='form-register-candidate'
                        layout='vertical'
                        form={formCandidate}
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane key='1' tab='Datos generales'>
                                <Spin spinning={load_candidates}>
                                    <TabGeneral sizeCol={12}/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane forceRender key='2' tab='Eduación'>
                                <Spin spinning={load_candidates}>
                                    <TabSchool sizeCol={12}/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane forceRender key='3' tab='Experiencia y especialización'>
                                <Spin spinning={load_candidates}>
                                    <TabExperience sizeCol={12}/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane forceRender key='4' tab='Últimas posiciones'>
                                <Spin spinning={load_candidates}>
                                    <TabPositions sizeCol={12}/>
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </Card>
            </Col>
            <Col span={24} className='content-end'>
                <Button
                    form='form-register-candidate'
                    htmlType='submit'
                    loading={load_candidates}
                >
                    Guardar
                </Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        load_candidates: state.jobBankStore.load_candidates,
        info_candidate: state.jobBankStore.info_candidate,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getInfoCandidate,
        setLoadCandidates
    }
)(RegisterCandidate);