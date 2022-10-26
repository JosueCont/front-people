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
import { setLoadVacancies, getInfoVacant } from '../../../redux/jobBankDuck';
import { useProcessInfo } from './hook/useProcessInfo';

const DetailsVacancies = ({
    action,
    currentNode,
    load_vacancies,
    setLoadVacancies,
    info_vacant,
    getInfoVacant
}) => {

    const router = useRouter();
    const [formVacancies] = Form.useForm();
    const [showTurns, setShowTurns] = useState(false);
    const [listInterviewers, setListInterviewers] = useState([]);
    const { setValuesForm, createData } = useProcessInfo({
        formVacancies,
        info_vacant,
        setListInterviewers,
        listInterviewers
    });

    useEffect(()=>{
        if(Object.keys(info_vacant).length > 0 && action == 'edit'){
            setValuesForm();
            setShowTurns(info_vacant.rotative_turn);
        }
    },[info_vacant])

    // Se utiliza la api de crear para actualizar pasándole una id,
    // de la contratario estaría creando otro registro
    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.createVacant({...values, id: info_vacant.id});
            message.success('Vacante actualizada');
            getInfoVacant(info_vacant.id);
        } catch (e) {
            console.log(e)
            setLoadVacancies(false);
            message.error('Vacante no actualizada');
        }        
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createVacant({...values, node_id: currentNode.id});
            message.success('Vacante registrada');
            router.replace({
                pathname: '/jobbank/vacancies/edit',
                query: { id: response.data.id }
            })
        } catch (e) {
            console.log(e)
            setLoadVacancies(false);
            message.error('Vacante no registrada')
        }
    }

    const onFinish = (values) => {
        setLoadVacancies(true);
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
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
                        id='form-vacancies'
                        layout='vertical'
                        form={formVacancies}
                        onFinish={onFinish}
                        requiredMark={false}
                        initialValues={{
                            vo_bo: false,
                            rotative_turn: false,
                            requires_travel_availability: false
                        }}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane
                                tab='Características del puesto'
                                key='tab_1'
                            >
                                <Spin spinning={load_vacancies}>
                                    <TabFeatures
                                        showTurns={showTurns}
                                        setShowTurns={setShowTurns}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Educación, competencias y habilidades'
                                forceRender
                                key='tab_2'
                            >
                                <Spin spinning={load_vacancies}>
                                    <TabEducation/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Sueldo de prestaciones'
                                forceRender
                                key='tab_3'
                            >
                                <Spin spinning={load_vacancies}>
                                    <TabSalary/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Proceso de reclutamiento'
                                forceRender
                                key='tab_4'
                            >
                                <Spin spinning={load_vacancies}>
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
                    {/* <Button>
                        Cancelar
                    </Button> */}
                    <Button
                        form='form-vacancies'
                        htmlType='submit'
                        loading={load_vacancies}
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
        load_vacancies: state.jobBankStore.load_vacancies,
        info_vacant: state.jobBankStore.info_vacant,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setLoadVacancies,
        getInfoVacant
    }
)(DetailsVacancies);