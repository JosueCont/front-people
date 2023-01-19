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

const ModalVacancies = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{}
}) => {

    const [formEvaluations] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formEvaluations.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formEvaluations.resetFields();
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
                form={formEvaluations}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='user'
                            label='Usuario'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={50}
                                placeholder='Nombre del usuario'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='password'
                            label='Contraseña'
                            rules={[ruleWhiteSpace, ruleRequired]}
                        >
                            <Input.Password
                                maxLength={100}
                                placeholder='Contraseña'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='type'
                            label='Tipo'
                            rules={[ruleRequired]}
                        >
                          <Select placeholder='selecciona el tipo'>
                            <Select.Option key={1}>
                              Khor
                            </Select.Option>
                            <Select.Option key={2}>
                              Cliente
                            </Select.Option>
                          </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='url'
                            label='URL'
                            rules={[ruleRequired]}
                        >
                            <Input
                                placeholder='Url del sitio'
                                maxLength={10}
                                // onKeyPress={validateMaxLength}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                    <Form.Item
                            name='instructions'
                            label='Instrucciones'
                        >
                            <Input.TextArea
                                placeholder='intrucciones'
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

export default ModalVacancies