import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker, Switch } from 'antd';
import MyModal from '../../../../common/MyModal';

const ModalComments = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{}
}) => {

    const [formComments] = Form.useForm();
    const [loading, setLoading ] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <=0) return;
        let comments = itemToEdit.comments ?? "";
        formComments.setFieldsValue({comments});
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formComments.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            actionForm(values)
            onCloseModal()
            setLoading(false)
        },1000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={500}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formComments}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={24} style={{marginTop: 8}}>
                        <Form.Item
                            // label='Comentario'
                            name='comments'
                        >
                            <Input.TextArea
                                placeholder='Escriba un comentario'
                                autoSize={{minRows: 5, maxRows: 5}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading} disabled={loading}>{textSave}</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalComments