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
import { downloadCustomFile, getPercentGenJB, copyContent } from '../../../utils/functions';
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

    const actionStatus = async (value, item) => {
        try {
            let response = await WebApiJobBank.updateApplications(item.id, { status: value });
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

    const onChangePage = ({ current, pageSize }) => {
        let filters = { ...router.query, page: current, size: pageSize };
        router.replace({
            pathname: '/jobbank/applications',
            query: filters
        })
    }

    const optionsStatus = (status) => {
        return optionsStatusApplications.map(item => {
            let disabled = status == 1 ? false : !(item.value == status);
            return { ...item, disabled }
        })
    }

    const copyPermalink = (item) => {
        copyContent({
            text: `${window.location.origin}/validation?user=${item.candidate?.user_person}&app=kuiz&type=user`,
            onSucces: () => message.success('Permalink copiado'),
            onError: () => message.error('Permalink no copiado')
        })
    }

    const menuItem = ({item, valid}) => {
        return (
            <Menu>
                {item.candidate?.cv && (
                    <Menu.Item
                        key='1'
                        icon={<DownloadOutlined />}
                        onClick={() => downloadCustomFile({
                            name: item.candidate?.cv?.split('/')?.at(-1),
                            url: item.candidate.cv
                        })}
                    >
                        Descargar CV
                    </Menu.Item>
                )}
                {valid && (
                    <Menu.Item
                        key='2'
                        icon={<LinkOutlined />}
                        onClick={() => copyPermalink(item)}
                    >
                        Permalink de evaluaciones
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Candidato',
            ellipsis: true,
            render: (item) => {
                return item?.candidate ? (
                    <span
                        className='ant-table-cell-ellipsis'
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => router.push({
                            pathname: '/jobbank/candidates/edit',
                            query: { ...router.query, id: item.candidate?.id, back: 'applications' }
                        })}
                    >
                        {item.candidate?.first_name} {item.candidate?.last_name}
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Correo electrónico',
            dataIndex: ['candidate', 'email'],
            key: ['candidate', 'email'],
            ellipsis: true
        },
        {
            title: 'Teléfono',
            dataIndex: ['candidate', 'cell_phone'],
            key: ['candidate', 'cell_phone']
        },
        {
            title: 'Cliente',
            ellipsis: true,
            render: (item) => {
                return item.vacant?.customer?.name ? (
                    <span
                        className='ant-table-cell-ellipsis'
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => router.push({
                            pathname: '/jobbank/clients/edit',
                            query: { ...router.query, id: item.vacant?.customer?.id, back: 'applications' }
                        })}
                    >
                        {item.vacant?.customer?.name}
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Vacante',
            ellipsis: true,
            render: (item) => {
                return item.vacant?.job_position ? (
                    <span
                        className='ant-table-cell-ellipsis'
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => router.push({
                            pathname: '/jobbank/vacancies/edit',
                            query: { ...router.query, id: item.vacant?.id, back: 'applications' }
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
            render: (item) => {
                return (
                    <>{moment(item.registration_date).format('DD-MM-YYYY hh:mm a')}</>
                )
            }
        },
        {
            title: 'Evaluaciones',
            render: (item) => {
                let valid = item.candidate?.user_person
                    && item.candidate?.person_assessment_list?.length > 0;
                return valid ? (
                    <span
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => router.push({
                            pathname: '/jobbank/candidates/assign',
                            query: { ...router.query, person: item.candidate?.user_person, back: 'applications' }
                        })}
                    >
                        {getPercentGenJB(item.candidate?.person_assessment_list)}%
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Estatus',
            width: 130,
            render: (item) => {
                return (
                    <Select
                        size='small'
                        style={{ width: 120 }}
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
            render: (item) => {
                let valid = item.candidate?.user_person
                && item.candidate?.person_assessment_list?.length > 0;
                return (valid || item.candidate?.cv) ? (
                    <Dropdown placement='bottomRight' overlay={() => menuItem({item,valid})}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                ) : <></>
            }
            // render: (item) =>{
            //     return(
            //         <Tooltip title='Descargar CV'>
            //             <Button
            //                 size='small'
            // onClick={()=> downloadCustomFile({
            //     name: item.candidate?.cv?.split('/')?.at(-1),
            //     url: item.candidate.cv
            // })}
            //             >
            //                 <DownloadOutlined/>
            //             </Button>
            //         </Tooltip>
            //     )   
            // }
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

const mapState = (state) => {
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