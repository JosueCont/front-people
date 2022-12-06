import React, { useState } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Select
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
import DeleteItems from '../../../common/DeleteItems';
import { optionsStatusVacant } from '../../../utils/constant';
import { getFiltersJB } from '../../../utils/functions';

const TableVacancies = ({
    load_vacancies,
    jobbank_page,
    list_vacancies,
    getVacancies,
    currentNode
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [viewAsList, setViewAsList] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        try {
            await WebApiJobBank.deleteVacant({ids});
            getVacanciesWithFilters();
            if(ids.length > 1) message.success('Vacantes eliminadas');
            else message.success('Vacante eliminada');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Vacantes no eliminadas');
            else message.error('Vacante no eliminada');
        }
    }

    const actionStatus = async (value, item) =>{
        try {
            await WebApiJobBank.updateVacantStatus(item.id, {status: value});
            getVacanciesWithFilters();
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const actionDuplicate = async (item) =>{
        const key = 'updatable';
        try {
            message.loading({content: 'Duplicando...', key});
            await WebApiJobBank.duplicateVacant(item.id);
            setTimeout(()=>{
                message.success({content: 'Vacante duplicada', key});
                getVacanciesWithFilters();
            },1000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                message.error({content: 'Vacante no duplicada', key});
            },1000)
        }
    }

    const getVacanciesWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB(router.query);
        getVacancies(currentNode.id, filters, page);
    }

    const openModalManyDelete = () =>{
        const filter_ = item => item.has_estrategy;
        let notDelete = itemsToDelete.filter(filter_);
        if(notDelete.length > 0){
            setViewAsList(true)
            setOpenModalDelete(true)
            setItemsToDelete(notDelete)
            return;
        }
        setViewAsList(false);
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
            return;
        }
        setOpenModalDelete(false)
        message.error('Selecciona al menos dos vacantes')
    }

    const openModalRemove = (item) =>{
        if(item.has_estrategy){
            let msg = `Esta vacante no se puede eliminar,
            ya que se encuentra asociada a una estrategia.`;
            message.error({content: msg, duration: 4});
            return;
        }
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        if(viewAsList) return;
        setItemsKeys([])
        setItemsToDelete([])
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/vacancies',
        query
    })

    const onChangePage = ({current}) =>{
        if(current > 1) savePage({...router.query, page: current});
        else{
            let newQuery = {...router.query};
            if(newQuery.page) delete newQuery.page;
            savePage(newQuery)
        };
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
                {/* <Menu.Item
                    key='3'
                    icon={<SettingOutlined />}
                    onClick={()=> router.push({
                        pathname: '/jobbank/publications/add',
                        query: {...router.query, vacancy: item.id }
                    })}
                >
                    Configurar publicación
                </Menu.Item> */}
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
                // <span>{getStatus(item)}</span>
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
        // width: 80, 
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
                current: jobbank_page,
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
        <DeleteItems
            title={viewAsList
                ? `Estas vacantes no se pueden eliminar,
                    ya que se encuentran asociadas a una estrategia.`
                : itemsToDelete.length > 1
                ? '¿Estás seguro de eliminar estas vacantes?'
                : '¿Estás seguro de eliminar esta vacante?'
            }
            visible={openModalDelete}
            keyTitle='job_position'
            keyDescription='description'
            close={closeModalDelete}
            itemsToDelete={itemsToDelete}
            actionDelete={actionDelete}
            textCancel={viewAsList ? 'Cerrar' : 'Cancelar'}
            viewAsList={viewAsList}
        />
    </>
  )
}

const mapState = (state) =>{
    return{
        list_vacancies: state.jobBankStore.list_vacancies,
        load_vacancies: state.jobBankStore.load_vacancies,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getVacancies }
)(TableVacancies);