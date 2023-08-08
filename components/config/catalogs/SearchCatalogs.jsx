import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import OptionsCatalogs from './OptionsCatalogs';

const SearchCatalogs = ({
    title = '',
    currentNode,
    actionAdd,
    showOptions = false,
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
                                {title ? title : `Catálogos de ${currentNode?.name}`}
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                {showBack && (
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => router.push('/config/catalogs/copy')}
                                    >
                                        Regresar
                                    </Button>
                                )}
                                {showOptions && <OptionsCatalogs />}
                                {actionAdd && (
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

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchCatalogs)