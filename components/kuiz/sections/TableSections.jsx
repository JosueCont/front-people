import React, {
    useState
} from 'react';
import {
    Table,
    Space,
    Menu,
    Dropdown,
    Button,
    message
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
    EllipsisOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import ListItems from '../../../common/ListItems';
import WebApiAssessment from '../../../api/WebApiAssessment';

const TableSections = ({
    list_sections,
    load_sections,
    getSections,
    showEdit = () => { }
}) => {

    const router = useRouter();
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.map(item => item.id);
            await WebApiAssessment.deleteSection(id);
            getSections(router.query?.assessment)
            message.success('Sección eliminada')
        } catch (e) {
            console.log(e)
            message.error('Sección no eliminada')
        }
    }

    const actionOrder = async (section_id, type) => {
        try {
            await WebApiAssessment.orderSection(type, { section_id })
            getSections(router.query?.assessment)
            message.success('Orden actualizado')
        } catch (e) {
            console.log(e)
            message.error('Orden no actualizado')
        }
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const MenuItem = ({ item }) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined />}
                onClick={() => showEdit(item)}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<DeleteOutlined />}
                onClick={() => showDelete(item)}
            >
                Eliminar
            </Menu.Item>
            <Menu.Item
                key='5'
                icon={<UnorderedListOutlined />}
                onClick={() => router.push({
                    pathname: '/kuiz/questions',
                    query: { ...router.query, section: item.id }
                })}
            >
                Ver preguntas
            </Menu.Item>
            {item.order > 0 && (
                <Menu.Item
                    key='4'
                    icon={<UpOutlined />}
                    onClick={() => actionOrder(item.id, 'move_section_up')}
                >
                    Mover hacia arriba
                </Menu.Item>
            )}
            {(item.order + 1) < list_sections?.results?.length && (
                <Menu.Item
                    key='3'
                    icon={<DownOutlined />}
                    onClick={() => actionOrder(item.id, 'move_section_down')}
                >
                    Mover hacia abajo
                </Menu.Item>
            )}
        </Menu>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
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
                <Dropdown placement='bottomLeft' overlay={<MenuItem item={item} />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                className='ant-table-colla'
                dataSource={list_sections?.results}
                loading={load_sections}
                pagination={{
                    showSizeChanger: true,
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta sección?'
                visible={openDelete}
                keyTitle='name'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_sections: state.kuizStore.list_sections,
        load_sections: state.kuizStore.load_sections
    }
}

export default connect(
    mapState, {
    getSections
}
)(TableSections);