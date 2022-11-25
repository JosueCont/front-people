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
import { setJobbankPage } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';

const TablePublications = ({
    currentNode,
    currentUser,
    jobbank_page,
    list_publications,
    load_publications,
    list_vacancies_options,
    list_profiles_options
}) => {

    const router = useRouter();

    const actionShare = async (item) =>{
        try {
            let publishData = new FormData();
            publishData.append('start_message', 'Hola demo');
            publishData.append('end_message', 'Gracias demo');
            publishData.append('person', currentUser.id);
            await WebApiJobBank.sharePublication(item.id, publishData);
            message.success('Vacante publicada');
        } catch (e) {
            console.log(e)
            message.error('Vacante no publicada');
        }
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
        const template = record => record.id == item.profile;
        let template_ = list_profiles_options.find(template);
        if(!template_) return null;
        return template_.name;
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<DeleteOutlined/>}
                    // onClick={()=>openModalManyDelete()}
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
                        query:{ id: item.id }
                    })}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    // onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<ShareAltOutlined />}
                    onClick={()=> actionShare(item)}
                >
                    Publicar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Código',
            dataIndex: 'code_post',
            key: 'code_post'
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
                // rowSelection={rowSelection}
                // onChange={onChangePage}
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
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setJobbankPage
    }
)(TablePublications);