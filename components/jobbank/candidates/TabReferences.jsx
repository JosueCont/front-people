import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Dropdown,
    Menu,
    message,
    Button,
    Space
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SelectOutlined,
    DownloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import moment from 'moment';
import ModalReferences from './ModalReferences';
import { redirectTo } from '../../../utils/constant';

const TabReferences = ({
    action,
    setInfoReferences,
    infoReferences
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const fakeData = useMemo(()=>{
        return Array(20).fill(null).map((_, idx) =>{
            return {
                id: idx,
                name: 'Un archivo ' + idx,
                file: 'https://khorplus.s3.amazonaws.com/grupohuman/people/job_bank/customers/documents/3012023224739/diseno_info_cliente.pdf',
                fecha: '01/02/2023'
            }
        })
    },[])

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoReference(router.query.id);
        }
    },[router.query?.id])

    const getInfoReference = async (id) =>{
        try {
            setLoading(true);
            setTimeout(()=>{
                setInfoReferences(fakeData);
                setLoading(false);
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionUpdate = async (values) =>{
        try {
            message.success('Referencia actualizada')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Referencia no actualizada')
        }
    }

    const actionCreate = async (values) =>{
        try {
            values.append('candidate', router.query?.id)
            message.success('Referencia registrada')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Referencia no registrada')
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            message.success('Referencia eliminada')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Referencia no eliminada')
        }
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

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
                    onClick={() => openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key='3'
                    icon={<EyeOutlined/>}
                    onClick={()=> redirectTo(`${item.file}#toolbar=0`, true)}
                >
                    Visualizar
                </Menu.Item>
                {/* <Menu.Item
                    key='4'
                    icon={<DownloadOutlined/>}
                    onClick={()=> downloadCustomFile(item.file)}
                >
                    Descargar
                </Menu.Item> */}
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
            title: 'Archivo',
            render: (item) =>{
                return(
                    <>{item.file ? item.file?.split('/')?.at(-1) : null}</>
                )
            }
        },
        {
            title: 'Fecha de carga',
            render: (item) =>{
                return(
                    <>{moment().format('DD-MM-YYYY')}</>
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
                dataSource={infoReferences}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalReferences
                title={isEdit ? 'Actualizar referencia' : 'Agregar referencia'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta referencia?'
                visible={openModalDelete}
                keyTitle='name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabReferences