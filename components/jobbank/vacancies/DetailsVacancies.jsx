import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import TabFeatures from './TabFeatures';
import TabEducation from './TabEducation';
import TabSalary  from './TabSalary';
import TabRecruitment from './TabRecruitment';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { setLoadJobBank, getInfoVacant } from '../../../redux/jobBankDuck';
import { useProcessInfo } from './hook/useProcessInfo';

const DetailsVacancies = ({
    action,
    load_jobbank,
    setLoadJobBank,
    info_vacant,
    getInfoVacant
}) => {

    const router = useRouter();
    const [formJobBank] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showTurns, setShowTurns] = useState(false);
    const [listInterviewers, setListInterviewers] = useState([]);
    const { setValuesForm, createData } = useProcessInfo({
        formJobBank,
        info_vacant
    });

    useEffect(()=>{
        if(Object.keys(info_vacant).length > 0 && action == 'edit'){
            // console.log('info vacant---->', info_vacant)
            setValuesForm();
            setShowTurns(info_vacant.rotative_turn);
            const { interviewers } = info_vacant.recruitment_process;
            if(interviewers?.length > 0) setListInterviewers(interviewers);
        }
    },[info_vacant])

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateVacant(info_vacant.id, values);
            message.success('Vacante actualizada');
            setLoading(false);
            getInfoVacant(info_vacant.id);
        } catch (e) {
            console.log(e)
            setLoading(false);
            setLoadJobBank(false);
            message.error('Vacante no actualizada');
        }        
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createVacant(values);
            message.success('Vancante registrada');
            setLoading(false);
            router.replace({
                pathname: '/jobbank/vacancies/edit',
                query: { id: response.data.id }
            })
        } catch (e) {
            console.log(e)
            setLoading(false);
            setLoadJobBank(false);
            message.error('Vacante no registrada')
        }
    }

    const onFinish = async (values) => {
        setLoading(true);
        setLoadJobBank(true);
        values.interviewers = listInterviewers;
        const bodyData = await createData(values);
        // console.log('info a mandar---->', bodyData)
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const onFailure = (error) =>{
        console.log('el error-------->', error)
    }

    const onValuesChange = (values) =>{
        console.log('value', values)
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva vacante'
                            : 'Información de la vacante'
                        }
                    </p>
                    <Button
                        onClick={()=> router.push('/jobbank/vacancies')}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Form
                        className='tabs-vacancies'
                        id='form-job-bank'
                        layout='vertical'
                        form={formJobBank}
                        onFinish={onFinish}
                        // onFinishFailed={onFailure}
                        requiredMark={false}
                        // onValuesChange={onValuesChange}
                        initialValues={{
                            vo_bo: false,
                            rotative_turn: false,
                            requires_travel_availability: false
                        }}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane
                                tab={'Características del puesto'}
                                key={'tab_1'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabFeatures
                                        showTurns={showTurns}
                                        setShowTurns={setShowTurns}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Educación, competencias y habilidades'}
                                forceRender
                                key={'tab_2'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabEducation/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Sueldo de prestaciones'}
                                forceRender
                                key={'tab_3'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabSalary/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Proceso de reclutamiento'}
                                forceRender
                                key={'tab_4'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabRecruitment
                                        setListInterviewers={setListInterviewers}
                                        listInterviewers={listInterviewers}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    <Button>
                        Cancelar
                    </Button>
                    <Button
                        form='form-job-bank'
                        htmlType='submit'
                        loading={loading}
                    >
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        load_jobbank: state.jobBankStore.load_jobbank,
        info_vacant: state.jobBankStore.info_vacant
    }
}

export default connect(
    mapState, {
        setLoadJobBank,
        getInfoVacant
    }
)(DetailsVacancies);