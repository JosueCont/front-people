import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

const TableQuestions = ({
    list_questions,
    load_questions
}) => {

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'title',
            key: 'title'
        }
    ]

    return (
        <Table
            rowKey='id'
            size='small'
            columns={columns}
            className='ant-table-colla'
            dataSource={list_questions?.results}
            loading={load_questions}
            pagination={{
                hideOnSinglePage: false,
                showSizeChanger: true,
            }}
        />
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_questions: state.kuizStore.list_questions,
        load_questions: state.kuizStore.load_questions,
        kuiz_filters: state.kuizStore.kuiz_filters
    }
}

export default connect(
    mapState, {
}
)(TableQuestions);