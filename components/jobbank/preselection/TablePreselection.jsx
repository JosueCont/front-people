import React, { useState, useMemo } from 'react';
import { Table, Dropdown, Button, Menu, message, Alert } from 'antd';
import { connect } from 'react-redux';
import { getPreselection, getVacanciesOptions } from '../../../redux/jobBankDuck';
import { optionsGenders } from '../../../utils/constant';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    CalendarOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TablePreselection = ({
    currentUser,
    currentNode,
    jobbank_filters,
    jobbank_page,
    list_preselection,
    load_preselection,
    getPreselection,
    getVacanciesOptions,
    list_vacancies_options,
    load_vacancies_options,
    jobbank_page_size
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [itemsKeys, setItemsKeys] = useState([]);

    const availableVacant = useMemo(()=>{
        if(list_vacancies_options.length <=0) return false;
        const find_ = item => item.id == router.query?.vacant;
        let result = list_vacancies_options.find(find_);
        if(!result) return false;
        return result.available > 0;
    },[router.query?.vacant, list_vacancies_options])

    const createSelection = async () =>{
        try {
            await WebApiJobBank.createSelection({
                node: currentNode.id,
                person: currentUser.id,
                candidate: itemsSelected?.at(-1)?.id,
                vacant: router.query?.vacant
            });
            getPreselection(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size)
            getVacanciesOptions(currentNode.id, '&status=1&has_strategy=1')
            message.success('Proceso iniciado')
        } catch (e) {
            let error = e.response?.data?.message;
            let msg = error ? error : 'Proceso no iniciado';
            message.error(msg)
        }
    }

    const getGender = (item) =>{
        if(!item.gender) return null;
        const find_ = record => record.value == item.gender;
        let result = optionsGenders.find(find_);
        if(!result) return null;
        return result.label;
    }

    const openModalMany = () =>{
        if(itemsSelected.length > 1){
            setOpenModal(true)
        }else{
            setOpenModal(false)
            message.error('Selecciona al menos dos candidatos')
        }
    }

    const openModalOne = (item) =>{
        setItemsSelected([item])
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemsKeys([])
        setItemsSelected([])
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsSelected(selectedRows)
        }
    }

    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/jobbank/preselection',
            query: filters
        })
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<UserAddOutlined />}
                    onClick={()=> openModalMany()}
                >
                    Proceso selección
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<UserAddOutlined />}
                    onClick={()=> openModalOne(item)}
                >
                    Proceso selección
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Candidato',
            show: true,
            ellipsis: true,
            render: (item) =>{
                return(
                    <>{item?.first_name} {item?.last_name}</>
                )
            }
        },
        {
            title: 'Género',
            show: true,
            render: (item) =>{
                return(
                    <span>{getGender(item)}</span>
                )
            }
        },
        {
            title: 'Estado',
            dataIndex: ['state', 'name'],
            key: ['state','name'],
            show: true,
        },
        {
            title: 'Municipio',
            dataIndex: 'municipality',
            key: 'municipality',
            show: true,
        },
        {
            title:'Correo electrónico',
            dataIndex: 'email',
            key: 'email',
            show: true,
            ellipsis: true,
        },
        {
            title: 'Teléfono',
            dataIndex: 'cell_phone',
            key: 'cell_phone',
            show: true
        },
        {
            title: 'Compatibilidad',
            show: !router.query?.applyMatch,
            render: (item) => {
                return(
                    <>{item.compatibility ?  `${item.compatibility}%` : null}</>
                )
            }
        },
        {
            // title: ()=>{
            //     return(
            //         <Dropdown overlay={menuTable}>
            //             <Button size='small'>
            //                 <EllipsisOutlined />
            //             </Button>
            //         </Dropdown>
            //     )
            // },
            title: 'Acciones',
            show: true,
            width: 80,
            align: 'center',
            render: (item) =>{
                return(
                    // <Dropdown overlay={()=> menuItem(item)}>
                        <Button size='small' onClick={()=> openModalOne(item)}>
                            <UserAddOutlined />
                        </Button>
                    // </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns.filter(item => item.show)}
                // rowSelection={rowSelection}
                loading={load_preselection}
                dataSource={list_preselection.results}
                onChange={onChangePage}
                locale={{
                    emptyText: load_preselection
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_preselection.count,
                    current: jobbank_page,
                    pageSize: jobbank_page_size,
                    hideOnSinglePage: list_preselection?.count < 10,
                    showSizeChanger: list_preselection?.count > 10
                }}
            />
            <ListItems
                title={availableVacant
                    ? '¿Iniciar proceso de selección?'
                    : 'No se puede iniciar un nuevo proceso de selección para esta vacante'
                }
                visible={openModal}
                keyTitle={['first_name','last_name']}
                keyDescription='email'
                close={closeModal}
                itemsToList={itemsSelected}
                textConfirm='Iniciar'
                actionConfirm={createSelection}
                useWithAction={availableVacant}
                textCancel={availableVacant ? 'Cancelar' : 'Cerrar'}
            />
        </>
    )
}

const mapState = (state) =>{
    return{
        list_preselection: state.jobBankStore.list_preselection,
        load_preselection: state.jobBankStore.load_preselection,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        jobbank_page_size: state.jobBankStore.jobbank_page_size,
        currentNode: state.userStore.current_node,
        currentUser: state.userStore.user,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        load_vacancies_options: state.jobBankStore.load_vacancies_options
    }
}

export default connect(
    mapState, {
        getPreselection,
        getVacanciesOptions
    }
)(TablePreselection);