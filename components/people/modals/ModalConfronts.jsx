import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Form,
    Row,
    Col,
    Select
} from 'antd';
import { useSelector } from 'react-redux';
import { ruleRequired } from '../../../utils/rules';

const ModalConfronts = ({
    visible = false,
    close = () => { },
    actionForm = () => { }
}) => {

    const {
        cat_patronal_registration
    } = useSelector(state => state?.catalogStore);

    const [formConfront] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            actionForm(values)
            setLoading(false)
            onClose()
        }, 2000)
    }

    const onClose = () => {
        formConfront.resetFields();
        close()
    }

    return (
        <MyModal
            title='Generar confronta'
            closable={!loading}
            visible={visible}
            widthModal={400}
            close={onClose}
        >
            <Form
                form={formConfront}
                onFinish={onFinish}
                layout="vertical"
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='patronal'
                            label='Registro patronal'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_patronal_registration.length > 0 && cat_patronal_registration.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.code}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            htmlType='submit'
                            loading={loading}
                        >
                            Generar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalConfronts