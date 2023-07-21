import React, { useState, useEffect } from 'react';
import { Table, Row, Col } from 'antd';
import { useRouter } from 'next/router';
import { SettingOutlined } from '@ant-design/icons';
import { catalogsJobbank } from '../../../utils/constant';
import SearchCatalogs from './SearchCatalogs';
import { valueToFilter } from '../../../utils/functions';

const ListCatalogs = () => {

    const router = useRouter();
    const [listCatalogs, setLisCatalogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        let exist = Object.keys(router.query).length > 0;
        if(!exist) onReset();
        else onFilter();
    },[router.query])

    const onReset = (values = catalogsJobbank) =>{
        setTimeout(()=>{
            setLisCatalogs(values);
            setLoading(false)
        },500)
    }

    const onFilter = () =>{
        let name = Object.values(router.query)[0];
        const search = item => valueToFilter(item.name).includes(valueToFilter(name));
        let results = catalogsJobbank.filter(search);
        onReset(results)
    }

    const redirect = (item) =>{
        let url = `/jobbank/settings/catalogs/${item.catalog}`;
        router.push(url);
    }

    const columns = [
        {
            title: 'Catálogo',
            render: (item) =>{
                return (
                    <a
                        style={{color: '#1890ff'}}
                        onClick={()=> redirect(item)}
                    >
                        {item.name}
                    </a>
                )
            }
        },
        {
            title: 'Acciones',
            render: (item) =>{
                return(
                    <SettingOutlined onClick={()=> redirect(item)}/>
                )
            }
        }
    ]

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    keyName='name'
                    showBtnAdd={false}
                    backURl='/jobbank/settings'
                />
            </Col>
            <Col span={24}>
                <Table
                    rowKey='catalog'
                    size='small'
                    loading={loading}
                    columns={columns}
                    dataSource={listCatalogs}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false
                    }}
                    locale={{ emptyText: loading
                        ? 'Cargando...'
                        : 'No se encontraron resultados'
                    }}
                />
            </Col>
        </Row>
    )
}

export default ListCatalogs