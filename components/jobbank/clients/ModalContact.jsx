import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import MyModal from '../../../common/MyModal';
import {
    ruleWhiteSpace,
    ruleEmail,
    rulePhone,
    ruleRequired
} from '../../../utils/rules';
import { validateNum, validateMaxLength } from '../../../utils/functions';

const ModalContact = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{}
}) => {

    const [formContact] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formContact.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formContact.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onCloseModal()
        },1000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={800}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formContact}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre del contacto'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={50}
                                placeholder='Nombre del contacto'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='job_position'
                            label='Ocupación del contacto'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={100}
                                placeholder='Ocupación del contacto'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='email'
                            label='Correo del contacto'
                            rules={[ruleEmail]}
                        >
                            <Input
                                maxLength={50}
                                placeholder='Correo del contacto'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='phone'
                            label='Teléfono del contacto'
                            rules={[rulePhone]}
                        >
                            <Input
                                placeholder='Teléfono del contacto'
                                maxLength={10}
                                onKeyDown={validateNum}
                                // onKeyPress={validateMaxLength}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>{textSave}</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalContact