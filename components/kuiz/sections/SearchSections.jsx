import React, { useMemo, useState } from 'react';
import { Button, Row, Col, Form, Tooltip, Card } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';

const SearchSections = ({
    currentNode,
    evaluation = {}
}) => {

    const router = useRouter();

    const defaultFilters = useMemo(() => {
        let name = evaluation?.name;
        return { 'Evaluación': name }
    }, [evaluation])

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Secciones
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Button icon={<ArrowLeftOutlined/>}>
                                    Regresar
                                </Button>
                                <Button onClick={() => router.push({
                                    pathname: '/kuiz/assessments/add',
                                    query: router.query
                                })}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            discardKeys={['assessment']}
                            defaultFilters={defaultFilters}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchSections)