import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Dropdown,
    Menu,
    Button,
    message,
    Select,
    Space,
    Tooltip
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    DownloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import { popupPDF, downloadCustomFile } from '../../../utils/functions';
import ListItems from '../../../common/ListItems';
import ModalReferences from './ModalReferences';
import { optionsStatusReferences } from '../../../utils/constant';
// import ModalRejected from './ModalRejected';
// import { EditorState, convertFromHTML, ContentState } from 'draft-js';

const TabReferences = ({
    action,
    type = '1'
}) => {

    const getUser = state => state.userStore.user;
    const currentUser = useSelector(getUser);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoReferences, setInfoReferences] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    // const [openModalReject, setOpenModalReject] = useState(false);
    // const [visibleFooter, setVisibleFooter] = useState(true);
    const [itemToEdit, setItemToEdit] = useState({});
    // const [itemToReject, setItemToReject] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    // const [msgHTML, setMsgHTML] = useState("<p></p>");
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isReject, setIsReject] = useState(false);
    const [useWithAction, setUseWithAction] = useState(true);
    
    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoReference(router.query.id);
        }
    },[router.query?.id])

    const getInfoReference = async (id) =>{
        try {
            setLoading(true);
            let params = `&paginate=0&type_file=${type}`;
            let response = await WebApiJobBank.getReferences(id, params);
            setInfoReferences(response.data);
            setLoading(false);
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateReference(itemToEdit.id, values)
            message.success('Archivo actualizado')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Archivo no actualizado')
        }
    }

    const actionCreate = async (values) =>{
        const key = 'updatable';
        message.loading({content: 'Guardando archivo...', key})
        try {
            let date = moment().tz('America/Merida').toISOString();
            values.append('candidate', router.query?.id)
            values.append('type_file', type)
            values.append('upload_date', date)
            values.append('registration_date', date)
            values.append('uploaded_by', currentUser.id)
            values.append('comments', '')
            await WebApiJobBank.createReferences(values)
            message.success({content: 'Archivo guardado', key})
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error({content: 'Archivo no guadado', key})
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteReference(id);
            message.success('Archivo eliminado')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Archivo no eliminado')
        }
    }

    const actionStatus = async (value, item) =>{
        if(value == 3){
            openModalEdit({...item, status: value})
            setIsReject(true)
            return;
        }
        try {
            let body = {file_name: item.file_name, status: value};
            await WebApiJobBank.updateReference(item.id, body);
            message.success('Estatus actualizado');
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    // const actionRejectstatus = async () => {
    //     try {
    //         let body = {
    //             status: 3,
    //             file_name: itemToReject.file_name,
    //             comments: msgHTML
    //         }
    //         await WebApiJobBank.updateReference(itemToReject.id, body);
    //         message.success('Estatus actualizado');
    //         getInfoReference(router.query.id);
    //         setItemToEdit({})
    //     } catch (error) {
    //         console.log(error)
    //         message.error('Estatus no actualizado');
    //         setItemToEdit({})
    //     }

    // }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
        setIsReject(false)
    }

    const openModalRemove = (item, withAcion = true) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
        setUseWithAction(withAcion)
    }

    // const openReject = (item, visibleFooter) => {
    //     setOpenModalReject(true)
    //     setItemToReject(item)
    //     if(visibleFooter) setVisibleFooter(false)
    //     if(!item.comments) return;
    //     setMsgHTML(item.comments);
    //     let convert = convertFromHTML(item.comments);
    //     let htmlMsg = ContentState.createFromBlockArray(convert);
    //     let template = EditorState.createWithContent(htmlMsg);
    //     setEditorState(template);
    // }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
        setIsReject(false)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    // const closeModalRejected = () => {
    //     setOpenModalReject(false)
    //     setMsgHTML('<p></p>');
    //     setItemToReject({})
    //     setEditorState(EditorState.createEmpty())
    //     setVisibleFooter(true)
    // }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={() => openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key='3'
                    icon={<EyeOutlined/>}
                    onClick={()=> popupPDF({url: item.file})}
                >
                    Visualizar
                </Menu.Item>
                <Menu.Item
                    key='4'
                    icon={<DownloadOutlined/>}
                    onClick={()=> downloadCustomFile({
                        url: item.file,
                        name: item.file?.split('/')?.at(-1)
                    })}
                >
                    Descargar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'file_name',
            key: 'file_name'
        },
        {
            title: 'Archivo',
            render: (item) =>{
                return(
                    <>{item.file ? item.file?.split('/')?.at(-1) : null}</>
                )
            }
        },
        {
            title: 'Fecha de carga',
            render: (item) =>{
                return(
                    <>{moment(item.upload_date).format('DD-MM-YYYY hh:mm a')}</>
                )
            }
        },
        {
            title: 'Estatus',
            filters: optionsStatusReferences.map(item => ({
                text: item.label,
                value: item.value
            })),
            onFilter: (value, record) => record.status == value,
            // filterSearch: true,
            render: (item) =>{
                return(
                    <Space>
                        <Select
                            size='small'
                            style={{width: 105}}
                            defaultValue={item.status}
                            value={item.status}
                            placeholder='Estatus'
                            options={optionsStatusReferences}
                            onChange={(e) => actionStatus(e, item)}
                        />
                        {item.status === 3 && (
                            <Tooltip title='Ver motivo'>
                                <EyeOutlined onClick={() => openModalRemove(item, false)}/>
                            </Tooltip>
                        )}
                    </Space>
                )
            }
        },
        {
            title: ()=> (
                <Button size='small' onClick={()=> setOpenModal(true)}>
                    Agregar
                </Button>
            ),
            width: 85,
            align: 'center',
            render: (item) =>{
                return(
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Table
                rowKey='id'
                className='table-custom'
                size='small'
                columns={columns}
                loading={loading}
                dataSource={infoReferences}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalReferences
                title={isEdit ? isReject ? 'Rechazar archivo' : 'Actualizar archivo' : 'Agregar archivo'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                isReject={isReject}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? isReject ? 'Rechazar' : 'Actualizar' : 'Guardar'}
            />
            {/* <ModalRejected 
                title='Rechazo de archivo'
                visible={openModalReject}
                close ={ closeModalRejected }
                itemToEdit ={ itemToReject }
                setMsgHTML = { setMsgHTML }
                setEditorState = {setEditorState}
                editorState = { editorState }
                actionForm = { actionRejectstatus }
                textSave = {'Rechazar'}
                viewFooter = {visibleFooter}
            /> */}
            <ListItems
                title={useWithAction ? '¿Estás seguro de eliminar este archivo?' : 'Motivo de rechazo'}
                visible={openModalDelete}
                keyTitle='file_name'
                {...useWithAction ? {} : {keyDescription: 'comments'}}
                textCancel={useWithAction ? 'Cancelar' : 'Cerrar'}
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
                useWithAction={useWithAction}
            />
            
        </>
    )
}

export default TabReferences