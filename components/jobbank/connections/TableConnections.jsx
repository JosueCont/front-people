import React from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Tag,
} from 'antd';
import { useRouter } from 'next/router';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { connect } from 'react-redux';
import { getConnections } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';

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
    
    const checkConfig = (item) => item.is_valid
    && item.data_config?.page_access_token
    && item.data_config?.user_access_token;

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    disabled={item.code == 'LK'}
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: '/jobbank/settings/connections/edit',
                        query: {...router.query, code: item.code, id: item.id}
                    })}
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