import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Table, Button, Row, Col } from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { redirectTo } from '../../../utils/constant';
import moment from 'moment';
import SearchHistory from './SearchHistory';

const TableHistory = ({ newFilters = {} }) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const [infoPublication, setInfoPublication] = useState({});
    const [infoHistory, setInfoHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(router.query?.id) getInfoHistory(router.query.id);
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoPublication).length <= 0) return;
        setLoading(true)
        onFilterHistory();
    },[infoPublication, router.query])

    const getInfoHistory = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoPublication(id);
            setInfoPublication(response.data);
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const searchItems = (size) =>{
        return infoPublication.history?.filter(item =>{
            let date = moment(item.timestamp).format('DD-MM-YYYY');
            let check_start = date >= router.query?.start;
            let check_end = date <= router.query?.end;
            let check_code = item.code_post == router.query?.account;
            if(size == 3 && check_start && check_end && check_code) return true;
            if(size == 2 && check_start && check_end) return true;
            if(size == 1 && check_code) return true;
            return false;
        });
    }

    const onFilterHistory = () =>{
        let valid = ['start','end','account'];
        let keys = Object.keys(router.query);
        let results = keys.filter(item => valid.includes(item));
        if(results.length > 0){
            let records = searchItems(results.length);
            setTimeout(()=>{
                setInfoHistory(records);
                setLoading(false)
            },1000)
            return;
        }
        setTimeout(()=>{
            setInfoHistory(infoPublication.history);
            setLoading(false)
        },1000)
    }

    const getAccount = (item) =>{
        if(!item.code_post) return null;
        const find_ = record => record.code == item.code_post;
        let result = list_connections_options.find(find_);
        if(!result) return null;
        return result.name;
    }

    const columns = [
        {
            title: 'Cuenta',
            render: (item) =>{
                return(
                    <span>{getAccount(item)}</span>
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
                return item.post_url ? (
                    <a
                        style={{color: '#1890ff'}}
                        onClick={()=> redirectTo(item.post_url, true)}
                    >
                        Ir a publicación
                    </a>
                ) : <></>;
            }
        }
    ]

    return (
        <Row gutter={[16,16]}>
            <Col span={24}>
                <SearchHistory
                    infoPublication={infoPublication}
                    newFilters={newFilters}
                />
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