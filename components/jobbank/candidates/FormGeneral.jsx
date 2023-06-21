import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Checkbox,
    DatePicker
} from 'antd';
import {
    ruleWhiteSpace,
    ruleRequired,
    ruleEmail,
    rulePhone,
    onlyNumeric
} from '../../../utils/rules';
import ListLangs from './ListLangs';
import FileUpload from '../FileUpload';
import { optionsGenders } from '../../../utils/constant';
import moment from 'moment';
import { useSelector } from 'react-redux';

const FormGeneral = ({
    formCandidate,
    setFileCV,
    infoCandidate,
    showVacant = false,
    optionVacant = [],
    loadVacant = false,
    onlyRead = false
}) => {

    const {
        list_states,
        load_states,
        list_connections_options,
        load_connections_options,
        list_vacancies_options,
        load_vacancies_options
    } = useSelector(state => state.jobBankStore);
    const state = Form.useWatch('state', formCandidate);
    const languages = Form.useWatch('languages', formCandidate);
    const typeFileCV = ['pdf','png','jpg','jpeg','xlsx','docx','pptx','pub'];

    const onChangeState = (value) =>{
        if(!value) formCandidate.setFieldsValue({municipality: null});
    }

    const disabledDate = (current) => {
        return current && current > moment().subtract(18,'years').endOf("day");
    };

    return (
        <Row gutter={[24,0]}>
            <Col xs={24} md={12} xl={8} xxl={6} style={{display: 'none'}}>
                <Form.Item name='is_active' valuePropName='checked'>
                    <Checkbox>¿Está activo?</Checkbox>
                </Form.Item>
            </Col>
            {showVacant && (
                <Col xs={24} md={12} xl={8} xxl={6}>
                    <Form.Item
                        name='vacant'
                        label='Vacante'
                        rules={[ruleRequired]}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled
                            loading={loadVacant}
                            placeholder='Seleccionar una opción'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            {optionVacant.map(item => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.job_position}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            )}
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='first_name'
                    label='Nombre'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={150}
                        placeholder='Nombre del candidato'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='last_name'
                    label='Apellidos'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={150}
                        placeholder='Apellidos del candidato'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='email'
                    label='Correo electrónico'
                    rules={[ruleRequired, ruleEmail]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={150}
                        placeholder='Correo electrónico'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='cell_phone'
                    label='Teléfono celular'
                    rules={[rulePhone, ruleRequired]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={10}
                        placeholder='Teléfono celular'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='birthdate'
                    label='Fecha de nacimiento'
                    rules={[ruleRequired]}
                    tooltip='Edad mínima requerida 18 años'
                >
                    <DatePicker
                        disabled={onlyRead}
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        defaultPickerValue={moment().subtract(18,'years')}
                        disabledDate={disabledDate}
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <FileUpload
                    label='CV'
                    keyName='cv_name_read'
                    tooltip={`Archivos permitidos: ${typeFileCV.join(', ')}.`}
                    urlPreview={infoCandidate?.cv}
                    download={true}
                    setFile={setFileCV}
                    disabled={onlyRead}
                    typeFile={typeFileCV}
                    setNameFile={e => formCandidate.setFieldsValue({
                        cv_name_read: e
                    })}
                />
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='gender'
                    label='Género'
                >
                    <Select
                        // allowClear
                        disabled={onlyRead}
                        showSearch
                        placeholder='Seleccionar un género'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsGenders}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='telephone'
                    label='Teléfono fijo'
                    rules={[rulePhone]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={10}
                        placeholder='Teléfono fijo'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='state'
                    label='Estado'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un estado'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_states || onlyRead}
                        loading={load_states}
                        optionFilterProp='children'
                        onChange={onChangeState}
                    >
                        {list_states?.length > 0 && list_states.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='municipality'
                    label='Municipio'
                    rules={[ruleWhiteSpace]}
                >
                    <Input
                        disabled={!state || onlyRead}
                        maxLength={100}
                        placeholder='Especificar el municipio'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='street_address'
                    label='Dirección'
                    rules={[ruleWhiteSpace]}
                >
                    <Input
                        disabled={onlyRead}
                        placeholder='Dirección'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='postal_code'
                    label='Código postal'
                    rules={[onlyNumeric]}
                >
                    <Input
                        disabled={onlyRead}
                        maxLength={10}
                        placeholder='Código postal'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    label='¿Disponibilidad para viajar?'
                    name='availability_to_travel'
                >
                    <Select
                        disabled={onlyRead}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                    >
                        <Select.Option value={true} key={true}>Sí</Select.Option>
                        <Select.Option value={false} key={false}>No</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <ListLangs
                    disabled={onlyRead}
                    listSelected={languages}
                />
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='notification_source'
                    label='Recibir notificaciones por'
                >
                    <Select
                        mode='multiple'
                        maxTagCount={1}
                        disabled={load_connections_options || onlyRead}
                        loading={load_connections_options}
                        placeholder='Seleccionar las opciones'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        <Select.Option value='EM' key='EM'>Correo electrónico</Select.Option>
                        {list_connections_options.length > 0 &&
                            list_connections_options.map(item=> (
                            <Select.Option value={item.code} key={item.code}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    name='about_me'
                    label='Comentarios'
                    rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        disabled={onlyRead}
                        placeholder='Comentarios'
                        autoSize={{
                            minRows: 5,
                            maxRows: 5,
                        }}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default FormGeneral;