import React, { useEffect, useState, useRef } from 'react';
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
import { getInfoProfile, setLoadProfiles } from '../../../redux/jobBankDuck';
import { useProcessInfo } from './hook/useProcessInfo';

const DetailsProfiles = ({
    action,
    currentNode,
    info_profile,
    load_profiles,
    setLoadProfiles,
    getInfoProfile
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
    const { formatData, createData } = useProcessInfo();

    useEffect(()=>{
        if(router.query.customer && action == 'add'){
            setDisabledClient(true)
            let customer = router.query.customer;
            setFieldsValue({ customer })
        } else setDisabledClient(false)
    },[router])

    useEffect(()=>{
        if(Object.keys(info_profile).length > 0 && action == 'edit'){
            setValuesForm()
        }
    },[info_profile])

    const setValuesForm = () => {
        let result = formatData(info_profile.fields_name);
        let all_info = {
            ...result,
            name: info_profile.name,
            customer: info_profile.customer
        };
        if(info_profile.profile_type){
            all_info['profile_type'] = info_profile.profile_type.id;
            setDisabledField(!info_profile.profile_type.form_enable);
        }
        setValuesDefault(all_info);
        setFieldsValue(all_info);
    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateProfile(info_profile.id, {...values, node: currentNode.id});
            message.success('Perfil actualizado');
            getInfoProfile(info_profile.id)
            setDisabledField(false)
        } catch (e) {
            message.error('Perfil no actualizado');
            setLoadProfiles(false)
            console.log(e)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createProfile({...values, node: currentNode.id});
            message.success('Perfil registrado')
            actionSaveAnd(response.data.id)
            resetFields();
        } catch (e) {
            message.error('Perfil no registrado')
            setLoading({})
            setLoadProfiles(false)
            console.log(e)
        }
    }

    const onFinish = (values) => {
        setLoadProfiles(true);
        const bodyData = createData(values);
        if(Object.keys(bodyData.fields_name).length <= 0){
            message.error('Seleccionar los campos del perfil');
            setLoadProfiles(false);
            setLoading({})
            return false;
        }
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const actionAddCreate = () =>{
        setDisabledField(false)
        setLoadProfiles(false)
        setLoading({})
    }

    const actionBack = () =>{
        if(router.query?.customer) router.push('/jobbank/clients');
        else router.push('/jobbank/profiles');
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionAddCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/profiles/edit',
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
                            ? 'Registrar nuevo perfil'
                            : 'Información del perfil'
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
                    <Spin spinning={load_profiles}>
                        <Form
                            id='form-profiles'
                            form={formProfile}
                            onFinish={onFinish}
                            requiredMark={false}
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
                            loading={load_profiles}
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
        load_profiles: state.jobBankStore.load_profiles,
        info_profile: state.jobBankStore.info_profile,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setLoadProfiles,
        getInfoProfile
    }
)(DetailsProfiles);