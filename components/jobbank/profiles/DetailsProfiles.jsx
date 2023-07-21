import React, {
    useEffect,
    useState
} from 'react';
import {
    Form,
    Spin,
    message
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import FormProfiles from './FormProfiles';
import { useInfoProfile } from '../hook/useInfoProfile';
import DetailsCustom from '../DetailsCustom';

const DetailsProfiles = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const router = useRouter();
    const [formProfile] = Form.useForm();
    const [valuesDefault, setValuesDefault] = useState({});
    const [disabledField, setDisabledField] = useState(false);
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [infoProfile, setInfoProfile] = useState({});
    const [fetching, setFetching] = useState(false);
    const { formatData, createData } = useInfoProfile();

    useEffect(() => {
        if (router.query.id && action == 'edit') {
            getInfoProfile(router.query.id);
        }
    }, [router.query?.id])

    useEffect(() => {
        if (router.query.client && action == 'add') {
            formProfile.resetFields()
            keepClient()
        }
    }, [router.query])

    useEffect(() => {
        if (Object.keys(infoProfile).length > 0 && action == 'edit') {
            formProfile.resetFields()
            setValuesForm()
        }
    }, [infoProfile])

    const getInfoProfile = async (id) => {
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

    const keepClient = () => {
        let customer = router.query?.client;
        formProfile.setFieldsValue({ customer })
    }

    const setValuesForm = () => {
        let result = formatData(infoProfile.fields_name);
        let all_info = {
            ...result,
            name: infoProfile.name,
            customer: infoProfile.customer
        };
        if (infoProfile.profile_type) {
            all_info['profile_type'] = infoProfile.profile_type.id;
            setDisabledField(!infoProfile.profile_type.form_enable);
        } else setDisabledField(false);
        setValuesDefault(all_info);
        formProfile.setFieldsValue(all_info);
    }

    const onFinisUpdate = async (values) => {
        try {
            await WebApiJobBank.updateProfile(infoProfile.id, { ...values, node: currentNode.id });
            message.success('Template actualizado');
            getInfoProfile(infoProfile.id)
        } catch (e) {
            let msgApi = e.response?.data?.message;
            let msg = msgApi ?? 'Template no actualizado';
            message.error(msg);
            setFetching(false)
            console.log(e)
        }
    }

    const onFinishCreate = async (values) => {
        try {
            let response = await WebApiJobBank.createProfile({ ...values, node: currentNode.id });
            message.success('Template registrado')
            actionSaveAnd(response.data.id)
        } catch (e) {
            let msgApi = e.response?.data?.message;
            let msg = msgApi ?? 'Template no registrado';
            message.error(msg);
            setLoading({})
            setFetching(false)
            console.log(e)
        }
    }

    const onFinish = (values) => {
        setFetching(true);
        const bodyData = createData(values, 'fields_name');
        if (Object.keys(bodyData.fields_name).length <= 0) {
            message.error('Seleccionar los campos del template');
            setFetching(false);
            setLoading({})
            return;
        }
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const actionCreate = () => {
        formProfile.resetFields();
        if (router.query?.client) keepClient();
        setDisabledField(false)
        setFetching(false)
        setLoading({})
    }

    const actionBack = () => {
        let url = router.query?.back
            ? `/jobbank/${router.query?.back}`
            : '/jobbank/profiles';
        router.push({
            pathname: url,
            query: newFilters
        });
    }

    const actionSaveAnd = (id) => {
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/profiles/edit',
                query: { ...newFilters, id }
            })
        }
        actionFunction[actionType]();
    }

    const propsCustom = {
        action,
        loading,
        fetching,
        setLoading,
        actionBack,
        setActionType,
        idForm: 'form-profiles',
        titleCard: action == 'add'
            ? 'Registrar nuevo template'
            : 'Información del template'
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Spin spinning={fetching}>
                <Form
                    id='form-profiles'
                    layout='vertical'
                    form={formProfile}
                    onFinish={onFinish}
                    onFinishFailed={() => setLoading({})}
                    initialValues={{ profile_type: 'open_fields' }}
                >
                    <FormProfiles
                        valuesDefault={valuesDefault}
                        formProfile={formProfile}
                        disabledClient={router.query?.client}
                        disabledField={disabledField}
                        setDisabledField={setDisabledField}
                    />
                </Form>
            </Spin>
        </DetailsCustom>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsProfiles);