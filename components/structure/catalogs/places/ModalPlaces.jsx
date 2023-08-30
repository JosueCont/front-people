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
    Tooltip,
    InputNumber
} from 'antd';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { fourDecimal, numCommaAndDot, ruleRequired } from '../../../../utils/rules';
import { useTreeOptions } from '../../useTreeOptions';
import {
    LoadingOutlined,
    PlusOutlined,
    UndoOutlined
} from '@ant-design/icons';
import ModalNodes from '../nodes/ModalNodes';
import ModalJobs from '../jobs/ModalJobs';
import ModalRanks from '../ranks/ModalRanks';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { getPlacesOptions } from '../../../../redux/OrgStructureDuck';
import { validateMaxLength, validateNum } from '../../../../utils/functions';
import { countBy } from 'lodash';

const ModalPlaces = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const noValid = [undefined, null, '', ' '];

    const {
        list_org_nodes_options,
        list_org_nodes_tree,
        load_org_nodes_options,
        list_jobs_options,
        load_jobs_options,
        list_ranks_options,
        load_ranks_options,
        list_places_options,
        load_places_options
    } = useSelector(state => state.orgStore);

    const refSubmit = useRef(null);
    const dispatch = useDispatch();
    const [formPlaces] = Form.useForm();
    const [type, setType] = useState('create');
    const [fetching, setFetching] = useState(false);

    const [openRank, setOpenRank] = useState(false);
    const [openNode, setOpenNode] = useState(false);
    const [openJob, setOpenJob] = useState(false);

    const { formatAdd } = useTreeOptions();

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.hierarchical_level = itemToEdit?.hierarchical_level
            ? itemToEdit?.hierarchical_level?.id : null;
        values.organizational_node = itemToEdit?.organizational_node
            ? itemToEdit?.organizational_node?.id : null;
        values.salary = itemToEdit?.salary
            ? parseFloat(itemToEdit?.salary).toLocaleString('es-Mx', { maximumFractionDigits: 4 }) : null;
        values.position_report = itemToEdit?.position_report
            ? itemToEdit?.position_report?.id : null;
        formPlaces.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createPlace(values);
            setTimeout(() => {
                message.success('Plaza registrada')
                dispatch(getPlacesOptions())
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Plaza no registrada')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updatePlace(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Plaza actualizada')
                dispatch(getPlacesOptions())
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Plaza no actualizada')
                setFetching(false)
            }, 1000)
        }
    }

    const createData = (values = {}) => {
        values.salary = values?.salary
            ? parseFloat(values.salary?.replace(/,/g, '')) : null;
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
        formPlaces.resetFields()
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

    const optionsNodes = useMemo(() => {
        if (list_org_nodes_tree.length <= 0 || !visible) return [];
        return list_org_nodes_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option];
        }, [])
    }, [list_org_nodes_tree, itemToEdit, visible])

    const optionsPlaces = useMemo(() => {
        let id = itemToEdit?.id;
        if (!id) return list_places_options;
        // const filter_ = item => item.id !== id;
        // return list_places_options.filter(filter_);
        return list_places_options.reduce((acc, item) => {
            if (item?.id == id) return acc;
            if (item?.position_report?.id == id) return acc;
            return [...acc, item]
        }, [])
    }, [list_places_options, itemToEdit])

    const ruleDecimal = () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            let num = parseFloat(value?.replaceAll(",", ""));
            let pattern = /^(?:\d{0,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/;
            if (isNaN(num)) return Promise.reject('Ingrese un valor numérico');
            if (!pattern.test(value)) return Promise.reject('Ingrese un formato válido');
            let parts = value?.split('.');
            if (parts.length > 1
                && parts?.at(-1).length > 4
            ) return Promise.reject('Máximo cuatro decimales');
            if (num < 1) return Promise.reject('Ingrese un valor mayor o igual a 1');
            return Promise.resolve();
        }
    })

    return (
        <Drawer
            title={isEdit ? 'Editar plaza' : 'Agregar plaza'}
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
                backgroundColor: (openRank || openJob || openNode) ? 'transparent' : 'rgba(0,0,0,0.45)'
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
                                form='form-places'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-places'
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
                    form={formPlaces}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-places'
                    initialValues={{
                        is_active: true,
                        is_vacant: false,
                        salary: null
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
                                    <label>Puesto de trabajo</label>
                                    <div className='label-options default'>
                                        <Tooltip title='Agregar' placement='left'>
                                            <PlusOutlined onClick={() => setOpenJob(true)} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <Form.Item
                                    name='job'
                                    noStyle
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder='Seleccionar una opción'
                                        notFoundContent='No se encontraron resultados'
                                        disabled={load_jobs_options}
                                        loading={load_jobs_options}
                                        optionFilterProp='children'
                                    >
                                        {list_jobs_options?.length > 0 && list_jobs_options.map(item => (
                                            <Select.Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='salary'
                                label='Salario'
                                rules={[ruleDecimal]}
                            >
                                <Input
                                    maxLength={13}
                                    prefix='$'
                                    allowClear
                                    placeholder='10,000.0000'
                                    style={{
                                        border: '1px solid black'
                                    }}
                                />
                                {/* <InputNumber
                                    min={1}
                                    maxLength={13}
                                    prefix='$'
                                    placeholder='10,000.0000'
                                    controls={false}
                                    keyboard={false}
                                    stringMode={true}
                                    onKeyPress={validateMaxLength}
                                    formatter={(value) => {
                                        let parts = `${value}`.split('.', 2);
                                        parts[0] = `${parts[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        if (parts.length > 1) {
                                            parts[1] = `${parts[1]}`.replace(/\$\s?|(,*)|./g, '')
                                        }
                                        return parts.join('.')
                                    }}
                                    style={{
                                        width: '100%',
                                        borderRadius: 10,
                                        border: '1px solid black'
                                    }}
                                /> */}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <div className='custom-label-form'>
                                    <label>Nivel jerárquico</label>
                                    <div className='label-options default'>
                                        <Tooltip title='Agregar' placement='left'>
                                            <PlusOutlined onClick={() => setOpenRank(true)} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <Form.Item
                                    name='hierarchical_level'
                                    noStyle
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder='Seleccionar una opción'
                                        notFoundContent='No se encontraron resultados'
                                        disabled={load_ranks_options}
                                        loading={load_ranks_options}
                                        optionFilterProp='children'
                                    >
                                        {list_ranks_options?.length > 0 && list_ranks_options.map(item => (
                                            <Select.Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <div className='custom-label-form'>
                                    <label>Nodo organizacional</label>
                                    <div className='label-options default'>
                                        <Tooltip title='Agregar' placement='left'>
                                            <PlusOutlined onClick={() => setOpenNode(true)} />
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
                                name='position_report'
                                label='Plaza a la que reporta'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    disabled={load_places_options}
                                    loading={load_places_options}
                                    optionFilterProp='children'
                                >
                                    {optionsPlaces?.length > 0 && optionsPlaces.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='is_vacant'
                                label='¿Está vacante?'
                            >
                                <Select placeholder='Seleccionar una opción'>
                                    <Select.Option value={true} key='1'>
                                        Sí
                                    </Select.Option>
                                    <Select.Option value={false} key='2'>
                                        No
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
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
                    </Row>
                </Form>
            </Spin>
            <ModalNodes
                visible={openNode}
                close={() => setOpenNode(false)}
            />
            <ModalJobs
                visible={openJob}
                showAddNode={false}
                close={() => setOpenJob(false)}
            />
            <ModalRanks
                visible={openRank}
                showAddNode={false}
                close={() => setOpenRank(false)}
            />
        </Drawer>
    )
}

export default ModalPlaces