import React, { useState, useEffect } from 'react';
import { Table, Row, Col } from 'antd';
import { useRouter } from 'next/router';
import {
    SettingOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { catalogsJobbank } from '../../../utils/constant';
import SearchCatalogs from './SearchCatalogs';

const ListCatalogs = () => {

    const router = useRouter();
    const [listCatalogs, setLisCatalogs] = useState(catalogsJobbank);
    const [loading, setLoading] = useState(false);

    const redirect = (item) =>{
        let url = `/jobbank/settings/catalogs/${item.catalog}`;
        router.push(url);
    }

    const columns = [
        {
            title: 'Catálogo',
            dataIndex: 'name',
            key: 'name'
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
                    listComplete={catalogsJobbank}
                    setItemsFilter={setLisCatalogs}
                    setLoading={setLoading}
                    actionBtn={()=> router.replace('/jobbank/settings')}
                    textBtn='Regresar'
                    iconBtn={<ArrowLeftOutlined />}
                />
            </Col>
            <Col span={24}>
                <Table
                    size='small'
                    loading={loading}
                    columns={columns}
                    dataSource={listCatalogs}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false
                    }}
                />
            </Col>
        </Row>
    )
}

export default ListCatalogs