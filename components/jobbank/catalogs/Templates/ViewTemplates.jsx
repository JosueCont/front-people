import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { useRouter } from 'next/router';

const ViewTemplates = ({
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
        getProfilesTypes(currentNode.id, filtersString);
    },[currentNode, filtersString])

    const getProfilesTypes = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getProfilesTypes(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteProfileType(id);
            getProfilesTypes(currentNode.id, filtersString);
            message.success('Template eliminado');
        } catch (e) {
            console.log(e)
            message.error('Template no eliminado');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    actionBtnAdd={()=> router.push({
                        pathname: '/jobbank/settings/catalogs/profiles/add',
                        query: filtersQuery
                    })}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar tipo de template'
                    titleEdit='Editar tipo de template'
                    titleDelete='¿Estás seguro de eliminar este tipo de template?'
                    actionDelete={actionDelete}
                    catalogResults={mainData}
                    catalogLoading={loading}
                    numPage={currentPage}
                    actionBtnEdit={(item)=> router.push({
                        pathname: '/jobbank/settings/catalogs/profiles/edit',
                        query: {...filtersQuery, id: item.id}
                    })}
                />
            </Col>
        </Row> 
    )
}

export default ViewTemplates;