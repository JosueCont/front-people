import React from 'react';
import {
    Table,
    Space,
    Menu,
    Dropdown,
    Button
} from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getSections } from '../../../redux/kuizDuck';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    DownOutlined,
    UpOutlined,
    EllipsisOutlined
} from '@ant-design/icons';

const TableSections = ({
    list_sections,
    load_sections,
    getSections
}) => {

    const router = useRouter();

    const MenuItem = ({item}) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined/>}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<DeleteOutlined/>}
            >
                Eliminar
            </Menu.Item>
            <Menu.Item
                key='5'
                icon={<PlusOutlined/>}
                onClick={()=> router.push({
                    pathname: '/kuiz/questions',
                    query: {...router.query, section: item.id}
                })}
            >
                Ver preguntas
            </Menu.Item>
            <Menu.Item
                key='3'
                icon={<DownOutlined/>}
            >
                Mover hacia abajo
            </Menu.Item>
            <Menu.Item
                key='4'
                icon={<UpOutlined/>}
            >
                Mover hacia arriba
            </Menu.Item>
        </Menu>
    )

    const columns = [
        {
            title: 'Sección',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'No. preguntas',
            dataIndex: 'num_questions',
            key: 'num_questions'
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
                <Dropdown placement='bottomLeft' overlay={<MenuItem item={item}/>}>
                    <Button size='small'>
                        <EllipsisOutlined/>
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
            dataSource={list_sections?.results}
            loading={load_sections}
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
        list_sections: state.kuizStore.list_sections,
        load_sections: state.kuizStore.load_sections,
        kuiz_filters: state.kuizStore.kuiz_filters
    }
}

export default connect(
    mapState, {
    getSections
}
)(TableSections);