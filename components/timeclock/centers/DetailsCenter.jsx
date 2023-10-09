import React, { useCallback, useEffect, useState } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Checkbox,
    Card,
    Button,
    message,
    Spin,
    Select
} from 'antd';
import { useRouter } from 'next/router';
import MapGoogle from './MapGoogle';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import WebApiTimeclock from '../../../api/WebApiTimeclock';
import { connect } from 'react-redux';

const DetailsCenter = ({
    currentNode,
    currentUser,
    action,
    newFilters = {},
    list_companies,
    load_companies
}) => {

    const router = useRouter();
    const [formCenter] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [polygon, setPolygon] = useState([]);
    const [shape, setShape] = useState({});
    const [infoWOrk, setInfoWork] = useState({});

    useEffect(() => {
        if (router.query?.id && action == 'edit') {
            getInfoWorkCenter();
        }
    }, [router.query?.id])

    useEffect(() => {
        let value = router.query?.node;
        if(currentNode && action == 'add'){
            let node = value ? value == 'all'
                ? currentNode?.id : parseInt(value) : currentNode?.id;
            formCenter.setFieldsValue({node})
        }        
    }, [currentNode, router.query?.node])

    useEffect(() => {
        if (Object.keys(infoWOrk)?.length <= 0) return;
        setValuesForm();
    }, [infoWOrk])

    const getInfoWorkCenter = async () => {
        try {
            setLoading(true)
            let response = await WebApiTimeclock.getInfoWorkCenter(router.query?.id);
            setInfoWork(response.data)
            let name = response.data?.name;
            let paths = response.data?.polygon?.slice(0, -1);
            setShape({ name, paths })
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinishCreate = async (values) => {
        try {
            await WebApiTimeclock.createWorkCenter(values);
            message.success('Centro registrado')
            actionBack();
        } catch (e) {
            console.log(e)
            message.error('Centro no registrado')
            setLoading(false)
        }
    }

    const onFinishUpdate = async (values) => {
        try {
            await WebApiTimeclock.updateWorkCenter(router.query?.id, values);
            message.success('Centro actualizado')
            getInfoWorkCenter();
        } catch (e) {
            console.log(e)
            message.error('Centro no actualizado')
            setLoading(false)
        }
    }

    const setValuesForm = () => {
        formCenter.resetFields();
        let values = {};
        values.node = infoWOrk.node ? infoWOrk.node?.id : null;
        values.address = infoWOrk.address ? infoWOrk.address : null;
        values.name = infoWOrk.name ? infoWOrk.name : null;
        values.is_active = infoWOrk.is_active;
        formCenter.setFieldsValue(values)
    }

    const createData = (values) => {
        let first = Object.values(polygon.at(0)).join('');
        let last = Object.values(polygon.at(-1)).join('');
        let coords = first == last ? polygon : polygon.concat(polygon[0]);
        const map_ = item => (`(${Object.values(item).join(',')})`);
        let shape = coords.map(map_).join(',');
        return { ...values, polygon: shape }
    }

    const onFinish = (values) => {
        if (polygon?.length <= 0) {
            message.error('Selecciona el centro de trabajo')
            return;
        }
        setLoading(true)
        let body = createData(values);
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const actionBack = () => {
        router.push({
            pathname: '/timeclock/centers',
            query: newFilters
        })
    }

    return (
        <Row gutter={[0, 12]}>
            <Col span={24} className='header-card'>
                <div className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar centro de trabajo'
                            : 'Información del centro de trabajo'}
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
            <Col span={24} className='ant-table-colla'>
                <Spin spinning={loading}>
                    <Row gutter={[0, 12]}>
                        <Col span={24}>
                            <Card bodyStyle={{
                                padding: 18
                            }}>
                                <Form
                                    layout='vertical'
                                    onFinish={onFinish}
                                    form={formCenter}
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                label='Empresa'
                                                name='node'
                                                rules={[ruleRequired]}
                                            >
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    disabled={load_companies}
                                                    loading={load_companies}
                                                    placeholder='Seleccionar una opción'
                                                    notFoundContent='No se encontraron resultados'
                                                    optionFilterProp='children'
                                                >
                                                    {list_companies?.length > 0
                                                        && list_companies?.map(item => (
                                                            <Select.Option value={item.id} key={item.id}>
                                                                {item.name}
                                                            </Select.Option>
                                                        ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                name='name'
                                                label='Nombre'
                                                rules={[ruleRequired, ruleWhiteSpace]}
                                            >
                                                <Input
                                                    maxLength={150}
                                                    placeholder='Nombre'
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} xl={8}>
                                            <Form.Item
                                                name='address'
                                                label='Dirección'
                                                rules={[ruleWhiteSpace]}
                                            >
                                                <Input
                                                    maxLength={250}
                                                    placeholder='Nombre'
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} className='content-end'>
                                            <Button htmlType='submit'>
                                               {action == 'add' ? 'Guardar' : 'Actualizar'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <MapGoogle
                                action={action}
                                setPolygon={setPolygon}
                                polygonShape={shape}
                            />
                        </Col>
                    </Row>
                </Spin>
            </Col>
        </Row>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        currentUser: state.userStore.user,
        list_companies: state.timeclockStore.list_companies,
        load_companies: state.timeclockStore.load_companies,
    }
}

export default connect(mapState)(DetailsCenter);