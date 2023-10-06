import React, {
    useState,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import {
    Tabs,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    Skeleton,
    message,
    Spin,
    Card,
    Space,
    Typography,
    Tooltip
} from 'antd';
// import PermissionsFields from './PermissionsFields';
import { ruleRequired } from '../../../utils/rules';
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';
import {
    ArrowLeftOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import CardType from './CardType';
import { connect } from 'react-redux';
import { getModulesPermissions } from '../../../redux/catalogCompany';
import ModalPerms from './ModalPerms';
import { valueToFilter } from '../../../utils/functions';
import { debounce } from 'lodash';

const DetailsRoles = ({
    action,
    newFilters = {},
    currentNode,
    getModulesPermissions,
    list_modules_permissions,
    load_modules_permissions
}) => {

    const noValid = [undefined, null, "", " "];
    const router = useRouter();
    const [formRol] = Form.useForm();
    const [fetching, setFetching] = useState(false);
    // const [checkedPermissions, setCheckedPermissions] = useState({});

    const [infoAdminRol, setInfoAdminRol] = useState({});
    const [checkedPerms, setCheckedPerms] = useState([]);

    const [loadModules, setLoadModules] = useState(false);
    const [listModules, setListModules] = useState([]);

    const [listPermissions, setListPermissions] = useState([]);
    const [valueSearch, setValueSearch] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    // useEffect(() => {
    //     console.log('checkedPerms', checkedPerms)
    // }, [checkedPerms])

    useEffect(() => {
        getModules();
    }, [])

    useEffect(() => {
        setListPermissions(list_modules_permissions)
    }, [list_modules_permissions])

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
        formRol.setFieldsValue({
            name: infoAdminRol.name,
            node: infoAdminRol?.node
        })
        // const reduce_ = (acc, current) => ({ ...acc, [`${current.id}`]: true });
        let checks = infoAdminRol.module_perm?.length > 0
            ? infoAdminRol.module_perm : [];
        setCheckedPerms(checks)
        // setCheckedPermissions(checks)
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
            let body = { ...values, is_active: true };
            await WebApiPeople.createAdminRole(body);
            // actionSaveAnd(response.data.id);
            message.success('Rol registrado')
            actionBack()
        } catch (e) {
            console.log(e)
            setFetching(false)
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

    // const module_perm = useMemo(() => {
    //     let checks = Object.entries(checkedPermissions);
    //     return checks.reduce((acc, current) => {
    //         if (!current[1]) return acc;
    //         return [...acc, parseInt(current[0])];
    //     }, []);
    // }, [checkedPermissions])

    const onFinish = (values) => {
        if (checkedPerms?.length <= 0) {
            message.error('Permisos no seleccionados')
            return;
        }
        setFetching(true);
        let module_perm = checkedPerms?.map(e => e?.id);
        let body = { ...values, module_perm };
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const getModules = async () => {
        try {
            setLoadModules(true)
            let response = await WebApiPeople.getModuldes();
            setListModules(response?.data?.results)
            setLoadModules(false)
        } catch (e) {
            console.log(e)
            setLoadModules(false)
            setListModules([])
        }
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

    const onChangeModule = (value) => {
        let query = '';
        if (!noValid.includes(value)) query = `?module_id=${value}`;
        // setCheckedPermissions({})
        setCheckedPerms([])
        setValueSearch(null)
        getModulesPermissions(query)
    }

    const getListType = (type = 1) => {
        const find_ = item => item?.perm_type == type;
        let result = listPermissions?.find(find_);
        if (!result) return [];
        return result?.modules;
    }

    const catalogs = useMemo(() => {
        return getListType(1);
    }, [listPermissions])

    const actions = useMemo(() => {
        return getListType(2);
    }, [listPermissions])

    const Void = (
        <div style={{ background: '#ffff', padding: 12 }}>
            <Skeleton active loading />
        </div>
    )

    const ExtraAction = (
        <button
            className='ant-btn-simple'
            onClick={() => setOpenModal(true)}
        >
            Seleccionados: {checkedPerms?.length || 0}
        </button>
    )

    const onSearch = ({ target: { value } }) => {
        if (![undefined, null, "", " "].includes(value)) {
            const filter_ = item => valueToFilter(item?.perm_name).includes(valueToFilter(value));
            let results = list_modules_permissions?.reduce((list, item) => {
                let modules = item?.modules?.reduce((module, record) => {
                    let groups = record?.groups?.reduce((group, row) => {
                        let perms = row?.perms?.filter(filter_);
                        if (perms?.length <= 0) return group;
                        return [...group, { ...row, perms }]
                    }, [])
                    if (groups?.length <= 0) return module;
                    return [...module, { ...record, groups }]
                }, [])
                if (modules?.length <= 0) return list;
                return [...list, { ...item, modules }];
            }, [])
            setListPermissions(results)
            return;
        }
        setListPermissions(list_modules_permissions)
    }

    const debounceSearch = useCallback(debounce(onSearch, 500), [list_modules_permissions]);

    const onChangeSearch = (e) => {
        setValueSearch(e?.target?.value)
        debounceSearch(e)
    }

    return (
        <>
            <Row gutter={[0, 16]}>
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
                <Col span={24} className='ant-table-colla'>
                    <Spin spinning={fetching}>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Card bodyStyle={{ padding: 12 }}>
                                    <Form
                                        layout='vertical'
                                        id='form-roles'
                                        form={formRol}
                                        onFinish={onFinish}
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
                                                            { value: '', key: '1', label: 'Global' },
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
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Typography.Title level={3} style={{ marginBottom: 0 }}>
                                        Listado de permisos
                                    </Typography.Title>
                                    <Space>
                                        <Tooltip title={`Los permisos previamente seleccionados serán eliminados
                                        después de filtrar por módulo.
                                    `}>
                                            <InfoCircleOutlined style={{
                                                fontSize: 18, display: 'flex',
                                                color: 'rgba(0,0,0,0.2)'
                                            }} />
                                        </Tooltip>
                                        <Input
                                            allowClear
                                            className='input-jb-clear'
                                            placeholder='Buscar'
                                            value={valueSearch}
                                            onChange={onChangeSearch}
                                        />
                                        <Select
                                            showSearch
                                            allowClear
                                            loading={loadModules}
                                            disabled={loadModules}
                                            className='select-jb'
                                            onChange={onChangeModule}
                                            placeholder='Seleccionar un módulo'
                                            optionFilterProp='children'
                                            style={{ width: 200 }}
                                        >
                                            {listModules.length > 0 && listModules.map(item => (
                                                <Select.Option value={item?.id} key={item?.id}>
                                                    {item?.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Space>
                                </Space>
                            </Col>
                            <Col span={24}>
                                <Tabs type='card' className='ant-tabs-perms' tabBarExtraContent={ExtraAction}>
                                    <Tabs.TabPane key='1' tab='Catálogos'>
                                        {!load_modules_permissions ? (
                                            <CardType
                                                typeList={catalogs}
                                                // checkedPermissions={checkedPermissions}
                                                // setCheckedPermissions={setCheckedPermissions}
                                                setCheckedPerms={setCheckedPerms}
                                                checkedPerms={checkedPerms}
                                            />
                                        ) : Void}
                                    </Tabs.TabPane>
                                    <Tabs.TabPane key='2' tab='Acciones'>
                                        {!load_modules_permissions ? (
                                            <CardType
                                                typeList={actions}
                                                // checkedPermissions={checkedPermissions}
                                                // setCheckedPermissions={setCheckedPermissions}
                                                setCheckedPerms={setCheckedPerms}
                                                checkedPerms={checkedPerms}
                                            />
                                        ) : Void}
                                    </Tabs.TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </Spin>
                </Col>
            </Row>
            <ModalPerms
                visible={openModal}
                close={() => setOpenModal(false)}
                checkedPerms={checkedPerms}
                setCheckedPerms={setCheckedPerms}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        list_modules_permissions: state.catalogStore.list_modules_permissions,
        load_modules_permissions: state.catalogStore.load_modules_permissions,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getModulesPermissions }
)(DetailsRoles);