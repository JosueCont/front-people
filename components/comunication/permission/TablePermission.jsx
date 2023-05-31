import React from 'react';
import {
    Table,
    Space
} from 'antd';
import {
    getFullName,
    getValueFilter
} from '../../../utils/functions';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { optionsStatusPermits } from '../../../utils/constant';
import {
    EditOutlined,
    EyeOutlined,
    DesktopOutlined,
    MobileOutlined,
} from '@ant-design/icons';

const TablePermission = ({
    loading = false,
    permits = []
}) => {

    const router = useRouter();
    const permissions = useSelector(state =>  state.userStore.permissions);

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'collaborator',
            render: (item) => getFullName(item)
        },
        {
            title: 'Departamento',
            dataIndex: 'department',
            key: 'department'   
        },
        {
            title: 'Días solicitados',
            dataIndex: 'requested_days',
            key: 'requested_days'
        },
        {
            title: 'Estatus',
            dataIndex: 'status',
            render: (item) => getValueFilter({
                value: item,
                list: optionsStatusPermits,
                keyEquals: 'value',
                keyShow: 'label'
            })
        },
        {
            title: 'Acciones',
            render: (item) => (
                <Space>
                    <EyeOutlined onClick={()=> router.push(`permission/${item.id}/details`)}/>
                    {permissions.permit?.edit && item.status == 1 && (
                        <EditOutlined onClick={()=> router.push(`permission/${item.id}/edit`)}/>
                    )}
                </Space>
            )
        }
    ]

    return (
        <Table
            rowKey='id'
            size='small'
            columns={columns}
            dataSource={permits}
            loading={loading}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

export default TablePermission