import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getDocumentType } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalDocuments from './ModalDocuments';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableDocuments = ({
    currentNode,
    nameCatalog,
    getDocumentType,
    cat_document_type,
    load_documents
}) => {

    const urlBase = '/business/document-type/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    // useEffect(()=>{
    //     if(!currentNode) return;
    //     getDocumentType(currentNode?.id)
    // },[currentNode])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Tipo registrado')
            getDocumentType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, values
            )
            message.success('Tipo actualizado')
            getDocumentType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Tipo eliminado')
            getDocumentType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no eliminado')
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
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
                loading={load_documents}
                dataSource={cat_document_type}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalDocuments
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar tipo de documento'
                    : 'Agregar tipo de documento'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar este tipo de documento?'
                visible={openDelete}
                keyTitle='name'
                keyDescription='code'
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
        cat_document_type: state.catalogStore.cat_document_type,
        load_documents: state.catalogStore.load_documents,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getDocumentType
    }
)(TableDocuments);