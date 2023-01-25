import React, { useState } from 'react';
import { Table, Dropdown, Button, Menu, message } from 'antd';
import { connect } from 'react-redux';
import { getPreselection } from '../../../redux/jobBankDuck';
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
    getPreselection
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [itemsKeys, setItemsKeys] = useState([]);

    const createSelection = async () =>{
        try {
            await WebApiJobBank.createSelection({
                node: currentNode.id,
                person: currentUser.id,
                candidate: itemsSelected?.at(-1)?.id,
                vacant: router.query?.vacant
            });
            getPreselection(currentNode.id, jobbank_filters, jobbank_page)
            message.success('Proceso iniciado')
        } catch (e) {
            console.log(e)
            message.error('Proceso no iniciado')
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

    console.log('list preselection', list_preselection, jobbank_page)

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
            title: 'Nombre',
            dataIndex: 'fisrt_name',
            key: 'fisrt_name',
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: 'last_name',
            key: 'last_name',
            ellipsis: true
        },
        {
            title: 'Género',
            render: (item) =>{
                return(
                    <span>{getGender(item)}</span>
                )
            }
        },
        {
            title: 'Estado',
            dataIndex: ['state', 'name'],
            key: ['state','name']
        },
        {
            title: 'Municipio',
            dataIndex: 'municipality',
            key: 'municipality'
        },
        {
            title:'Correo electrónico',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true
        },
        // {
        //     title: 'Teléfono',
        //     dataIndex: 'cell_phone',
        //     key: 'cell_phone'
        // },
        {
            title: 'Compatibilidad',
            render: (item) => {
                return(
                    <span>{item.compatibility ?  `${item.compatibility} %` : null}</span>
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
                columns={columns}
                rowSelection={rowSelection}
                loading={load_preselection}
                dataSource={list_preselection.results}
                locale={{
                    emptyText: load_preselection
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_preselection.count,
                    // current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title='¿Iniciar proceso de selección?'
                visible={openModal}
                keyTitle='fisrt_name'
                keyDescription='last_name'
                close={closeModal}
                itemsToList={itemsSelected}
                textConfirm='Iniciar'
                actionConfirm={createSelection}
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
        currentNode: state.userStore.current_node,
        currentUser: state.userStore.user,
    }
}

export default connect(mapState, { getPreselection })(TablePreselection);