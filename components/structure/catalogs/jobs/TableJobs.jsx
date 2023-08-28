import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import {
    getJobs
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

const TableJobs = ({
    currentNode,
    getJobs,
    list_jobs,
    load_jobs,
    org_page,
    org_page_size,
    org_filters,
    showEdit = () => { },
    showDelete = () => { }
}) => {

    const router = useRouter();

    const actionStatus = async (is_active, item) => {
        try {
            await WebApiOrgStructure.updateJob(item.id, { is_active }, 'patch')
            message.success('Estatus actualizado')
            getJobs(org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const onChangePage = ({ current, pageSize }) => {
        let params = { ...router.query, page: current, size: pageSize };
        let filters = deleteFiltersJb(params, ['catalog']);
        router.replace({
            pathname: '/structure/catalogs/jobs',
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
                dataSource={list_jobs?.results}
                columns={columns}
                loading={load_jobs}
                onChange={onChangePage}
                className='ant-table-colla'
                pagination={{
                    total: list_jobs?.count,
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
        list_jobs: state.orgStore.list_jobs,
        load_jobs: state.orgStore.load_jobs,
        org_page: state.orgStore.org_page,
        org_filters: state.orgStore.org_filters,
        org_page_size: state.orgStore.org_page_size,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getJobs
}
)(TableJobs);