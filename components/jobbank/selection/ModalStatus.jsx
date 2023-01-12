import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
import MyModal from '../../../common/MyModal';
import { optionsStatusSelection } from '../../../utils/constant';
import { ruleWhiteSpace, ruleRequired } from '../../../utils/rules';

const ModalStatus = ({
    title = '',
    actionForm = ()=>{},
    close = ()=>{},
    visible = false,
    itemToEdit = {}
}) => {

    const [formStatus] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formStatus.setFieldsValue({
            status_process: itemToEdit.status_process
        })
    },[itemToEdit])

    const onClose = () =>{
        formStatus.resetFields();
        close()
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onClose()
        },2000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            closable={!loading}
            close={onClose}
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                form={formStatus}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='status_process'
                            label='Estatus'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                options={optionsStatusSelection}
                                optionFilterProp='label'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='comments'
                            label='Comentarios'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Escriba o especifique un motivo'
                                autoSize={{minRows: 3, maxRows: 3}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap:8}}>
                        <Button onClick={()=> onClose()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>Actualizar</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalStatus