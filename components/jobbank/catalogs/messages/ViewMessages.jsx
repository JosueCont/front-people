import React, { useState, useEffect } from 'react';
import { Row, Col, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { optionsStatusSelection, optionsTypeNotify } from '../../../../utils/constant';
import { getConnectionsOptions } from '../../../../redux/jobBankDuck';

const ViewMessages = ({
    filtersString,
    filtersQuery,
    currentPage
}) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);
    const getNode = state => state.userStore.current_node;
    const currentNode = useSelector(getNode);
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const optionEmail = {code: 'EM', name: 'Correo electrónico'};

    useEffect(()=>{
        if(!currentNode) return;
        dispatch(getConnectionsOptions(currentNode.id,'&conection_type=2'));
    },[currentNode])

    useEffect(()=>{
        if(!currentNode) return;
        getTemplateNotification(currentNode.id, filtersString);
    },[currentNode, filtersString])

    const getTemplateNotification = async (node, query) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getTemplateNotification(node, query);
            setMainData(response.data)
            setLoading()
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteTemplateNotification(id);
            getTemplateNotification(currentNode.id, filtersString);
            message.success('Notificación eliminada');
        } catch (e) {
            console.log(e)
            message.error('Notificación no eliminada')
        }
    }

    const getStatus = (item) =>{
        const find_ = record => record.value == item.status_process;
        let result = optionsStatusSelection.find(find_);
        if(!result) return null;
        return result.label;
    }

    const getType = (item) =>{
        const find_ = record => record.value == item.type;
        let result = optionsTypeNotify.find(find_);
        if(!result) return null;
        return result.label;
    }

    const getRed = (item) =>{
        if(item.notification_source?.length <= 0) return [];
        const red = record => item.notification_source.includes(record.code);
        return [...list_connections_options, optionEmail].filter(red);
    }

    const extraColumns = [
        {
            title: 'Asunto',
            dataIndex: 'subject',
            key: 'subject'
        },
        {
            title: 'Estatus',
            render: (item) => getStatus(item)
        },
        {
            title: 'Tipo',
            render: (item) => getType(item)
        },
        {
            title: 'Medio de notificación',
            render: (item)=>{
                return(
                    <div style={{display: 'flex', flexFlow: 'row wrap'}}>
                        {getRed(item).map(record => (
                            <Tag>{record.name}</Tag>
                        ))}
                    </div>
                )
            }
        }
    ];

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    keyName='subject__unaccent__icontains'
                    actionBtnAdd={()=> router.push({
                        pathname: '/jobbank/settings/catalogs/messages/add',
                        query: filtersQuery
                })}/>
            </Col>
            <Col span={24}>
                <TableCatalogs
                    keyTitle='subject'
                    titleDelete='¿Estas seguro de eliminar esta notificación?'
                    catalogResults={mainData}
                    catalogLoading={loading}
                    numPage={currentPage}
                    extraColumns={extraColumns}
                    actionDelete={actionDelete}
                    actionBtnEdit={(item)=> router.push({
                        pathname: '/jobbank/settings/catalogs/messages/edit',
                        query: {...filtersQuery, id: item.id}
                    })}
                />
            </Col>
        </Row>
    )
}

export default ViewMessages