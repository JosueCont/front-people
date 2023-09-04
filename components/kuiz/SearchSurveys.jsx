import React, { useMemo, useState } from 'react';
import { Button, Row, Col, Form, Tooltip, Card } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import TagFilters from '../jobbank/TagFilters';
import { useDefaultFilters } from './useDefaultFilters';

const SearchSurveys = ({
    title = '',
    urlBack = '/kuiz/assessments',
    params = {},
    actionAdd = () => { }
}) => {

    const router = useRouter();
    const filters = useDefaultFilters();

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                {title}
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.push(({
                                        pathname: urlBack,
                                        query: params
                                    }))}
                                >
                                    Regresar
                                </Button>
                                <Button onClick={() => actionAdd()}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            discardKeys={['assessment', 'section', 'question']}
                            defaultFilters={filters}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default SearchSurveys