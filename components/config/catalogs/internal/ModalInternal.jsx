import React, {
    useState,
    useEffect
} from 'react';
import MyModal from '../../../../common/MyModal';
import { Row, Col, Input, Form, Button, Select } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalInternal = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () => { },
    actionForm = () => { }
}) => {

    const [formInternal] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        formInternal.setFieldsValue(itemToEdit);
    }, [itemToEdit])

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            actionForm(values)
            setLoading(false)
            onClose()
        }, 1000)
    }

    const onClose = () => {
        close()
        formInternal.resetFields();
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            closable={!loading}
            widthModal={500}
            close={() => onClose()}
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                form={formInternal}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='code'
                            label='Código'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={100} placeholder='Código' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='description'
                            label='Descripción'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={100} placeholder='Descripción' />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button
                            htmlType='button'
                            disabled={loading}
                            onClick={() => onClose()}
                        >
                            Cancelar
                        </Button>
                        <Button loading={loading} htmlType='submit'>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalInternal