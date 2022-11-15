import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Button,
    Tabs,
    message,
    Spin,
    Input
} from 'antd';

const ModalCatalogs = ({
    actionForm = ()=> {}, //function
    title = '', //string
    visible = false, //boolean
    close = ()=> {}, //function
    itemToEdit = {}, //object
    textSave = 'Guardar'//string
}) => {

    const [formCatalog] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onCloseModal = ()=>{
        close()
        formCatalog.resetFields();
    }

    const onFinish = () =>{

    }

    return (
        <MyModal
            title={title}
            widthModal={700}
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
                        <Form.Item name='name' label='Nombre'>
                            <Input placeholder='Nombre' maxLength={50}/>
                        </Form.Item>
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