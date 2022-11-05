import React from 'react';
import { Table } from 'antd';
import { useRouter } from 'next/router';

const TableCatalogs = () => {

    const router = useRouter();

    const listCatalogs = [
        { name: 'Categorías', redirect: () => router.push('/jobbank/settings/catalos/categories')},
        { name: 'Subcategorías', redirect: () => router.push('/jobbank/settings/catalos/subcategories') },
        { name: 'Carreras', redirect: () => router.push('/jobbank/settings/catalos/academics') },
        { name: 'Competencias', redirect: () => router.push('/jobbank/settings/catalos/competences') },
        { name: 'Perfiles de vacantes', redirect: () => router.push('/jobbank/settings/catalos/profiles') },
        { name: 'Sectores', redirect: () => router.push('/jobbank/settings/catalos/sectors') },
        { name: 'Idiomas', redirect: () => router.push('/jobbank/settings/catalos/languajes') }
    ]

    const columns = [
        {
            title: 'Catálogo',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Acciones',
            render: (item) =>{
                return(
                    <SettingOutlined/>
                )
            }
        }
    ]

    return (
        <Table
            size='small'
            rowKey='name'
            columns={columns}
            dataSource={listCatalogs}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

export default TableCatalogs