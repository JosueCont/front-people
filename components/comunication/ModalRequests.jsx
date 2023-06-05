import React, { useEffect, useState } from 'react';
import MyModal from '../../common/MyModal';
import { Form, Row, Col, Input, Button} from 'antd';

const ModalRequests = ({
    title = '',
    close = () => { },
    visible,
    actionForm = () => { },
    textAction = ''
}) => {

    const [formAction] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) =>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onClose()
        },2000)
    }

    const onClose = () =>{
        close()
        formAction.resetFields()
    }

    return (
        <MyModal
            title={title}
            close={onClose}
            closable={!loading}
            visible={visible}
            widthModal={500}
        >
            <Form
                form={formAction}
                onFinish={onFinish}
                layout='vertical'
                initialValues={{
                    comment: null
                }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item name='comment' label='Comentarios'>
                            <Input.TextArea
                                placeholder='Especificar motivo'
                                autoSize={{minRows: 4, maxRows: 4}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end'style={{gap: 8}}>
                        <Button onClick={()=> onClose()}>
                            Cerrar
                        </Button>
                        <Button loading={loading} htmlType='submit'>
                            {textAction}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalRequests