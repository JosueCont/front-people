import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Dropdown,
    Menu, 
    message
} from 'antd';
import {
    optionsLevelAcademic,
    optionsStatusAcademic
} from '../../../utils/constant';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined
} from '@ant-design/icons';
import ModalEducation from './ModalEducation';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';

const TabSchool = ({ sizeCol = 8, action }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [infoEducation, setInfoEducation] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoEducation(router.query.id);
        }
    },[router])

    const getInfoEducation = async (id) =>{
        try {
            setLoading(true);
            let response = await WebApiJobBank.getCandidateEducation(id);
            setInfoEducation(response.data);
            setLoading(false);
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            setLoading(true);
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.createCandidateEducation(body);
            message.success('Educación registrada');
            getInfoEducation(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Educación no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            setLoading(true)
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.updateCandidateEducation(itemToEdit.id, body);
            message.success('Educación actualizada');
            getInfoEducation(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Educación no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            setLoading(true)
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteCandidateEducation(id);
            message.success('Educación eliminadaa');
            getInfoEducation(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Educación no eliminada');
            setLoading(false)
        }
    }

    const validateAction = () => Object.keys(itemToEdit).length > 0;
    
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

    const getAcademic = (item) =>{
        if(!item.study_level) return null;
        const find_ = record => record.value == item.study_level;
        let result = optionsLevelAcademic.find(find_);
        if(!result) return null;
        return result.label;
    }

    const getStatus = (item) =>{
        if(!item.status) return null;
        const find_ = record => record.value == item.status;
        let result = optionsStatusAcademic.find(find_);
        if(!result) return null;
        return result.label;
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<PlusOutlined/>}
                    onClick={()=> setOpenModal(true)}
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
            title: 'Escolaridad',
            render: (item) =>{
                return(
                    <span>{getAcademic(item)}</span>
                )
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <span>{getStatus(item)}</span>
                )
            }
        },
        {
            title: 'Institución',
            dataIndex: 'institution_name',
            key: 'institution_name'
        },
        {
            title: 'Finalización',
            dataIndex: 'end_date',
            key: 'end_date'
        },
        {
            title: ()=>{
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
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
                className='table-custom'
                size='small'
                columns={columns}
                loading={loading}
                dataSource={infoEducation.results}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    total: infoEducation.count,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalEducation
                title={validateAction() && openModal ? 'Editar educación' : 'Agregar educación'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={validateAction() && openModal ? actionUpdate : actionCreate}
                textSave={validateAction() && openModal ? 'Actualizar' : 'Guardar'}
            />
           <DeleteItems
                title='¿Estás seguro de eliminar esta educación?'
                visible={openModalDelete}
                keyTitle='institution_name'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
            />
        </>
    )
}

export default TabSchool