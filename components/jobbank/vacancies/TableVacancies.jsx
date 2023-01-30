import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Select,
  Tag,
  Tooltip
} from 'antd';
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import { optionsStatusVacant } from '../../../utils/constant';

const TableVacancies = ({
    load_vacancies,
    jobbank_page,
    list_vacancies,
    getVacancies,
    currentNode,
    jobbank_filters,
    jobbank_page_size
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [useToDelete, setUseToDelete] = useState(true);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        try {
            await WebApiJobBank.deleteVacant({ids});
            getVacancies(currentNode.id, jobbank_filters, jobbank_page);
            let msg = ids.length > 1 ? 'Vacantes eliminadas' : 'Vacante eliminada';
            message.success(msg)
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Vacantes no eliminadas' : 'Vacante no eliminada';
            message.error(msg);
        }
    }

    const actionStatus = async (value, item) =>{
        try {
            await WebApiJobBank.updateVacantStatus(item.id, {status: value});
            getVacancies(currentNode.id, jobbank_filters, jobbank_page);
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const actionDuplicate = async (item) =>{
        const key = 'updatable';
        message.loading({content: 'Duplicando vacante...', key});
        try {
            await WebApiJobBank.duplicateVacant(item.id);
            setTimeout(()=>{
                message.success({content: 'Vacante duplicada', key});
                getVacancies(currentNode.id, jobbank_filters, jobbank_page);
            },1000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                message.error({content: 'Vacante no duplicada', key});
            },1000)
        }
    }

    const openModalManyDelete = () =>{
        const filter_ = item => item.has_strategy;
        let notDelete = itemsToDelete.filter(filter_);
        if(notDelete.length > 0){
            setUseToDelete(false)
            setOpenModalDelete(true)
            setItemsToDelete(notDelete)
            return;
        }
        setUseToDelete(true);
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
            return;
        }
        setOpenModalDelete(false)
        message.error('Selecciona al menos dos vacantes')
    }

    const openModalRemove = (item) =>{
        setUseToDelete(!item?.has_strategy)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setUseToDelete(true)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const titleDelete = useMemo(()=>{
        if(!useToDelete){
            return itemsToDelete.length > 1
            ? `Estas vacantes no se pueden eliminar, ya que
                se encuentran asociadas a una estrategia`
            : `Esta vacante no se puede eliminar, ya que
                se encuentra asociada a una estrategia`;
        }
        return itemsToDelete.length > 1
            ? '¿Estás seguro de eliminar estas vacantes?'
            : '¿Estás seguro de eliminar esta vacante?';
    },[useToDelete, itemsToDelete])
    
    const onChangePage = ({current, pageSize}) =>{
        router.replace({
            pathname: '/jobbank/vacancies',
            query: {...router.query, page: current, size: pageSize}
        })
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
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/vacancies/edit`,
                        query: {...router.query, id: item.id }
                    })}
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
                <Menu.Item
                    key='3'
                    icon={<CopyOutlined />}
                    onClick={()=> actionDuplicate(item)}
                >
                    Duplicar
                </Menu.Item>
                {/* {item.status == 1 && (
                    <Menu.Item
                        key='4'
                        icon={<SettingOutlined />}
                        onClick={()=> router.push({
                            pathname: '/jobbank/publications/add',
                            query: {...router.query, vacancy: item.id }
                        })}
                    >
                        Configurar publicación
                    </Menu.Item>
                )} */}
            </Menu>
        );
    };

  const columns = [
    {
        title: 'Vacante',
        dataIndex: 'job_position',
        key: 'job_position',
        ellipsis: true
    },
    {
        title: 'Cliente',
        dataIndex: ['customer', 'name'],
        key: ['customer', 'name']
    },
    {
        title: 'Estatus',
        render: (item) =>{
            return (
                <Select
                    size='small'
                    style={{width: 101}}
                    defaultValue={item.status}
                    value={item.status}
                    placeholder='Estatus'
                    options={optionsStatusVacant}
                    onChange={(e) => actionStatus(e, item)}
                />
            )
        }
    },
    {
        title: 'Estrategia',
        render: (item) =>{
            return item.has_strategy ? (
                <a
                    style={{color: '#1890ff'}}
                    onClick={()=> router.push({
                        pathname: '/jobbank/strategies/edit',
                        query: {id: item.has_strategy}
                    })}
                >
                    Ver estrategia
                </a>
            ) : <></>;
        }
    },
    {
        title: 'Reclutador',
        dataIndex: ['recruiter', 'full_name'],
        key: ['recruiter', 'full_name']
        
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
        width: 60, 
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
                pageSize: jobbank_page_size,
                current: jobbank_page,
                showSizeChanger: list_vacancies.count > jobbank_page_size,
                hideOnSinglePage: list_vacancies.count <= jobbank_page_size
            }}
        />
        <ListItems
            title={titleDelete}
            visible={openModalDelete}
            keyTitle='job_position'
            keyDescription='customer, name'
            close={closeModalDelete}
            itemsToList={itemsToDelete}
            actionConfirm={actionDelete}
            textCancel={useToDelete ? 'Cancelar' : 'Cerrar'}
            useWithAction={useToDelete}
        />
    </>
  )
}

const mapState = (state) =>{
    return{
        list_vacancies: state.jobBankStore.list_vacancies,
        load_vacancies: state.jobBankStore.load_vacancies,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node,
        jobbank_page_size: state.jobBankStore.jobbank_page_size
    }
}

export default connect(
    mapState, { getVacancies }
)(TableVacancies);