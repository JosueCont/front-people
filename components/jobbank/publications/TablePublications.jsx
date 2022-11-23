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
  SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { setJobbankPage } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import DeleteItems from '../../../common/DeleteItems';

const TablePublications = ({
    currentNode,
    jobbank_page
}) => {

    const data = [
        {
            "vacant": "b4df3afd0cbb4729a8641e059007b08c",
            "profile": "b84a28e33e19492abf3210fdcd794f7a",
            "fields": [],
            "node": 10,
            "code_post": "FB",
            "created_by": "fcad1cc68c824a91b86ac369ea51ac8e"
        }
    ]

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
            title: 'Perfíl',
            render: (item) =>{
                return(
                    <span>{item.profile}</span>
                )
            }
        },
        {
            title: 'Vacante',
            render: (item) =>{
                return(
                    <span>{item.vacant}</span>
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
                loading={false}
                // rowSelection={rowSelection}
                // onChange={onChangePage}
                dataSource={data}
                // locale={{ emptyText: load_vacancies
                //     ? 'Cargando...'
                //     : 'No se encontraron resultados'
                // }}
                pagination={{
                    // total: list_vacancies.count,
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
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setJobbankPage
    }
)(TablePublications);