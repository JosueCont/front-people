import React, { useState } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Switch
} from 'antd';
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies, setPage } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import DeleteItems from '../../../common/DeleteItems';

const TableVacancies = ({
    load_vacancies,
    page_jobbank,
    list_vacancies,
    getVacancies,
    setPage,
    currentNode
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        closeModalDelete();
        try {
            await WebApiJobBank.deleteVacant({ids});
            getVacancies(currentNode.id)
            // console.log('eliminar is_deleted', ids)
            if(ids.length > 1) message.success('Vacantes eliminadas');
            else message.success('Vacante eliminada');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Vacantes no eliminadas');
            else message.error('Vacante no eliminada');
        }
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos vacantes')
        }
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const onChangePage = ({current}) =>{
        setPage(current)
        if (current == 1) getVacancies(currentNode?.id);
        if (current > 1) {
            const offset = (current - 1) * 10;
            const queryParam = `&limit=10&offset=${offset}`;
            getVacancies(currentNode?.id, queryParam, current)
        } 
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<DeleteOutlined/>}
                    onClick={()=>openModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/vacancies/edit`,
                        query:{ id: item.id }
                    })}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key={2}
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
        dataIndex: 'job_position',
        key: 'job_position'
    },
    {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: ()=> {
            return(
                <Dropdown overlay={menuTable}>
                    <Button size={'small'}>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        },
        render: (item) =>{
            return (
                <Dropdown overlay={()=> menuItem(item)}>
                    <Button size={'small'}>
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
            loading={load_vacancies}
            rowSelection={rowSelection}
            onChange={onChangePage}
            dataSource={list_vacancies.results}
            locale={{ emptyText: load_vacancies
                ? 'Cargando...'
                : 'No se encontraron resultados'
            }}
            pagination={{
                total: list_vacancies.count,
                current: page_jobbank,
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
        <DeleteItems
            title={itemsToDelete.length > 1
                ? '¿Estás seguro de eliminar estas vacantes?'
                : '¿Estás seguro de eliminar esta vacante?'
            }
            visible={openModalDelete}
            keyTitle='job_position'
            keyDescription='description'
            close={closeModalDelete}
            itemsToDelete={itemsToDelete}
            actionDelete={actionDelete}
        />
    </>
  )
}

const mapState = (state) =>{
    return{
        list_vacancies: state.jobBankStore.list_vacancies,
        load_vacancies: state.jobBankStore.load_vacancies,
        page_jobbank: state.jobBankStore.page_jobbank,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getVacancies,
        setPage
    }
)(TableVacancies);