import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import WebApiJobBank from '../../../../api/WebApiJobBank';

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

    const extraColumns = [
        {
            title: 'Estatus',
            render: (item) => (
                <span>algo</span>
            )
        },
        {
            title: 'Tipo',
            render: (item) => (
                <span>algo</span>
            )
        }
    ]

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
                    titleDelete='¿Estas seguro de eliminar este mensaje?'
                    catalogResults={mainData}
                    catalogLoading={loading}
                    numPage={currentPage}
                    extraColumns={extraColumns}
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