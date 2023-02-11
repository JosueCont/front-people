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
import { getApplications, getApplicationsCandidates } from '../../../redux/jobBankDuck';
import { downloadCustomFile } from '../../../utils/functions';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TableApplications = ({
    currentNode,
    list_applications,
    load_applications,
    jobbank_page,
    jobbank_filters,
    jobbank_page_size,
    getApplications,
    getApplicationsCandidates
}) => {

    const router = useRouter();

    const actionStatus = async (value, item) =>{
        try {
            let response = await WebApiJobBank.updateApplications(item.id, {status: value});
            getApplications(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            let txt = response?.data?.message;
            let msg = txt ? txt : 'Estatus actualizado';
            message.success(msg);
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

    const optionsStatus = (status) =>{ 
        return optionsStatusApplications.map(item =>{
            let disabled = status == 1 ? false : !(item.value == status);
            return {...item, disabled}
        })
    }

    const columns = [
        {
            title: 'Candidato',
            render: (item) =>{
                return item?.candidate ? (
                    <span
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> router.push({
                            pathname: '/jobbank/candidates/edit',
                            query: {...router.query, id: item.candidate?.id}
                        })}
                    >
                        {item.candidate?.first_name} {item.candidate?.last_name}
                    </span>
                ) : <></>;
            }   
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
            ellipsis: true,
            render: (item) =>{
                return item.vacant?.job_position ? (
                    <span
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> router.push({
                            pathname: '/jobbank/vacancies/edit',
                            query: {...router.query, id: item.vacant?.id}
                        })}
                    >
                        {item.vacant?.job_position}
                    </span>
                ) : <></>;
            }
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
                        options={optionsStatus(item.status)}
                        onChange={(e) => actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: 'Acciones',
            width: 105,
            render: (item) =>{
                return(
                    <span
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> downloadCustomFile({
                            name: item.candidate?.cv?.split('/')?.at(-1),
                            url: item.candidate.cv
                        })}
                    >
                        Descargar CV
                    </span>
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
    mapState, {
        getApplications,
        getApplicationsCandidates
    }
)(TableApplications);