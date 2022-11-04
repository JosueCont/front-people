import React, { useEffect, useState, useRef } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Form,
    Spin,
    message,
    Divider
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TabGeneral from './TabGeneral';
import TabSchool from './TabSchool';
import TabExperience from './TabExperience';
import TabPositions from './TabPositions';
import {
    getInfoCandidate,
    setLoadCandidates
} from '../../../redux/jobBankDuck';

const DetailsCandidates = ({
    action,
    currentNode,
    load_candidates,
    info_candidate,
    getInfoCandidate,
    setLoadCandidates
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formCandidate] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');

    useEffect(()=>{
        if(Object.keys(info_candidate).length > 0 && action == 'edit'){
            setValuesForm()
        }
    },[info_candidate])

    const setValuesForm = () => {
        formCandidate.setFieldsValue({});
    }

    const onFinisUpdate = async (values) =>{
        try {
            // await WebApiJobBank.updateCandidate(info_candidate.id, {...values, node: currentNode.id});
            message.success('Candidato actualizado');
            getInfoCandidate(info_candidate.id)
        } catch (e) {
            message.error('Candidato no actualizado');
            setLoadCandidates(false)
            console.log(e)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            // let response = await WebApiJobBank.createCandidate({...values, node: currentNode.id});
            message.success('Candidato registrado')
            actionSaveAnd('l9zxzubn31h0qdbbb')
        } catch (e) {
            message.error('Candidato no regustrado')
            setLoading({})
            setLoadCandidates(false)
            console.log(e)
        }
    }

    const onFinish = (values) => {
        setLoadCandidates(true)
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](values);
    }

    const actionAddCreate = () =>{
        formCandidate.resetFields();
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: () => router.push('/jobbank/candidates'),
            create: actionAddCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/candidates/edit',
                query: { id }
            })
        }
        actionFunction[actionType]();
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
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
                        onClick={()=> router.push('/jobbank/candidates')}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Form
                        className='tabs-vacancies'
                        id='form-candidates'
                        layout='vertical'
                        form={formCandidate}
                        onFinish={onFinish}
                        requiredMark={false}
                        onFinishFailed={()=> setLoading({})}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane
                                tab='Datos generales'
                                key='1'
                            >
                                <Spin spinning={load_candidates}>
                                    <TabGeneral/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Educación'
                                forceRender
                                key='2'
                            >
                                <Spin spinning={load_candidates}>
                                    <TabSchool/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Experiencia y especialización'
                                forceRender
                                key='3'
                            >
                                <Spin spinning={load_candidates}>
                                    <TabExperience/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Últimas posiciones'
                                forceRender
                                key='4'
                            >
                                <Spin spinning={load_candidates}>
                                    <TabPositions/>
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>    
                    </Form>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-candidates'
                                ref={btnSave}
                                style={{display:'none'}}
                            />
                            <Button
                                onClick={()=>getSaveAnd('back')}
                                disabled={loading['back']?.disabled}
                                loading={loading['back']?.loading}
                            >
                                Guardar y regresar
                            </Button>
                            <Button
                                onClick={()=>getSaveAnd('create')}
                                disabled={loading['create']?.disabled}
                                loading={loading['create']?.loading}
                            >
                                Guardar y registrar otro
                            </Button>
                            <Button
                                onClick={()=>getSaveAnd('edit')}
                                disabled={loading['edit']?.disabled}
                                loading={loading['edit']?.loading}
                            >
                                Guardar y editar
                            </Button>
                        </>
                    ):(
                        <Button
                            htmlType='submit'
                            form='form-candidates'
                            loading={load_candidates}
                        >
                            Guardar
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
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
)(DetailsCandidates);