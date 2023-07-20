import React, { useState } from 'react';
import {
    Table,
    Select,
    message,
    Switch,
    Dropdown,
    Button,
    Menu
} from 'antd';
import { connect } from 'react-redux';
import { getWorkCenters } from '../../../redux/UserDuck';
import WebApiPeople from '../../../api/WebApiPeople';
import ListItems from '../../../common/ListItems';
import {
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const TableCenters = ({
    getWorkCenters,
    list_work_centers,
    load_work_centers,
    user_page,
    user_filters,
    user_page_size
}) => {

    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);

    const actionStatus = async (is_active, item) => {
        try {
            await WebApiPeople.updateWorkCenter(item.id, { is_active });
            getWorkCenters(user_filters, user_page, user_page_size);
            message.success('Estatus actualizado')
        } catch (e) {
            console.log(e)
            message.error('Estas no actualizado')
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsSelected?.at(-1)?.id;
            await WebApiPeople.deleteWorkCenter(id);
            getWorkCenters(user_filters, user_page, user_page_size);
            message.success('Centro eliminado')
        } catch (e) {
            console.log(e)
            message.error('Centro no eliminado')
        }
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/business/centers',
            query: filters
        }, undefined, {shallow: true})
    }


    const MenuItem = ({ item }) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined />}
                onClick={() => router.push({
                    pathname: '/business/centers/edit',
                    query: { ...router.query, id: item.id }
                })}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<DeleteOutlined />}
                onClick={() => showDelete(item)}
            >
                Eliminar
            </Menu.Item>
        </Menu>
    )

    const columns = [
        {
            title: 'Empresa',
            dataIndex: ['node','name'],
            key: ['node','name']
        },
        {
            title: 'Nombre',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: 'Dirección',
            key: 'address',
            dataIndex: 'address'
        },
        {
            title: 'Estatus',
            render: (item) => (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checked={item.is_active}
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                    onChange={(e) => actionStatus(e, item)}
                />
            )
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Dropdown placement='bottomRight' overlay={<MenuItem item={item} />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={list_work_centers?.results}
                loading={load_work_centers}
                onChange={onChangePage}
                pagination={{
                    total: list_work_centers?.count,
                    current: user_page,
                    pageSize: user_page_size,
                    hideOnSinglePage: true,
                    showSizeChanger: true
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar este centro de trabajo?'
                visible={openDelete}
                keyTitle='name'
                keyDescription='address'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_work_centers: state.userStore.list_work_centers,
        load_work_centers: state.userStore.load_work_centers,
        user_page: state.userStore.user_page,
        user_filters: state.userStore.user_filters,
        user_page_size: state.userStore.user_page_size
    }
}

export default connect(
    mapState, {
    getWorkCenters
}
)(TableCenters);