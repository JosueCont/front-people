import React, { useEffect, useMemo } from 'react';
import {
    Table
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { SettingOutlined } from '@ant-design/icons';
import { catalogsCompany } from '../../../utils/constant';

const TableCatalogs = ({
    permissions
}) => {

    const router = useRouter();

    const catalogs = useMemo(() => {
        if (Object.keys(permissions || {}).length <= 0) return catalogsCompany;
        return catalogsCompany.reduce((acc, item) => {
            let access = permissions[item?.key];
            let show = access ? access?.view : true;
            return [...acc, {...item, show}]
        },[]);
    }, [permissions])

    const goTo = ({ catalog }) => {
        let url = `/config/catalogs/${catalog}`;
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
            dataSource={catalogs.filter(item => item.show)}
            pagination={{
                pageSize: catalogsCompany?.length,
                hideOnSinglePage: true,
                showSizeChanger: false,
            }}
        />
    )
}

const mapState = (state) => {
    return {
        permissions: state.userStore.permissions
    }
}

export default connect(mapState)(TableCatalogs);