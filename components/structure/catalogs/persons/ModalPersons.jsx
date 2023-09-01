import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback
} from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Input,
    Drawer,
    Space,
    Spin,
    message,
    InputNumber,
    Typography
} from 'antd';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';
import {
    LoadingOutlined
} from '@ant-design/icons';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { getTypesPersonsOptions } from '../../../../redux/OrgStructureDuck';
import { validateMaxLength, validateNum } from '../../../../utils/functions';

const ModalPersons = ({
    visible = false,
    itemToEdit = {},
    refreshList = true,
    close = () => { },
    onReady = () => { },
}) => {

    const noValid = [undefined, null, '', ' '];

    const {
        current_node
    } = useSelector(state => state.userStore)

    const refSubmit = useRef(null);
    const dispatch = useDispatch();
    const [formPersons] = Form.useForm();
    const [type, setType] = useState('create');
    const [fetching, setFetching] = useState(false);

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    const prefix = Form.useWatch('prefix', formPersons);
    const digits = Form.useWatch('num_digits', formPersons);
    const automatic = Form.useWatch('is_automatic', formPersons);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.prefix = itemToEdit?.prefix
            ? itemToEdit.prefix : itemToEdit?.code
                ? itemToEdit.code : null;
        formPersons.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            values.node = current_node?.id;
            await WebApiOrgStructure.createTypePerson(values);
            setTimeout(() => {
                message.success('Tipo de persona registrada')
                if (refreshList) dispatch(getTypesPersonsOptions(current_node?.id));
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Tipo de persona no registrada')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateTypePerson(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Tipo de persona actualizada')
                if (refreshList) dispatch(getTypesPersonsOptions(current_node?.id));
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Tipo de persona no actualizada')
                setFetching(false)
            }, 1000)
        }
    }

    const createData = (values = {}) => {
        values.code = values.prefix ? values.prefix : null;
        const map_ = ([key, val]) => ([key, !noValid.includes(val) ? val : null])
        let result = Object.entries(values).map(map_);
        return Object.fromEntries(result);
    }

    const onFinish = (values) => {
        setFetching(true)
        let body = createData(values);
        if (isEdit) actionUpdate(body);
        else actionCreate(body);
    }

    const reset = () => {
        setFetching(false)
        formPersons.resetFields()
    }

    const onClose = () => {
        close()
        reset()
    }

    const submitType = (type) => {
        setType(type)
        refSubmit.current?.click();
    }

    const submitAction = () => {
        if (type == 'create') reset();
        else onClose();
    }

    const availableDigits = useMemo(() => {
        if (!prefix) return 50;
        let init = prefix?.length || 0;
        return 50 - init;
    }, [prefix])

    const prewiewPrefix = useMemo(() => {
        let valid = digits > availableDigits;
        if (!automatic || !prefix || !digits || valid) return null;
        if (digits <= 1) return `${prefix}${digits}`;
        let str = Array(digits - 1).fill('0').join('');
        return `${prefix}${str}1`;
    }, [prefix, digits, automatic])

    const prefixValue = (value) => {
        let code = `${value}`?.replace(/[^a-zA-Z\s]/g, '');
        return code.toUpperCase();
    }

    const ruleMin = { type: 'number', min: 1, message: 'Ingres un valor mayor o igual a 1' };
    const ruleMax = { type: 'number', max: availableDigits, message: `Ingrese un valor menor o igual a ${availableDigits}` };

    const selectBoolean = (
        <Select placeholder='Seleccionar una opción'>
            <Select.Option value={true} key='1'>
                Sí
            </Select.Option>
            <Select.Option value={false} key='2'>
                No
            </Select.Option>
        </Select>
    )

    return (
        <Drawer
            title={isEdit ? 'Editar tipo de persona' : 'Agregar tipo de persona'}
            width={500}
            visible={visible}
            placement='right'
            maskClosable={false}
            closable={!fetching}
            keyboard={false}
            onClose={() => onClose()}
            className='ant-table-colla'
            footer={
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    {isEdit ? (
                        <>
                            <Button
                                disabled={fetching}
                                onClick={() => onClose()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                htmlType='submit'
                                disabled={fetching}
                                form='form-persons'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-persons'
                                type='submit'
                                ref={refSubmit}
                            />
                            <Button
                                disabled={fetching}
                                htmlType='button'
                                onClick={() => submitType('create')}
                            >
                                Guardar y agregar otro
                            </Button>
                            <Button
                                disabled={fetching}
                                htmlType='button'
                                onClick={() => submitType('close')}
                            >
                                Guardar y cerrar
                            </Button>
                        </>
                    )}
                </Space>
            }
        >
            <Spin
                spinning={fetching}
                indicator={<LoadingOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />}
            >
                <Form
                    form={formPersons}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-persons'
                    initialValues={{
                        is_active: true,
                        is_automatic: true,
                        is_collaborator: true,
                        is_assignable: true,
                        num_digits: 7
                    }}
                >
                    <Row gutter={[24, 0]}>
                        <Col span={24}>
                            <Form.Item
                                name='name'
                                label='Nombre'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input maxLength={100} placeholder='Nombre' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='prefix'
                                label='Prefijo'
                                rules={[ruleRequired]}
                                normalize={prefixValue}
                                tooltip='Prefijo alfabético que se utilizará para generar la clave numérica de la persona'
                            >
                                <Input
                                    // maxLength={15}
                                    maxLength={5}
                                    placeholder='Prefijo'
                                    onKeyPress={validateMaxLength}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='num_digits'
                                label={`Número de dígitos (max: ${availableDigits})`}
                                // dependencies={['prefix']}
                                tooltip='Número de dígitos que se utilizarán para generar la clave numérica de la persona junto con el prefijo'
                                rules={[ruleMin, ruleRequired, ruleMax]}
                            >
                                <InputNumber
                                    maxLength={9}
                                    controls={false}
                                    onKeyDown={validateNum}
                                    onPaste={validateNum}
                                    onKeyPress={validateMaxLength}
                                    placeholder='Número de dígitos'
                                    style={{
                                        width: '100%',
                                        border: '1px solid black'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='is_automatic'
                                label='¿Automático?'
                                tooltip='Determina si el número correspondiente a la clave númerica será generada por el sistema o capturado'
                            >
                                {selectBoolean}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label='Clave numérica (ejemplo)'>
                                <Input value={prewiewPrefix} disabled placeholder='Clave numérica' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='is_collaborator'
                                label='¿Colaborador?'
                                tooltip='Este tipo de persona es considerado como colaborador'
                            >
                                {selectBoolean}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='is_active'
                                label='Estatus'
                            >
                                <Select placeholder='Seleccionar una opción'>
                                    <Select.Option value={true} key='1'>
                                        Activo
                                    </Select.Option>
                                    <Select.Option value={false} key='2'>
                                        Inactivo
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='is_assignable'
                                label='¿Asignable a personas?'
                            >
                                {selectBoolean}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default ModalPersons