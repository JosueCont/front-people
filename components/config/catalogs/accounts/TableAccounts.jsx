import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getAccountantAccount } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalAccounts from './ModalAccounts';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableAccounts = ({
    currentNode,
    nameCatalog,
    getAccountantAccount,
    cat_accounts,
    load_accounts
}) => {

    const urlBase = '/payroll/accountant-account/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Cuenta registrada')
            getAccountantAccount(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Cuenta no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, values
            )
            message.success('Cuenta actualizada')
            getAccountantAccount(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Cuenta no actualizada')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Cuenta eliminada')
            getAccountantAccount(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Cuenta no eliminada')
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
            title: 'Cuenta',
            dataIndex: 'account',
            key: 'account'
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
                loading={load_accounts}
                dataSource={cat_accounts}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalAccounts
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar cuenta contable'
                    : 'Agregar cuenta contable'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar esta cuenta contable?'
                visible={openDelete}
                keyTitle='account'
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
        cat_accounts: state.catalogStore.cat_accounts,
        load_accounts: state.catalogStore.load_accounts,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getAccountantAccount
    }
)(TableAccounts);