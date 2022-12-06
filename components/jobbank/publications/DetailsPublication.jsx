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

const DetailsPublication = ({
    action,
    currentNode,
    currentUser,
    newFilters = {}
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
    const [disableField, setDisabledField] = useState(false);
    const [disabledVacant, setDisabledVacant] = useState(false);
    const [infoPublication, setInfoPublication] = useState({});
    const [valuesDefault, setValuesDefault] = useState({});
    const [fetching, setFetching] = useState(false);
    const { createData, formatData } = useProcessInfo();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoPublication(router.query.id);
        }
    },[router])

    useEffect(()=>{
        if(router.query.vacancy && action == 'add'){
            formPublications.resetFields()
            keepVacancy();
        }else setDisabledVacant(false);
    },[router])

    useEffect(()=>{
        if(Object.keys(infoPublication).length > 0 && action == 'edit'){
            formPublications.resetFields();
            setValuesForm();
        }
    },[infoPublication])

    const getInfoPublication = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoPublication(id);
            setInfoPublication(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const keepVacancy = () =>{
        setDisabledVacant(true);
        formPublications.setFieldsValue({
            vacant: router.query.vacancy
        })
    }

    const setValuesForm = () =>{
        let results = {};
        let existFields = Object.keys(infoPublication.fields).length > 0;
        let existFieldsName = infoPublication.profile && Object.keys(infoPublication.profile?.fields_name).length > 0;
        if(existFields && !existFieldsName) results = formatData(infoPublication.fields);
        if(existFieldsName && !existFields) results = formatData(infoPublication.profile.fields_name);
        let all_info = {
            ...results,
            vacant: infoPublication.vacant,
            profile: infoPublication.profile?.id ?? 'open_fields',
            code_post: infoPublication.code_post
        }
        setValuesDefault(all_info)
        formPublications.setFieldsValue(all_info);
        if(infoPublication.profile) setDisabledField(true);
        else setDisabledField(false);
    }

    const onFinishUpdate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id, created_by: currentUser.id};
            await WebApiJobBank.updatePublication(infoPublication.id, body);
            message.success('Publicación actualizada');
            getInfoPublication(infoPublication.id);
        } catch (e) {
            console.log(e)
            setFetching(false);
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
            setFetching(false);
            setLoading({});
            message.error('Publicación no registrada');
        }
    }

    const onFinish = (values) =>{
        setFetching(true)
        let bodyData = createData(values, 'fields');
        if(bodyData.profile) bodyData.fields = {};
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () =>{
        if(router.query?.vacancy) router.push({
            pathname: '/jobbank/vacancies',
            query: newFilters
        });
        else router.push({
            pathname: '/jobbank/publications',
            query: newFilters
        });
    }

    const actionCreate = () =>{
        formPublications.resetFields();
        if (router.query?.vacancy) keepVacancy();
        setDisabledField(false);
        setFetching(false)
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/publications/edit',
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
                    <Spin spinning={fetching}>
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
                                valuesDefault={valuesDefault}
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
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsPublication);