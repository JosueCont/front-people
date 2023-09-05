import React, { useEffect, useMemo } from 'react';
import {
    Table,
    Row,
    Col,
    Card
} from 'antd';
import { useRouter } from 'next/router';
import { SettingOutlined } from '@ant-design/icons';
import { catalogsOrgStructure } from '../../../utils/constant';

const ListCatalogs = () => {

    const router = useRouter();

    const sort_ = (a, b) =>{
        if(a.name > b.name) return 1;
        if(a.name < b.name) return -1;
        return 0;
    }

    const goTo = ({ catalog }) => {
        let url = `/structure/catalogs/${catalog}`;
        router.push(url)
    }

    const columns = [
        {
            title: 'Nombre',
            render: (item) => (
                <a
                    style={{ color: '#1890ff' }}
                    onClick={() => goTo(item)}
                >
                    {item.name}
                </a>
            )
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <SettingOutlined onClick={() => goTo(item)} />
            )
        }
    ]

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                               Catálogos
                            </p>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Table
                rowKey='catalog'
                size='small'
                columns={columns}
                dataSource={catalogsOrgStructure.sort(sort_)}
                pagination={{
                    pageSize: catalogsOrgStructure?.length,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
        </>
    )
}

export default ListCatalogs