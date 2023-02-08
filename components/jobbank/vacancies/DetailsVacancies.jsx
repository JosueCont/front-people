import React, {
    useEffect,
    useState,
    useRef,
    useMemo
} from 'react';
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
import TabEvaluations from './TabEvaluations';
import TabRecruitment from './TabRecruitment';
import WebApiJobBank from '../../../api/WebApiJobBank';;
import { useInfoVacancy } from '../hook/useInfoVacancy';

const DetailsVacancies = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formVacancies] = Form.useForm();
    const [idVacant, setIdVacant ] = useState(null)
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [listInterviewers, setListInterviewers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});
    const [currentKey, setCurrentKey] = useState('1');
    const [evaluationList, setEvaluationList] = useState([]);
    const { setValuesForm, createData } = useInfoVacancy();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoVacant(router.query.id)
            getEvaluationsVacant(router.query.id)
            setIdVacant(router.query.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoVacant).length > 0 && action == 'edit'){
            formVacancies.resetFields()
            let allValues = setValuesForm(infoVacant);
            formVacancies.setFieldsValue(allValues)
            let inters = allValues?.interviewers?.length > 0 ? allValues.interviewers : [];
            setListInterviewers(inters)
        }
    },[infoVacant])

    useEffect(()=>{
        if(router.query.client && action == 'add'){
            formVacancies.resetFields()
            keepClient()
        }
    },[router.query])


    const getInfoVacant = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setInfoVacant(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const getEvaluationsVacant = async (id) => {
        try {
            setFetching(true)
            let response = await WebApiJobBank.getEvaluationsVacant(id)
            setEvaluationList(response.data.results)
        } catch (e) {
            console.log(e)
        } finally {
            setFetching(false)
        }
    }

    const addEvaluations = async (values) => {
        let data = new FormData()
        data.append('vacant', router.query.id)
        data.append('name', values.name)
        data.append('source', values.source)
        data.append('url', values.url)
        data.append('instructions', values.instructions)
        data.append('is_active', values.is_active)

        try {
            let response = await WebApiJobBank.addEvaluationVacant(data)
            if (response) {
                getEvaluationsVacant(router.query.id)
            }
            message.success('Evaluación agregada')
        } catch (error) {
            console.log('Error', error)
            message.error('Error al agregar evaluación')
        }
    }

    const updateEvaluation = async (id, values) => {

        console.log('Values', values)

        let data = new FormData()
        data.append('vacant', router.query.id)
        data.append('name', values.name)
        data.append('source', values.source)
        data.append('url', values.url)
        data.append('instructions', values.instructions)
        data.append('is_active', values.is_active)

        try {
            let response = await WebApiJobBank.updateEvaluation(id, data)
            if(response){
                getEvaluationsVacant(router.query.id)
            }
            message.success('Evaluación editada')
        } catch (error) {
            console.log('Error -->', error)
            message.error('Error al editar evaluación')
        }
    }

    const deleteEvaluation = async (id) => {
        try {
            let response = await WebApiJobBank.deleteEvaluation(id)
            if(response){
                getEvaluationsVacant(router.query.id)
            }
            message.success('Evaluacion eliminada')
        } catch (error) {
            console.log('Error -->', error)
            message.error('Error al eliminar evaluación')
        }
    }

    const changeEvaluationstatus = async (id, status) => {
        
        let data = new FormData()
        data.append('is_active', status)

        try {
            let response = await WebApiJobBank.updateStatusEvaluation(id, data)
            if(response){
                getEvaluationsVacant(router.query.id)
            }
            message.success('Estatus de evaluación editada')

        } catch (error) {
            console.log('Error -->', error)
            message.error('Error al editar estatus de la evaluación')
        }
    }


    const keepClient = () =>{
        formVacancies.setFieldsValue({
            customer_id: router.query.client
        })
    }

    // Se utiliza la api de crear para actualizar pasándole una id,
    // de la contratario estaría creando otro registro
    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.createVacant({
                ...values,
                id: infoVacant.id,
                node_id: currentNode.id
            });
            message.success('Vacante actualizada');
            getInfoVacant(infoVacant.id);
        } catch (e) {
            console.log(e)
            setFetching(false);
            message.error('Vacante no actualizada');
        }        
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createVacant({...values, node_id: currentNode.id});
            message.success('Vacante registrada');
            actionSaveAnd(response.data.id)
        } catch (e) {
            console.log(e)
            setFetching(false);
            setLoading({})
            message.error('Vacante no registrada')
        }
    }



    const onFinish = (values) => {
        setFetching(true);
        let bodyData = createData(values);
        bodyData.interviewers = listInterviewers;
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const onFinishFailed = (e) =>{
        setLoading({})
        if(e.errorFields.length <= 0) return false;
        message.error(`Verificar que se ha seleccionado el Cliente
            e ingresado Nombre de la vacante y el Sueldo mensual bruto.`);
    }

    const actionCreate = () =>{
        formVacancies.resetFields()
        if (router.query?.client) keepClient();
        setFetching(false)
        setLoading({})
    }

    const actionBack = () =>{
        if(router.query?.client) router.push({
            pathname: '/jobbank/clients',
            query: newFilters
        });
        else router.push({
            pathname: '/jobbank/vacancies',
            query: newFilters
        });
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/vacancies/edit',
                query: {...newFilters, id }
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

    const onChangeTab = (tab) =>{
        if(action == 'add'){
            setCurrentKey(tab)
            return;
        }
        let querys = {...router.query, tab};
        if(querys.tab == '1') delete querys.tab;
        router.replace({
            pathname: `/jobbank/vacancies/${action}`,
            query: querys
        }, undefined, {shallow: true})
    }

    const activeKey = useMemo(()=>{
        let tab = router.query?.tab;
        return action == 'edit'
            ? tab ? tab : '1'
            : currentKey;
    },[router.query, currentKey, action])

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
                        onClick={()=> actionBack()}
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
                        onFinishFailed={onFinishFailed}
                        // requiredMark={false}
                        initialValues={{
                            vo_bo: false,
                            rotative_turn: false,
                            requires_travel_availability: false,
                            languages: []
                        }}
                    >
                        <Tabs
                            type='card'
                            activeKey={activeKey}
                            onChange={onChangeTab}
                        >
                            <Tabs.TabPane
                                tab='Características del puesto'
                                forceRender
                                key='1'
                            >
                                <Spin spinning={fetching}>
                                    <TabFeatures
                                        formVacancies={formVacancies}
                                        disabledClient={router.query?.client}
                                        hasEstrategy={infoVacant?.has_strategy}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Educación, competencias y habilidades'
                                forceRender
                                key='2'
                            >
                                <Spin spinning={fetching}>
                                    <TabEducation formVacancies={formVacancies}/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Sueldo y prestaciones'
                                forceRender
                                key='3'
                            >
                                <Spin spinning={fetching}>
                                    <TabSalary formVacancies={formVacancies}/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Evaluaciones'
                                forceRender
                                key='4'
                            >
                                <Spin spinning={fetching}>
                                    <TabEvaluations 
                                        evaluationList={evaluationList}
                                        setEvaluationList={setEvaluationList}
                                        idVacant = { idVacant? idVacant : null }
                                        addEvaluationVacant = { addEvaluations }
                                        updateEvaluation = { updateEvaluation }
                                        deleteEvaluation = {deleteEvaluation}
                                        changeEvaluationstatus = {changeEvaluationstatus}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            {/* <Tabs.TabPane
                                tab='Proceso de reclutamiento'
                                forceRender
                                key='4'
                            >
                                <Spin spinning={fetching}>
                                    <TabRecruitment
                                        setListInterviewers={setListInterviewers}
                                        listInterviewers={listInterviewers}
                                    />
                                </Spin>
                            </Tabs.TabPane> */}
                        </Tabs>
                    </Form>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-vacancies'
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
                                Guardar y registrar otra
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
                            form='form-vacancies'
                            htmlType='submit'
                            loading={fetching}
                        >
                            Actualizar
                        </Button>
                    )}
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

export default connect(mapState)(DetailsVacancies);