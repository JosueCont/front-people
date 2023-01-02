import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Space,
    Tag,
    Tooltip,
    Modal
} from 'antd';
import { useRouter } from 'next/router';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
    PlusOutlined,
    LinkOutlined,
    UserOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import { getConnections } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import ModalConfig from './ModalConfig';

const TableConnections = ({
    list_connections,
    load_connections,
    jobbank_page,
    currentNode,
    getConnections,
    currentPage,
    currentFilters
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [configCurrent, setConfigCurrent] = useState({});
    const [configExist, setConfigExist] = useState({});

    const actionStatus = async (checked, item) =>{
        try {
            await WebApiJobBank.updateConnectionStatus(item.id, {is_active: checked});
            getConnections(currentNode.id, currentFilters, currentPage);
            let msg = checked ? 'Conexión activada' : 'Conexión desactivada';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = checked ? 'Conexión no activada' : 'Conexión no desactivada';
            message.error(msg);
        }
    }

    const actionUpdate = async () =>{
        const key = 'updatable';
        message.loading({content: 'Copiando configuración...', key});
        try {
            await WebApiJobBank.updateConnection(configCurrent.id, {
                node: currentNode.id,
                name: configCurrent.name,
                code: configCurrent.code,
                is_valid: configExist.is_valid,
                data_config: configExist.data_config
            });
            setTimeout(()=>{
                getConnections(currentNode.id, currentFilters, currentPage);
                message.success({content: 'Configuración copiada', key})
            },1000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                message.error({content: 'Configuración no copiada', key})
            },1000)
        }
    }

    const toEdit = (item) =>{
        router.push({
            pathname: '/jobbank/settings/connections/edit',
            query: {...router.query, id: item.id, code: item.code }
        })
    }
    
    const checkConfig = (item) => item.is_valid
    && item.data_config?.page_access_token
    && item.data_config?.user_access_token;

    const validateFBAndIG = (item) =>{
        if(!['FB','IG'].includes(item.code)){
            toEdit(item)
            return;
        }
        if(checkConfig(item)){
            toEdit(item)
            return;
        }
        let code = item.code == 'FB' ? 'IG' : 'FB';
        const find_ = record => record.code == code;
        let result = list_connections.results.find(find_);
        if(!checkConfig(result)){
            toEdit(item)
            return;
        }
        setConfigExist(result)
        setConfigCurrent(item)
        setOpenModal(true)
    }

    const closeModal = () =>{
        setConfigCurrent({})
        setConfigExist({})
        setOpenModal(false)
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    disabled={item.code == 'LK'}
                    icon={<EditOutlined/>}
                    onClick={()=> validateFBAndIG(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    disabled
                    icon={<DeleteOutlined/>}
                    // onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

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
            title: 'Configuración',
            render: (item) =>{
                let valid = checkConfig(item);
                return(
                    <Tag
                        style={{width: '57px', textAlign: 'center'}}
                        color={valid ? 'green' : 'red'}
                    >
                        {valid ? 'Válida' : 'Inválida'}
                    </Tag>
                )
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Switch
                        size='small'
                        disabled={item.code == 'LK'}
                        defaultChecked={item.is_active}
                        checked={item.is_active}
                        checkedChildren="Activo"
                        unCheckedChildren="Inactivo"
                        onChange={(e)=> actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: 'Acciones',
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

    return (
        <>
             <Table
                size='small'
                rowKey='id'
                columns={columns}
                dataSource={list_connections.results}
                loading={load_connections}
                // rowSelection={rowSelection}
                // onChange={onChangePage}
                locale={{
                    emptyText: load_connections
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_connections.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalConfig
                visible={openModal}
                configCurrent={configCurrent}
                configExist={configExist}
                close={closeModal}
                actionUpdate={actionUpdate}
            />
        </>
    )
}

const mapState = (state) =>{
    return{
        list_connections: state.jobBankStore.list_connections,
        load_connections: state.jobBankStore.load_connections,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getConnections })(TableConnections);