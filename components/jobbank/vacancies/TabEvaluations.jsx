import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    Table,
    Space,
    Tag,
    Tooltip,
    Dropdown,
    Button,
    Menu,
    message,
    Switch
} from 'antd';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import ViewAssessments from './ViewAssessments';
import ListItems from '../../../common/ListItems';
import ModalEvaluations from './ModalEvaluations';

// const ModalEvaluations = dynamic(() => import('./ModalEvaluations'), { ssr: false });

const TabEvaluationsCopy = () => {

    const {
        list_group_assessments,
        load_group_assessments,
    } = useSelector(state => state.assessmentStore);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [evaluations, setEvaluations] = useState({});
    const [openList, setOpenList] = useState(false);
    const [listGroups, setListGroups] = useState([]);

    const [itemToEdit, setItemToEdit] = useState({});
    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);

    useEffect(() => {
        if (!router.query?.id) return;
        getEvaluations(router.query?.id);
    }, [router.query?.id])

    const isEdit = useMemo(() => Object.keys(itemToEdit)?.length > 0, [itemToEdit])

    const getEvaluations = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getEvaluationsVacant(id);
            setLoading(false)
            setEvaluations(response.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) => {
        try {
            await WebApiJobBank.addEvaluationVacant({ ...values, vacant: router.query?.id });
            getEvaluations(router.query?.id)
            message.success('Evaluación agregada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no agregada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiJobBank.updateEvaluation(itemToEdit?.id, {...values, vacant: router.query?.id});
            getEvaluations(router.query?.id)
            message.success('Evaluación actualizada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no actualizada')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1)?.id;
            await WebApiJobBank.deleteEvaluation(id);
            getEvaluations(router.query?.id)
            message.success('Evaluación eliminada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no eliminada')
        }
    }

    const actionStatus = async (id, is_active) => {
        try {
            await WebApiJobBank.updateStatusEvaluation(id, { is_active });
            getEvaluations(router.query?.id)
            message.success('Estatus actualizado')
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const showList = (item) => {
        let ids = item.group_assessment.map(item => item.id);
        let results = list_group_assessments.filter(item => ids.includes(item.id));
        setListGroups(results)
        setOpenList(true)
    }

    const closeList = () => {
        setListGroups([])
        setOpenList(false)
    }

    const showEdit = (item) => {
        setItemToEdit(item)
        setOpenEdit(true)
    }

    const closeEdit = () => {
        setOpenEdit(false)
        setItemToEdit({})
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
            dataIndex: 'source',
            render: (item) => item == 1 ? 'KHOR+' : 'Cliente'
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url'
        },
        {
            title: 'Grupos de evaluaciones',
            render: (item) => item.group_assessment?.length > 0 ? (
                <Space>
                    <Tooltip title='Ver grupos'>
                        <EyeOutlined
                            onClick={() => showList(item)}
                        />
                    </Tooltip>
                    <Tag
                        icon={<FileTextOutlined style={{ color: '#52c41a' }} />}
                        color='green' style={{ fontSize: '14px' }}
                    >
                        {item.group_assessment ? item.group_assessment.length : 0}
                    </Tag>
                </Space>
            ) : <></>
        },
        {
            title: 'Estatus',
            render: (item) => (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checked={item.is_active}
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                    onChange={(e) => actionStatus(item.id, e)}
                />
            )
        },
        {
            title: () => <Button size='small' onClick={() => setOpenEdit(true)}>Agregar</Button>,
            render: (item) => (
                <Dropdown overlay={<MenuItem item={item} />}>
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
                loading={loading}
                className='table-custom'
                dataSource={evaluations?.results}
                pagination={{
                    total: evaluations?.count,
                    showSizeChanger: false,
                    hideOnSinglePage: true
                }}
            />
            <ViewAssessments
                visible={openList}
                close={closeList}
                itemsGroup={listGroups}
            />
            <ModalEvaluations
                title={isEdit ? 'Actualizar evaluación' : 'Agregar evaluación'}
                visible={openEdit}
                close={closeEdit}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta evaluación?'
                visible={openDelete}
                keyTitle='name'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabEvaluationsCopy