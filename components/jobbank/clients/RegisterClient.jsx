import React, { useState, useEffect } from 'react';
import {
    Form,
    Row,
    Col,
    Divider,
    Card,
    Button,
    Modal
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
    
    const createData = (obj) =>{
        let dataClient = new FormData();
        dataClient.append('node', currentNode.id);
        dataClient.append('auto_register', true);
        if(newDocs.length > 0) newDocs.map(item => dataClient.append('files', item));
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
            if(e.response?.data['rfc']) Modal.error({ content: 'Ya existe un cliente con el mismo RFC' });
            else Modal.error({ content: 'Cliente no registrado' });
            setLoading(false)
        }
    }

    return (
        <Row gutter={[0,24]} style={{width: '60%'}}>
            <Col span={24} className='content-center'>
                <p style={{
                    marginBottom: 0,
                    fontSize: '1.25rem',
                    fontWeight: 700
                }}>Formulario de registro</p>
            </Col>
            <Col span={24} className='content-register-client'>
                <Card>
                    <Form id='form-register-client' form={formClient} onFinish={onFinish}>
                        <Divider plain>
                            Información del cliente
                        </Divider>
                        <TabClient sizeCol={8}/>
                        <Divider plain style={{marginTop: 0}}>
                            Información del contacto
                        </Divider>
                        <TabContact sizeCol={8}/>
                        <Divider plain style={{marginTop: 0}}>
                            Carga de documentos
                        </Divider>
                        <div style={{padding: '0px 12px'}}>
                            <TabDocuments
                                newDocs={newDocs}
                                prevDocs={prevDocs}
                                setNewDocs={setNewDocs}
                                setPrevDocs={setPrevDocs}
                            />
                        </div>
                    </Form>
                </Card>
            </Col>
            <Col span={24} className='content-end'>
                <Button form='form-register-client' htmlType='submit' loading={loading}>
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