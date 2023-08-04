import React from 'react';
import {
    Table
} from 'antd';
import { useRouter } from 'next/router';
import { SettingOutlined } from '@ant-design/icons';
import { catalogsCompany } from '../../../utils/constant';

const TableCatalogs = () => {

    const router = useRouter();

    const goTo = ({catalog}) =>{
        let url = `/config/catalogs/${catalog}`;
        router.push(url)
    }

    const columns = [
        {
            title: 'Catálogo',
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
            dataSource={catalogsCompany}
            pagination={{
                pageSize: catalogsCompany?.length,
                hideOnSinglePage: true,
                showSizeChanger: false,
            }}
        />
    )
}

export default TableCatalogs