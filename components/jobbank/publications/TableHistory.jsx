import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Row, Col } from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { redirectTo } from '../../../utils/constant';
import moment from 'moment';
import SearchHistory from './SearchHistory';

const TableHistory = () => {

    const router = useRouter();
    const [infoPublication, setInfoPublication] = useState({});
    const [infoHistory, setInfoHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const nameList = {'FB': 'Facebook'};
    moment.locale('es-mx');

    useEffect(()=>{
        if(router.query?.id) getInfoHistory(router.query.id);
    },[router])

    const search_ = item =>{
        let date = moment(item.timestamp).format('DD-MM-YYYY');
        let check_start = date >= router.query?.start;
        let check_end = date <= router.query?.end;
        let check_code = item.code_post == router.query?.code_post;
        let check_dates = check_start && check_end;
        if(check_dates && check_code) return true;
        if(check_dates) return true;
        if(check_code) return true;
        return false;
    }

    const onFilterHistory = (history = []) =>{
        let size = Object.keys(router.query).length;
        if(size > 1){
            let results = history?.filter(search_);
            setInfoHistory(results);
            return;
        }
        setInfoHistory(history);
    }

    const getInfoHistory = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoPublication(id);
            setInfoPublication(response.data);
            onFilterHistory(response.data?.history);
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const columns = [
        {
            title: 'Cuenta',
            render: (item) =>{
                return(
                    <span>{nameList[item.code_post]}</span>
                )
            }
        },
        {
            title: 'Fecha',
            render: (item) =>{
                let format = 'DD-MM-YYYY hh:mm a';
                return(
                    <span>{moment(item.timestamp).format(format)}</span>
                )
            }
        },
        {
            title: 'Publicación',
            render: (item) =>{
                return(
                    <a
                        style={{color: '#1890ff'}}
                        onClick={()=> redirectTo(item.post_url, true)}
                    >
                        Ir a publicación
                    </a>
                )
            }
        }
    ]

    return (
        <Row gutter={[16,16]}>
            <Col span={24}>
                <SearchHistory infoPublication={infoPublication}/>
            </Col>
            <Col span={24}>
                <Table
                    size='small'
                    rowKey='id'
                    columns={columns}
                    loading={loading}
                    dataSource={infoHistory}
                    locale={{ emptyText: loading
                        ? 'Cargando...'
                        : 'No se encontraron resultados'
                    }}
                    pagination={{
                        total: infoHistory?.length ?? 0,
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                    }}
                />
            </Col>
        </Row>
    )
}

export default TableHistory