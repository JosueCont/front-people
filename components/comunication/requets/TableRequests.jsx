import React from 'react';
import { Table, Space} from 'antd';
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
    } = useSelector(state =>  state.userStore.permissions);
    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';
    const router = useRouter();

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'collaborator',
            render: (item) => getFullName(item)
        },        
        {
            title: 'Periodo',
            dataIndex: 'period',
            key: 'period'
        },       
        {
            title: 'Fecha inicio',
            dataIndex: 'departure_date',
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
            dataIndex: 'remaining_days',
            render: (item, record) => record?.current_available_days - record?.days_requested
        },
        {
            title: 'Jefe inmediato',
            dataIndex: 'immediate_supervisor',
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Estatus',
            dataIndex: 'status',
            render: (item) => getValueFilter({
                value: item,
                list: optionsStatusVacation,
                keyEquals: 'value',
                keyShow: 'label'
            })
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
                    <EyeOutlined onClick={()=> router.push(`holidays/${item.id}/details`)}/>
                    {vacation.edit
                        && [1,5].includes(item.status)
                        && item.created_from == 2 
                        && (
                        <EditOutlined onClick={()=> router.push(`holidays/${item.id}/edit`)}/>
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
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

export default TableRequests