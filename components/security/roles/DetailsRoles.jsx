import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Button, Form, Input, Select, Skeleton, message, Spin, Card, Space } from 'antd';
import DetailsCustom from '../../jobbank/DetailsCustom';
import PermissionsFields from './PermissionsFields';
import { ruleRequired } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';
import { ArrowLeftOutlined } from '@ant-design/icons';

const DetailsRoles = ({
    action,
    newFilters = {}
}) => {

    const router = useRouter();
    const [formRol] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [checkedPermissions, setCheckedPermissions] = useState({});
    const [infoAdminRol, setInfoAdminRol] = useState({});

    const {
        list_modules_permissions,
        load_modules_permissions
    } = useSelector(state => state.catalogStore);
    const currentNode = useSelector(state => state.userStore.current_node);

    useEffect(() => {
        if (currentNode && action == 'add') {
            formRol.setFieldsValue({
                node: currentNode?.id
            })
        }
    }, [currentNode])

    useEffect(() => {
        if (router.query?.id && action == 'edit') {
            getInfoAdminRol(router.query?.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoAdminRol).length <= 0) return;
        formRol.resetFields();
        formRol.setFieldsValue({
            name: infoAdminRol.name,
            node: infoAdminRol?.node,
            is_active: infoAdminRol.is_active
        })
        const reduce_ = (acc, current) => ({ ...acc, [current.id]: true });
        let checks = infoAdminRol.module_perm?.length > 0
            ? infoAdminRol.module_perm.reduce(reduce_, {}) : {};
        setCheckedPermissions(checks)
    }, [infoAdminRol])

    const getInfoAdminRol = async (id) => {
        try {
            setFetching(true)
            let response = await WebApiPeople.getInfoAdminRole(id);
            setInfoAdminRol(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) => {
        try {
            let body = { ...values, is_active: true, node: currentNode.id };
            await WebApiPeople.createAdminRole(body);
            // actionSaveAnd(response.data.id);
            actionBack()
            message.success('Rol registrado')
        } catch (e) {
            console.log(e)
            setFetching(false)
            setLoading({})
            message.error('Rol no registrado')
        }
    }

    const onFinisUpdate = async (values) => {
        try {
            // let body = {...values, node: currentNode.id};
            await WebApiPeople.updateAdminRole(router.query?.id, values);
            message.success('Rol actualizado')
            getInfoAdminRol(router.query?.id)
        } catch (e) {
            console.log(e)
            setFetching(false)
            message.error('Rol no actualizado')
        }
    }

    const onFinish = (values) => {
        let checks = Object.entries({ ...checkedPermissions });
        let module_perm = checks.reduce((acc, current) => {
            if (!current[1]) return acc;
            return [...acc, parseInt(current[0])];
        }, []);
        if (module_perm.length <= 0) {
            message.error('Permisos no seleccionados')
            setLoading({})
            return;
        }
        setFetching(true);
        let body = { ...values, module_perm };
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const actionBack = () => {
        router.push({
            pathname: '/security/roles',
            query: newFilters
        })
    }

    // const actionCreate = () => {
    //     formRol.resetFields();
    //     setCheckedPermissions({})
    //     setFetching(false)
    //     setLoading({})
    // }

    // const actionEdit = (id) => {
    //     router.push({
    //         pathname: '/security/roles/edit',
    //         query: { ...router.query, id }
    //     })
    // }

    // const actionSaveAnd = (id) => {
    //     const actionFunction = {
    //         back: actionBack,
    //         create: actionCreate,
    //         edit: actionEdit,
    //     }
    //     actionFunction[actionType](id);
    // }

    const ExtraAction = (
        <Select
            className='select-jb'
            placeholder='Seleccionar un módulo'
            style={{ width: 200 }}
        />
    )

    return (
        <Row gutter={[0, 12]}>
            <Col span={24} className='header-card'>
                <div className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nuevo rol'
                            : 'Información del rol'
                        }
                    </p>
                    <div className='content-end' style={{ gap: 8 }}>
                        <Button
                            onClick={() => actionBack()}
                            icon={<ArrowLeftOutlined />}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </Col>
            <Col span={24} className='ant-spinning'>
                <Spin spinning={fetching}>
                    <Row gutter={[0, 18]}>
                        <Col span={24}>
                            <Card bodyStyle={{ padding: 18 }}>
                                <Form
                                    layout='vertical'
                                    id='form-roles'
                                    form={formRol}
                                    onFinish={onFinish}
                                    onFinishFailed={e => setLoading({})}
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} lg={12}>
                                            <Form.Item
                                                name='name'
                                                label='Nombre'
                                                rules={[ruleRequired]}
                                            >
                                                <Input
                                                    allowClear
                                                    maxLength={150}
                                                    className='input-with-clear'
                                                    placeholder='Ej. Administrador, Ejecutivo, Reclutador, etc.'
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col xs={24} lg={12}>
                                            <Form.Item
                                                label='Tipo'
                                                name='node'
                                            >
                                                <Select
                                                    placeholder='Seleccionar una opción'
                                                    options={[
                                                        { value: '', key: '2', label: 'Global' },
                                                        { value: currentNode?.id, key: '2', label: 'Empresa' }
                                                    ]}
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
                            <Tabs type='card' className='tabs-perms' tabBarExtraContent={ExtraAction}>
                                <Tabs.TabPane key='1' tab='Catálogos'>
                                    <Skeleton active />
                                </Tabs.TabPane>
                                <Tabs.TabPane key='2' tab='Acciones'>
                                    <Skeleton active />
                                </Tabs.TabPane>
                            </Tabs>
                        </Col>
                        <Col span={24}>
                            {/* <Tabs type='card'>
                                <Tabs.TabPane key='1' tab='Catálogos'>
                                    <Skeleton active />
                                </Tabs.TabPane>
                                <Tabs.TabPane key='2' tab='Acciones'>
                                    <Skeleton active />
                                </Tabs.TabPane>
                            </Tabs> */}
                            {/* <Skeleton active loading={load_modules_permissions}>
                                {list_modules_permissions?.length > 0 ? (
                                    <Tabs type='card' content=''>
                                        {list_modules_permissions.map((item, idx) => (
                                            <Tabs.TabPane
                                                tab={item.khorplus_module?.name}
                                                forceRender
                                                key={idx + 1}
                                            >
                                                <PermissionsFields
                                                    module={item}
                                                    checkedPermissions={checkedPermissions}
                                                    setCheckedPermissions={setCheckedPermissions}
                                                />
                                            </Tabs.TabPane>
                                        ))}
                                    </Tabs>
                                ) : (
                                    <div className='placeholder-list-items'>
                                        <p>Ningún módulo encontrado</p>
                                    </div>
                                )}
                            </Skeleton> */}
                        </Col>
                    </Row>
                </Spin>
            </Col>
        </Row>
    )
}

export default DetailsRoles