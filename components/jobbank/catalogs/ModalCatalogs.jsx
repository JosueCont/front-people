import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import { useSelector } from 'react-redux';
import {
    Form,
    Row,
    Col,
    Button,
    Tabs,
    message,
    Spin,
    Input,
    Select
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace
} from '../../../utils/rules';

const ModalCatalogs = ({
    actionForm = ()=> {}, //function
    title = '', //string
    visible = false, //boolean
    close = ()=> {}, //function
    itemToEdit = {}, //object
    textSave = 'Guardar',//string
    children,
}) => {

    const [formCatalog] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formCatalog.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = ()=>{
        close()
        formCatalog.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(() => {
            onCloseModal();
            setLoading(false)
            actionForm(values)
        }, 2000);
    }

    return (
        <MyModal
            title={title}
            widthModal={500}
            close={onCloseModal}
            visible={visible}
            closable={!loading}
        >
            <Form
                form={formCatalog}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row gutter={[0,16]}>
                    <Col span={24}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input placeholder='Nombre' maxLength={100}/>
                        </Form.Item>
                        {children}
                    </Col>
                    <Col span={24} style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalCatalogs