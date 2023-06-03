import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFullName } from '../../../utils/functions';
import moment from 'moment';
import { ruleRequired } from '../../../utils/rules';
import {
    Form,
    Row,
    Col,
    Select,
    DatePicker,
    InputNumber,
    Button,
    Input
} from 'antd';
import WebApiPeople from '../../../api/WebApiPeople';
import WebApiFiscal from '../../../api/WebApiFiscal';
import FileUpload from '../../jobbank/FileUpload';
import {
    optionsCategoryIMSS,
    optionsClasifIMSS
} from '../../../utils/constant';

const IncapacityForm = ({
    action,
    formIncapacity,
    infoIncapacity = {},
    setCurrentPerson,
    setFileDocument,
    actionBack = () => { }
}) => {

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    const {
        current_node,
    } = useSelector(state => state.userStore);

    const noValid = [undefined, null, "", " "];

    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [nonWorkingWeekDays, setNonWorkingWeekDays] = useState([]);

    const [loadDisability, setLoadDisability] = useState(false);
    const [listDisability, setListDisability] = useState([]);
    // const [typeDisability, setTypeDisability] = useState({});

    const departureDate = Form.useWatch('departure_date', formIncapacity);
    const idDisability = Form.useWatch('incapacity_type', formIncapacity);
    const idClasif = Form.useWatch('imss_classification', formIncapacity);
    const idCategory = Form.useWatch('category', formIncapacity);

    useEffect(() => {
        getTypeDisability()
    }, [])

    useEffect(() => {
        if (current_node) {
            getNonWorkingDays(current_node?.id)
            getWorkingWeekDays(current_node?.id)
        }
    }, [current_node])

    const getNonWorkingDays = async (node) => {
        try {
            let params = { node, limit: 1000 };
            let response = await WebApiPeople.getNonWorkingDays(params)
            let dates = response.data?.results?.map(e => e.date)
            setNonWorkingDays(dates)
        } catch (e) {
            console.log(e)
        }
    }

    const getWorkingWeekDays = async (node) => {
        try {
            let response = await WebApiPeople.getWorkingWeekDays(node)
            const workingWeekDays = response?.data?.results.length > 0
                ? response.data?.results[0] : {}
            // Obtenemos los días no laborables de la semana
            const reduce_ = (acc, [key, val]) => val ? acc : [...acc, key];
            let _days = Object.entries(workingWeekDays).reduce(reduce_, [])
            setNonWorkingWeekDays(_days)
        } catch (e) {
            console.log(e)
        }
    }

    const getTypeDisability = async () => {
        try {
            setLoadDisability(true)
            let response = await WebApiFiscal.getDisabilityType();
            let results = response.data?.results || [];
            // Los registros se repiten y se eliminan por medio del código
            let list = results?.reduce((acc, current) => {
                const some_ = item => item.code == current.code;
                if (acc?.some(some_)) return acc;
                return [...acc, current]
            }, [])
            setListDisability(list)
            setLoadDisability(false)
        } catch (e) {
            console.log(e)
            setListDisability([])
            setLoadDisability(false)
        }
    }

    // Recupera el número de días laborables entre un rango de fecha especificado
    const getWorkingDaysFromRange = async (start, end) => {
        try {
            let params = {
                node_id: current_node.id,
                start_date: start?.format('YYYY-MM-DD'),
                end_date: end?.format('YYYY-MM-DD')
            }
            let response = await WebApiPeople.getWorkingDaysFromRange(params)
            formIncapacity.setFieldsValue({ requested_days: response.data.total_days });
        } catch (e) {
            console.log(e)
        }
    }

    const getPerson = (id) => {
        if (!id) return {};
        const find_ = item => item.id == id;
        let result = persons_company.find(find_);
        if (!result) return {};
        return result;
    }

    const getDisability = (id) => {
        if (!id || listDisability?.length <= 0) return {};
        let result = listDisability.find(item => item.id == id);
        if (!result) return {};
        return result;
    }

    const typeDisability = useMemo(() => {
        return getDisability(idDisability);
    }, [idDisability, listDisability])

    const onChangePerson = (value) => {
        let person = getPerson(value);
        setCurrentPerson(person)
    }

    const onChangeStart = (value) => {
        if (value) return true;
        formIncapacity.setFieldsValue({
            requested_days: undefined,
            return_date: undefined
        })
    }

    const onChangeEnd = (date) => {
        if (!date) {
            formIncapacity.setFieldsValue({ requested_days: undefined });
            return false;
        }
        getWorkingDaysFromRange(departureDate, date)
    }

    const onChangeCategory = (value) => {
        formIncapacity.setFieldsValue({
            subcategory: null
        })
    }

    const onChangeClasif = (value) => {
        formIncapacity.setFieldsValue({
            category: null,
            subcategory: null
        })
    }

    const onChangeDisabiliy = (value) => {
        formIncapacity.setFieldsValue({
            category: null,
            subcategory: null,
            imss_classification: null
        })
    }

    const getDefaultEnd = () => {
        return departureDate ? departureDate : moment();
    }

    const disabledStart = (current) => {
        let actually = current?.format('YYYY-MM-DD');
        let present = current?.locale('en').format('dddd').toLowerCase();
        let exist = nonWorkingDays.includes(actually) || nonWorkingWeekDays.includes(present);
        return current && exist;
    }

    const disabledEnd = (current) => {
        let actually = current?.format('YYYY-MM-DD');
        let present = current?.locale('en').format('dddd').toLowerCase();
        let exist = nonWorkingDays.includes(actually) || nonWorkingWeekDays.includes(present);
        let valid_start = current < departureDate?.startOf("day");
        return current && (valid_start || exist);
    }

    const getOptionsClasif = () => {
        let code = typeDisability?.code;
        if (!code) return [];
        const gets = {
            '01': e => e.value >= 1 && e.value <= 3,
            '03': e => e.value >= 4 && e.value <= 7
        }
        return gets[code]
            ? optionsClasifIMSS.filter(gets[code])
            : [optionsCategoryIMSS.find(item => item.value == 0)];
    }

    const find0 = item => item.value == 0;
    const find1 = item => item.value == 1;
    const find2 = item => item.value == 2;
    const diff0 = item => item.value !== 0;
    const diff2 = item => item.value !== 2;

    const getOptionsCategory = () => {
        let code = typeDisability?.code;
        if (code == '01') {
            if (idClasif == 1) return [optionsCategoryIMSS.find(find0)];
            return [optionsCategoryIMSS.find(find1)];
        }
        if(code == '02' &&
            idClasif == 0
        ) return optionsCategoryIMSS.filter(diff2);
        if(code == '03' &&
            [4,5,6,7].includes(idClasif)
        ) return [optionsCategoryIMSS.find(find0)];
        // 04
        return [optionsCategoryIMSS.find(find0)];
    }

    const getOptionsSubcategory = () => {
        let code = typeDisability?.code;
        if (code == '01') {
            if (idClasif == 1) return [optionsCategoryIMSS.find(find0)];
            return optionsCategoryIMSS.filter(diff0);
        }
        if(code == '02' &&
            idCategory == 0
        ) return [optionsCategoryIMSS.find(find2)];
        if(code == '02' &&
            idCategory == 1
        ) return optionsCategoryIMSS.filter(diff0);
        if(code == '03' &&
            [4,5,6,7].includes(idClasif)
        ) return [optionsCategoryIMSS.find(find2)];
        // 04
        return [optionsCategoryIMSS.find(find2)];
    }

    const optionsClasifications = useMemo(() => {
        return getOptionsClasif();
    }, [typeDisability])

    const optionsCategory = useMemo(() => {
        return getOptionsCategory();
    }, [idClasif])

    const optionsSubcategory = useMemo(() => {
        return getOptionsSubcategory();
    }, [idCategory])

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='person'
                    label='Colaborador'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_persons || action == 'edit'}
                        loading={load_persons}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={onChangePerson}
                        size='large'
                    >
                        {persons_company.length > 0 && persons_company.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {getFullName(item)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='invoice'
                    label='Folio'
                    rules={[ruleRequired]}
                >
                    <Input
                        size='large'
                        maxLength={20}
                        placeholder='Folio de inpacidad'
                        disabled={action == 'edit'}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='incapacity_type'
                    label='Tipo de incapacidad'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={loadDisability}
                        loading={loadDisability}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        size='large'
                        onChange={onChangeDisabiliy}
                    >
                        {listDisability.length > 0 && listDisability.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.description}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='imss_classification'
                    label='Clasificación (IMSS)'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        size='large'
                        disabled={optionsClasifications?.length <= 0}
                        options={optionsClasifications}
                        onChange={onChangeClasif}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='category'
                    label='Categoría'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        size='large'
                        disabled={noValid.includes(idClasif)}
                        options={optionsCategory}
                        onChange={onChangeCategory}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='subcategory'
                    label='Subcategoría'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        size='large'
                        disabled={noValid.includes(idCategory)}
                        options={optionsSubcategory}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='departure_date'
                    label='Fecha inicio'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder='Seleccionar una fecha'
                        disabledDate={disabledStart}
                        onChange={onChangeStart}
                        format='DD-MM-YYYY'
                        inputReadOnly
                        size='large'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='return_date'
                    label='Fecha fin'
                    dependencies={['departure_date']}
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder='Seleccionar una fecha'
                        disabledDate={disabledEnd}
                        defaultPickerValue={getDefaultEnd()}
                        disabled={!departureDate}
                        onChange={onChangeEnd}
                        format='DD-MM-YYYY'
                        inputReadOnly
                        size='large'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='requested_days'
                    label='Días solicitados'
                    rules={[ruleRequired, {
                        type: 'number', min: 1,
                        message: 'Días solicitados debe ser mayor o igual a 1'
                    }]}
                >
                    <InputNumber
                        min={1}
                        disabled
                        size='large'
                        placeholder='Días solicitados'
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='payroll_apply_date'
                    label='Fecha de aplicación en Nómina'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        inputReadOnly
                        size='large'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <FileUpload
                    sizeInput='large'
                    isRequired={true}
                    label='Documentación'
                    keyName='document_name_read'
                    urlPreview={infoIncapacity?.document}
                    setFile={setFileDocument}
                    setNameFile={e => formIncapacity.setFieldsValue({
                        document_name_read: e
                    })}
                />
            </Col>
            <Col span={24} className='content-end' style={{ gap: 8 }}>
                <Button htmlType='button' onClick={() => actionBack()}>
                    Cancelar
                </Button>
                <Button htmlType='submit'>
                    {action == 'add' ? 'Guardar' : 'Actualizar'}
                </Button>
            </Col>
        </Row>
    )
}

export default IncapacityForm