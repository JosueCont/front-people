import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Menu,
    Dropdown,
    Button,
    message,
    Tooltip,
    Space,
    Tag
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import WebApiJobBank from '../../../api/WebApiJobBank';
import ModalExperience from './ModalExperience';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';

const TabExperience = ({
    action,
    setInfoExperience,
    infoExperience
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [withAction, setWithAction] = useState(true);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoExperience(router.query.id);
        }
    },[router.query?.id])

    const getInfoExperience = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getCandidateExperience(id, '&paginate=0');
            setInfoExperience(response.data);
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionUpdate = async (values) =>{
        try {
            setLoading(true)
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.updateCandidateExperience(itemToEdit.id, body);
            message.success('Experiencia actualizada');
            getInfoExperience(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Experiencia no actualizada');
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            setLoading(true)
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.createCandidateExperience(body);
            message.success('Experiencia registrada');
            getInfoExperience(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Experiencia no registrada')
            setLoading(false)
        }
    }

    const actionDelete = async () =>{
        try {
            setLoading(true)
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteCandidateExperience(id);
            message.success('Experiencia eliminadaa');
            getInfoExperience(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Experiencia no eliminada');
            setLoading(false)
        }
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
        setWithAction(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
        setWithAction(true)
    }

    const showModalList = (item) =>{
        setItemsToDelete(item.competences)
        setOpenModalDelete(true)
        setWithAction(false)
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
            title: 'Categoría',
            dataIndex: ['category', 'name'],
            key: ['category', 'name']
        },
        {
            title: 'Subcategoría',
            dataIndex: ['sub_category', 'name'],
            key: ['sub_category', 'name']
        },
        {
            title: 'Años de experiencia',
            dataIndex: 'experience_years',
            key: 'experience_years'
        },
        {
            title: 'Competencias',
            render: (item) =>{
                return(
                    <Space>
                        {item.competences?.length > 0 ? (
                            <Tooltip title='Ver competencias'>
                                <EyeOutlined
                                    style={{cursor: 'pointer'}}
                                    onClick={()=>showModalList(item)}
                                />
                            </Tooltip>
                        ):(
                            <EyeInvisibleOutlined />
                        )}
                        <Tag
                            icon={<FileTextOutlined style={{color:'#52c41a'}} />}
                            color='green' style={{fontSize: '14px'}}
                        >
                            {item.competences ? item.competences.length : 0}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: ()=> (
                <Button size='small' onClick={()=> setOpenModal(true)}>
                    Agregar
                </Button>
            ),
            width: 85,
            align: 'center',
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
            <Table
                rowKey='id'
                size='small'
                className='table-custom'
                columns={columns}
                loading={loading}
                dataSource={infoExperience}
                locale={{emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalExperience
                title={isEdit ? 'Editar experiencia' : 'Agregar experiencia'}
                actionForm={isEdit ? actionUpdate : actionCreate}
                close={closeModal}
                itemToEdit={itemToEdit}
                visible={openModal}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
            <ListItems
                title={withAction
                    ? '¿Estás seguro de eliminar esta experiencia?'
                    : 'Listado de competencias'
                }
                visible={openModalDelete}
                keyTitle={withAction ? 'category, name' : 'name'}
                keyDescription={withAction ? 'sub_category, name' : ''}
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
                textCancel={withAction ? 'Cancelar' : 'Cerrar'}
                useWithAction={withAction}
            />
        </>
    )
}

export default TabExperience