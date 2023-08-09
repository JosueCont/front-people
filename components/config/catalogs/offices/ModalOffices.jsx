import React, {
    useState,
    useEffect
} from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../../common/MyModal';
import { Row, Col, Input, Form, Button, Select } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalOffices = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () => { },
    actionForm = () => { }
}) => {

    const {
        cat_patronal_registration,
        load_patronal_registration
    } = useSelector(state => state.catalogStore);
    const [formOffice] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.patronal_registration = itemToEdit?.patronal_registration
            ? itemToEdit?.patronal_registration?.id : null;
        formOffice.setFieldsValue(values);
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
        formOffice.resetFields();
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
                form={formOffice}
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
                            name='name'
                            label='Nombre'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={100} placeholder='Nombre' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Registro patronal'
                            name='patronal_registration'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_patronal_registration}
                                loading={load_patronal_registration}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_patronal_registration.length > 0
                                    && cat_patronal_registration.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.code}
                                    </Select.Option>
                                ))}
                            </Select>
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

export default ModalOffices