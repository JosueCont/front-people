import React, { useEffect } from 'react';
import {
    Table,
    Space
} from 'antd';
import {
    getFullName,
    getValueFilter
} from '../../../utils/functions';
import moment from 'moment';
import { optionsStatusPermits } from '../../../utils/constant';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';

const TableIncapacity = ({
    loading = false,
    disabilities = []
}) => {

    const {
        incapacity
    } = useSelector(state => state.userStore.permissions);
    const router = useRouter();

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'person',
            render: (item) => getFullName(item)
        },
        {
            title: 'Departamento',
            dataIndex: ['department', 'name'],
            key: ['department', 'name']
        },
        {
            title: 'Días solicitados',
            dataIndex: 'requested_days',
            key: 'requested_days'
        },
        {
            title: 'Fecha incio',
            dataIndex: 'departure_date',
            render: (item) => item ? moment(item, formatStart).format(formatEnd) : null
        },
        {
            title: 'Fecha final',
            dataIndex: 'return_date',
            render: (item) => item ? moment(item, formatStart).format(formatEnd) : null
        },
        {
            title: 'Documento',
            dataIndex: 'document',
            render: (item) => item ? (
                <a href={item} target='_blank'>Ver documento</a>
            ) : null
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
                    <EyeOutlined onClick={() => router.push(`incapacity/${item.id}/details`)} />
                    {incapacity?.edit && item.status == 1 && (
                        <EditOutlined onClick={() => router.push(`incapacity/${item.id}/edit`)} />
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
            loading={loading}
            dataSource={disabilities}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

export default TableIncapacity