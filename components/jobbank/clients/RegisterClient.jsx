import React, { useState, useEffect } from 'react';
import {
    Form,
    Row,
    Col,
    Divider,
    Card,
    Button,
    Modal,
    Spin
} from 'antd';
import TabClient from './TabClient';
import TabContact from './TabContact';
import TabDocuments from './TabDocuments';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { connect } from 'react-redux';

const RegisterClient = ({
    currentNode
}) => {

    const [formClient] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [prevDocs, setPrevDocs] = useState([]);
    const [newDocs, setNewDocs] = useState([]);
    const [contactList, setContactList] = useState([]);
    
    const createData = (obj) =>{
        let dataClient = new FormData();
        dataClient.append('node', currentNode.id);
        dataClient.append('auto_register', true);
        if(newDocs.length > 0) newDocs.map(item => dataClient.append('files', item));
        if(contactList.length > 0) dataClient.append('contact_list', JSON.stringify(contactList));
        Object.entries(obj).map(([key, val])=>{ if(val) dataClient.append(key, val) });
        return dataClient;
    }

    const onSuccessCreate = () =>{
        Modal.success({ content: 'Cliente registrado' })
        formClient.resetFields();
        setPrevDocs([])
        setNewDocs([])
        setLoading(false)
    }

    const onFinish = async (values) =>{
        setLoading(true)
        try {
            const bodyData = createData(values);
            await WebApiJobBank.createClient(bodyData);
            onSuccessCreate()
        } catch (e) {
            console.log(e)
            if(e.response?.data['rfc']) Modal.error({ content: 'RFC ya registrado' });
            else Modal.error({ content: 'Cliente no registrado' });
            setLoading(false)
        }
    }

    return (
        <Row gutter={[0,24]} style={{width: '70%'}}>
            <Col span={24} className='content-center'>
                <p style={{
                    marginBottom: 0,
                    fontSize: '1.25rem',
                    fontWeight: 700
                }}>Formulario de registro</p>
            </Col>
            <Col span={24}>
                <Card>
                    <Form
                        id='form-register-client'
                        layout='vertical'
                        form={formClient}
                        onFinish={onFinish}
                        initialValues={{is_active: true}}
                    >
                        <Spin spinning={loading}>
                            <Divider plain>
                                Información del cliente
                            </Divider>
                            <TabClient sizeCol={8}/>
                            <Divider plain style={{marginTop: 0}}>
                                Información del contacto
                            </Divider>
                            <TabContact
                                formClients={formClient}
                                contactList={contactList}
                                setContactList={setContactList}
                            />
                            <Divider plain style={{marginTop: 0}}>
                                Carga de documentos
                            </Divider>
                            <TabDocuments
                                newDocs={newDocs}
                                prevDocs={prevDocs}
                                setNewDocs={setNewDocs}
                                setPrevDocs={setPrevDocs}
                                showPrevDocs={false}
                            />
                        </Spin>
                    </Form>
                </Card>
            </Col>
            <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                {newDocs.length > 0 && loading && (
                    <span style={{marginRight: 'auto'}}>
                        Espere un momento por favor, subiendo archivos.
                    </span>
                )}
                <Button
                    form='form-register-client'
                    htmlType='submit'
                    loading={loading}
                    style={{marginLeft: 'auto'}}
                >
                    Guardar
                </Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(RegisterClient);