import React, {
    useState,
    useEffect
} from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Switch,
    message,
    Dropdown,
    Button,
    Menu
} from 'antd';
import {
    EllipsisOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { getAssessments } from '../../../redux/kuizDuck';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import AssessmentsGroup from '../../assessment/groups/AssessmentsGroup';

const TableAssessments = ({
    currentNode,
    getAssessments,
    list_assessments,
    load_assessments,
    kuiz_filters
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);

    const [openDelete, setOpenDelete] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);

    const actionStatus = async (is_active, item) => {
        try {
            await WebApiAssessment.assessmentStatus(item.id, { is_active });
            getAssessments(currentNode?.id, kuiz_filters);
            message.success('Estatus actualizado')
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.map(item => item.id);
            await WebApiAssessment.assessmentDelete(id);
            getAssessments(currentNode?.id, kuiz_filters)
            message.success('Evaluación eliminada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no eliminada')
        }
    }

    const actionGroup = async () => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiAssessment.createGroupAssessments(body);
            message.success('Grupo creado')
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            if (e.response.status === 400) return txt;
            let msg = txt ? txt : 'Grupo no agregado';
            message.error(msg)
            return 'ERROR';
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

    const closeGroup = () => {
        setItemsSelected([])
        setItemsKeys([])
        setOpenGroup(false)
    }

    const showGroup = () => {
        if (itemsSelected?.length > 1) {
            setOpenGroup(true)
            return;
        }
        setOpenGroup(false)
        message.error('Selecciona al menos dos evaluaciones')
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsSelected(selectedRows)
        }
    }

    const MenuTable = () => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<PlusOutlined />}
                onClick={() => showGroup()}
            >
                Crear grupo
            </Menu.Item>
        </Menu>
    )

    const MenuItem = ({ item }) => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EditOutlined />}
                onClick={() => router.push({
                    pathname: '/kuiz/assessments/edit',
                    query: {...router.query, id: item.id}
                })}
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
        </Menu>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Tipo',
            dataIndex: 'category',
            render: (item) => item == 'A'
                ? 'Assessments' : item == 'Q'
                    ? 'Quiz' : 'Khor'
        },
        {
            title: 'Estatus',
            render: (item) => item.category != 'K' ? (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                    onChange={(e) => actionStatus(e, item)}
                />
            ) : item.is_active ? 'Activo' : 'Inactivo'
        },
        {
            width: 60,
            title: () => (
                <Dropdown placement='bottomLeft' overlay={<MenuTable />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ),
            render: (item) => item.category == 'K' ? (
                <Dropdown placement='bottomLeft' overlay={<MenuItem item={item} />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ) : <></>
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                className='ant-table-colla'
                dataSource={list_assessments?.results}
                rowSelection={rowSelection}
                loading={load_assessments}
                pagination={{
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta evaluación?'
                visible={openDelete}
                keyTitle='name'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
            <AssessmentsGroup
                visible={openGroup}
                close={closeGroup}
                itemGroup={{ name: null, assessments: itemsSelected }}
                title='Crear nuevo grupo'
                actionForm={actionGroup}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_assessments: state.kuizStore.list_assessments,
        load_assessments: state.kuizStore.load_assessments,
        kuiz_filters: state.kuizStore.kuiz_filters
    }
}

export default connect(
    mapState, {
    getAssessments
}
)(TableAssessments);