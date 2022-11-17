import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    Row,
    Col,
    Input,
    Table,
    Form,
    Dropdown,
    Button,
    Menu
} from 'antd';
import { useCatalog } from './hook/useCatalog';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    SyncOutlined,
    SettingOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { ruleWhiteSpace } from '../../../utils/rules';
import { valueToFilter } from '../../../utils/functions';
import ModalCatalogs from './ModalCatalogs';
import DeleteItems from '../../../common/DeleteItems';

const TableCatalogs = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const { currentCatalog, infoCatalog, setCurrentCatalog } = useCatalog();
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const onFinishSearch = (values) =>{
        if(!values.name) return;
        setCurrentCatalog({...currentCatalog, loading: true});
        const _filter = item => valueToFilter(item.name).includes(valueToFilter(values.name));
        let results = infoCatalog.results?.filter(_filter);
        setTimeout(()=>{
            setCurrentCatalog({results, loading: false})
        },1000)
        
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setCurrentCatalog({...currentCatalog, loading: true});
        setTimeout(()=>{
            setCurrentCatalog({
                results: infoCatalog.results,
                loading: false
            });
        },1000)
    }

    const validateAction = () => Object.keys(itemToEdit).length > 0;

    const getTitleModal = () =>{
        let check = validateAction();
        let actionName = check ? 'Editar' : 'Agregar';
        return `${actionName} ${infoCatalog.titleModal}`;
    }

    const getTitleDelete = () =>{
        let text = '¿Estás seguro de eliminar esta/este';
        return `${text} ${infoCatalog.titleModal}?`;
    }

    const actionUpdate = (values) =>{
        infoCatalog.updateAction(itemToEdit.id, values);
    }

    const actionDelete = () =>{
        closeModalDelete();
        let id = itemsToDelete.at(-1).id;
        infoCatalog.deleteAction(id);
    }

    const getActionModal = () =>{
        let check = validateAction();
        return check ? actionUpdate : infoCatalog.createAction;
    }

    const getTextModal = () =>{
        let check = validateAction();
        return check ? 'Actualizar' : 'Guardar';
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalAdd = () =>{
        setItemToEdit({})
        setOpenModal(true)
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Acciones',
            render: (item) =>{
                return(
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Row gutter={[0,24]}>
                <Col span={24}>
                    <Form
                        onFinish={onFinishSearch}
                        form={formSearch}
                        layout='inline'
                        style={{width: '100%'}}
                    >
                        <Row style={{width: '100%'}}>
                            <Col span={8}>
                                <Form.Item
                                    name='name'
                                    rules={[ruleWhiteSpace]}
                                    style={{marginBottom: 0}}
                                >
                                    <Input placeholder='Buscar por nombre'/>
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{display: 'flex', gap: '8px'}}>
                                <Button htmlType='submit'>
                                    <SearchOutlined />
                                </Button>
                                <Button onClick={()=> deleteFilter()}>
                                    <SyncOutlined />
                                </Button>
                            </Col>
                            <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button onClick={()=> openModalAdd(true)}>
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={24}>
                    <Table
                        size='small'
                        rowKey='id'
                        columns={columns}
                        dataSource={currentCatalog.results}
                        loading={currentCatalog.loading}
                        locale={{ emptyText: currentCatalog.loading
                            ? 'Cargando...'
                            : 'No se encontraron resultados'
                        }}
                        pagination={{
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                    />
                </Col>
            </Row>
            {openModal && (
                <ModalCatalogs
                    title={getTitleModal()}
                    visible={openModal}
                    close={closeModal}
                    itemToEdit={itemToEdit}
                    actionForm={getActionModal()}
                    textSave={getTextModal()}
                />
            )}
            {openModalDelete && (
                <DeleteItems
                    title='¿Estás seguro de eliminarlo?'
                    visible={openModalDelete}
                    keyTitle='name'
                    close={closeModalDelete}
                    itemsToDelete={itemsToDelete}
                    actionDelete={actionDelete}
                />
            )}
        </>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {}
)(TableCatalogs);