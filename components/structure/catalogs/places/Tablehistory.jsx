import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Tag
} from 'antd';
import { useRouter } from 'next/router';
import { getFullName } from '../../../../utils/functions';
import moment from 'moment';

const TableHistory = ({
    newFilters,
    list_places_history,
    load_places_history,
    org_page,
    org_page_size
}) => {

    const router = useRouter();
    const format = 'DD-MM-YYYY';

    const onChangePage = ({ current, pageSize }) => {
        let filters = { ...newFilters, page: current, size: pageSize };
        router.replace({
            pathname: '/structure/catalogs/history',
            query: filters
        }, undefined, { shallow: true })
    }

    const columns = [
        {
            title: 'Plaza',
            dataIndex: ['position', 'name'],
            key: ['position', 'name']
        },
        {
            title: 'Persona',
            dataIndex: 'person',
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Actual',
            dataIndex: 'is_current',
            render: (item) => (
                <Tag color={item ? 'blue' : 'default'}>{item ? 'Sí' : 'No'}</Tag>
            )
        },
        {
            title: 'Fecha inicio',
            dataIndex: 'start_date',
            render: (item) => moment(item).format(format)
        },
        {
            title: 'Fecha fin',
            dataIndex: 'end_date',
            render: (item) => moment(item).format(format)
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                dataSource={list_places_history?.results}
                columns={columns}
                loading={load_places_history}
                onChange={onChangePage}
                className='ant-table-colla'
                pagination={{
                    total: list_places_history?.count,
                    pageSize: org_page_size,
                    current: org_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        list_places_history: state.orgStore.list_places_history,
        load_places_history: state.orgStore.load_places_history,
        org_page: state.orgStore.org_page,
        org_page_size: state.orgStore.org_page_size,
    }
}

export default connect(mapState)(TableHistory);