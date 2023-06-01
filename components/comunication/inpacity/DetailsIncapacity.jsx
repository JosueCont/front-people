import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import IncapacityForm from './IncapacityForm';
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

const DetailsIncapacity = ({
    action
}) => {
    
    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);
    const router = useRouter();
    
    const [formIncapacity] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [currentPerson, setCurrentPerson] = useState({});
    const [infoIncapacity, setInfoIncapacity] = useState({});
    const [fileDocument, setFileDocument] = useState([]);

    useEffect(()=>{
        if(router?.query?.id && action == 'edit'){
            getInfoIncapacity(router.query?.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoIncapacity).length > 0){
            formIncapacity.setFieldsValue()
            setValuesForm()
        }
    },[infoIncapacity])

    const getInfoIncapacity = async (id) =>{
        // try {
        //     setLoading(true)
        //     let response = await WebApiPeople.getinfoIncapacity(id);
        //     setInfoIncapacity(response.data)
        //     setCurrentPerson(response.data?.collaborator)
        //     setLoading(false)
        // } catch (e) {
        //     console.log(e)
        //     setLoading(false)
        // }
    }

    const onFinishCreate = async (values) =>{
        // try {
        //     let body = {...values, node: current_node?.id}
        //     await WebApiPeople.savePermitsRequest(body);
        //     message.success('Solicitud registrada')
        //     actionBack()
        // } catch (e) {
        //     console.log(e)
        //     setLoading(false)
        //     message.error('Solicitud no registrada')
        // }
    }

    const onFinishUpdate = async (values) =>{
        // try {
        //     let response = await WebApiPeople.updatePermitsRequest(router.query?.id, values);
        //     setInfoIncapacity(response.data)
        //     setLoading(false)
        //     message.success('Solicitud actualizada')
        // } catch (e) {
        //     setLoading(false)
        //     console.log(e)
        //     message.error('Solicitud no actualizada')
        // }
    }

    const setValuesForm = () =>{
        // let values = {};
        // values.person = infoIncapacity?.collaborator ? infoIncapacity.collaborator?.id : null;
        // values.departure_date = infoIncapacity?.departure_date
        //     ? moment(infoIncapacity.departure_date, 'YYYY-MM-DD') : null;
        // values.return_date = infoIncapacity?.return_date
        //     ? moment(infoIncapacity.return_date, 'YYYY-MM-DD') : null;
        // values.requested_days = infoIncapacity?.requested_days
        //     ? infoIncapacity?.requested_days : null;
        // values.reason = infoIncapacity?.reason
        //     ? infoIncapacity.reason : null;
        // formIncapacity.setFieldsValue(values)
    }

    const onFinish = (values) =>{
        // setLoading(true)
        // values.departure_date = values.departure_date
        //     ? values.departure_date?.format('YYYY-MM-DD') : null;
        // values.return_date = values.return_date
        //     ? values.return_date?.format('YYYY-MM-DD') : null;
        // const actions = {
        //     edit: onFinishUpdate,
        //     add: onFinishCreate
        // }
        // actions[action](values)
    }

    const actionBack = () =>{
        router.push('/comunication/requests/incapacity')
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
                            form={formIncapacity}
                            layout='vertical'
                            onFinish={onFinish}
                        >
                            <IncapacityForm
                                currentPerson={currentPerson}
                                setCurrentPerson={setCurrentPerson}
                                formIncapacity={formIncapacity}
                                action={action}
                                actionBack={actionBack}
                                infoIncapacity={infoIncapacity}
                                setFileDocument={setFileDocument}
                            />
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
}

export default DetailsIncapacity