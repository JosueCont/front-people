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
  SettingOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import { optionsStatusVacant, optionsShowCustomerNameVacant } from '../../../utils/constant';
import { copyContent } from '../../../utils/functions';

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
    const [useWithAction, setUseWithAction] = useState(true);
    const [useToCopy, setUseToCopy] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        try {
            await WebApiJobBank.deleteVacant({ids});
            getVacancies(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
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
            getVacancies(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const actionShowCustomerName = async (value, item) =>{
        try {
            await WebApiJobBank.updateShowCustomerNameVacant(item.id, {show_customer_name: value});
            getVacancies(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            message.success('Información de la vacante actualizada');
        } catch (e) {
            console.log(e)
            message.error('Información de la vacante no actualizada');
        }
    }

    const actionDuplicate = async () =>{
        try {
            let id = itemsToDelete?.at(-1)?.id;
            await WebApiJobBank.duplicateVacant(id);
            message.success('Vacante duplicada');
            getVacancies(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
        } catch (e) {
            console.log(e)
            message.error('Vacante no duplicada');
        }
    }

    const openModalManyDelete = () =>{
        const filter_ = item => item.has_strategy;
        let notDelete = itemsToDelete.filter(filter_);
        if(notDelete.length > 0){
            setUseWithAction(false)
            setOpenModalDelete(true)
            setItemsToDelete(notDelete)
            return;
        }
        setUseWithAction(true);
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
            return;
        }
        setOpenModalDelete(false)
        message.error('Selecciona al menos dos vacantes')
    }

    const openModalRemove = (item) =>{
        setUseWithAction(!item?.has_strategy)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalDuplicate = (item) =>{
        setUseToCopy(true)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setUseWithAction(true)
        setUseToCopy(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const titleDelete = useMemo(()=>{
        if(!useWithAction){
            return itemsToDelete.length > 1
            ? `Estas vacantes no se pueden eliminar, ya que
                se encuentran asociadas a una estrategia`
            : `Esta vacante no se puede eliminar, ya que
                se encuentra asociada a una estrategia`;
        }
        if(useToCopy) return '¿Estás seguro de duplicar esta vacante?';
        return itemsToDelete.length > 1
            ? '¿Estás seguro de eliminar estas vacantes?'
            : '¿Estás seguro de eliminar esta vacante?';
    },[useWithAction, useToCopy, itemsToDelete])
    
    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/jobbank/vacancies',
            query: filters
        })
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const copyLinkPostulation = (item) =>{
        let url = `${window.location.origin}/jobbank/autoregister/candidate`;
        copyContent({
            text: `${url}?code=${currentNode.permanent_code}&vacant=${item.id}`,
            onSucces: ()=> message.success('Link de postulación copiado'),
            onError: () => message.error('Link de postulación no copiado')
        })
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
                    onClick={()=> openModalDuplicate(item)}
                >
                    Duplicar
                </Menu.Item>
                {item.status == 1 && item.has_strategy && (
                    <>
                        {/* <Menu.Item
                            key='4'
                            icon={<SettingOutlined />}
                            onClick={()=> router.push({
                                pathname: '/jobbank/publications/add',
                                query: {...router.query, vacancy: item.id }
                            })}
                        >
                            Configurar publicación
                        </Menu.Item> */}
                        <Menu.Item
                            key='5'
                            icon={<UserAddOutlined />}
                            onClick={()=> copyLinkPostulation(item)}
                        >
                            Postulación
                        </Menu.Item>
                    </>
                )}
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
        key: ['customer', 'name'],
        ellipsis: true
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
        title: 'Mostrar nombre cliente',
        render: (item) =>{
            return (
                <Select
                    size='small'
                    style={{width: 101}}
                    defaultValue={item.show_customer_name}
                    value={item.show_customer_name}
                    placeholder='Seleccionar'
                    options={optionsShowCustomerNameVacant}
                    onChange={(e) => actionShowCustomerName(e, item)}
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
                        query: {...router.query, id: item.has_strategy, back: 'vacancies'}
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
        key: ['recruiter', 'full_name'],
        ellipsis: true
    },
    {
        title: ()=> {
            return(
                <Dropdown overlay={menuTable}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        },
        width: 60, 
        render: (item) =>{
            return (
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
                hideOnSinglePage: list_vacancies?.count < 10,
                showSizeChanger: list_vacancies?.count > 10
            }}
        />
        <ListItems
            title={titleDelete}
            visible={openModalDelete}
            keyTitle='job_position'
            keyDescription='customer, name'
            close={closeModalDelete}
            itemsToList={itemsToDelete}
            actionConfirm={useToCopy ? actionDuplicate : actionDelete}
            textCancel={useWithAction ? 'Cancelar' : 'Cerrar'}
            textConfirm={useToCopy ? 'Duplicar' : 'Eliminar'}
            useWithAction={useWithAction}
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