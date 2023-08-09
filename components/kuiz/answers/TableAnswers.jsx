import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Dropdown,
    Button,
    Menu
} from 'antd';
import { useRouter } from 'next/router';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    DownOutlined,
    UpOutlined,
    EllipsisOutlined
} from '@ant-design/icons';

const TableAnswers = ({
    list_answers,
    load_answers
}) => {

    const router = useRouter();

    const MenuItem = ({ item }) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined />}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<DeleteOutlined />}
            >
                Eliminar
            </Menu.Item>
            {/* <Menu.Item
                key='5'
                icon={<PlusOutlined/>}
                onClick={()=> router.push({
                    pathname: '/kuiz/answers',
                    query: {...router.query, question: item.id}
                })}
            >
                Ver respuestas
            </Menu.Item> */}
            <Menu.Item
                key='3'
                icon={<DownOutlined />}
            >
                Mover hacia abajo
            </Menu.Item>
            <Menu.Item
                key='4'
                icon={<UpOutlined />}
            >
                Mover hacia arriba
            </Menu.Item>
        </Menu>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Orden',
            dataIndex: 'order',
            render: (item) => item + 1
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Dropdown placement='bottomLeft' overlay={<MenuItem item={item} />}>
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
            className='ant-table-colla'
            dataSource={list_answers?.results}
            loading={load_answers}
            pagination={{
                hideOnSinglePage: true,
                showSizeChanger: true,
            }}
        />
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_answers: state.kuizStore.list_answers,
        load_answers: state.kuizStore.load_answers,
        kuiz_filters: state.kuizStore.kuiz_filters
    }
}

export default connect(
    mapState, {
}
)(TableAnswers);