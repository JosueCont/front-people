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
import WebApiJobBank from '../../../api/WebApiJobBank';
import FormPublications from './FormPublications';
import { useProcessInfo } from '../profiles/hook/useProcessInfo';
import {
    setLoadStrategies,
    getInfoStrategy,
    setInfoStrategy,
    setLoadPublications,
    getInfoPublication,
    setInfoPublication
} from '../../../redux/jobBankDuck';

const DetailsPublication = ({
    action,
    currentNode,
    currentUser,
    load_publications,
    info_publication,
    setLoadPublications,
    getInfoPublication,
    setInfoPublication,
    list_vacancies_options
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const btnSave = useRef(null);
    const router = useRouter();
    const [formPublications] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [disableField, setDisabledField] = useState(true);
    const [disabledVacant, setDisabledVacant] = useState(false);
    const { createData, formatData } = useProcessInfo();

    useLayoutEffect(()=>{
        setInfoPublication()
    },[])

    useEffect(()=>{
        if(router.query.vacant && action == 'add'){
            formPublications.resetFields()
            keepVacant();
        }else setDisabledVacant(false);
    },[router])

    useEffect(()=>{
        if(Object.keys(info_publication).length > 0 && action == 'edit'){
            formPublications.resetFields();
            setValuesForm();
        }
    },[info_publication])

    const keepVacant = () =>{
        setDisabledVacant(true);
        formPublications.setFieldsValue({
            vacant: router.query.vacant
        })
    }

    const clientByVacant = (vacant) =>{
        if(!vacant) return null;
        const _find = item => item.id == vacant;
        let result = list_vacancies_options.find(_find);
        if(!result) return null;
        if(!result.customer) return null;
        return result.customer.id;
    }

    const setValuesForm = () =>{
        let results = {};
        let customer = clientByVacant(info_publication.vacant);
        let haveFields = Object.keys(info_publication.fields).length > 0;
        if(haveFields) results = formatData(info_publication.fields);
        let all_info = {
            ...results, customer,
            vacant: info_publication.vacant,
            profile: info_publication.profile ?? 'open_fields',
            code_post: info_publication.code_post
        }
        formPublications.setFieldsValue(all_info);
        if(info_publication.profile) setDisabledField(true);
        else setDisabledField(false);
    }

    const onFinishUpdate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id, created_by: currentUser.id};
            await WebApiJobBank.updatePublication(info_publication.id, body);
            message.success('Publicación registrada');
            getInfoPublication(info_publication.id);
        } catch (e) {
            console.log(e)
            setLoadPublications(false);
            message.error('Publicación no actualizada');
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id, created_by: currentUser.id};
            let response = await WebApiJobBank.createPublication(body);
            message.success('Publicación registrada');
            actionSaveAnd(response.data.id);
        } catch (e) {
            console.log(e)
            setLoadPublications(false);
            setLoading({});
            message.error('Publicación no registrada');
        }
    }

    const onFinish = (values) =>{
        setLoadPublications(true)
        let bodyData = createData(values, 'fields');
        if(bodyData.profile) bodyData.fields = {};
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () =>{
        if(router.query?.vacant) router.push('/jobbank/vacancies');
        else router.push('/jobbank/publications');
    }

    const actionCreate = () =>{
        formPublications.resetFields();
        if (router.query?.vacant) keepVacant();
        setDisabledField(false);
        setLoadStrategies(false)
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/publications/edit',
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
                <Col span={24} className='title-action-content title-action-border'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva publicación'
                            : 'Información de la publicación'
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
                    <Spin spinning={load_publications}>
                        <Form
                            id='form-publications'
                            form={formPublications}
                            layout='vertical'
                            onFinish={onFinish}
                            onFinishFailed={()=> setLoading({})}
                        >
                            <FormPublications
                                disabledVacant={disabledVacant}
                                formPublications={formPublications}
                                disableField={disableField}
                                setDisabledField={setDisabledField}
                            />
                        </Form>
                    </Spin>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-publications'
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
                            form='form-publications'
                            htmlType='submit'
                            loading={load_publications}
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
        load_publications: state.jobBankStore.load_publications,
        info_publication: state.jobBankStore.info_publication,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setLoadPublications,
        getInfoPublication,
        setInfoPublication
    }
)(DetailsPublication);