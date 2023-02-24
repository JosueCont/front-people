import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Select,
    Tooltip
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
import moment from 'moment';

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
            let error = e.response?.data?.message;
            let msg = error ? error : 'Estatus no actualizado';
            message.error(msg);
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

    const getPercentGen = (item) =>{
        let assets = item.candidate?.person_assessment_list;
        if(!assets || assets.length <= 0) return null;
        let percent = 100 / (assets?.length * 100);
        let progress = assets.reduce((acc, current) =>{
            if(!current?.applys[0]) return acc;
            return acc + current.applys[0]?.progress;
        }, 0);
        return (percent * progress).toFixed(2);
    }

    const columns = [
        {
            title: 'Candidato',
            ellipsis: true,
            render: (item) =>{
                return item?.candidate ? (
                    <span
                        className='ant-table-cell-ellipsis'
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> router.push({
                            pathname: '/jobbank/candidates/edit',
                            query: {...router.query, id: item.candidate?.id, back: 'applications'}
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
                        className='ant-table-cell-ellipsis'
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> router.push({
                            pathname: '/jobbank/vacancies/edit',
                            query: {...router.query, id: item.vacant?.id, back: 'applications'}
                        })}
                    >
                        {item.vacant?.job_position}
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Fecha de registro',
            ellipsis: true,
            render: (item) =>{
                return(
                    <>{moment(item.registration_date).format('DD-MM-YYYY hh:mm a')}</>
                )
            }
        },
        {
            title: 'Evaluaciones',
            render: (item) =>{
                let valid = item.candidate?.user_person
                    && item.candidate?.person_assessment_list?.length > 0;
                return valid ? (
                    <span
                        style={{color: '#1890ff', cursor: 'pointer'}}
                        onClick={()=> router.push({
                            pathname: `/assessment/persons/${item.candidate?.user_person}`,
                            query: {...router.query, back: 'applications'}
                        })}
                    >
                        {getPercentGen(item)}%
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Estatus',
            width: 130,
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
            width: 80,
            align: 'center',
            render: (item) =>{
                return(
                    <Tooltip title='Descargar CV'>
                        <Button
                            size='small'
                            onClick={()=> downloadCustomFile({
                                name: item.candidate?.cv?.split('/')?.at(-1),
                                url: item.candidate.cv
                            })}
                        >
                            <DownloadOutlined/>
                        </Button>
                    </Tooltip>
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