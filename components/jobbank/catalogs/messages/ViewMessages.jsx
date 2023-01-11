import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { optionsStatusSelection, optionsTypeNotify } from '../../../../utils/constant';

const ViewMessages = ({
    filtersString,
    filtersQuery,
    currentPage
}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);

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
        }
    ];

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs actionBtnAdd={()=> router.push({
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