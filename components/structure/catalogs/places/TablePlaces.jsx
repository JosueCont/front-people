import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import {
    getPlaces
} from '../../../../redux/OrgStructureDuck';
import {
    Table,
    Dropdown,
    Menu,
    Button,
    Switch,
    message
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { deleteFiltersJb } from '../../../../utils/functions';

const TablePlaces = ({
    currentNode,
    getPlaces,
    list_places,
    load_places,
    org_page,
    org_page_size,
    org_filters,
    showEdit = () => { },
    showDelete = () => { }
}) => {

    const router = useRouter();

    const actionStatus = async (is_active, item) => {
        try {
            await WebApiOrgStructure.updatePlace(item.id, { is_active }, 'patch')
            message.success('Estatus actualizado')
            getPlaces(org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const onChangePage = ({ current, pageSize }) => {
        let params = { ...router.query, page: current, size: pageSize };
        let filters = deleteFiltersJb(params, ['catalog']);
        router.replace({
            pathname: '/structure/catalogs/places',
            query: filters
        }, undefined, { shallow: true })
    }

    const MenuItem = ({ item }) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined />}
                onClick={() => showEdit(item)}
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
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Reporta a',
            dataIndex: ['position_report', 'name'],
            key: ['position_report', 'name']
        },
        {
            title: 'Puesto de trabajo',
            dataIndex: ['job', 'name'],
            key: ['job', 'name']
        },
        {
            title: 'Nivel jerárquico',
            dataIndex: ['hierarchical_level', 'name'],
            key: ['hierarchical_level', 'name']
        },
        {
            title: 'Nodo',
            dataIndex: ['organizational_node', 'name'],
            key: ['organizational_node', 'name']
        },
        {
            title: 'Estatus',
            render: (item) => (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checked={item.is_active}
                    checkedChildren='Activo'
                    unCheckedChildren='Inactivo'
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
                dataSource={list_places?.results}
                columns={columns}
                loading={load_places}
                onChange={onChangePage}
                className='ant-table-colla'
                pagination={{
                    total: list_places?.count,
                    pageSize: org_page_size,
                    current: org_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        list_places: state.orgStore.list_places,
        load_places: state.orgStore.load_places,
        org_page: state.orgStore.org_page,
        org_filters: state.orgStore.org_filters,
        org_page_size: state.orgStore.org_page_size,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getPlaces
}
)(TablePlaces);