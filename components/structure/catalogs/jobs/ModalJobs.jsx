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
    Spin,
    message,
    Tooltip
} from 'antd';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { ruleRequired } from '../../../../utils/rules';
import { useTreeOptions } from '../../useTreeOptions';
import {
    LoadingOutlined,
    PlusOutlined,
    UndoOutlined
} from '@ant-design/icons';
import ModalNodes from '../nodes/ModalNodes';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';

const ModalJobs = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const noValid = [undefined, null, '', ' '];

    const {
        list_org_nodes_options,
        list_org_nodes_tree,
        load_org_nodes_options
    } = useSelector(state => state.orgStore);
    const refSubmit = useRef(null);
    const [formJobs] = Form.useForm();
    const [type, setType] = useState('create');
    const [fetching, setFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { formatAdd } = useTreeOptions();

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.organizational_node = itemToEdit?.organizational_node
            ? itemToEdit?.organizational_node?.id : null;
        formJobs.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createJob(values);
            setTimeout(() => {
                message.success('Puesto de trabajo registrado')
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Puesto de trabajo no registrado')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateJob(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Puesto de trabajo actualizado')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Puesto de trabajo no actualizado')
                setFetching(false)
            }, 1000)
        }
    }

    const createData = (values = {}) => {
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
        formJobs.resetFields()
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
        { value: true, key: '1', label: 'Activo' },
        { value: false, key: '2', label: 'Inactivo' }
    ]

    const optionsNodes = useMemo(() => {
        if (list_org_nodes_tree.length <= 0 || !visible) return [];
        return list_org_nodes_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option];
        }, [])
    }, [list_org_nodes_tree, itemToEdit, visible])

    return (
        <Drawer
            title={isEdit
                ? 'Editar puesto de trabajo'
                : 'Agregar puesto de trabajo'
            }
            width={500}
            visible={visible}
            placement='right'
            maskClosable={false}
            closable={!fetching}
            keyboard={false}
            onClose={() => onClose()}
            className='ant-table-colla'
            maskStyle={{
                transition: 'background-color 0.3s',
                backgroundColor: openModal ? 'transparent' : 'rgba(0,0,0,0.45)'
            }}
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
                                form='form-jobs'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-jobs'
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
                    form={formJobs}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-jobs'
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
                            <Form.Item>
                                <div className='custom-label-form'>
                                    <label>Nodo organizacional</label>
                                    <div className='label-options default'>
                                        <Tooltip title='Agregar' placement='left'>
                                            <PlusOutlined onClick={() => setOpenModal(true)} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <Form.Item
                                    name='organizational_node'
                                    noStyle
                                >
                                    <TreeSelect
                                        allowClear
                                        showSearch
                                        treeLine={{ showLeafIcon: false }}
                                        treeData={optionsNodes}
                                        treeDefaultExpandedKeys={itemToEdit?.organizational_node
                                            ? [itemToEdit?.organizational_node?.id] : []}
                                        loading={load_org_nodes_options}
                                        disabled={load_org_nodes_options}
                                        placeholder='Seleccionar una opción'
                                        treeNodeFilterProp='name'
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='is_active'
                                label='Estatus'
                            >
                                <Select
                                    placeholder='Seleccionar una opción'
                                    options={optionsBoolean}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
            <ModalNodes
                visible={openModal}
                close={() => setOpenModal(false)}
            />
        </Drawer>
    )
}

export default ModalJobs