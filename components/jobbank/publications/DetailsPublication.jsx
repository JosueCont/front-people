import React, {
    useEffect,
    useState
} from 'react';
import {
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import FormPublications from './FormPublications';
import { useInfoProfile } from '../hook/useInfoProfile';
import DetailsCustom from '../DetailsCustom';

const DetailsPublication = ({
    action,
    currentNode,
    currentUser,
    newFilters = {},
    list_connections_options,
    load_connections_options
}) => {

    const router = useRouter();
    const [formPublications] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [disableField, setDisabledField] = useState(false);
    const [infoPublication, setInfoPublication] = useState({});
    const [valuesDefault, setValuesDefault] = useState({});
    const [fetching, setFetching] = useState(false);
    const { createData, formatData } = useInfoProfile();

    useEffect(() => {
        if (router.query.id && action == 'edit') {
            getInfoPublication(router.query.id);
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoPublication).length > 0 && action == 'edit') {
            formPublications.resetFields();
            setValuesForm();
        }
    }, [infoPublication, list_connections_options])

    const getInfoPublication = async (id) => {
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

    const setValuesForm = () => {
        let selected = infoPublication.account_to_share?.length > 0 ? infoPublication.account_to_share : [];
        const filter_ = item => selected.includes(item.code) && item.is_active;
        let account_to_share = list_connections_options.filter(filter_).map(item => item.code);
        let existFields = Object.keys(infoPublication.fields).length > 0;
        let existFieldsName = infoPublication.profile && Object.keys(infoPublication.profile?.fields_name).length > 0;
        let results = existFields && !existFieldsName
            ? formatData(infoPublication.fields)
            : existFieldsName && !existFields
                ? formatData(infoPublication.profile.fields_name)
                : {};

        let all_info = {
            ...results,
            account_to_share,
            customer: infoPublication?.vacant?.customer?.id,
            vacant: infoPublication?.vacant?.id,
            profile: infoPublication.profile?.id ?? 'open_fields',
        }
        setValuesDefault(all_info)
        formPublications.setFieldsValue(all_info);
        if (infoPublication.profile) setDisabledField(true);
        else setDisabledField(false);
    }

    const onFinishUpdate = async (values) => {
        try {
            let body = { ...values, node: currentNode.id, created_by: currentUser.id };
            await WebApiJobBank.updatePublication(infoPublication.id, body);
            message.success('Publicación actualizada');
            getInfoPublication(infoPublication.id);
        } catch (e) {
            console.log(e)
            setFetching(false);
            message.error('Publicación no actualizada');
        }
    }

    const onFinishCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode.id, created_by: currentUser.id };
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

    const onFinish = (values) => {
        setFetching(true)
        let bodyData = createData(values, 'fields');
        if (bodyData.profile) bodyData.fields = {};
        let exist = Object.keys(bodyData.fields).length > 0;
        if (!bodyData.profile && !exist) {
            message.error('Seleccionar los campos de la publicación');
            setFetching(false)
            setLoading({})
            return;
        }
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () => {
        router.push({
            pathname: '/jobbank/publications',
            query: newFilters
        });
    }

    const actionCreate = () => {
        formPublications.resetFields();
        keepValues();
        setDisabledField(false);
        setFetching(false)
        setLoading({})
    }

    const actionSaveAnd = (id) => {
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/publications/edit',
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
        idForm: 'form-publications',
        titleCard: action == 'add'
            ? 'Registrar nueva publicación'
            : 'Información de la publicación'
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Spin spinning={fetching}>
                <Form
                    id='form-publications'
                    form={formPublications}
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={() => setLoading({})}
                >
                    <FormPublications
                        formPublications={formPublications}
                        disableField={disableField}
                        setDisabledField={setDisabledField}
                        valuesDefault={valuesDefault}
                    />
                </Form>
            </Spin>
        </DetailsCustom>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node,
        list_connections_options: state.jobBankStore.list_connections_options,
        load_connections_options: state.jobBankStore.load_connections_options,
    }
}

export default connect(mapState)(DetailsPublication);