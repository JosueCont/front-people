import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Dropdown,
    Button,
    Menu
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ModalCatalogs from './ModalCatalogs';
import ListItems from '../../../common/ListItems';

const TableCatalogs = ({
    titleEdit = '',
    titleCreate = '',
    titleDelete = '',
    actionCreate = ()=>{},
    actionUpdate = ()=>{},
    actionDelete = ()=>{},
    actionBtnEdit,
    catalogResults = [],
    catalogLoading = false,
    openModal,
    setOpenModal,
    numPage = 1,
    keyTitle = 'name',
    extraFields = <></>,
    ExtraOptions = ()=> <></>,
    extraColumns = [{
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
    }]
}) => {

    const router = useRouter();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    
    const validateAction = useMemo(()=>{
        return Object.keys(itemToEdit).length > 0
    },[itemToEdit])

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

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const getActionForm = (values) =>{
        if(validateAction) actionUpdate(itemToEdit.id, values);
        else actionCreate(values);
    }

    const actionRemove = () =>{
        let id = itemsToDelete.at(-1).id;
        actionDelete(id);
    }

    const savePage = (query) => router.replace({
        pathname: router.asPath.split('?')[0],
        query
    })

    const onChangePage = ({current}) =>{
        let newQuery = {...router.query, page: current};
        if(newQuery.catalog) delete newQuery.catalog;
        if(current > 1){
            savePage(newQuery);
            return; 
        }
        if(newQuery.page) delete newQuery.page;
        savePage(newQuery)
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> actionBtnEdit
                        ? actionBtnEdit(item)
                        : openModalEdit(item)
                    }
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
                <ExtraOptions item={item}/>
            </Menu>
        );
    };

    const columns = [
        // {
        //     title: 'Nombre',
        //     dataIndex: 'name',
        //     key: 'name'
        // },
        ...extraColumns,
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
            <Table
                size='small'
                rowKey='id'
                columns={columns}
                onChange={onChangePage}
                dataSource={catalogResults.results}
                loading={catalogLoading}
                locale={{ emptyText: catalogLoading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    current: numPage,
                    total: catalogResults.count,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalCatalogs
                title={validateAction ? titleEdit : titleCreate}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={getActionForm}
                textSave={validateAction ? 'Actualizar' : 'Guardar'}
            >{extraFields}</ModalCatalogs>
            <ListItems
                title={titleDelete}
                visible={openModalDelete}
                keyTitle={keyTitle}
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionRemove}
            />
        </>
    )
}

export default TableCatalogs;