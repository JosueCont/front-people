import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react';
import MyModal from '../../../common/MyModal';
import { getWorkTitle } from '../../../redux/catalogCompany';
import {
    Button,
    Form,
    Row,
    Col,
    Typography,
    Space,
    Select,
    Input,
    DatePicker,
    Drawer,
    Switch,
    message,
    Popconfirm,
    Spin
} from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
    ruleRequired,
    nameLastname,
    ruleEmail
} from '../../../utils/rules';
import {
    getFullName
} from '../../../utils/functions';
import {
    KhorflixAccess,
    SukhaAccess,
    genders,
    intranetAccess
} from '../../../utils/constant';
import WebApiPeople from '../../../api/WebApiPeople';
import SelectPeople from '../utils/SelectPeople';
import { PlusOneOutlined } from '@material-ui/icons';
import { PlusOutlined } from '@ant-design/icons';
import SelectWorkTitle from '../../selects/SelectWorkTitle';

const ModalPeople = ({
    visible = false,
    close = () => { },
    onReady = () => { }
}) => {

    const {
        user,
        current_node,
        general_config,
        applications
    } = useSelector(state => state.userStore);


    const dispatch = useDispatch();

    const {
        cat_job,
        cat_groups,
        cat_person_type,
        cat_departments,
        cat_work_title
    } = useSelector(state => state.catalogStore);

    const [formPeople] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [txtError, setTxtError] = useState(null);
    const [payrollActive, setPayrollActive] = useState(true);

    // No se usan los states
    // const [searchValue, setSearchValue] = useState(null)
    // const [workTitleFocus, setWorkTitleFocus] = useState(false)
    // const [optionsWorkPlace, setOptionsWorkPlace] = useState([])

    const idSuperivor = Form.useWatch('immediate_supervisor', formPeople);
    const idSubstitute = Form.useWatch('substitute_immediate_supervisor', formPeople);
    const idDepartment = Form.useWatch('person_department', formPeople);
    const idJob = Form.useWatch('job', formPeople);

    const format = 'YYYY-MM-DD';

    const actionCreate = async (values) => {
        try {
            setLoading(true)

            if(!values?.work_title_id){
                delete values['work_title_id']
            }

            let body = { ...values, node: current_node?.id };
            let response = await WebApiPeople.createPerson(body);
            setTimeout(() => {
                setLoading(false)
                onClose()
            }, 1000)
            setTimeout(() => {
                message.success('Persona registrada')
                onReady()
            }, 2000)
        } catch (e) {
            let error = e.response?.data?.message;
            let msg = error ? error : 'Person no registrada';
            setTxtError(msg)
            setLoading(false)
            console.log(e)
        }
    }

    const onFinish = async (values) => {
        setTxtError(null)
        if (values?.password !== values?.passwordTwo) {
            let errors = ['Las contraseñas no coinciden'];
            formPeople.setFields([{ name: 'passwordTwo', errors }]);
            return;
        }
        if (values.groups) values.groups = [values.groups];
        values.birth_date = values.birth_date ? values.birth_date?.format(format) : null;
        actionCreate(values)
    }

    const onClose = () => {
        close()
        setTxtError(null)
        setPayrollActive(true)
        formPeople.resetFields();
    }

    const disabledDate = (current) => {
        return current && moment(current).startOf('day') > moment().startOf('day');
    }

    const onChangeSupervisor = (value) => {
        formPeople.setFieldsValue({
            substitute_immediate_supervisor: null
        })
    }

    const rulePass = () => ({
        validator(_, value) {
            if (!value) return Promise.reject('Este campo es requerido');
            if (value.includes(' ')) return Promise.reject('No están permitidos los espacios en blanco');
            return Promise.resolve();
        }
    })

    const ruleConfirm = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value) return Promise.reject('Este campo es requerido');
            if (value.includes(' ')) return Promise.reject('No están permitidos los espacios en blanco');
            let one = getFieldValue('password');
            if (one !== value) return Promise.reject('Las contraseñas no coinciden');
            return Promise.resolve();
        }
    })

    // const reloadOptionsWorkPlaces = () => {
    //     if (!idDepartment || !idJob) return [];
    //     let places = cat_work_title.filter(item => !item?.person);
    //     const filter_ = (item) => item.department?.id === idDepartment && item.job.id === idJob;
    //     let list = places.filter(filter_)
    //     setOptionsWorkPlace(list)
    // }

    // Se sustiye por el onChange del select
    // useEffect(() => {
    //     reloadOptionsWorkPlaces()
    //     formPeople.setFieldsValue({ 'work_title_id': null })
    // }, [idDepartment, idJob])

    // Las opciones no se usan aqui
    // useEffect(() => {
    //     reloadOptionsWorkPlaces()
    // }, [cat_work_title])

    useEffect(() => {
        if (cat_groups.length === 1) {
            formPeople.setFieldsValue({ 'groups': cat_groups[0].id })
        }
    }, [cat_groups])

    const optionsSupervisor = (options) => {
        if (!idSubstitute) return options;
        const filter_ = item => item.id !== idSubstitute;
        return options.filter(filter_);
    }

    const optionsSubstitute = (options) => {
        if (!idSuperivor) return options;
        const filter_ = item => item.id !== idSuperivor;
        return options.filter(filter_);
    }

    const onChangeDepartment = () =>{
        formPeople.setFieldsValue({work_title_id: null})
    }

    const onChangeJob = () =>{
        formPeople.setFieldsValue({work_title_id: null})
    }

    return (
        // <MyModal
        //     title={`Alta de personas en ${current_node?.name}`}
        //     closable={!loading}
        //     visible={visible}
        //     widthModal={800}
        //     close={onClose}
        // >
        <Drawer
            title={`Alta de personas en ${current_node?.name}`}
            width={900}
            visible={visible}
            placement='right'
            maskClosable={false}
            closable={!loading}
            keyboard={false}
            onClose={() => onClose()}
            footer={txtError ? (
                <Typography.Text type='danger'>
                    {txtError}
                </Typography.Text>
            ) : false}
            extra={
                <Space>
                    <Button disabled={loading} onClick={() => onClose()}>
                        Cancelar
                    </Button>
                    <Button
                        htmlType='submit'
                        loading={loading === true}
                        form='form_people'
                    >
                        Guardar
                    </Button>
                </Space>
            }
        >
            <Form
                form={formPeople}
                onFinish={onFinish}
                layout='vertical'
                id='form_people'
            >
                <Row gutter={[24, 0]}>
                    <Col span={8}>
                        <Form.Item
                            name='first_name'
                            label='Nombre'
                            rules={[ruleRequired, nameLastname]}
                        >
                            <Input
                                allowClear
                                placeholder='Nombre'
                                className='input-with-clear'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='flast_name'
                            label='Apellido paterno'
                            rules={[ruleRequired, nameLastname]}
                        >
                            <Input
                                allowClear
                                placeholder='Apellido paterno'
                                className='input-with-clear'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='mlast_name'
                            label='Apellido materno'
                            rules={[ruleRequired, nameLastname]}
                        >
                            <Input
                                allowClear
                                placeholder='Apellido materno'
                                className='input-with-clear'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='gender'
                            label='Género'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={genders}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='birth_date'
                            label="Fecha de nacimiento"
                        >
                            <DatePicker
                                inputReadOnly
                                style={{ width: '100%' }}
                                format='DD-MM-YYYY'
                                disabledDate={disabledDate}
                                placeholder='Seleccionar una fecha'
                            />
                        </Form.Item>
                    </Col>
                    {
                        cat_person_type?.length > 0 &&
                        <Col span={8}>
                            <Form.Item
                                name='person_type'
                                label='Tipo de persona'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {cat_person_type?.length > 0 && cat_person_type.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    }

                    <Col span={8}>
                        <Form.Item
                            name='person_department'
                            label='Departamento'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                onChange={onChangeDepartment}
                            >
                                {cat_departments?.length > 0 && cat_departments.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='job'
                            label='Puesto de trabajo'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                onChange={onChangeJob}
                            >
                                {cat_job.length > 0 && cat_job.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <SelectWorkTitle
                            name='work_title_id'
                            viewLabel={true}
                            department={idDepartment}
                            job={idJob}
                            labelText='Plaza laboral'
                            dependencies={['person_department', 'job']}
                            //rules={[ruleRequired]} //Se omite la validación aqui, ya que se realiza en el componente
                            placeholder='Seleccionar una opción'
                            disabled={!idDepartment || !idJob}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='code'
                            label='No. empleado'
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='No. empleado'
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item
                            name='email'
                            label='Correo electrónico'
                            rules={[ruleEmail, payrollActive ? ruleRequired : {}]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Correo electrónico'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <SelectPeople
                            name='immediate_supervisor'
                            label='Jefe inmediato'
                            onChangeSelect={onChangeSupervisor}
                            watchParam={idSubstitute}
                            watchCallback={optionsSupervisor}
                        />
                    </Col>
                    <Col span={8}>
                        <SelectPeople
                            name='substitute_immediate_supervisor'
                            label='Jefe suplente'
                            disabled={!idSuperivor}
                            watchParam={idSuperivor}
                            watchCallback={optionsSubstitute}
                        />
                    </Col>
                    <Col span={24} style={{ marginBottom: 20 }}>
                        <div className='ant-label-user default'>
                            {applications?.payroll?.active && (
                                <>
                                    <label>¿Crear usuario?</label>
                                    <Switch
                                        size='small'
                                        checked={payrollActive}
                                        onChange={setPayrollActive}
                                    />
                                </>
                            )}
                        </div>
                    </Col>
                    {payrollActive && (
                        <>
                            <Col span={24}>
                                <Row gutter={[24, 0]}>
                                    <Col lg={8} xs={24}>
                                        <Form.Item
                                            name='password'
                                            label='Contraseña'
                                            required
                                            rules={[rulePass]}
                                        >
                                            <Input.Password placeholder='Contraseña' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name='passwordTwo'
                                            label='Confirmar contraseña'
                                            required={true}
                                            dependencies={['password']}
                                            rules={[ruleConfirm]}
                                        >
                                            <Input.Password placeholder='Confirmar contraseña' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name='groups'
                                            label='Perfil de seguridad'
                                            rules={[ruleRequired]}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder='Seleccionar una opción'
                                                notFoundContent='No se encontraron resultados'
                                                optionFilterProp='children'
                                            >
                                                {cat_groups?.length > 0 && cat_groups.map(item => (
                                                    <Select.Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    {general_config?.intranet_enabled && (
                                        <Col span={8}>
                                            <Form.Item
                                                name='intranet_access'
                                                label='Acceso a Khor Connect'
                                                rules={[ruleRequired]}
                                            >
                                                <Select
                                                    allowClear
                                                    placeholder='Seleccionar una opción'
                                                    options={intranetAccess}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )}
                                    {applications?.sukhatv?.active && (
                                        <>
                                            <Col span={8}>
                                                <Form.Item
                                                    name='sukhatv_access'
                                                    label='Acceso a Sukha'
                                                    rules={[ruleRequired]}
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder='Seleccionar una opción'
                                                        options={SukhaAccess}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name='is_sukhatv_admin'
                                                    label='¿Es administrador SukhaTV?'
                                                    rules={[ruleRequired]}
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder='Seleccionar una opción'
                                                        options={SukhaAccess}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </>
                                    )}
                                    {applications?.khorflix?.active && (
                                        <>
                                            <Col span={8}>
                                                <Form.Item
                                                    name='khorflix_access'
                                                    label='Acceso a Khorflix'
                                                    rules={[ruleRequired]}
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder='Seleccionar una opción'
                                                        options={KhorflixAccess}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name='is_khorflix_admin'
                                                    label='¿Es administrador Khorflix?'
                                                    rules={[ruleRequired]}
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder='Seleccionar una opción'
                                                        options={KhorflixAccess}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
        </Drawer>
        // </MyModal>
    )
}

export default ModalPeople