import React from 'react';
import {
    Table,
    Button,
    Dropdown
} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { getFullName } from '../../../utils/functions';
import {
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { SlLocationPin } from 'react-icons/sl';
import { FiMapPin } from 'react-icons/fi';

const TableLogs = ({
    currentNode,
    list_logs_events,
    load_logs_events,
    timeclock_page,
    timeclock_filters,
    timeclock_page_size
}) => {

    const formatEnd = 'DD-MM-YYYY hh:mm a';

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'timestamp',
            render: (item) => moment(item).format(formatEnd)
        },
        {
            title: 'Colaborador',
            dataIndex: 'person',
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Centro de trabajo',
            dataIndex: ['workcenter','name'],
            key: ['workcenter','name']
        },
        {
            title: 'Checkin',
            render: (item) => (
                <Button
                    size='small'
                >
                    Ver
                    <FiMapPin style={{color: '#ffff', marginInlineStart: 4}}/>
                </Button>
            )
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Dropdown placement='bottomRight'>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ]

    return (
        <Table
            rowKey='id'
            size='small'
            columns={columns}
            dataSource={list_logs_events?.results}
            loading={load_logs_events}
            // onChange={onChangePage}
            pagination={{
                total: list_logs_events?.count,
                current: timeclock_page,
                pageSize: timeclock_page_size,
                hideOnSinglePage: false,
                showSizeChanger: true
            }}
        />
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_logs_events: state.timeclockStore.list_logs_events,
        load_logs_events: state.timeclockStore.load_logs_events,
        timeclock_page: state.timeclockStore.timeclock_page,
        timeclock_filters: state.timeclockStore.timeclock_filters,
        timeclock_page_size: state.timeclockStore.timeclock_page_size
    }
}

export default connect(
    mapState, {}
)(TableLogs);