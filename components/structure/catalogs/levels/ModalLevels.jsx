import React, {
    useState,
    useMemo,
    useEffect,
    useRef
} from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Input,
    TreeSelect,
    Drawer,
    Space,
    message,
    Spin
} from 'antd';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { getOrgLevelsOptions } from '../../../../redux/OrgStructureDuck';
import { ruleRequired } from '../../../../utils/rules';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { useTreeOptions } from '../../useTreeOptions';
import { LoadingOutlined } from '@ant-design/icons';

const ModalLevels = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const {
        list_org_levels_options,
        list_org_levels_tree,
        load_org_levels_options
    } = useSelector(state => state.orgStore);
    const dispatch = useDispatch();
    const [formLevel] = Form.useForm();
    const refSubmit = useRef(null);
    const [fetching, setFetching] = useState(false);
    const [type, setType] = useState('create');
    const { getOptionsEdit, formatAdd } = useTreeOptions();

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.parent = itemToEdit?.parent ? itemToEdit?.parent?.id : null;
        formLevel.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createOrgLevel(values);
            setTimeout(() => {
                dispatch(getOrgLevelsOptions())
                message.success('Nivel organizacional registrado')
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nivel organizacional no registrado')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateOrgLevel(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Nivel organizacional actualizado')
                dispatch(getOrgLevelsOptions())
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nivel organizacional no actualizado')
                setFetching(false)
            }, 1000)
        }
    }

    const onFinish = (values) => {
        setFetching(true)
        if (isEdit) actionUpdate(values);
        else actionCreate(values);
    }

    const reset = () => {
        setFetching(false)
        formLevel.resetFields()
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

    const optionsBoolean = [
        { value: true, key: '1', label: 'Sí' },
        { value: false, key: '2', label: 'No' }
    ]

    const optionsStatus = [
        { value: true, key: '1', label: 'Activo' },
        { value: false, key: '2', label: 'Inactivo' }
    ]

    const optionsLevels = useMemo(() => {
        if (list_org_levels_tree.length <= 0 || !visible) return [];
        if (isEdit) return getOptionsEdit({
            value: itemToEdit?.id,
            list_tree: list_org_levels_tree
        })
        return list_org_levels_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option]
        }, [])
    }, [list_org_levels_tree, isEdit, visible])

    return (
        <Drawer
            title={isEdit
                ? 'Editar nivel organizacional'
                : 'Agregar nivel organizacional'
            }
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
                                form='form-org-levels'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-org-levels'
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
                    form={formLevel}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-org-levels'
                    initialValues={{
                        is_active: true
                    }}
                >
                    <Row gutter={[24, 0]}>
                        <Col span={24}>
                            <Form.Item
                                name='name'
                                label='Nombre'
                                rules={[ruleRequired]}
                            >
                                <Input maxLength={400} placeholder='Nombre' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='description'
                                label='Descripción'
                            >
                                <Input placeholder='Descripción' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='enable_assign_worktitle'
                                label='¿Permite asignar plazas?'
                            >
                                <Select
                                    allowClear
                                    placeholder='Seleccionar una opción'
                                    options={optionsBoolean}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='enable_custom_catalogs'
                                label='¿Permite catálogos personalizados?'
                            >
                                <Select
                                    allowClear
                                    placeholder='Seleccionar una opción'
                                    options={optionsBoolean}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='parent'
                                label='Precede'
                            >
                                <TreeSelect
                                    allowClear
                                    showSearch
                                    treeLine={{ showLeafIcon: false }}
                                    treeData={optionsLevels}
                                    treeDefaultExpandedKeys={itemToEdit?.parent 
                                        ? [itemToEdit?.parent?.id] : []}
                                    loading={load_org_levels_options}
                                    disabled={load_org_levels_options}
                                    placeholder='Seleccionar una opción'
                                    treeNodeFilterProp='name'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='is_active'
                                label='Estatus'
                            >
                                <Select
                                    placeholder='Seleccionar una opción'
                                    options={optionsStatus}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default ModalLevels