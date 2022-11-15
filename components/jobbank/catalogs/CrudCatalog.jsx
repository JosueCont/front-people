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
import ModalCatalogs from './ModalCatalogs';

const CrudCatalog = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const { infoCatalog } = useCatalog();
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const actionUpdate = () =>{

    }

    const actionAdd = () =>{

    }

    const getTitleModal = () =>{
        let action = Object.keys(itemToEdit).length > 0
            ? 'Editar' : 'Agregar' ;
        return `${action} ${infoCatalog.titleModal}`;
    }

    const closeModal = () =>{

    }

    const closeModalEdit = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        // setItemsKeys([])
        setItemsToDelete([])
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const onFinishSearch = () =>{

    }

    const deleteFilter = () =>{

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
            <Row gutter={[0,16]}>
                <Col span={24}>
                    <Row gutter={[24,24]}>
                        <Col span={12}>
                            <Form
                                onFinish={onFinishSearch}
                                form={formSearch}
                                layout='inline'
                                style={{width: '100%'}}
                            >
                                <Row style={{width: '100%'}}>
                                    <Col span={16}>
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
                                </Row>
                            </Form>
                        </Col>
                        <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                // icon={<ArrowLeftOutlined />}
                                // onClick={()=> router.replace('/jobbank/settings')}
                            >
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        size='small'
                        columns={columns}
                        dataSource={infoCatalog.results}
                        loading={infoCatalog.loading}
                        pagination={{
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                    />
                </Col>
            </Row>
            <ModalCatalogs
                title={getTitleModal()}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={Object.keys(itemToEdit).length > 0
                    ? actionUpdate
                    : actionAdd
                }
                textSave={Object.keys(itemToEdit).length > 0
                    ? 'Actualizar'
                    : 'Guardar'
                }
            />
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
)(CrudCatalog);