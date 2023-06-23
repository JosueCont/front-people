import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    Spin,
    Tabs,
    Form,
    message
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DetailsCustom from '../DetailsCustom';
import TabFeatures from './TabFeatures';
import TabEducation from './TabEducation';
import TabSalary from './TabSalary';
import TabEvaluations from './TabEvaluations';
import { useInfoVacancy } from '../hook/useInfoVacancy';
import { EditorState } from 'draft-js';

const DetailsVacancies = ({
    currentNode,
    action,
    newFilters = {}
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');

    const [currentKey, setCurrentKey] = useState('1');
    const [infoVacant, setInfoVacant] = useState({});
    const [listInterviewers, setListInterviewers] = useState([]);

    const [formVacancies] = Form.useForm();
    const { setValuesForm, createData } = useInfoVacancy();

    const emptyHTML = EditorState.createEmpty();
    const initialHTML = {
        description: emptyHTML,
        language_activities: emptyHTML,
        knowledge: emptyHTML,
        experience: emptyHTML,
        technical_skills: emptyHTML,
        economic_benefits_description: emptyHTML,
        benefits: emptyHTML,
        rewards: emptyHTML,
        work_tools: emptyHTML
    }
    const [editorState, setEditorState] = useState(initialHTML);
    const [valueHTML, setValueHTML] = useState({});
    
    useEffect(() => {
        if (router.query.client && action == 'add') {
            formVacancies.resetFields()
            keepClient()
        }
    }, [router.query?.client])

    useEffect(() => {
        if (router.query.id && action == 'edit') {
            getInfoVacant(router.query.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoVacant).length > 0 && action == 'edit') {
            formVacancies.resetFields()
            let allValues = setValuesForm(infoVacant);
            formVacancies.setFieldsValue(allValues)
            let inters = allValues?.interviewers?.length > 0 ? allValues.interviewers : [];
            setListInterviewers(inters)
        }
    }, [infoVacant])

    const getInfoVacant = async (id) => {
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

    const onFinishCreate = async (values) => {
        try {
            let response = await WebApiJobBank.createVacant({ ...values, node_id: currentNode.id });
            message.success('Vacante registrada');
            actionSaveAnd(response.data.id)
        } catch (e) {
            console.log(e)
            setFetching(false);
            setLoading({})
            message.error('Vacante no registrada')
        }
    }

    // Se utiliza la api de crear para actualizar pasándole una id,
    // de la contratario estaría creando otro registro
    const onFinisUpdate = async (values) => {
        try {
            await WebApiJobBank.createVacant({
                ...values,
                id: router.query?.id,
                node_id: currentNode.id
            });
            message.success('Vacante actualizada');
            getInfoVacant(router.query?.id);
        } catch (e) {
            console.log(e)
            setFetching(false);
            message.error('Vacante no actualizada');
        }
    }

    const onFinish = async (values) => {
        setFetching(true);
        let bodyData = createData({...values, ...valueHTML});
        bodyData.interviewers = listInterviewers;
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const onFailed = (e) => {
        setLoading({})
        setLoading({})
        if (e.errorFields.length <= 0) return false;
        message.error(`Verificar que se ha seleccionado el Cliente
            e ingresado Nombre de la vacante y el Sueldo mensual bruto.`);
    }

    const keepClient = () => {
        formVacancies.setFieldsValue({
            customer_id: router.query.client
        })
    }

    const actionBack = () => {
        let url = router.query?.back
            ? `/jobbank/${router.query?.back}`
            : '/jobbank/vacancies';
        router.push({
            pathname: url,
            query: newFilters
        });
    }

    const actionCreate = () => {
        formVacancies.resetFields()
        if (router.query?.client) keepClient();
        setFetching(false)
        setLoading({})
        setValueHTML({})
        setEditorState(initialHTML)
    }

    const actionSaveAnd = (id) => {
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/vacancies/edit',
                query: { ...newFilters, id }
            })
        }
        actionFunction[actionType]();
    }

    const onChangeTab = (tab) => {
        if (action == 'add') {
            setCurrentKey(tab)
            return;
        }
        router.replace({
            pathname: '/jobbank/vacancies/edit',
            query: { ...router.query, tab }
        }, undefined, { shallow: true })
    }

    const activeKey = useMemo(() => {
        let tab = router.query?.tab;
        return action == 'edit'
            ? tab ? tab : '1'
            : currentKey;
    }, [router.query?.tab, currentKey, action])

    const propsCustom = {
        action,
        loading,
        fetching,
        setLoading,
        actionBack,
        setActionType,
        showOptions: activeKey != '4',
        idForm: 'form-vacancies',
        titleCard: action == 'add'
            ? 'Registrar nueva vacante'
            : 'Información de la vacante',
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Form
                id='form-vacancies'
                form={formVacancies}
                layout='vertical'
                onFinish={onFinish}
                onFinishFailed={onFailed}
                className='tabs-vacancies'
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
                                infoVacant={infoVacant}
                                setEditorState={setEditorState}
                                editorState={editorState}
                                setValueHTML={setValueHTML}
                            />
                        </Spin>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab='Educación, competencias y habilidades'
                        forceRender
                        key='2'
                    >
                        <Spin spinning={fetching}>
                            <TabEducation
                                formVacancies={formVacancies}
                                infoVacant={infoVacant}
                                setEditorState={setEditorState}
                                editorState={editorState}
                                setValueHTML={setValueHTML}
                            />
                        </Spin>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab='Sueldo y prestaciones'
                        forceRender
                        key='3'
                    >
                        <Spin spinning={fetching}>
                            <TabSalary
                                formVacancies={formVacancies}
                                infoVacant={infoVacant}
                                setEditorState={setEditorState}
                                editorState={editorState}
                                setValueHTML={setValueHTML}
                                initialHTML={initialHTML}
                            />
                        </Spin>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab='Evaluaciones'
                        forceRender
                        disabled={Object.keys(infoVacant)?.length <= 0}
                        key='4'
                    >
                        <TabEvaluations />
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </DetailsCustom>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsVacancies);