import React, {
    useState
} from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Dropdown,
    Button,
    Menu,
    message
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
import WebApiAssessment from '../../../api/WebApiAssessment';
import { getAnswers } from '../../../redux/kuizDuck';
import ListItems from '../../../common/ListItems';

const TableAnswers = ({
    list_answers,
    load_answers,
    getAnswers,
    showEdit = () => { }
}) => {

    const router = useRouter();
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.map(item => item.id);
            await WebApiAssessment.deleteAnswer(id);
            getAnswers(router.query?.question)
            message.success('Respuesta eliminada')
        } catch (e) {
            console.log(e)
            message.error('Respuesta no eliminada')
        }
    }

    const actionOrder = async (answer_id, type) => {
        try {
            await WebApiAssessment.orderAnswer(type, { answer_id })
            getAnswers(router.query?.question)
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
            {item.order > 0 && (
                <Menu.Item
                    key='4'
                    icon={<UpOutlined />}
                    onClick={() => actionOrder(item.id, 'move_answer_up')}
                >
                    Mover hacia arriba
                </Menu.Item>
            )}
            {(item.order + 1) < list_answers?.results?.length && (
                <Menu.Item
                    key='3'
                    icon={<DownOutlined />}
                    onClick={() => actionOrder(item.id, 'move_answer_down')}
                >
                    Mover hacia abajo
                </Menu.Item>
            )}
        </Menu>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value'
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
                dataSource={list_answers?.results}
                loading={load_answers}
                pagination={{
                    showSizeChanger: true,
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta pregunta?'
                visible={openDelete}
                keyTitle='title'
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
        list_answers: state.kuizStore.list_answers,
        load_answers: state.kuizStore.load_answers
    }
}

export default connect(
    mapState, {
    getAnswers
}
)(TableAnswers);