import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../../common/MyModal';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Select,
    Switch,
    Checkbox,
    InputNumber,
    DatePicker
} from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalFixed = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () => { },
    actionForm = () => { },
    conditions = []
}) => {

    const {
        perceptions_int,
        deductions_int,
        other_payments_int,
        load_perceptions_int,
        load_deductions_int,
        load_other_payments_int
    } = useSelector(state => state.fiscalStore);

    const [formFixed] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const conceptType = Form.useWatch('concept_type', formFixed);
    const applicationMode = Form.useWatch('application_mode', formFixed);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        formFixed.setFieldsValue(itemToEdit);
    }, [itemToEdit])

    const createData = (values) => {
        let info = Object.assign(values);
        info.application_date = values?.application_date
            ? values.application_date?.format('YYYY-MM-DD') : null;
        info.num_of_periods = values?.num_of_periods
            ? values?.num_of_periods : 0;

        if (info.concept_type == 1) {
            info.deduction_type = null;
            info.other_payment_type = null;
        }

        if (info.concept_type == 2) {
            info.perception_type = null;
            info.other_payment_type = null;
        }

        if (info.concept_type == 3) {
            info.perception_type = null;
            info.deduction_type = null;
        }
        return info;
    }

    const onFinish = (values) => {
        let body = createData(values);
        setLoading(true)
        setTimeout(() => {
            actionForm(body)
            setLoading(false)
            onClose()
        }, 1000)
    }

    const onClose = () => {
        close()
        formFixed.resetFields();
    }

    const onChangeMode = (value) => {
        if (value <= 1) {
            formFixed.setFieldsValue({
                num_of_periods: null
            })
            return;
        }
    }

    const concept_type = [
        { value: 1, label: 'Percepción' },
        { value: 2, label: 'Deducción' },
        { value: 3, label: 'Otro pago' },
    ]

    const data_type = [
        { value: 1, label: 'Monto' },
        { value: 2, label: 'Porcentaje' },
        { value: 3, label: 'Veces salario' },
    ]

    const based_on = [
        { value: 1, label: 'Periodo' },
        { value: 2, label: 'Días trabajados' },
    ]

    const type_salary = [
        { value: 0, label: 'N/A' },
        { value: 1, label: 'Bruto' },
        { value: 2, label: 'Neto' },
    ]

    const period_config = [
        { value: 1, label: 'Todos' },
        { value: 2, label: 'Primer periodo' },
        { value: 3, label: 'Último periodo' }
    ]

    const application_mode = [
        { value: 1, label: 'Fijo' },
        { value: 2, label: 'Dividir en periodos' },
        { value: 3, label: 'Frecuencia' }
    ]

    const customSelect = {
        '1': {
            name: 'perception_type',
            label: 'Percepción',
            options: perceptions_int,
            loading: load_perceptions_int
        },
        '2': {
            name: 'deduction_type',
            label: 'Deducción',
            options: deductions_int,
            loading: load_deductions_int
        },
        '3': {
            name: 'other_payment_type',
            label: 'Otro pago',
            options: other_payments_int,
            loading: load_other_payments_int
        }
    }

    const propsSelect = useMemo(() => {
        return customSelect[conceptType];
    }, [
        conceptType,
        perceptions_int,
        deductions_int,
        other_payments_int
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
                form={formFixed}
                initialValues={{
                    concept_type: 1,
                    based_on: 1,
                    salary_type: 0,
                    max_delays: 0,
                    period_config: 1,
                    application_mode: 1
                }}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input placeholder='Nombre' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='concept_type'
                            label='Tipo de concepto'
                            rules={[ruleRequired]}
                        >
                            <Select
                                options={concept_type}
                                placeholder='Seleccionar una opción'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={propsSelect?.label}
                            name={propsSelect?.name}
                            rules={[ruleRequired]}
                            dependencies={['concept_type']}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={!conceptType || propsSelect?.loading}
                                loading={propsSelect?.loading}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {propsSelect?.options?.length > 0
                                    && propsSelect.options.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.description}
                                        </Select.Option>
                                    ))}
                            </Select>
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
                                options={data_type}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='datum'
                            label='Valor'
                            rules={[
                                ruleRequired,
                                {
                                    type: 'number',
                                    min: 1,
                                    message: 'Se requiere un valor mayor a 0'
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                placeholder='Valor'
                                maxLength={9}
                                type='number'
                                style={{
                                    width: '100%',
                                    border: '1px solid black'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='application_date'
                            label='Fecha de inicio de aplicación'
                            rules={[ruleRequired]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='based_on'
                            label='Basado en'
                            rules={[ruleRequired]}
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={based_on}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            initialValue={0}
                            name='salary_type'
                            label='Tipo de sueldo'
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={type_salary}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='max_delays'
                            label='Máximo de retardos'
                        >
                            <Input
                                placeholder='Máximo de retardos'
                                type='number' min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='period_config'
                            label='Configuración de períodos'
                        >
                            <Select
                                options={period_config}
                                placeholder='Seleccionar una opción'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='application_mode'
                            label='Modo de aplicación'
                        >
                            <Select
                                options={application_mode}
                                placeholder='Seleccionar una opción'
                                onChange={onChangeMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='num_of_periods'
                            label='Número de periodos'
                            dependencies={['application_mode']}
                            rules={[
                                applicationMode > 1 ?ruleRequired : {},
                                {
                                    type: 'number',
                                    min: 1,
                                    message: 'Se requiere un valor mayor a 0',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                placeholder='Número de periodos'
                                disabled={!(applicationMode > 1)}
                                maxLength={9}
                                type='number'
                                style={{
                                    width: '100%',
                                    border: '1px solid black'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    {conditions?.length > 0 && (
                        <Col span={24}>
                            <Row justify='space-between'>
                                {conditions.map((item, idx) => (
                                    <Col key={idx}>
                                        <Form.Item
                                            name={item.name}
                                            initialValue={item.value}
                                            valuePropName='checked'
                                            noStyle
                                        >
                                            <Checkbox>{item.label}</Checkbox>
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    )}
                    <Col
                        span={24}
                        className='content-end'
                        style={{ gap: 8, marginTop: conditions?.length > 0 ? 24 : 0 }}
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

export default ModalFixed