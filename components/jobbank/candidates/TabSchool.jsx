import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Button,
    Dropdown,
    Menu, 
    message
} from 'antd';
import { optionsStatusAcademic } from '../../../utils/constant';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    DownloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import ModalEducation from './ModalEducation';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import ListItems from '../../../common/ListItems';
import moment from 'moment';
import { downloadCustomFile, popupPDF } from '../../../utils/functions';
import { redirectTo } from '../../../utils/constant';

const TabSchool = ({
    action,
    setInfoEducation,
    infoEducation = []
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const infoEducationOrder = useMemo(()=>{
        let data = [...infoEducation];
        if(data?.length <=0) return [];
        return data.sort((a,b) => {
            if (a.study_level.name > b.study_level.name) return 1;
            if (a.study_level.name < b.study_level.name) return -1;
            return 0;
        })
    },[infoEducation])

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoEducation(router.query.id);
        }
    },[router.query?.id])

    const getInfoEducation = async (id) =>{
        try {
            setLoading(true);
            let response = await WebApiJobBank.getCandidateEducation(id, '&paginate=0');
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
            values.append('candidate', router.query?.id);
            await WebApiJobBank.createCandidateEducation(values);
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
            values.append('candidate', router.query?.id);
            await WebApiJobBank.updateCandidateEducation(itemToEdit.id, values);
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
            message.success('Educación eliminada');
            getInfoEducation(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Educación no eliminada');
            setLoading(false)
        }
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])
    
    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item]);
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const getStatus = (item) =>{
        if(!item.status) return null;
        const find_ = record => record.value == item.status;
        let result = optionsStatusAcademic.find(find_);
        if(!result) return null;
        return result.label;
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
                {(item.url_file || item.file) && (
                    <>
                        <Menu.Divider/>
                        {item.url_file && (
                            <Menu.Item
                                key='4'
                                icon={<EyeOutlined />}
                                onClick = {()=> redirectTo(item.url_file, true)}
                            >
                                Ver certificado
                            </Menu.Item>
                        )}
                        {item.file && (
                            <Menu.Item
                                key='3'
                                icon={<DownloadOutlined/>}
                                onClick={()=> downloadCustomFile({
                                    url: item.file,
                                    name: item.file?.split('/')?.at(-1)
                                })}
                            >
                                Descargar certificado
                            </Menu.Item>
                        )}
                    </>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Escolaridad',
            dataIndex: ['study_level', 'name'],
            key: ['study_level', 'name']
        },
        {
            title: 'Institución',
            dataIndex: 'institution_name',
            key: 'institution_name',
            ellipsis: true
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <>{getStatus(item)}</>
                )
            }
        },
        {
            title: 'Certificado',
            render: (item) =>{
                return item.file ? (
                    <>{item.file?.split('/').at(-1)}</>
                ) : <></>;
            }
        },
        {
            title: 'Fecha finalización',
            render: (item) =>{
                return(
                    <>{item.end_date ? moment(item.end_date, 'YY-MM-DD').format('DD-MM-YYYY') : ''}</>
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
                className='table-custom'
                size='small'
                columns={columns}
                loading={loading}
                dataSource={infoEducationOrder}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalEducation
                title={isEdit ? 'Editar educación' : 'Agregar educación'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
           <ListItems
                title='¿Estás seguro de eliminar esta educación?'
                visible={openModalDelete}
                keyTitle='study_level, name'
                keyDescription='institution_name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabSchool