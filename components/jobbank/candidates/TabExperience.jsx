import React, { useState, useEffect } from 'react';
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
import DeleteItems from '../../../common/DeleteItems';
import ListCompetences from './ListCompetences';

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
    const [openModalList, setOpenModalList] = useState(false);
    const [itemSelected, setItemSelected] = useState({});

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

    const validateAction = () => Object.keys(itemToEdit).length > 0;

    const showModalAdd = () =>{
        setItemToEdit({})
        setOpenModal(true)
    }

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
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const showModalList = (item) =>{
        setItemSelected(item)
        setOpenModalList(true)
    }

    const closeModalList = () =>{
        setItemToEdit({})
        setOpenModalList(false)
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<PlusOutlined/>}
                    onClick={()=> showModalAdd()}
                >
                    Agregar
                </Menu.Item>
            </Menu>
        );
    };

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
            // title: ()=>{
            //     return(
            //         <Dropdown overlay={menuTable}>
            //             <Button size={'small'}>
            //                 <EllipsisOutlined />
            //             </Button>
            //         </Dropdown>
            //     )
            // },
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
                title={validateAction() && openModal ? 'Editar experiencia' : 'Agregar experiencia'}
                actionForm={validateAction() && openModal ? actionUpdate : actionCreate}
                close={closeModal}
                itemToEdit={itemToEdit}
                visible={openModal}
                textSave={validateAction() && openModal ? 'Actualizar' : 'Guardar'}
            />
            <DeleteItems
                title='¿Estás seguro de eliminar esta experiencia?'
                visible={openModalDelete}
                keyTitle='category, name'
                keyDescription='sub_category, name'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
            />
            <ListCompetences
                itemSelected={itemSelected}
                close={closeModalList}
                visible={openModalList}
            />
        </>
    )
}

export default TabExperience