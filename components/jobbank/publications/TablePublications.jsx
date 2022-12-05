import React, { useState } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Switch,
  Tooltip,
  Select
} from 'antd';
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  SettingOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getPublications } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';
import ModalPost from './ModalPost';
import { getFiltersJB } from '../../../utils/functions';

const TablePublications = ({
    currentNode,
    currentUser,
    jobbank_page,
    list_publications,
    load_publications,
    list_vacancies_options,
    list_profiles_options,
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
            setTimeout(()=>{
                getPublicationsWithFilters();
                message.success({content: 'Vacante publicada', key});
            },1000);
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Vacante no publicada';
            setTimeout(()=>{
                message.error({content: msgError, key});
            },1000);
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

    const getVacant = (item) =>{
        if(!item.vacant) return null;
        const vacant = record => record.id == item.vacant;
        let vacant_ = list_vacancies_options.find(vacant);
        if(!vacant_) return null;
        return vacant_.job_position;
    }

    const getTemplate = (item) =>{
        if(!item.profile) return 'Personalizado';
        const template = record => record.id == item.profile.id;
        let template_ = list_profiles_options.find(template);
        if(!template_) return null;
        return template_.name;
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
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Cuenta',
            render: (item) =>{
                return(
                    <span>{getRed(item)}</span>
                )
            }
        },
        {
            title: 'Vacante',
            render: (item) =>{
                return(
                    <span>{getVacant(item)}</span>
                )
            }
        },
        {
            title: 'Template',
            render: (item) =>{
                return(
                    <span>{getTemplate(item)}</span>
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
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        list_profiles_options: state.jobBankStore.list_profiles_options,
        list_connections: state.jobBankStore.list_connections,
        load_connections: state.jobBankStore.load_connections,
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getPublications }
)(TablePublications);