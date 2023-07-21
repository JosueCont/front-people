import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { getFullName, getWork } from '../../../utils/functions';
import { useSelector } from 'react-redux';
import { Form, Row, Col, Select, Button, Table, message, Tooltip, Typography, Space, Switch, Checkbox } from 'antd';
import { ruleRequired } from '../../../utils/rules';
import WebApiAssessment from '../../../api/WebApiAssessment';
import dynamic from 'next/dynamic';
import {
    UserOutlined,
    ProfileOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import ViewList from './ViewList';
import ModalPP from './ModalPP';
import SelectPeople from '../../people/utils/SelectPeople';

const OptionsExport = dynamic(() => import('./ReportPDF/OptionsExport'), { ssr: false });
const ReportPDF = dynamic(() => import('./ReportPDF/ReportPDF'), { ssr: false });
const ViewChart = dynamic(() => import('./ViewChart'), { ssr: false });

const FormReport = ({
    typeReport,
    infoReport,
    setInfoReport,
    loading,
    setLoading,
    columnsMany,
    setColumnsMany,
    columns_many,
    // Props para validaciones
    showChart = false,
    showSelectProfile = true,
    showTitleProfile = false,
    showTitleWork = true,
    multiUser = false,
    multiProfile = false,
    // props grupo de personas
    loadGroups,
    groupsPersons,
    useGroups = false
}) => {

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    const {
        profiles,
        load_profiles
    } = useSelector(state => state.assessmentStore);
    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);

    const [formReport] = Form.useForm();

    const [isUsers, setIsUsers] = useState(false);
    const [openModalList, setOpenModalList] = useState(false);

    const [openModalInfo, setOpenModalInfo] = useState(false);
    const [itemInfo, setItemInfo] = useState({});

    const [openModalChart, setOpenModalChart] = useState(false);
    const [dataChart, setDataChart] = useState([]);
    const [typeChart, setTypeChart] = useState('p');

    const [values, setValues] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    const user = Form.useWatch('user_id', formReport);
    const profile = Form.useWatch('profile_id', formReport);

    /* For Groups */
    const [showGroups, setShowGroups] = useState(false)

    useEffect(() => {
        formReport.resetFields()
        setValues({})
        setShowGroups(false)
    }, [typeReport])

    const getUser = (user_id, list) => {
        if (!user_id) return multiUser ? [] : {};
        const find_ = item => item.id == user_id;
        const filter_ = item => user_id.includes(item.id);
        let result = multiUser
            ? list.filter(filter_)
            : list.find(find_);
        if (!result) return multiUser ? [] : {};
        return result;
    }

    const getProfile = (profile_id) => {
        if (!profile_id) return multiProfile ? [] : {};
        const find_ = item => item.id == profile_id;
        const filter_ = item => profile_id.includes(item.id);
        let result = multiProfile
            ? profiles.filter(filter_)
            : profiles.find(find_);
        if (!result) return multiProfile ? [] : {};
        return result;
    }

    const onChangeUser = (value, list) => {
        let records = getUser(value, list);
        setCurrentUser(records)
    }

    //Se actualiza según el valor del formulario
    const currentProfile = useMemo(() => {
        return getProfile(profile);
    }, [profile])

    const getReportCompetences = async (values) => {
        setLoading(true)
        try {
            let body = {
                node_id: current_node?.id,
                user_id: values.user_id,
                calculation_type: general_config?.calculation_type
            }
            let response = await WebApiAssessment.getReportCompetences(body);
            setInfoReport(response.data);
            setLoading(false)
            message.success('Información obtenida')
        } catch (e) {
            setLoading(false)
            setInfoReport([])
            setValues({})
            let error = e.response?.data?.message;
            let msg = error ? error : 'Informacióon no obtenida';
            message.error(msg)
            console.log(e)
        }
    }

    const createData = (values) => {
        const filter_ = item => values.user_id?.includes(item.id);
        const map_ = item => ({ id: item.id, fullName: getFullName(item) });
        const find_ = item => item.id == values.user_id;
        const _filter = item => values?.group_id?.includes(item.id);

        let profiles = Array.isArray(values.profile_id)
            ? values.profile_id : [values.profile_id]
        let users = values?.user_id
            ? Array.isArray(values.user_id)
                ? currentUser.map(map_)
                : [currentUser].map(map_)
            : [];
        let groups = values?.group_id
            ? groupsPersons.filter(_filter) : [];

        return {
            profiles, users, groups,
            calculation_type: general_config?.calculation_type,
            node_id: current_node?.id
        }
    }

    const getReportProfiles = async (values) => {
        try {
            setLoading(true)
            let body = createData(values);
            let response = await WebApiAssessment.getReportProfiles(body);
            setInfoReport(response.data);
            setLoading(false)
            message.success('Información obtenida')
        } catch (e) {
            setLoading(false)
            setInfoReport([])
            setValues({})
            message.error('Información no obtenida')
            console.log(e)
        }
    }

    const subTitle = (item, subs = 3) => item?.competence?.name.substring(0, subs).toUpperCase();
    const generateColumns = () => {
        let info_columns = currentProfile?.competences;
        let list_columns = [...columns_many];
        info_columns.map((item, idx) => {
            let title = subTitle(item);
            let exist = list_columns.some(record => record.comp == title)
            if (exist) title = subTitle(item, title.length + 1)
            list_columns.push({
                title: () => (
                    <Tooltip title={item.competence?.name}>
                        <span>{title} ({item.level})</span>
                    </Tooltip>
                ),
                comp: title,
                name: `${item.competence.name} (${item.level})`,
                nested: [item.competence.id, 'level_person'],
                width: 35,
                align: 'center',
                show: true,
                render: (record) => {
                    return (
                        <>{getLevelPerson(record, item?.competence?.id)}</>
                    )
                }
            })
        })
        list_columns.push({
            title: 'Compatibilidad',
            width: 50,
            align: 'center',
            show: true,
            nested: ['profiles', 'compatibility'],
            render: (record) => {
                let compatibility = record?.profiles?.at(-1)?.compatibility;
                if (compatibility == 'N/A') return compatibility;
                return (
                    <a style={{ color: '#1890ff' }}
                        onClick={() => showInfo(record)}
                    >{typeof compatibility == "string"
                        ? compatibility : `${compatibility?.toFixed(2)}%`}
                    </a>
                )
            }
        })
        list_columns.push({
            title: 'Ver gráfica',
            width: 50,
            align: 'center',
            show: true,
            render: (record) => {
                let compatibility = record?.profiles?.at(-1)?.compatibility;
                if (compatibility == 'N/A') return <></>;
                return <EyeOutlined onClick={() => showChartIndividual(record)} />;
            }
        })
        let newList = list_columns.filter(item => item.show);
        setColumnsMany(newList)
    }

    const onFinish = (values) => {
        const list = {
            'p': getReportCompetences,
            'pp': getReportProfiles,
            'psp': getReportProfiles,
            'pps': getReportProfiles,
            'psc': (e) => {
                generateColumns()
                getReportProfiles(e)
            }
        }
        list[typeReport](values)
        setValues({
            selectedUser: currentUser,
            selectedProfile: currentProfile
        })
    }

    const onReset = () => {
        formReport.resetFields()
        setLoading(false)
        setInfoReport([])
        setValues({})
        setShowGroups(false)
        setCurrentUser(null)
    }

    const getCompatibility = (item) => {
        return item
            ? item.profiles
                ? typeof item.profiles.at(-1).compatibility == "string"
                    ? item.profiles.at(-1).compatibility
                    : `${item.profiles.at(-1).compatibility.toFixed(2)}%`
                : 'Pendiente'
            : 'Pendiente';
    }

    const getWorkById = (id) => {
        let user = persons_company.find(item => item.id == id);
        return getWork(user);
    }

    const getLevelPerson = (record, id) => {
        if (!id) return 'N/A';
        const find_ = item => item.id == id
        let profiles = record?.profiles?.at(-1).competences
        if (!profiles) return 'N/A';
        let result = profiles.find(find_)
        if (!result) return 'N/A';
        return result.level_person
    }

    const showModalList = (isUsers = false) => {
        setIsUsers(isUsers)
        setOpenModalList(true)
    }

    const closeModalList = () => {
        setIsUsers(false)
        setOpenModalList(false)
    }

    const getDataP = () => {
        const some_ = item => item.level == 'N/A';
        let result = infoReport.some(some_);
        if (result) return [];
        return [{
            fullName: getFullName(values?.selectedUser),
            data: infoReport
        }]
    }

    const getDataChart = () => {
        const list = {
            'p': getDataP
        }
        return list[typeReport]()
    }

    const showChartGeneral = () => {
        let data = getDataChart();
        if (data?.length <= 0) {
            message.error('Información insuficiente');
            return;
        }
        setDataChart(data)
        setTypeChart(typeReport)
        setOpenModalChart(true)
    }

    const showChartIndividual = (item) => {
        if (typeReport == 'pps') {
            let fullName = infoReport?.at(-1)?.persons?.fullName;
            let data = { persons: { fullName }, profiles: [item] };
            setDataChart([data]);
        } else setDataChart([item]);
        setTypeChart('pp')
        setOpenModalChart(true)
    }

    const showInfo = (item) => {
        if (typeReport == 'pps') {
            let fullName = infoReport?.at(-1)?.persons?.fullName;
            let data = { persons: { fullName }, profiles: [item] };
            setItemInfo(data);
        } else setItemInfo(item);
        setOpenModalInfo(true)
    }

    const closeInfo = () => {
        setItemInfo({})
        setOpenModalInfo(false)
    }

    const columns_p = [
        {
            title: 'Competencia',
            dataIndex: ['competence', 'name'],
            key: ['competence', 'name']
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            align: 'center',
            render: (item) => item == 0 ? 'N/A' : item
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            render: (item) => item || 'N/A'
        },
    ]

    const columns_pp = [
        {
            title: 'Competencia',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Nivel persona',
            dataIndex: 'level_person',
            key: 'level_person',
            align: 'center'
        },
        {
            title: 'Descripción',
            dataIndex: 'description_person',
            render: (item) => item || 'N/A'
        },
        {
            title: 'Nivel perfil',
            dataIndex: 'level_profile',
            key: 'level_profile',
            align: 'center',
        },
        {
            title: 'Descripción',
            dataIndex: 'description_profile',
            render: (item) => item || 'N/A'
        },
        {
            title: 'Compatibilidad',
            dataIndex: 'compatibility',
            align: 'center',
            render: (item) => typeof (item) == "string"
                ? item : `${item?.toFixed(2)}%`
        }
    ]

    const columns_psp = [
        {
            title: 'Persona',
            dataIndex: ['persons', 'fullName'],
            key: ['persons', 'fullName']
        },
        {
            title: 'Compatibilidad',
            nested: ['profiles', 'compatibility'],
            render: (item) => {
                let compatibility = item?.profiles?.at(-1)?.compatibility;
                if (compatibility == 'N/A') return compatibility;
                return (
                    <a style={{ color: '#1890ff' }}
                        onClick={() => showInfo(item)}
                    >{typeof compatibility == "string"
                        ? compatibility : `${compatibility?.toFixed(2)}%`}
                    </a>
                )
            }
        },
        {
            title: 'Ver gráfica',
            render: (item) => {
                let compatibility = item?.profiles?.at(-1)?.compatibility;
                if (compatibility == 'N/A') return <></>;
                return <EyeOutlined onClick={() => showChartIndividual(item)} />;
            }
        }
    ]

    const columns_pps = [
        {
            title: 'Perfil',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Compatibilidad',
            nested: 'compatibility',
            render: (item) => {
                if (item?.compatibility == 'N/A') return item?.compatibility;
                return (
                    <a style={{ color: '#1890ff' }}
                        onClick={() => showInfo(item)}
                    >
                        {typeof item?.compatibility == "string"
                            ? item?.compatibility
                            : `${item?.compatibility?.toFixed(2)}%`
                        }
                    </a>
                )
            }
        },
        {
            title: 'Ver gráfica',
            render: (item) => {
                if (item?.compatibility == 'N/A') return <></>;
                return <EyeOutlined onClick={() => showChartIndividual(item)} />;
            }
        }
    ]

    const list_columns = {
        'p': columns_p,
        'pp': columns_pp,
        'psp': columns_psp,
        'pps': columns_pps,
        'psc': columnsMany
    }

    const data_report = {
        'pp': [...infoReport]?.at(-1)?.profiles?.at(-1)?.competences,
        'pps': [...infoReport]?.at(-1)?.profiles
    }

    const getRowKey = (record) => {
        if (typeReport == 'p') return record?.competence?.id;
        if (['psc', 'psp'].includes(typeReport)) return record?.persons?.id;
        // pp pps
        return record?.id;
    }

    const onDelete = (e) => {
        let ids = e.map(item => item.id);
        let data = isUsers ? { user_id: ids } : { profile_id: ids };
        formReport.setFieldsValue(data);
        if (isUsers) setCurrentUser(e);
    }

    return (
        <>
            <Row style={{ padding: 16 }}>
                <Col span={24}>
                    <Row justify='space-between'>
                        <Col span={showSelectProfile ? 16 : 10}>
                            <Form
                                form={formReport}
                                onFinish={onFinish}
                                layout='vertical'
                            >
                                <Row style={{ width: '100%' }}>
                                    <Col span={24} style={{ display: 'flex', gap: 16 }}>
                                        <Form.Item style={{ flex: '1' }}>
                                            <div className='custom-label-form'>
                                                <label className='custom-required'>
                                                    {showGroups ? 'Grupos' : multiUser ? 'Usuarios' : 'Usuario'}
                                                </label>
                                                {useGroups && (
                                                    <div className='label-options'>
                                                        <label>{showGroups ? 'Usuarios' : 'Grupos'}</label>
                                                        <Switch
                                                            size='small'
                                                            checked={showGroups}
                                                            onChange={e => setShowGroups(!showGroups)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {!showGroups ? (
                                                <SelectPeople
                                                    name='user_id'
                                                    noStyle={true}
                                                    rules={[ruleRequired]}
                                                    mode={multiUser ? 'multiple' : false}
                                                    onChangeSelect={onChangeUser}
                                                    preserveHistory={multiUser}
                                                />
                                            ) : (
                                                <Form.Item
                                                    name='group_id'
                                                    rules={[ruleRequired]}
                                                    noStyle
                                                >
                                                    <Select
                                                        showSearch
                                                        mode='multiple'
                                                        maxTagCount='responsive'
                                                        placeholder='Seleccionar una opción'
                                                        notFoundContent='No se encontraron resultados'
                                                        loading={loadGroups}
                                                        disabled={loadGroups}
                                                        optionFilterProp='children'
                                                    >
                                                        {groupsPersons.length > 0 && groupsPersons.map(item => (
                                                            <Select.Option value={item.id} key={item.id}>
                                                                {item.name}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        {showSelectProfile && (
                                            <Form.Item
                                                label={multiProfile ? 'Perfiles' : 'Perfil'}
                                                name='profile_id'
                                                style={{ flex: '1' }}
                                                rules={[ruleRequired]}
                                            >
                                                <Select
                                                    showSearch
                                                    mode={multiProfile ? 'multiple' : false}
                                                    maxTagCount='responsive'
                                                    disabled={load_profiles}
                                                    loading={load_profiles}
                                                    placeholder='Seleccionar una opción'
                                                    notFoundContent='No se encontraron resultados'
                                                    optionFilterProp='children'
                                                >
                                                    {profiles.length > 0 && profiles.map(item => (
                                                        <Select.Option value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        )}
                                        <Form.Item style={{ marginTop: 'auto' }}>
                                            <Button
                                                loading={loading}
                                                htmlType='submit'
                                            >
                                                Generar
                                            </Button>
                                        </Form.Item>
                                        <Form.Item style={{ marginTop: 'auto' }}>
                                            <Button
                                                disabled={loading}
                                                htmlType='button'
                                                onClick={() => onReset()}
                                            >
                                                Reiniciar
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col style={{ display: 'flex', gap: 16 }}>
                            <OptionsExport
                                infoReport={infoReport}
                                typeReport={typeReport}
                                currentUser={values?.selectedUser}
                                currentProfile={values?.selectedProfile}
                                columns={list_columns[typeReport]}
                                dataSource={data_report[typeReport] ?? infoReport}
                                disabled={loading || infoReport?.length <= 0}
                            />
                            {/* {['p'].includes(typeReport) && (
                                <Button
                                    disabled={infoReport?.length <=0}
                                    icon={<EyeOutlined />}
                                    onClick={()=> showChartGeneral()}
                                    style={{marginTop: 'auto', marginBottom: 24}}
                                >
                                    Ver gráfica
                                </Button>
                            )} */}
                            {multiUser && (
                                <Button
                                    icon={<UserOutlined />}
                                    disabled={currentUser?.length <= 0 || showGroups}
                                    onClick={() => showModalList(true)}
                                    style={{ marginTop: 'auto', marginBottom: 24 }}
                                >
                                    Usuarios ({currentUser?.length ?? 0})
                                </Button>
                            )}
                            {multiProfile && (
                                <Button
                                    icon={<ProfileOutlined />}
                                    disabled={currentProfile?.length <= 0}
                                    onClick={() => showModalList(false)}
                                    style={{ marginTop: 'auto', marginBottom: 24 }}
                                >
                                    Perfiles ({currentProfile?.length ?? 0})
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Col>
                {Object.keys(currentUser || {}).length > 0 && !Array.isArray(currentUser) && (
                    <Col span={24} style={{ marginBottom: 24 }}>
                        <div className='body-list-items scroll-bar'>
                            <div className='item-list-row default'>
                                <p>Usuario: {Object.keys(values)?.length > 0
                                    ? getFullName(values?.selectedUser)
                                    : getFullName(currentUser)}</p>
                            </div>
                            {showTitleWork && (
                                <div className='item-list-row default'>
                                    <p>Puesto: {Object.keys(values).length > 0
                                        ? getWork(values?.selectedUser)
                                        : getWork(currentUser)}</p>
                                </div>
                            )}
                            {showTitleProfile ? (
                                <>
                                    <div className='item-list-row normal'>
                                        <p>Perfil: {infoReport?.length > 0
                                            ? infoReport.at(-1)?.profiles?.at(-1)?.name
                                            : Object.keys(currentProfile || {}).length > 0
                                                ? currentProfile.name : 'Pendiente'}</p>
                                    </div>
                                    <div className='item-list-row normal'>
                                        <p>Compatibilidad: {infoReport?.length > 0
                                            ? getCompatibility(infoReport.at(-1)) : 'Pendiente'}</p>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </Col>
                )}
                {showChart && (
                    <Col span={24} style={{ marginBottom: 24 }}>
                        {infoReport?.length > 0 ? (
                            <div style={{ maxWidth: 800, margin: '0px auto' }}>
                                <ViewChart
                                    isModal={false}
                                    infoReport={infoReport}
                                    typeReport={typeReport}
                                />
                            </div>
                        ) : (
                            <div className='placeholder-list-items graph'>
                                <p>Reporte no generado</p>
                                <p>Gráfica en espera</p>
                            </div>
                        )}
                    </Col>
                )}
                <Col span={24}>
                    <Table
                        bordered
                        size='small'
                        rowKey={getRowKey}
                        loading={loading}
                        dataSource={data_report[typeReport] ?? infoReport}
                        columns={list_columns[typeReport]}
                        scroll={typeReport == 'pp' ? { y: 500 } : columnsMany.length > 8 ? { x: 1500 } : {}}
                        pagination={{
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                    />
                </Col>
                {/* <Col span={24}>
                    <ReportPDF
                        infoReport={infoReport}
                        typeReport={typeReport}
                        currentUser={currentUser}
                        currentProfile={currentProfile}
                        columns={list_columns[typeReport]}
                    />
                </Col> */}
            </Row>
            <ViewList
                visible={openModalList}
                isUsers={isUsers}
                close={closeModalList}
                listData={isUsers ? currentUser : currentProfile}
                setListData={onDelete}
            />
            {openModalChart && (
                <ViewChart
                    visible={openModalChart}
                    infoReport={dataChart}
                    typeReport={typeChart}
                    close={() => {
                        setOpenModalChart(false)
                        setDataChart([])
                        setTypeChart('p')
                    }}
                />
            )}
            <ModalPP
                visible={openModalInfo}
                record={itemInfo}
                onClose={closeInfo}
            />
        </>
    )
}

export default memo(FormReport)