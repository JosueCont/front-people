import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getCostCenter } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalCenters from './ModalCenters';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableCenters = ({
    currentNode,
    nameCatalog,
    getCostCenter,
    cat_cost_center,
    load_cost_center
}) => {

    const urlBase = '/payroll/cost-center/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Centro registrado')
            getCostCenter(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Centro no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            let body = {...values, node: currentNode?.id};
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, body
            )
            message.success('Centro actualizado')
            getCostCenter(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Centro no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Centro eliminado')
            getCostCenter(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Centro no eliminado')
        }
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const showEdit = (item) => {
        setItemToEdit(item)
        setOpenModal(true)
    }

    const closeModal = () => {
        setItemToEdit({})
        setOpenModal(false)
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const columns = [
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Space>
                    <EditOutlined onClick={() => showEdit(item)} />
                    <DeleteOutlined onClick={() => showDelete(item)} />
                </Space>
            )
        }
    ]

    return (
        <>
            <SearchCatalogs
                title={nameCatalog}
                actionAdd={() => setOpenModal(true)}
            />
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                loading={load_cost_center}
                dataSource={cat_cost_center}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalCenters
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar centro de costos'
                    : 'Agregar centro de costos'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar este centro de costos?'
                visible={openDelete}
                keyTitle='code'
                keyDescription='description'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
                timeLoad={1000}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        cat_cost_center: state.catalogStore.cat_cost_center,
        load_cost_center: state.catalogStore.load_cost_center,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getCostCenter
    }
)(TableCenters);