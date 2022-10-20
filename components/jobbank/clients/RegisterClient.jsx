import React, { useState } from 'react';
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
import { deleteKeyByValue } from '../../../utils/constant';
import { connect } from 'react-redux';
import { useEffect } from 'react';

const RegisterClient = ({
    currentNode
}) => {

    const [formClient] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [listDocs, setListDocs] = useState([]);

    // useEffect(()=>{
    //     console.log('checa--------->', currentNode)
    // },[currentNode])

    const getDataClient = (obj) =>{
        let data = new FormData();
        data.append('node', currentNode.id)
        Object.entries(obj).map(([key, val]) =>{
            if(val) data.append(key, val);
        })
        return data;
    }

    const onFinish = async (values) =>{
        setLoading(true)
        try {
            let body = deleteKeyByValue(values);
            let data = getDataClient(body);
            await WebApiJobBank.createClient(data);
            Modal.success({ content: 'Cliente registrado' })
            formClient.resetFields();
            setLoading(false)
        } catch (e) {
            console.log(e)
            Modal.error({ content: 'Cliente no registrado' })
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
                                listDocs={listDocs}
                                setListDocs={setListDocs}
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