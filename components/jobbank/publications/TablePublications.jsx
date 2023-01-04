import React, { useState } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Switch,
  Tooltip,
  Select,
  Tag,
  Space
} from 'antd';
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  NotificationOutlined,
  LinkedinOutlined,
  InstagramOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getPublications } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';
import ModalPost from './ModalPost';
import { optionsStatusVacant } from '../../../utils/constant';

const TablePublications = ({
    currentNode,
    currentUser,
    jobbank_page,
    list_publications,
    load_publications,
    list_connections_options,
    load_connections_options,
    getPublications,
    currentPage,
    currentFilters
}) => {

    const router = useRouter();
    const [itemToPublish, setItemToPublish] = useState({});
    const [openModalShare, setOpenModalShare] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionShare = async (values) =>{
        const key = 'updatable';
        message.loading({content: 'Publicando vacante...', key});
        try {
            await WebApiJobBank.sharePublication(itemToPublish.id, values);
            setTimeout(()=>{
                getPublications(currentNode.id, currentFilters, currentPage);
                message.success({content: 'Vacante publicada', key});
            }, 1000)
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let errorExtra = e.response?.data?.extra;
            let msgError = errorExtra ?? txtError ?? 'Vacante no publicada';
            setTimeout(()=>{
                message.error({content: msgError, key});
            },1000)
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deletePublication({ids});
            getPublications(currentNode.id, currentFilters, currentPage);
            let msg = ids.length > 1 ? 'Publicaciones eliminadas' : 'Publicación eliminada';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Publicacione no eliminadas' : 'Publicación no eliminada';
            message.error(msg);
        }
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos publicaciones')
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

    const nameAndIcon = (item) =>{
        const list = {
            FB: { icon: <FacebookOutlined/>, color: "#3b5999"},
            IG: { icon: <InstagramOutlined />, color: "#E1306C"}
        }
        return list[item.code];
    }

    const getRed = (item) =>{
        if(item.account_to_share?.length <= 0) return [];
        const red = record => item.account_to_share.includes(record.id);
        return list_connections_options.filter(red);
    }

    const getStatus = (item) =>{
        if(!item.vacant?.status) return null;
        const find_ = record => record.value == item.vacant?.status;
        let result = optionsStatusVacant.find(find_);
        if(!result) return null;
        return result.label;
    }

    const closeModalShare = () =>{
        setItemToPublish({})
        setOpenModalShare(false)
    }

    const showModalShare = (item) =>{
        setItemToPublish(item)
        setOpenModalShare(true)
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/publications',
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
                    key='1'
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
                {/* <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/publications/edit`,
                        query:{...router.query, id: item.id }
                    })}
                >
                    Editar
                </Menu.Item> */}
                {/* <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item> */}
                <Menu.Item
                    key='3'
                    icon={<ShareAltOutlined />}
                    onClick={()=> showModalShare(item)}
                >
                    Publicar
                </Menu.Item>
                {item.history?.length > 0 && (
                    <Menu.Item
                        key='4'
                        icon={<NotificationOutlined/>}
                        onClick={()=> router.push({
                            pathname: `/jobbank/publications/history/${item.id}`,
                            query: router.query
                        })}
                    >
                        Ver historial
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Cliente',
            dataIndex: ['vacant','customer','name'],
            key: ['vacant','customer','name']
        },
        {
            title: 'Vacante',
            dataIndex: ['vacant','job_position'],
            key: ['vacant','job_position']
        },
        {
            title: 'Estatus vacante',
            render: (item) =>{
                return(
                    <span>{getStatus(item)}</span>
                )
            }
        },
        {
            title: 'Cuenta',
            render: (item) =>(
                <div style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {getRed(item).map(record => (
                        <Tag>{record.name}</Tag>
                    ))}
                </div>
            )
        },
        {
            title: 'Template',
            render: (item) =>{
                return(
                    <span>{item.profile?.name ?? 'Personalizado'}</span>
                )
            }
        },
        // {
        //     title: 'Creado por',
        //     render: (item) =>{
        //         return(
        //             <span>{item.created_by}</span>
        //         )
        //     }
        // },
        // {
        //     title: 'Estatus',
        //     render: (item) =>{
        //         return(
        //             <span>{item.is_published ? 'Publicado' : 'En borrador'}</span>
        //         )
        //     }
        // },
        {
            // title: ()=> {
            //     return(
            //         <Dropdown overlay={menuTable}>
            //             <Button size={'small'}>
            //                 <EllipsisOutlined />
            //             </Button>
            //         </Dropdown>
            //     )
            // },
            title: 'Acciones',
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
                loading={load_publications}
                rowSelection={rowSelection}
                onChange={onChangePage}
                dataSource={list_publications.results}
                locale={{ emptyText: load_publications
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    total: list_publications.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalPost
                title='Publicar vacante'
                visible={openModalShare}
                actionForm={actionShare}
                close={closeModalShare}
                itemToPublish={itemToPublish}
            />
            <DeleteItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estas publicaciones?'
                    : '¿Estás seguro de eliminar esta publicación?'
                }
                visible={openModalDelete}
                keyTitle='vacant, job_position'
                keyDescription='profile, name'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
            />
        </>
    )
}


const mapState = (state) =>{
    return{
        jobbank_page: state.jobBankStore.jobbank_page,
        list_publications: state.jobBankStore.list_publications,
        load_publications: state.jobBankStore.load_publications,
        list_connections_options: state.jobBankStore.list_connections_options,
        list_connections_options: state.jobBankStore.list_connections_options,
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getPublications }
)(TablePublications);