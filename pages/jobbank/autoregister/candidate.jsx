import React, { useEffect, useMemo, useState } from 'react';
import { Form, Spin, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getListStates,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import {
    CheckCircleFilled
} from '@ant-design/icons';
import styled from '@emotion/styled';
import WebApiJobBank from '../../../api/WebApiJobBank';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import DetailsCustom from '../../../components/jobbank/DetailsCustom';
import FormGeneral from '../../../components/jobbank/candidates/FormGeneral';
import { useInfoCandidate } from '../../../components/jobbank/hook/useInfoCandidate';
import { deleteFiltersJb } from '../../../utils/functions';

const ContentMsg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 134px);
`;

const ContentVertical = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;
    gap: ${({ gap }) => gap ? `${gap}px` : '0px'};
`;

const candidate = ({
    currentNode,
    getListStates,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const textTitle = 'Postulación a vacante';
    const [formCandidate] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    const [fileCV, setFileCV] = useState([]);
    const [loadVacant, setLoadVacant] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});
    const [filters, setFilters] = useState({});
    const { createData } = useInfoCandidate({
        fileCV, isAutoRegister: true
    });

    useEffect(() => {
        if(Object.keys(router.query)?.length <=0) return;
        setFilters(deleteFiltersJb({...router.query}, ['back']))
        if (!router.query?.vacant) return;
        getInfoVacant(router.query?.vacant)
        formCandidate.setFieldsValue({
            vacant: router.query?.vacant
        })
    }, [router.query])

    useEffect(() => {
        if (Object.keys(infoVacant)?.length <= 0) return;
        getListStates(infoVacant?.node);
        getConnectionsOptions(infoVacant?.node, '&conection_type=2');
    }, [infoVacant])

    const updatePage = (filters = {}) => router.replace({
        pathname: '/jobbank/autoregister/candidate',
        query: filters
    }, undefined, { shallow: true });

    const getInfoVacant = async (id) => {
        try {
            setLoadVacant(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setLoadVacant(false)
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

    const vacant_name = useMemo(() => {
        if (Object.keys(infoVacant)?.length <= 0) return textTitle;
        return <>Postulación a <span style={{ color: 'rgba(0,0,0,0.5)' }}>{infoVacant?.job_position}</span></>
    }, [infoVacant, router.query?.vacant])

    return (
        <>
            <AutoRegister
                currentNode={infoVacant?.node}
                logoAlign='right'
            >
                {router.query?.type == 'success' ? (
                    <ContentMsg>
                        <ContentVertical gap={8}>
                            <CheckCircleFilled style={{ fontSize: 50, color: "#28a745" }} />
                            <p style={{ marginBottom: 0, fontSize: '1.5rem', fontWeight: 500 }}>
                                Gracias por registrarte.<br />Hemos recibido tu información.
                            </p>
                        </ContentVertical>
                    </ContentMsg>
                ) : (
                    <DetailsCustom
                        action='add'
                        idForm='form-candidates'
                        fetching={fetching}
                        titleCard={router.query?.vacant ? vacant_name : 'Registro de candidato'}
                        borderTitle={true}
                        showBack={!!router.query?.back}
                        actionBack={()=> router.push({
                            pathname: `/jobbank/search/${router.query?.back}`,
                            query: filters
                        })}
                        isAutoRegister={true}
                    >
                        <Spin spinning={fetching}>
                            <Form
                                id='form-candidates'
                                layout='vertical'
                                form={formCandidate}
                                onFinish={onFinish}
                                initialValues={{
                                    is_active: true,
                                    availability_to_travel: false,
                                    languages: [],
                                    notification_source: []
                                }}
                            >
                                <FormGeneral
                                    optionVacant={Object.keys(infoVacant)?.length > 0 ? [infoVacant] : []}
                                    loadVacant={loadVacant}
                                    formCandidate={formCandidate}
                                    showVacant={!!router.query?.vacant}
                                    setFileCV={setFileCV}
                                    infoCandidate={{}}
                                />
                            </Form>
                        </Spin>
                    </DetailsCustom>
                )}
            </AutoRegister>
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