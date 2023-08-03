import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Button, Form, Input, Select, Skeleton, message, Spin } from 'antd';
import DetailsCustom from '../../jobbank/DetailsCustom';
import PermissionsFields from './PermissionsFields';
import { ruleRequired } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';

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

    useEffect(()=>{
        if(router.query?.id && action == 'edit'){
            getInfoAdminRol(router.query?.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoAdminRol).length <= 0) return;
        formRol.resetFields();
        formRol.setFieldsValue({
            name: infoAdminRol.name,
            is_active: infoAdminRol.is_active
        })
        const reduce_ = (acc, current) => ({...acc, [current.id]: true});
        let checks = infoAdminRol.module_perm?.length > 0
            ? infoAdminRol.module_perm.reduce(reduce_, {}): {};
        setCheckedPermissions(checks)
    },[infoAdminRol])

    const getInfoAdminRol = async (id) =>{
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

    const onFinishCreate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id};
            let response = await WebApiPeople.createAdminRole(body);
            actionSaveAnd(response.data.id);
            message.success('Rol registrado')
        } catch (e) {
            console.log(e)
            setFetching(false)
            setLoading({})
            message.error('Rol no registrado')
        }
    }

    const onFinisUpdate = async (values) =>{
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

    const onFinish = (values) =>{
        let checks = Object.entries({...checkedPermissions});
        let module_perm = checks.reduce((acc, current) =>{
            if(!current[1]) return acc;
            return [...acc, parseInt(current[0])];
        }, []);
        if(module_perm.length <=0){
            message.error('Permisos no seleccionados')
            setLoading({})
            return;
        }
        setFetching(true);
        let body = {...values, module_perm};
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const actionBack = () =>{
        router.push({
            pathname: '/security/roles',
            query: newFilters
        })
    }

    const actionCreate = () =>{
        formRol.resetFields();
        setCheckedPermissions({})
        setFetching(false)
        setLoading({})
    }

    const actionEdit = (id) =>{
        router.push({
            pathname: '/security/roles/edit',
            query: {...router.query, id}
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: actionEdit,
        }
        actionFunction[actionType](id);
    }

    return (
        <DetailsCustom
            action={action}
            idForm='form-roles'
            loading={loading}
            fetching={fetching}
            actionBack={actionBack}
            setLoading={setLoading}
            setActionType={setActionType}
            titleCard={action == 'add'
                ? 'Registrar nuevo rol'
                : 'Información del rol'
            }
        >
            <Spin spinning={fetching}>
                <Row>
                    <Col span={24}>
                        <Form
                            layout='vertical'
                            id='form-roles'
                            form={formRol}
                            onFinish={onFinish}
                            onFinishFailed={e=> setLoading({})}
                            initialValues={{
                                is_active: true
                            }}
                        >
                            <Form.Item
                                name='name'
                                label='Nombre del rol'
                                rules={[ruleRequired]}
                            >
                                <Input
                                    allowClear
                                    maxLength={150}
                                    className='input-with-clear'
                                    placeholder='Ej. Administrador, Ejecutivo, Reclutador, etc.'
                                />
                            </Form.Item>
                            <Form.Item
                                name='is_active'
                                label='¿Activo?'
                                style={{display: 'none'}}
                            >
                                <Select
                                    placeholder='Seleccionar una opción'
                                    options={[
                                        {value: true, key: true, label: 'Sí'},
                                        {value: false, key: false, label: 'No'}
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Skeleton active loading={load_modules_permissions}>
                            {list_modules_permissions?.length > 0 ? (
                                <div className='tabs-vacancies mode1'>
                                    <Tabs type='card'>
                                        {list_modules_permissions.map((item, idx) => (
                                            <Tabs.TabPane
                                                tab={item.khorplus_module?.name}
                                                forceRender
                                                key={idx+1}
                                            >
                                                <PermissionsFields
                                                    module={item}
                                                    checkedPermissions={checkedPermissions}
                                                    setCheckedPermissions={setCheckedPermissions}
                                                />
                                            </Tabs.TabPane>
                                        ))}
                                    </Tabs>
                                </div>
                            ):(
                                <div className='placeholder-list-items'>
                                    <p>Ningún módulo encontrado</p>
                                </div>
                            )}
                        </Skeleton>
                    </Col>
                </Row>
            </Spin>
        </DetailsCustom>
    )
}

export default DetailsRoles