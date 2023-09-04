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
    EllipsisOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { getQuestions } from '../../../redux/kuizDuck';
import ListItems from '../../../common/ListItems';

const TableQuestions = ({
    list_questions,
    load_questions,
    getQuestions,
    showEdit = () => { }
}) => {

    const router = useRouter();
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.map(item => item.id);
            await WebApiAssessment.deleteQuestion(id);
            getQuestions(router.query?.section)
            message.success('Pregunta eliminada')
        } catch (e) {
            console.log(e)
            message.error('Pregunta no eliminada')
        }
    }

    const actionOrder = async (question_id, type) => {
        try {
            await WebApiAssessment.orderQuestion(type, { question_id })
            getQuestions(router.query?.section)
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
                    pathname: '/kuiz/answers',
                    query: { ...router.query, question: item.id }
                })}
            >
                Ver respuestas
            </Menu.Item>
            {item.order > 0 && (
                <Menu.Item
                    key='4'
                    icon={<UpOutlined />}
                    onClick={()=> actionOrder(item.id, 'move_question_up')}
                >
                    Mover hacia arriba
                </Menu.Item>
            )}
            {(item.order + 1) < list_questions?.results?.length && (
                <Menu.Item
                    key='3'
                    icon={<DownOutlined />}
                    onClick={()=> actionOrder(item.id, 'move_question_down')}
                >
                    Mover hacia abajo
                </Menu.Item>
            )}
        </Menu>
    )

    const columns = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'No. respuestas',
            dataIndex: 'answer_set',
            render: (item) => item?.length || '0'
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
                dataSource={list_questions?.results}
                loading={load_questions}
                pagination={{
                    showSizeChanger: true,
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta pregunta?'
                visible={openDelete}
                keyTitle='title'
                keyDescription='type'
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
        list_questions: state.kuizStore.list_questions,
        load_questions: state.kuizStore.load_questions
    }
}

export default connect(
    mapState, {
    getQuestions
}
)(TableQuestions);