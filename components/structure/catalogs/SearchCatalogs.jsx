import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const SearchCatalogs = ({
    title = '',
    showAdd = true,
    actionAdd = () =>{},
    showBack = true
}) => {

    const router = useRouter();

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                {title ? title : 'Catálogos'}
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                {showBack && (
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => router.push('/structure/catalogs')}
                                    >
                                        Regresar
                                    </Button>
                                )}
                                {showAdd && (
                                    <Button onClick={() => actionAdd()}>
                                        Agregar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default SearchCatalogs;