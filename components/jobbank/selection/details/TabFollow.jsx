import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Table, Select, message, Menu, Dropdown, Skeleton } from 'antd';
import { optionsStatusSelection } from '../../../../utils/constant';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useSelector } from 'react-redux';
import ModalComments from './ModalComments';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import ListItems from '../../../../common/ListItems';

const TabFollow = () => {

    const router = useRouter();
    const getUser = state => state.userStore.user;
    const currentUser = useSelector(getUser);
    const noValid = [undefined,null,""," "];
    const [infoProcess, setInfoProcess] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [listLog, setListLog] = useState([]);
    const [statusProcess, setStatusProcess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(Object.keys(infoProcess).length <= 0) return;
        setStatusProcess(infoProcess.status_process);
    },[infoProcess])

    useEffect(()=>{
        if(!router.query?.id) return;
        getProcessLog(router.query?.id);
        getInfoSelection(router.query?.id);
    },[router.query?.id])

    const getProcessLog = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getProcessLog(id);
            let data = response.data?.results ?? [];
            const filter_ = item => !noValid.includes(item.comments);
            setListLog(data?.filter(filter_));
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getInfoSelection = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoSelection(id);
            setInfoProcess(response.data);
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const updateStatusProcess = async () =>{
        try {
            let data = {status_process: statusProcess, person: currentUser.id};
            await WebApiJobBank.updateSelectionStatus(infoProcess.id, data);
            message.success('Estatus actualizado')
            getInfoSelection(router.query?.id)
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const createData = (values) =>{
        return{
            ...values,
            initial_status: infoProcess?.status_process,
            final_status: infoProcess?.status_process,
            process: router.query?.id,
            person: currentUser.id
        }
    }

    const actionCreate = async (values) =>{
        try {
            let body = createData(values);
            await WebApiJobBank.createProcessLog(body);
            message.success('Comentario registrado')
            getProcessLog(router.query?.id);
        } catch (e) {
            console.log(e)
            message.error('Comentario no registrado')
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateProcessLog(itemToEdit.id, values);
            message.success('Comentario actualizado')
            getProcessLog(router.query?.id);
        } catch (e) {
            console.log(e)
            message.error('Comentario no actualizado')
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1)?.id;
            await WebApiJobBank.deleteProcessLog(id);
            message.success('Comentario eliminado')
            getProcessLog(router.query?.id);
        } catch (e) {
            console.log(e)
            message.error('Comentario no eliminado')
        }
    }

    const optionsStatus = useMemo(()=>{
        let selected = Object.keys(infoProcess).length > 0
            ? infoProcess.status_process : 7;
        const map_ = item => ({...item, disabled: item.value < selected});
        return optionsStatusSelection.map(map_)
    },[infoProcess])

    const isEdit = useMemo(()=> Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const showModal = (item) =>{
        setOpenModal(true)
        setItemToEdit(item)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalRemove = (item) =>{
        setOpenModalDelete(true)
        setItemsToDelete([item])
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> showModal(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Comentario',
            dataIndex: 'comments',
            key: 'comments'
        },
        {
            title: ()=>{
                return(
                    <Button
                        size='small'
                        onClick={()=> setOpenModal(true)}
                    >
                        Agregar
                    </Button>
                )
            },
            width: 100,
            render: (item) =>{
                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return(
        <>
             <Row gutter={[0,24]}>
                <Col span={24}>
                    <div span={24} className='title-action-content'>
                        <p style={{marginBottom: 0, fontSize: 14}}>
                            {Object.keys(infoProcess).length > 0 && (
                                <>
                                    {infoProcess?.candidate?.first_name} {infoProcess?.candidate?.last_name}
                                    &nbsp;/&nbsp;<span style={{color: 'rgba(0,0,0,0.5)'}}>
                                        {infoProcess?.vacant?.job_position}
                                    </span>
                                </>
                            )}
                        </p>
                        <div className='content-end' style={{gap: 8}}>
                            <Select
                                loading={fetching}
                                disabled={fetching}
                                value={statusProcess}
                                onChange={e => setStatusProcess(e)}
                                className='select-jb'
                                size='small'
                                style={{width: 165}}
                                placeholder='Seleccionar una opción'
                                options={optionsStatus}
                            />
                            <Button
                                disabled={fetching || (infoProcess?.status_process == statusProcess)}
                                onClick={()=> updateStatusProcess()}
                                size='small'
                            >
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col span={24}>
                    <Table
                        rowKey='id'
                        size='small'
                        className='table-custom'
                        columns={columns}
                        dataSource={listLog}
                        loading={loading}
                        pagination={{
                            hideOnSinglePage: true,
                            showSizeChanger: false,
                        }}
                    />
                </Col>
            </Row>
            <ModalComments
                title={isEdit ? 'Actualizar comentario' : 'Agregar comentario'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
            <ListItems
                title='¿Estás seguro de eliminar este comentario?'
                visible={openModalDelete}
                keyTitle='comments'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabFollow