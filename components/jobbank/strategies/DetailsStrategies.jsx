import React, {
    useEffect,
    useState,
} from 'react';
import {
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import FormStrategies from './FormStrategies';
import { useInfoStrategy } from '../hook/useInfoStrategy';
import DetailsCustom from '../DetailsCustom';

const DetailsStrategies = ({
    action,
    currentNode,
    newFilters = {}
}) => {

    const router = useRouter();
    const [formStrategies] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [infoStrategy, setInfoStrategy] = useState({});
    const [fetching, setFetching] = useState(false);
    const [optionVacant, setOptionVacant] = useState([]);
    const { createData, setValuesForm } = useInfoStrategy();

    useEffect(() => {
        if (router.query.id && action == 'edit') {
            getInfoStrategy(router.query.id);
        }
    }, [router.query?.id])

    useEffect(() => {
        if (router.query.client && action == 'add') {
            formStrategies.resetFields()
            keepClient()
        }
    }, [router.query])

    useEffect(() => {
        if (Object.keys(infoStrategy).length > 0 && action == 'edit') {
            formStrategies.resetFields();
            let allValues = setValuesForm(infoStrategy);
            if (Object.keys(allValues.vacant).length > 0) {
                setOptionVacant([allValues.vacant])
                allValues.vacant = allValues.vacant.id;
            }
            formStrategies.setFieldsValue(allValues);
        }
    }, [infoStrategy])


    const getInfoStrategy = async (id) => {
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoStrategy(id);
            setInfoStrategy(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const keepClient = () => {
        formStrategies.setFieldsValue({
            customer: router.query.client
        })
    }

    const onFinishUpdate = async (values) => {
        try {
            await WebApiJobBank.updateStrategy(infoStrategy.id, values);
            message.success('Estrategia actualizada');
            getInfoStrategy(infoStrategy.id);
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Estrategia no actualizada';
            message.error(msgError);
            setFetching(false);
        }
    }

    const onFinishCreate = async (values) => {
        try {
            let response = await WebApiJobBank.createStrategy({ ...values, node: currentNode.id });
            message.success('Estrategia registrada');
            actionSaveAnd(response.data.id)
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Estrategia no registrada';
            message.error(msgError);
            setFetching(false)
            setLoading({})
        }
    }

    const onFinish = (values) => {
        setFetching(true)
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () => {
        let url = router.query?.back
            ? `/jobbank/${router.query?.back}`
            : '/jobbank/strategies';
        router.push({
            pathname: url,
            query: newFilters
        });
    }

    const actionCreate = () => {
        formStrategies.resetFields();
        if (router.query?.client) keepClient();
        setFetching(false)
        setLoading({})
    }

    const actionSaveAnd = (id) => {
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/strategies/edit',
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
        idForm: 'form-strategies',
        titleCard: action == 'add'
            ? 'Registrar nueva estrategia'
            : 'Información de la estrategia'
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Spin spinning={fetching}>
                <Form
                    id='form-strategies'
                    form={formStrategies}
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={() => setLoading({})}
                >
                    <FormStrategies
                        infoStrategy={infoStrategy}
                        optionVacant={optionVacant}
                        formStrategies={formStrategies}
                        disabledClient={router.query?.client}
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

export default connect(mapState)(DetailsStrategies);