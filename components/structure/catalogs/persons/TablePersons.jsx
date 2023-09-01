import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import {
    getTypesPersons
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

const TablePersons = ({
    currentNode,
    getTypesPersons,
    list_types_persons,
    load_types_persons,
    org_page,
    org_page_size,
    org_filters,
    showEdit = () => { },
    showDelete = () => { }
}) => {

    const router = useRouter();

    const actionField = async (data, item) => {
        try {
            await WebApiOrgStructure.updateTypePerson(item.id, data, 'patch')
            message.success('Estatus actualizado')
            getTypesPersons(currentNode?.id, org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const onChangePage = ({ current, pageSize }) => {
        let params = { ...router.query, page: current, size: pageSize };
        let filters = deleteFiltersJb(params, ['catalog']);
        router.replace({
            pathname: '/structure/catalogs/persons',
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
            title: 'Prefijo',
            render: (item) => item?.prefix ? item.prefix : item?.code
        },
        {
            title: 'Dígitos',
            dataIndex: 'num_digits',
            key: 'num_digits'
        },
        // {
        //     title: 'Colaborador',
        //     render: (item) => (
        //         <Switch
        //             size='small'
        //             defaultChecked={item.is_collaborator}
        //             checked={item.is_collaborator}
        //             checkedChildren='Sí'
        //             unCheckedChildren='No'
        //             onChange={(e) => actionField({ is_collaborator: e }, item)}
        //         />
        //     )
        // },
        // {
        //     title: 'Automático',
        //     render: (item) => (
        //         <Switch
        //             size='small'
        //             defaultChecked={item.is_automatic}
        //             checked={item.is_automatic}
        //             checkedChildren='Sí'
        //             unCheckedChildren='No'
        //             onChange={(e) => actionField({ is_automatic: e }, item)}
        //         />
        //     )
        // },
        {
            title: 'Estatus',
            render: (item) => (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checked={item.is_active}
                    checkedChildren='Activo'
                    unCheckedChildren='Inactivo'
                    onChange={(e) => actionField({ is_active: e }, item)}
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
                dataSource={list_types_persons?.results}
                columns={columns}
                loading={load_types_persons}
                onChange={onChangePage}
                className='ant-table-colla'
                pagination={{
                    total: list_types_persons?.count,
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
        list_types_persons: state.orgStore.list_types_persons,
        load_types_persons: state.orgStore.load_types_persons,
        org_page: state.orgStore.org_page,
        org_filters: state.orgStore.org_filters,
        org_page_size: state.orgStore.org_page_size,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getTypesPersons
}
)(TablePersons);