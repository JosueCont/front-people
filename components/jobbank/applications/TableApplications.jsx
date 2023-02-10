import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Select
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    DownloadOutlined,
    LinkOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { optionsStatusApplications } from '../../../utils/constant';
import { getApplications } from '../../../redux/jobBankDuck';
import { downloadCustomFile } from '../../../utils/functions';

const TableApplications = ({
    currentNode,
    list_applications,
    load_applications,
    jobbank_page,
    jobbank_filters,
    jobbank_page_size,
    getApplications
}) => {

    const router = useRouter();

    const actionStatus = async (value, item) =>{
        try {
            getApplications(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size)
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/jobbank/applications',
            query: filters
        })
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EyeOutlined/>}
                >
                    Ver detalle
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DownloadOutlined/>}
                    onClick={()=> downloadCustomFile({
                        name: item.candidate?.cv?.split('/')?.at(-1),
                        url: item.candidate.cv
                    })}
                >
                    Descargar CV
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: ['candidate','first_name'],
            key: ['candidate','first_name'],
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: ['candidate','last_name'],
            key: ['candidate','last_name'],
            ellipsis: true
        },
        {
            title:'Correo electrónico',
            dataIndex: ['candidate','email'],
            key: ['candidate','email'],
            ellipsis: true
        },
        {
            title: 'Teléfono',
            dataIndex: ['candidate','cell_phone'],
            key: ['candidate','cell_phone']
        },
        {
            title: 'Vacante',
            dataIndex: ['vacant','job_position'],
            key: ['vacant','job_postion'],
            ellipsis: true
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Select
                        size='small'
                        style={{width: 120}}
                        defaultValue={item.status}
                        value={item.status}
                        placeholder='Estatus'
                        options={optionsStatusApplications}
                        onChange={(e) => actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: 'Acciones',
            width: 80,
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
                dataSource={list_applications.results}
                loading={load_applications}
                onChange={onChangePage}
                locale={{
                    emptyText: load_applications
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_applications.count,
                    pageSize: jobbank_page_size,
                    current: jobbank_page,
                    hideOnSinglePage: list_applications?.count < 10,
                    showSizeChanger: list_applications?.count > 10
                }}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_applications: state.jobBankStore.list_applications,
        load_applications: state.jobBankStore.load_applications,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node,
        jobbank_page_size: state.jobBankStore.jobbank_page_size
    }
}

export default connect(
    mapState, { getApplications }
)(TableApplications);