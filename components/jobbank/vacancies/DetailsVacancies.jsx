import React, {
    useEffect,
    useState,
    useRef,
    useLayoutEffect
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
import TabRecruitment from './TabRecruitment';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useProcessInfo } from './hook/useProcessInfo';
import ListLangs from '../candidates/ListLangs';

const DetailsVacancies = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const rule_languages = {text:'', status:''};
    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formVacancies] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [listInterviewers, setListInterviewers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});
    const [currentKey, setCurrentKey] = useState('1');
    const { setValuesForm, createData } = useProcessInfo();
     //Idiomas
    const [currentValue, setCurrentValue] = useState([]);
    const [listLangDomain, setListLangDomain] = useState([]);
    const [ruleLanguages, setRuleLanguages] = useState(rule_languages);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoVacant(router.query.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoVacant).length > 0 && action == 'edit'){
            formVacancies.resetFields()
            let allValues = setValuesForm(infoVacant);
            formVacancies.setFieldsValue(allValues)
            let inters = allValues?.interviewers?.length > 0
                ? allValues.interviewers : [];
            let langs = allValues?.languages?.length > 0
                ? allValues.languages?.map(item => ({lang: item.lang, domain: item.domain}))
                : []; 
            setListInterviewers(inters)
            setListLangDomain(langs)
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
        bodyData.languages = listLangDomain;
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
        setCurrentValue([])
        setRuleLanguages(rule_languages)
        setListLangDomain([])
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
        if(querys['tab'] == '1') delete querys['tab'];
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
                            requires_travel_availability: false
                        }}
                    >
                        <Tabs
                            type='card'
                            activeKey={action == 'edit'
                                ? router.query?.tab ?? '1'
                                : currentKey
                            }
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
                                        hasEstrategy={infoVacant?.has_estrategy}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Educación, competencias y habilidades'
                                forceRender
                                key='2'
                            >
                                <Spin spinning={fetching}>
                                    <TabEducation formVacancies={formVacancies}>
                                        <ListLangs
                                            changeColor={true}
                                            listLangDomain={listLangDomain}
                                            setListLangDomain={setListLangDomain}
                                            setCurrentValue={setCurrentValue}
                                            currentValue={currentValue}
                                            setRuleLanguages={setRuleLanguages}
                                            ruleLanguages={ruleLanguages}
                                            rule_languages={rule_languages}
                                        />
                                    </TabEducation>
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
                            </Tabs.TabPane>
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