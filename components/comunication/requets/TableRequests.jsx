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

    // Keys para periodo actual
    const period = 'current_vacation_period';
    const start = 'start_date_current_vacation_period';
    const end = 'end_date_current_vacation_period';
    // Keys para siguiente periodo
    const periodNext = 'next_vacation_period';
    const startNext = 'start_date_next_vacation_period';
    const endNext = 'end_date_next_vacation_period';

    const formatYears = (item) => {
        let person = item?.collaborator;
        let years = person[period] == item?.period
            ? [person[start], person[end]]
            : [person[startNext], person[endNext]];
        let init = moment(years[0], formatStart).year();
        let finish = moment(years[1], formatStart).year();
        return `${init} - ${finish}`;
    }

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'collaborator',
            render: (item) => getFullName(item)
        },
        {
            title: 'Periodo',
            render: formatYears
        },
        {
            title: 'Fecha solicitud',
            dataIndex: 'timestamp',
            sorter: (a, b) => {
                return moment(a?.timestamp).unix() - moment(b?.timestamp).unix();
            },
            render: (item) => moment(item).format(`${formatEnd} hh:mm a`)
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
            // render: (item) => getValueFilter({
            //     value: item,
            //     list: optionsStatusVacation,
            //     keyEquals: 'value',
            //     keyShow: 'label'
            // })
            render: (item) => {
                let label = getValueFilter({
                    value: item,
                    list: optionsStatusVacation,
                    keyEquals: 'value',
                    keyShow: 'label'
                });
                if (![3, 4].includes(item)) return label;
                return (
                    <Tag style={{ width: 90, textAlign: 'center' }} color='red'>
                        {label}
                    </Tag>
                )
            }
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
                    <EyeOutlined onClick={() => router.push(`holidays/${item.id}/details`)} />
                    {vacation.edit
                        && [1, 5].includes(item.status)
                        && item.created_from == 2
                        && (
                            <EditOutlined onClick={() => router.push(`holidays/${item.id}/edit`)} />
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