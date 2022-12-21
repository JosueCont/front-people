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
  CopyOutlined,
  SettingOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  NotificationOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getPublications } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';
import ModalPost from './ModalPost';
import { getFiltersJB } from '../../../utils/functions';
import { redirectTo } from '../../../utils/constant';

const TablePublications = ({
    currentNode,
    currentUser,
    jobbank_page,
    list_publications,
    load_publications,
    list_connections,
    load_connections,
    getPublications
}) => {

    const router = useRouter();
    const [itemToPublish, setItemToPublish] = useState({});
    const [openModalShare, setOpenModalShare] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionShare = async (values) =>{
        const key = 'updatable';
        try {
            message.loading({content: 'Publicando vacante...', key});
            await WebApiJobBank.sharePublication(itemToPublish.id, values);
            getPublicationsWithFilters();
            message.success({content: 'Vacante publicada', key});
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Vacante no publicada';
            message.error({content: msgError, key});
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deletePublication({ids});
            getPublicationsWithFilters();
            if(ids.length > 1) message.success('Publicaciones eliminadas');
            else message.success('Publicación eliminada');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Publicaciones no eliminadas');
            else message.error('Publicación no eliminada');
        }
    }

    const getPublicationsWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB(router.query);
        getPublications(currentNode.id, filters, page);
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

    const getRed = (item) =>{
        if(!item.code_post) return null;
        const red = record => record.code == item.code_post;
        let red_ = list_connections.find(red);
        if(!red_) return null;
        return red_.name;
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

    const validateHistory = (item) =>{
        if(item.history?.length > 1){
            router.push({
                pathname: `/jobbank/publications/history/${item.id}`,
                query: router.query
            })
            return;
        }
        let url = item.history?.at(-1)?.post_url;
        redirectTo(url, true);
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
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/publications/edit`,
                        query:{...router.query, id: item.id }
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
                    icon={<ShareAltOutlined />}
                    onClick={()=> showModalShare(item)}
                >
                    Publicar
                </Menu.Item>
                {item.history?.length > 0 && (
                    <Menu.Item
                        key='4'
                        icon={item.history?.length > 1 ? <FileTextOutlined /> : <NotificationOutlined/>}
                        onClick={()=> validateHistory(item)}
                    >
                        {item.history?.length > 1 ? 'Ver historial' : 'Ir a publicación'}
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
            title: 'Cuenta',
            render: (item) =>{
                return(
                    <span>{getRed(item)}</span>
                )
            }
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
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <span>{item.is_published ? 'Publicado' : 'En borrador'}</span>
                )
            }
        },
        // {
        //     title: 'Historial',
        //     render: (item) =>{
        //         return(
        //             <Space>
        //                 {item.history?.length > 0 ? (
        //                     <Tooltip title='Ver historial'>
        //                         <EyeOutlined
        //                             style={{cursor: 'pointer'}}
        //                             // onClick={()=>showModalList(item)}
        //                         />
        //                     </Tooltip>
        //                 ):(
        //                     <EyeInvisibleOutlined />
        //                 )}
        //                 <Tag
        //                     icon={<NotificationOutlined style={{color:'#52c41a'}} />}
        //                     color='green' style={{fontSize: '14px'}}
        //                 >
        //                     {item.history?.length ?? 0}
        //                 </Tag>
        //             </Space>
        //         )
        //     }
        // },
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
            />
            <DeleteItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estas publicaciones?'
                    : '¿Estás seguro de eliminar esta publicación?'
                }
                visible={openModalDelete}
                keyTitle='code_post'
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
        list_connections: state.jobBankStore.list_connections,
        load_connections: state.jobBankStore.load_connections,
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getPublications }
)(TablePublications);