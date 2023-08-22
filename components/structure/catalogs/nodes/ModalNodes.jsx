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
    Upload,
    Drawer,
    Space,
    Spin,
    message,
    Typography
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
import { DeleteOutlined } from '@ant-design/icons';
import ModalLevels from '../levels/ModalLevels';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { getOrgNodesOptions } from '../../../../redux/OrgStructureDuck';
import { getFileExtension, valueToFilter } from '../../../../utils/functions';
import axios from 'axios';

const ModalNodes = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const noValid = [undefined, null, '', ' '];
    const typeFile = ['png', 'jpg', 'jpeg'];

    const {
        list_org_levels_options,
        list_org_levels_tree,
        load_org_levels_options,
        list_org_nodes_options,
        list_org_nodes_tree,
        load_org_nodes_options
    } = useSelector(state => state.orgStore);
    const dispatch = useDispatch();
    const refSubmit = useRef(null);
    const [formNode] = Form.useForm();
    const [file, setFile] = useState([]);
    const [type, setType] = useState('create');
    const [preview, setPreview] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loadFile, setLoadFile] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [deleteImg, setDeleteImg] = useState(false);
    const { getOptionsEdit, formatAdd } = useTreeOptions();

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.parent = itemToEdit?.parent ? itemToEdit?.parent?.id : null;
        values.organizational_level = itemToEdit?.organizational_level
            ? itemToEdit?.organizational_level?.id : null;
        formNode.setFieldsValue(values)
        onPreviewImg()
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createOrgNode(values);
            setTimeout(() => {
                dispatch(getOrgNodesOptions())
                message.success('Nodo organizacional registrado')
                submitAction()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nodo organizacional no registrado')
                setFetching(false)
            }, 1000)
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateOrgNode(itemToEdit?.id, values)
            setTimeout(() => {
                message.success('Nodo organizacional actualizado')
                dispatch(getOrgNodesOptions())
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error('Nodo organizacional no actualizado')
                setFetching(false)
            }, 1000)
        }
    }

    const createData = (values = {}) => {
        let data = new FormData();
        if (file.length > 0) data.append('image', file[0]);
        if (deleteImg) data.append('delete_image', deleteImg);
        const forEach_ = ([key, val]) => data.append(key, !noValid.includes(val) ? val : '');
        Object.entries(values).forEach(forEach_);
        return data;
    }

    const onFinish = (values) => {
        setFetching(true)
        let body = createData(values);
        if (isEdit) actionUpdate(body);
        else actionCreate(body);
    }

    const onPreviewImg = async (reload) => {
        let preview_ = itemToEdit?.image ? itemToEdit?.image : null;
        if (!preview_) return;
        const img = new Image();
        setLoadFile(true)
        img.src = preview_;
        img.onload = (e) => {
            setDeleteImg(false)
            setLoadFile(false)
            setErrorFile(false)
            setPreview(preview_)
        }
    }

    const reset = () => {
        setFile([])
        setPreview(null)
        setFetching(false)
        setErrorFile(false)
        setDeleteImg(false)
        formNode.resetFields()
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

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const beforeUpload = (file) => {
        let extension = getFileExtension(file?.name);
        let isValid = typeFile.includes(valueToFilter(extension));
        if (isValid) setDeleteImg(false);
        setErrorFile(!isValid);
        return isValid;
    }

    const onUpload = (info) => {
        if (info.file.status == 'uploading') {
            setLoadFile(true)
            return;
        }
        if (info.file.status == 'done') {
            setFile([info?.file?.originFileObj])
            getBase64(info.file.originFileObj, (url) => {
                setTimeout(() => {
                    setLoadFile(false)
                    setPreview(url)
                }, 1000)
            })
        }
    }

    const onDelete = () => {
        setFile([])
        setPreview(null)
        setErrorFile(false)
        setDeleteImg(!!itemToEdit?.image)
    }

    const optionsBoolean = [
        { value: true, key: '1', label: 'Activo' },
        { value: false, key: '2', label: 'Inactivo' }
    ]

    const optionsLevels = useMemo(() => {
        if (list_org_levels_tree.length <= 0 || !visible) return [];
        return list_org_levels_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option]
        }, [])
    }, [list_org_levels_tree, visible])

    const optionsNodes = useMemo(() => {
        if (list_org_nodes_tree.length <= 0 || !visible) return [];
        if (isEdit) return getOptionsEdit({
            value: itemToEdit?.id,
            list_tree: list_org_nodes_tree
        })
        return list_org_nodes_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option];
        }, [])
    }, [list_org_nodes_tree, isEdit, visible])

    return (
        <Drawer
            title={isEdit
                ? 'Editar nodo organizacional'
                : 'Agregar nodo organizacional'
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
                                form='form-org-nodes'
                            >
                                Actualizar
                            </Button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{ display: 'none' }}
                                form='form-org-nodes'
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
                    form={formNode}
                    onFinish={onFinish}
                    layout='vertical'
                    id='form-org-nodes'
                    initialValues={{
                        is_active: true
                    }}
                >
                    <Row gutter={[24, 0]}>
                        <Col span={24} className='ant-node-img'>
                            <Spin
                                spinning={loadFile}
                                indicator={<LoadingOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />}
                            >
                                <Upload
                                    name='image'
                                    listType='picture-card'
                                    className='avatar-uploader'
                                    showUploadList={false}
                                    onChange={onUpload}
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
                                    accept={typeFile.reduce((acc, item) => `${acc}.${item}, `, '')}
                                >
                                    {preview ? (
                                        <div className='ant-node-file'>
                                            <img src={preview} alt='avatar' />
                                            {/* <div className='ant-file-actions'>
                                                <DeleteOutlined title='Borrar' onClick={onDelete} />
                                            </div> */}
                                        </div>
                                    ) : !loadFile && (
                                        <div>
                                            <PlusOutlined />
                                            <div>Cargar</div>
                                        </div>
                                    )}
                                </Upload>
                                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        type='button'
                                        disabled={!preview}
                                        className='ant-btn-simple small'
                                        onClick={() => onDelete()}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        type='button'
                                        disabled={!(isEdit && !preview && itemToEdit?.image)}
                                        className='ant-btn-simple small'
                                        onClick={() => onPreviewImg()}
                                    >
                                        <span>Restaurar</span>
                                    </button>
                                </div>
                                {errorFile && (
                                    <Typography.Text
                                        type='danger'
                                        className='ant-error-text'
                                    >
                                        Archivo no válido
                                    </Typography.Text>
                                )}
                            </Spin>
                        </Col>
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
                                    <label>Nivel organizacional</label>
                                    <div className={`label-options default`}>
                                        <PlusOutlined onClick={() => setOpenModal(true)} />
                                    </div>
                                </div>
                                <Form.Item
                                    name='organizational_level'
                                    noStyle
                                >
                                    <TreeSelect
                                        allowClear
                                        showSearch
                                        treeLine={{ showLeafIcon: false }}
                                        treeData={optionsLevels}
                                        treeDefaultExpandedKeys={itemToEdit?.organizational_level
                                            ? [itemToEdit?.organizational_level?.id] : []}
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
                                name='parent'
                                label='Precede'
                            >
                                <TreeSelect
                                    allowClear
                                    showSearch
                                    treeLine={{ showLeafIcon: false }}
                                    treeData={optionsNodes}
                                    treeDefaultExpandedKeys={itemToEdit?.parent 
                                        ? [itemToEdit?.parent?.id] : []}
                                    loading={load_org_nodes_options}
                                    disabled={load_org_nodes_options}
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
                                    options={optionsBoolean}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
            <ModalLevels
                visible={openModal}
                close={() => setOpenModal(false)}
            />
        </Drawer>
    )
}

export default ModalNodes