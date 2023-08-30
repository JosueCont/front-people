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
import { getRanksOptions } from '../../../../redux/OrgStructureDuck';

const ModalRanks = ({
    visible = false,
    itemToEdit = {},
    showAddNode = true,
    refreshList = true,
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
    const dispatch = useDispatch();
    const [formRank] = Form.useForm();

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
        formRank.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createRank(values);
            setTimeout(() => {
                message.success('Nivel jerárquico registrado')
                if (refreshList) dispatch(getRanksOptions());
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nivel jerárquico no registrado')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateRank(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Nivel jerárquico actualizado')
                if (refreshList) dispatch(getRanksOptions());
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nivel jerárquico no actualizado')
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
        formRank.resetFields()
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
                ? 'Editar nivel jerárquico'
                : 'Agregar nivel jerárquico'
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
                                form='form-ranks'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-ranks'
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
                    form={formRank}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-ranks'
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
                                    {showAddNode && (
                                        <div className='label-options default'>
                                            <Tooltip title='Agregar' placement='left'>
                                                <PlusOutlined onClick={() => setOpenModal(true)} />
                                            </Tooltip>
                                        </div>
                                    )}
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

export default ModalRanks