import React, { useEffect, useMemo, useState } from 'react';
import { Form, Spin, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getListStates,
    getConnectionsOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import {
    LoadingOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
    InfoCircleFilled
} from '@ant-design/icons';
import styled from '@emotion/styled';
import WebApiJobBank from '../../../api/WebApiJobBank';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import DetailsCustom from '../../../components/jobbank/DetailsCustom';
import FormGeneral from '../../../components/jobbank/candidates/FormGeneral';
import { useInfoCandidate } from '../../../components/jobbank/hook/useInfoCandidate';

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
    gap: ${({gap}) => gap ? `${gap}px` : '0px'};
`;

const candidate = ({
    currentNode,
    getListStates,
    getConnectionsOptions,
    getVacanciesOptions,
    load_vacancies_options,
    list_vacancies_options,
}) => {

    const router = useRouter();
    const textTitle = 'Postulación a vacante';
    const [formCandidate] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    const [fileCV, setFileCV] = useState([]);
    const { createData } = useInfoCandidate({
        fileCV, isAutoRegister: true
    });

    useEffect(()=>{
        if(!router.query?.vacant) return;
        formCandidate.setFieldsValue({
            vacant: router.query?.vacant
        })
    },[router.query?.vacant])

    useEffect(()=>{
        if(currentNode){
            getListStates(currentNode.id);
            getVacanciesOptions(currentNode.id, '&status=1');
            getConnectionsOptions(currentNode.id, '&conection_type=2');
        }
    },[currentNode])

    const updatePage = (filters = {}) => router.replace({
        pathname: '/jobbank/autoregister/candidate',
        query: filters
    }, undefined, {shallow:true});

    const onFinish = async (values) =>{
        try{
            setFetching(true)
            if(values.birthdate) values.birthdate = values.birthdate?.format('YYYY-MM-DD');
            await WebApiJobBank.createCandidate(createData(values));
            setTimeout(()=>{
                formCandidate.resetFields();
                setFetching(false);
                setFileCV([]);
                updatePage({...router.query, type: 'success'});
            },2000)
        }catch(e){
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

    const vacant_name = useMemo(()=>{
        if(list_vacancies_options?.length <= 0) return textTitle;
        const find_ = item => item.id == router.query?.vacant;
        let result = list_vacancies_options.find(find_);
        if(!result) return textTitle;
        return <>Postulación a <span style={{color: 'rgba(0,0,0,0.5)'}}>{result.job_position}</span></>;
    },[list_vacancies_options, router.query?.vacant])

    return (
        <>
            <AutoRegister>
                {router.query?.type == 'success' ? (
                    <ContentMsg>
                        <ContentVertical gap={8}>
                            <CheckCircleFilled style={{fontSize:50, color:"#28a745"}} />
                            <p style={{marginBottom: 0, fontSize: '1.5rem', fontWeight: 500}}>
                                Gracias por registrarte.<br/>Hemos recibido tu información.
                            </p>
                        </ContentVertical>
                    </ContentMsg>
                ):(
                    <DetailsCustom
                        action='add'
                        idForm='form-candidates'
                        fetching={fetching}
                        titleCard={router.query?.vacant ? vacant_name : 'Registro de candidato'}
                        isAutoRegister={true}
                        borderTitle={true}
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
                                    showVacant={!!router.query?.vacant}
                                    formCandidate={formCandidate}
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

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
    }
}

export default connect(
    mapState, {
        getListStates,
        getConnectionsOptions,
        getVacanciesOptions
    }
)(candidate);