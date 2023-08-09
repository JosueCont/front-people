import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../../common/MyModal';
import { Row, Col, Input, Form, Button, Select, Switch, Checkbox } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalInternal = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () => { },
    actionForm = () => { },
    tab = 'tab1'
}) => {

    const dataType = [
        { value: 1, label: 'Monto' },
        { value: 2, label: 'Dato' },
    ]

    const {
        cat_perceptions,
        cat_deductions,
        cat_other_payments
    } = useSelector(state => state.fiscalStore);

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

    const customSelect = {
        tab1: {
            name: 'perception_type',
            label: 'Percepción',
            options: cat_perceptions
        },
        tab2: {
            name: 'deduction_type',
            label: 'Deducción',
            options: cat_deductions
        },
        tab3: {
            name: 'other_type_payment',
            label: 'Otro pago',
            options: cat_other_payments
        }
    }

    const propsSelect = useMemo(() => {
        return customSelect[tab];
    }, [
        tab,
        cat_perceptions,
        cat_deductions,
        cat_other_payments
    ])

    return (
        <MyModal
            title={title}
            visible={visible}
            closable={!loading}
            widthModal={700}
            close={() => onClose()}
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                form={formInternal}
                initialValues={{
                    show: true,
                    apply_assimilated: false,
                    is_salary: false,
                    is_holiday: false,
                    is_rest_day: false,
                    is_seventh_day: false,
                }}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='code'
                            label='Código'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={50} placeholder='Código' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='description'
                            label='Nombre'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={50} placeholder='Nombre' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='data_type'
                            label='Tipo de dato'
                            rules={[ruleRequired]}
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={dataType}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={propsSelect.label}
                            name={propsSelect.name}
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {propsSelect.options.length > 0
                                    && propsSelect.options.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.description}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='show'
                            valuePropName='checked'
                            noStyle
                        >
                            <Checkbox>Mostrar para calcular</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='apply_assimilated'
                            valuePropName='checked'
                            noStyle
                        >
                            <Checkbox>Aplica asimilado</Checkbox>
                        </Form.Item>
                    </Col>
                    {tab == 'tab1' && (
                        <>
                            <Col span={8}>
                                <Form.Item
                                    name='is_salary'
                                    valuePropName='checked'
                                    noStyle
                                >
                                    <Checkbox>¿Es sueldo?</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='is_holiday'
                                    valuePropName='checked'
                                    noStyle
                                >
                                    <Checkbox>¿Es festivo?</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='is_rest_day'
                                    valuePropName='checked'
                                    noStyle
                                >
                                    <Checkbox>¿Es descanso?</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='is_seventh_day'
                                    valuePropName='checked'
                                    noStyle
                                >
                                    <Checkbox>¿Es séptimo día?</Checkbox>
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    <Col
                        span={24}
                        className='content-end'
                        style={{ gap: 8, marginTop: 24}}
                    >
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