import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PermissionForm from './PermissionForm';
import { useSelector } from 'react-redux';
import { getPhoto } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import { message, Spin } from 'antd';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Image
} from 'antd';
import moment from 'moment';

const DetailsPermission = ({
    action
}) => {
    
    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);
    const router = useRouter();
    
    const [formPermit] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [currentPerson, setCurrentPerson] = useState({});
    const [infoPermit, setInfoPermit] = useState({});


    useEffect(()=>{
        if(router?.query?.id && action == 'edit'){
            getInfoPermit(router.query?.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoPermit).length > 0){
            formPermit.setFieldsValue()
            setValuesForm()
        }
    },[infoPermit])

    const getInfoPermit = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.getInfoPermit(id);
            setInfoPermit(response?.data)
            setCurrentPerson(response?.data?.collaborator)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            values.append('node', current_node?.id)
            /* let body = {...values, node: current_node?.id} */
            await WebApiPeople.savePermitsRequest(values);
            message.success('Solicitud registrada')
            actionBack()
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no registrada')
        }
    }

    const onFinishUpdate = async (values) =>{
        try {
            let response = await WebApiPeople.updatePermitsRequest(router.query?.id, values);
            setInfoPermit(response.data)
            setLoading(false)
            message.success('Solicitud actualizada')
        } catch (e) {
            setLoading(false)
            console.log(e)
            message.error('Solicitud no actualizada')
        }
    }

    const setValuesForm = () =>{
        let values = {...infoPermit};
        values.person = infoPermit?.collaborator ? infoPermit.collaborator?.id : null;
        if(infoPermit?.permit_reason_perception){
            values.permit_reason = infoPermit.permit_reason_perception
        }else if(infoPermit?.permit_reason_deduction){
            values.permit_reason = infoPermit.permit_reason_deduction
        }
        values.departure_date = infoPermit?.departure_date
            ? moment(infoPermit.departure_date, 'YYYY-MM-DD') : null;
        values.return_date = infoPermit?.return_date
            ? moment(infoPermit.return_date, 'YYYY-MM-DD') : null;
        formPermit.setFieldsValue(values)
    }

    const onFinish = (values) =>{ 
        let formData = new FormData()
        if(values.person){
            formData.append('person', values.person)
        }
        if(values.departure_date){
            formData.append('departure_date', values.departure_date ? values.departure_date?.format('YYYY-MM-DD') : null)
        }
        if(values.permit_reason && values.reason_key){
            if(values.reason_key === 'p'){
                formData.append('permit_reason_perception', values.permit_reason)
            }else if(values.reason_key === 'p'){
                formData.append('permit_reason_deduction', values.permit_reason)
            }   
        }
        if(values.reason){
            formData.append('reason', values.reason)
        }
        if(values.requested_days){
            formData.append('requested_days', values.requested_days)
        }
        if(values.return_date){
            formData.append('return_date', values.return_date ? values.return_date?.format('YYYY-MM-DD') : null)
        }

        if(values.evidence && Array.isArray(values.evidence) ){
            formData.append('evidence', values.evidence ? values.evidence.file : null)
        }
        setLoading(true)
        /* values.departure_date = values.departure_date
            ? values.departure_date?.format('YYYY-MM-DD') : null;
        values.return_date = values.return_date
            ? values.return_date?.format('YYYY-MM-DD') : null; */
        const actions = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actions[action](formData)
    }

    const actionBack = () =>{
        router.push('/comunication/requests/permission')
    }
    
    return (
        <Card bodyStyle={{padding: 18}}>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content title-action-border'>
                    <div className='content_title_requets'>
                        <Image
                            src={getPhoto(currentPerson, '/images/fallback.png')}
                            preview={false}
                        />
                        <div className='content_title_requets_text'>
                            <p className='title-action-text'>
                                {action == 'add'
                                    ? 'Registrar nueva solicitud'
                                    : 'Información de la solicitud'
                                }
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={()=> actionBack()}
                        disabled={loading}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <Form
                            form={formPermit}
                            layout='vertical'
                            onFinish={onFinish}
                        >
                            <PermissionForm
                                infoPermit={infoPermit}
                                currentPerson={currentPerson}
                                setCurrentPerson={setCurrentPerson}
                                formPermit={formPermit}
                                action={action}
                                actionBack={actionBack}
                            />
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
}

export default DetailsPermission