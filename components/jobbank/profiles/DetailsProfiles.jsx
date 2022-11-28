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
import WebApiJobBank from '../../../api/WebApiJobBank';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import FormProfiles from './FormProfiles';
import { useProcessInfo } from './hook/useProcessInfo';

const DetailsProfiles = ({
    action,
    currentNode,
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formProfile] = Form.useForm();
    const { setFieldsValue, resetFields } = formProfile;
    const [disabledClient, setDisabledClient] = useState(false);
    const [valuesDefault, setValuesDefault] = useState({});
    const [disabledField, setDisabledField] = useState(false);
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [infoProfile, setInfoProfile] = useState({});
    const [fetching, setFetching] = useState(false);
    const { formatData, createData } = useProcessInfo();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoProfile(router.query.id);
        }
    },[router])

    useEffect(()=>{
        if(router.query.client && action == 'add'){
            resetFields()
            keepClient()
        } else setDisabledClient(false)
    },[router])

    useEffect(()=>{
        if(Object.keys(infoProfile).length > 0 && action == 'edit'){
            resetFields()
            setValuesForm()
        }
    },[infoProfile])

    const getInfoProfile = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoProfile(id);
            setInfoProfile(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const keepClient = () =>{
        setDisabledClient(true)
        let customer = router.query.client;
        setFieldsValue({ customer })
    }

    const setValuesForm = () => {
        let result = formatData(infoProfile.fields_name);
        let all_info = {
            ...result,
            name: infoProfile.name,
            customer: infoProfile.customer
        };
        if(infoProfile.profile_type){
            all_info['profile_type'] = infoProfile.profile_type.id;
            setDisabledField(!infoProfile.profile_type.form_enable);
        }else setDisabledField(false);
        setValuesDefault(all_info);
        setFieldsValue(all_info);
    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateProfile(infoProfile.id, {...values, node: currentNode.id});
            message.success('Template actualizado');
            getInfoProfile(infoProfile.id)
        } catch (e) {
            if(e.response?.data?.message == 'Este nombre ya existe'){
                message.error(e.response?.data?.message);
            } else message.error('Template no actualizado');
            setFetching(false)
            console.log(e)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createProfile({...values, node: currentNode.id});
            message.success('Template registrado')
            actionSaveAnd(response.data.id)
        } catch (e) {
            if(e.response?.data?.message == 'Este nombre ya existe'){
                message.error(e.response?.data?.message);
            } else message.error('Template no registrado');
            setLoading({})
            setFetching(false)
            console.log(e)
        }
    }

    const onFinish = (values) => {
        setFetching(true);
        const bodyData = createData(values, 'fields_name');
        if(Object.keys(bodyData.fields_name).length <= 0){
            message.error('Seleccionar los campos del template');
            setFetching(false);
            setLoading({})
            return false;
        }
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const actionCreate = () =>{
        resetFields();
        if(router.query?.client) keepClient();
        setDisabledField(false)
        setFetching(false)
        setLoading({})
    }

    const getNewFilters = () =>{
        let newFilters = {...router.query};
        if(newFilters.id) delete newFilters.id;
        if(newFilters.client) delete newFilters.client;
        return newFilters;
    }

    const actionBack = () =>{
        let filters = getNewFilters();
        if(router.query?.client) router.push({
            pathname: '/jobbank/clients',
            query: filters
        });
        else router.push({
            pathname: '/jobbank/profiles',
            query: filters
        });
    }

    const actionEdit = (id) =>{
        let filters = getNewFilters();
        router.replace({
            pathname: '/jobbank/profiles/edit',
            query: {...filters, id }
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: actionEdit
        }
        actionFunction[actionType](id);
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
                            ? 'Registrar nuevo template'
                            : 'Información del template'
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
                            id='form-profiles'
                            form={formProfile}
                            onFinish={onFinish}
                            // requiredMark={false}
                            onFinishFailed={()=> setLoading({})}
                            initialValues={{profile_type: 'open_fields'}}
                        >
                            <FormProfiles
                                valuesDefault={valuesDefault}
                                formProfile={formProfile}
                                disabledClient={disabledClient}
                                disabledField={disabledField}
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
                                form='form-profiles'
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
                            form='form-profiles'
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

export default connect(mapState)(DetailsProfiles);