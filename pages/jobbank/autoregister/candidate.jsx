import React, { useEffect, useMemo, useState } from 'react';
import { Form, Spin, message } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getListStates,
    getConnectionsOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import DetailsCustom from '../../../components/jobbank/DetailsCustom';
import FormGeneral from '../../../components/jobbank/candidates/FormGeneral';
import { useInfoCandidate } from '../../../components/jobbank/hook/useInfoCandidate';

const candidate = ({
    currentNode,
    getListStates,
    getConnectionsOptions,
    getVacanciesOptions
}) => {

    const router = useRouter();
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

    const onFinish = async (values) =>{
        try{
            setFetching(true)
            if(values.birthdate) values.birthdate = values.birthdate?.format('YYYY-MM-DD');
            await WebApiJobBank.createCandidate(createData(values));
            let msg = router.query?.vacant
                ? 'Postulación registrada'
                : 'Candidato registrado';
            message.success(msg);
            formCandidate.resetFields();
            setFetching(false);
            setFileCV([]);
        }catch(e){
            console.log(e)
            setFetching(false);
            let error = e.response?.data?.email;
            let msg = error
                ?'Este correo ya existe'
                : router.query?.vacant
                ? 'Postulación no registrada'
                : 'Candidato no registrado';
            message.error(msg);
        }
    }

    return (
        <AutoRegister>
            <DetailsCustom
                action='add'
                idForm='form-candidates'
                fetching={fetching}
                titleCard={router.query?.vacant ? 'Postulación a vacante' : 'Registro de candidato'}
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
        </AutoRegister>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getListStates,
        getConnectionsOptions,
        getVacanciesOptions
    }
)(candidate);