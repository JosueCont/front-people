import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { getPreselection } from '../../../redux/jobBankDuck';

const TablePreselection = ({
    list_preselection,
    load_preselection,
    getPreselection
}) => {

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'fisrt_name',
            key: 'fisrt_name',
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: 'last_name',
            key: 'last_name',
            ellipsis: true
        },
        {
            title:'Correo',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true
        },
        {
            title: 'Teléfono',
            dataIndex: 'cell_phone',
            key: 'cell_phone'
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                loading={load_preselection}
                dataSource={list_preselection.results}
                locale={{
                    emptyText: load_preselection
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
            />
        </>
    )
}

const mapState = (state) =>{
    return{
        list_preselection: state.jobBankStore.list_preselection,
        load_preselection: state.jobBankStore.load_preselection,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getPreselection })(TablePreselection);