import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WebApiTimeclock from '../../../api/WebApiTimeclock';
import MapGoogle from '../centers/MapGoogle';
import { Row, Col, Form, Input, Spin, Card, Button } from 'antd';
import { getFullName } from '../../../utils/functions';
import moment from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';

const DetailsLogs = ({
    newFilters = {}
}) => {

    const router = useRouter();
    const [formDetail] = Form.useForm();
    const [infoEvent, setInfoEvent] = useState({});
    const [polygon, setPolygon] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (router.query?.id) getInfoLogEvent();
    }, [router.query?.id])

    useEffect(() => {
        if(Object.keys(infoEvent)?.length > 0){
            setValuesForm()
        }
    }, [infoEvent])

    const getInfoLogEvent = async () => {
        try {
            setLoading(true)
            let response = await WebApiTimeclock.getInfoLogEvent(router.query?.id);
            setInfoEvent(response.data)
            let center = response.data?.workcenter;
            setPolygon({
                name: center.name,
                paths: center.polygon,
                marker: response.data?.location
            })
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const setValuesForm = () =>{
        let values = {};
        values.node = infoEvent?.node
            ? infoEvent?.node?.name : null;
        values.workcenter =  infoEvent?.workcenter
            ? infoEvent?.workcenter?.name : null;
        values.person = infoEvent?.person
            ? getFullName(infoEvent?.person) : null;
        values.type = infoEvent.type;
        values.timestamp = infoEvent?.timestamp
            ? moment(infoEvent?.timestamp).format('DD-MM-YYYY hh:mm a') : null;
        formDetail.setFieldsValue(values)
    }

    const actionBack = () =>{
        router.push({
            pathname: '/timeclock/logs',
            query: newFilters
        })
    }

    return (
        <Row gutter={[0, 12]}>
            <Col span={24} className='header-card'>
                <div className='title-action-content'>
                    <p className='title-action-text'>
                        Detalle del log de evento
                    </p>
                    <div className='content-end' style={{ gap: 8 }}>
                        <Button
                            onClick={() => actionBack()}
                            icon={<ArrowLeftOutlined />}
                            disabled={loading}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </Col>
            <Col span={24} className='ant-spinning'>
                <Spin spinning={loading}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Card bodyStyle={{
                                padding: 18
                            }}>
                                <Form
                                    layout='vertical'
                                    form={formDetail}
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                label='Empresa'
                                                name='node'
                                            >
                                                <Input placeholder='Empresa' readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                label='Centro de trabajo'
                                                name='workcenter'
                                            >
                                                <Input placeholder='Centro de trabajo' readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                name='person'
                                                label='Colaborador'
                                            >
                                                <Input placeholder='Colaborador' readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                name='type'
                                                label='Tipo'
                                            >
                                                <Input placeholder='Tipo' readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                name='timestamp'
                                                label='Fecha'
                                            >
                                                <Input placeholder='Fecha' readOnly />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <MapGoogle
                                action='edit'
                                showControls={false}
                                polygonShape={polygon}
                            />
                        </Col>
                    </Row>
                </Spin>
            </Col>
        </Row>
    )
}

export default DetailsLogs