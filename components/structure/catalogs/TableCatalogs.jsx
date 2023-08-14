import React, { useEffect, useMemo } from 'react';
import {
    Table
} from 'antd';
import { useRouter } from 'next/router';
import { SettingOutlined } from '@ant-design/icons';
import { catalogsOrgStructure } from '../../../utils/constant';

const TableCatalogs = () => {

    const router = useRouter();

    const goTo = ({ catalog }) => {
        let url = `/structure/catalogs/${catalog}`;
        router.push(url)
    }

    const columns = [
        {
            title: 'Nombre',
            render: (item) => (
                <a
                    style={{ color: '#1890ff' }}
                    onClick={() => goTo(item)}
                >
                    {item.name}
                </a>
            )
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <SettingOutlined onClick={() => goTo(item)} />
            )
        }
    ]

    return (
        <Table
            rowKey='catalog'
            size='small'
            columns={columns}
            dataSource={catalogsOrgStructure}
            pagination={{
                pageSize: catalogsOrgStructure?.length,
                hideOnSinglePage: true,
                showSizeChanger: false,
            }}
        />
    )
}

export default TableCatalogs;