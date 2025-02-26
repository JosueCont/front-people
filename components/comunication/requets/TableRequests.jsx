import React from 'react';
import { Table, Space, Tag } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getFullName, getValueFilter } from '../../../utils/functions';
import { optionsStatusVacation } from '../../../utils/constant';
import {
    EditOutlined,
    EyeOutlined,
    DesktopOutlined,
    MobileOutlined,
} from '@ant-design/icons';

const TableRequests = ({
    requests = [],
    loading = false
}) => {

    const {
        vacation
    } = useSelector(state => state.userStore.permissions);
    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';
    const router = useRouter();

    const getColor = (status) => {
        const colors = {
            1: '#1677ff',
            2: '#52c41a',
            3: '#ff4d4f',
            4: 'default',
            5: '#F99543'
        }
        return colors[status];
    }

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'collaborator',
            render: (item) => getFullName(item)
        },
        {
            title: 'Periodo',
            dataIndex: 'period',
            render: (item) => `${item} - ${item + 1}`
        },
        {
            title: 'Fecha solicitud',
            dataIndex: 'timestamp',
            sorter: (a, b) => {
                return moment(a?.timestamp).unix() - moment(b?.timestamp).unix();
            },
            render: (item) => moment(item).format(formatEnd)
        },
        {
            title: 'Fecha inicio',
            dataIndex: 'departure_date',
            sorter: (a, b) => {
                return moment(a?.departure_date, formatStart).unix() - moment(b?.departure_date, formatStart).unix();
            },
            render: (item) => item ? moment(item, formatStart).format(formatEnd) : <></>
        },
        {
            title: 'Fecha fin',
            dataIndex: 'return_date',
            render: (item) => item ? moment(item, formatStart).format(formatEnd) : <></>
        },
        {
            title: 'Días disponibles',
            dataIndex: 'current_available_days',
            key: 'current_available_days'
        },
        {
            title: 'Días solicitados',
            dataIndex: 'days_requested',
            key: 'days_requested'
        },
        {
            title: 'Días restantes',
            render: (item) => item?.current_available_days - item?.days_requested
        },
        {
            title: 'Jefe inmediato',
            dataIndex: 'immediate_supervisor',
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Estatus',
            dataIndex: 'status',
            render: (item) => (
                <Tag style={{ width: 90, textAlign: 'center' }}
                    color={getColor(item)}
                >
                    {getValueFilter({
                        value: item,
                        list: optionsStatusVacation,
                        keyEquals: 'value',
                        keyShow: 'label'
                    })}
                </Tag>
            )
        },
        // {
        //     title: 'Medio',
        //     dataIndex: 'created_from',
        //     render: (item) => item == 2
        //         ? <DesktopOutlined style={{ color: 'blue', fontWeight: 'bolder', fontSize: 20 }} />
        //         : <MobileOutlined style={{ color: 'orange', fontWeight: 'bolder', fontSize: 20 }} />
        // },
        {
            title: 'Acciones',
            render: (item) => (
                <Space>
                    <EyeOutlined onClick={() => router.push({
                        pathname: `holidays/${item.id}/details`,
                        query: router.query
                    })} />
                    {vacation.edit
                        && [1, 5].includes(item.status)
                        // && item.created_from == 2
                        && (
                            <EditOutlined onClick={() => router.push({
                                pathname:`holidays/${item.id}/edit`,
                                query: router.query
                            })} />
                        )}
                </Space>
            )
        }
    ]

    return (
        <Table
            size='small'
            rowKey='id'
            columns={columns}
            loading={loading}
            dataSource={requests}
            locale={{
                emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados.',
            }}
            // rowClassName={e => e.status == 4 ? 'holidays-cancelled': ''}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

export default TableRequests