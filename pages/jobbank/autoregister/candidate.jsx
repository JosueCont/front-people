import React, { useEffect, useMemo, useState } from 'react';
import {
    Form,
    Spin,
    message
} from 'antd';
import Router, { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getListStates,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import {
    ArrowLeftOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import WebApiJobBank from '../../../api/WebApiJobBank';
import FormGeneral from '../../../components/jobbank/candidates/FormGeneral';
import { useInfoCandidate } from '../../../components/jobbank/hook/useInfoCandidate';
import { deleteFiltersJb } from '../../../utils/functions';
import MainSearch from '../../../components/jobbank/search/MainSearch';
import VacantHead from '../../../components/jobbank/search/vacant/VacantHead';
import {
    SearchBtn,
    ButtonPrimary,
} from '../../../components/jobbank/search/SearchStyled';
import VacantMessage from '../../../components/jobbank/search/vacant/VacantMessage';

const candidate = ({
    currentNode,
    getListStates,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [formCandidate] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    const [fileCV, setFileCV] = useState([]);
    const [loadVacant, setLoadVacant] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});
    const [filters, setFilters] = useState({});
    const [redirect, setRedirect] = useState(false);
    const { createData } = useInfoCandidate({
        fileCV, isAutoRegister: true
    });

    useEffect(() => {
        if (Object.keys(router.query)?.length <= 0) return;
        setFilters(deleteFiltersJb({ ...router.query }, ['back', 'type']))
        if (!router.query?.vacant) return;
        getInfoVacant(router.query?.vacant)
    }, [router.query])

    useEffect(() => {
        if (!currentNode) return;
        getListStates(currentNode?.id);
        getConnectionsOptions(currentNode?.id, '&conection_type=2');
    }, [currentNode])

    useEffect(() => {
        if (!currentNode || redirect) return;
        if (Object.keys(infoVacant)?.length <= 0) return;
        if (currentNode?.id !== infoVacant?.node) {
            setRedirect(true)
            setTimeout(() => {
                message.error('Vacante no encontrada')
                Router.push('/jobbank/search');
            }, 2000)
        } else {
            setRedirect(false)
            setTimeout(() => {
                setLoadVacant(false)
                formCandidate.setFieldsValue({
                    vacant: router.query?.vacant
                })
                return;
            }, 1000)
        }
    }, [currentNode, infoVacant])

    const updatePage = (filters = {}) => router.replace({
        pathname: '/jobbank/autoregister/candidate',
        query: filters
    }, undefined, { shallow: true });

    const getInfoVacant = async (id) => {
        try {
            setLoadVacant(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setInfoVacant(response.data)
        } catch (e) {
            console.log(e)
            setLoadVacant(false)
            setInfoVacant({})
        }
    }

    const onFinish = async (values) => {
        try {
            setFetching(true)
            if (values.birthdate) values.birthdate = values.birthdate?.format('YYYY-MM-DD');
            await WebApiJobBank.createCandidate(createData(values));
            setTimeout(() => {
                formCandidate.resetFields();
                setFetching(false);
                setFileCV([]);
                updatePage({ ...router.query, type: 'success' });
            }, 2000)
        } catch (e) {
            console.log(e)
            setFetching(false);
            let error = e.response?.data?.email;
            let txt = e.response?.data?.message;
            let msg = txt ? txt : error
                ? 'Este correo ya existe'
                : router.query?.vacant
                    ? 'Postulación no registrada'
                    : 'Candidato no registrado';
            message.error(msg);
        }
    }

    const actionBack = (type = 1) => {
        let base = '/jobbank/search/';
        let url = type == 1 ? `${base}${router.query?.back}` : base;
        router.push({
            pathname: url,
            query: type == 1 ? filters : {}
        })
    }

    const actions = (
        <>
            {!!router.query?.back && (
                <SearchBtn
                    type='button'
                    disabled={fetching || loadVacant}
                    onClick={() => actionBack(1)}
                >
                    <ArrowLeftOutlined />
                    <span>Regresar</span>
                </SearchBtn>
            )}
            <ButtonPrimary
                type='submit'
                form='form-candidate'
                disabled={fetching || loadVacant}
                role={fetching ? 'loading' : ''}
            >
                {fetching ? <LoadingOutlined /> : <></>}
                <span>Guardar</span>
            </ButtonPrimary>
        </>
    )

    const title = useMemo(() => {
        if (Object.keys(infoVacant)?.length <= 0) return 'Postulación a vacante';
        let customer = infoVacant?.show_customer_name ? `(${infoVacant?.customer?.name})` : '';
        return `Postulación a ${infoVacant?.job_position} ${customer}`;
    }, [infoVacant, router.query?.vacant])

    return (
        <>
            <MainSearch
                showLogo={!router.query?.type}
            >
                {router.query?.type == 'success' ? (
                    <VacantMessage actionBack={actionBack} />
                ) : (
                    <>
                        <VacantHead
                            loading={loadVacant}
                            title={router.query?.vacant ? title : 'Registro de candidato'}
                            actions={actions}
                        />
                        <div style={{
                            padding: '12px 24px',
                            backgroundColor: '#ffff',
                            borderRadius: 10
                        }}>
                            <Form
                                id='form-candidate'
                                layout='vertical'
                                form={formCandidate}
                                onFinish={onFinish}
                                disabled={loadVacant}
                            >
                                <Spin spinning={fetching}>
                                    <FormGeneral
                                        optionVacant={Object.keys(infoVacant)?.length > 0 ? [infoVacant] : []}
                                        loadVacant={loadVacant}
                                        formCandidate={formCandidate}
                                        showVacant={!!router.query?.vacant}
                                        setFileCV={setFileCV}
                                        infoCandidate={{}}
                                    />
                                </Spin>
                            </Form>
                        </div>
                    </>
                )}
            </MainSearch>
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
    getListStates,
    getConnectionsOptions
}
)(candidate);