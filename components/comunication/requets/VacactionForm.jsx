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
    message,
    Button
} from 'antd';
import WebApiPeople from '../../../api/WebApiPeople';

const VacactionForm = ({
    formRequest,
    currentPerson,
    setCurrentPerson,
    action,
    actionBack = () => { }
}) => {

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);

    const [loadDays, setLoadDays] = useState(false);
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [nonWorkingWeekDays, setNonWorkingWeekDays] = useState([]);
    const departureDate = Form.useWatch('departure_date', formRequest);
    const availableDays = Form.useWatch('availableDays', formRequest);
    const periodForm = Form.useWatch('period', formRequest);

    const formatStart = 'YYYY-MM-DD';
    // Keys para periodo actual
    const days = 'available_days_vacation';
    const period = 'current_vacation_period';
    const start = 'start_date_current_vacation_period';
    const end = 'end_date_current_vacation_period';
    // Keys para siguiente periodo
    const daysNext = 'next_period_available_days_vacation';
    const periodNext = 'next_vacation_period';
    const startNext = 'start_date_next_vacation_period';
    const endNext = 'end_date_next_vacation_period';

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

    // Recupera el número de días laborables entre un rango de fecha especificado
    const getWorkingDaysFromRange = async (start, end) => {
        let key = 'days_requested';
        try {
            setLoadDays(true)
            let params = {
                node_id: current_node.id,
                start_date: moment(start).format(formatStart),
                end_date: moment(end).format(formatStart)
            }
            let response = await WebApiPeople.getWorkingDaysFromRange(params)
            let total_days = response.data.total_days;

            formRequest.setFieldsValue({ [key]: total_days })
            let errors = total_days > availableDays
                ? ['Días solicitados no debe ser mayor a los días disponibles']
                : [];
            formRequest.setFields([{ name: key, errors }]);
            setLoadDays(false)
        } catch (e) {
            console.log(e)
            setLoadDays(false)
        }
    }

    const setValuesByUser = (person) => {
        let values = {};
        values.availableDays = person[days] ? person[days] : null;
        values.period = person[period] ? person[period] : null;
        values.immediate_supervisor = person?.immediate_supervisor
            ? person?.immediate_supervisor?.id : null,
            values.days_requested = null;
        values.departure_date = null;
        values.return_date = null;
        formRequest.setFieldsValue(values);
    }

    const getPerson = (id) => {
        if (!id) return {};
        const find_ = item => item.id == id;
        let result = persons_company.find(find_);
        if (!result) return {};
        return result;
    }

    const onChangePerson = (value) => {
        let person = getPerson(value);
        setCurrentPerson(person)

        if (!value) formRequest.resetFields();
        else setValuesByUser(person);
    }

    const onChangePeriod = (value) => {
        let _days = value == currentPerson[period]
            ? currentPerson[days] : currentPerson[daysNext];
        let availableDays = value ? _days : undefined;
        formRequest.setFieldsValue({
            departure_date: undefined,
            return_date: undefined,
            days_requested: undefined,
            availableDays
        })
    }

    const onChangeStart = (value) => {
        if (value) return true;
        formRequest.setFieldsValue({
            days_requested: undefined,
            return_date: undefined
        })
    }

    const onChangeEnd = (date) => {
        if (!date) {
            formRequest.setFieldsValue({ days_requested: undefined });
            return false;
        }
        getWorkingDaysFromRange(departureDate, date)
    }

    const getDates = (isStart = true) => {
        if (Object.keys(currentPerson).length <= 0 || !periodForm) return moment();
        let keys = isStart ? [start, startNext] : [end, endNext];
        let date = periodForm == currentPerson[period]
            ? currentPerson[keys[0]]
            : currentPerson[keys[1]];
        return moment(date, formatStart);
    }

    const getDefaultStart = () => {
        if (!periodForm) return moment();
        let date = periodForm == currentPerson[period]
            ? moment().format(formatStart)
            : currentPerson[startNext];
        return moment(date, formatStart)
    }

    // Revisar bien
    const getDefaultEnd = () => {
        if (!departureDate) return moment();
        return moment(departureDate);
    }

    const optionsPeriod = useMemo(() => {
        // if (Object.keys(currentPerson).length <= 0) return [];
        let options = [];
        if (currentPerson[period]) {
            let init = moment(currentPerson[start], formatStart).year();
            let finish = moment(currentPerson[end], formatStart).year();
            options.push({
                key: '1',
                value: currentPerson[period],
                label: `${init} - ${finish}`
            });
        }
        if(currentPerson[periodNext]){
            let init = moment(currentPerson[startNext], formatStart).year();
            let finish = moment(currentPerson[endNext], formatStart).year();
            options.push({
                key: '2',
                value: currentPerson[periodNext],
                label: `${init} - ${finish}`
            });
        }
        return options;
    }, [currentPerson])

    const dateStart = useMemo(() => {
        return getDates()
    }, [currentPerson, periodForm])

    const dateEnd = useMemo(() => {
        return getDates(false)
    }, [currentPerson, periodForm])

    const dateInit = useMemo(() => {
        return getDefaultEnd();
    }, [departureDate])

    const disabledStart = (current) => {
        if (Object.keys(currentPerson).length <= 0 || !periodForm) return false;
        let actually = current?.format(formatStart);
        let present = current?.locale('en').format('dddd').toLowerCase();
        let exist = nonWorkingDays.includes(actually) || nonWorkingWeekDays.includes(present);
        let valid_start = current < dateStart?.startOf('day');
        let valid_end = current > dateEnd?.endOf('day');
        return current && (valid_start || valid_end || exist);
    }

    const disabledEnd = (current) => {
        if (Object.keys(currentPerson).length <= 0) return false;
        let actually = current?.format(formatStart);
        let present = current?.locale('en').format('dddd').toLowerCase();
        let exist = nonWorkingDays.includes(actually) || nonWorkingWeekDays.includes(present);
        let valid_start = current < dateInit?.startOf("day");
        let valid_end = current > dateEnd.endOf("day");
        return current && (valid_start || valid_end || exist);
    }

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} xl={8}>
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
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='period'
                    label='Periodo'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        disabled={action == 'edit'}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={onChangePeriod}
                        options={optionsPeriod}
                        size='large'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='departure_date'
                    label='Fecha inicio'
                    rules={[ruleRequired]}
                    dependencies={['period']}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder='Seleccionar una fecha'
                        disabledDate={disabledStart}
                        defaultPickerValue={getDefaultStart()}
                        disabled={!periodForm}
                        onChange={onChangeStart}
                        format='DD-MM-YYYY'
                        inputReadOnly
                        size='large'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
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
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='days_requested'
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
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='availableDays'
                    label='Días disponibles'
                    rules={[{
                        type: 'number', min: 1,
                        message: 'Días disponibles debe ser mayor o igual a 1'
                    }]}
                >
                    <InputNumber
                        disabled
                        size='large'
                        placeholder='Días disponibles'
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='immediate_supervisor'
                    label='Jefe inmediato'
                    rules={[ruleRequired]}
                    tooltip='Esta información la puedes asignar desde el expediente de la persona'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled
                        loading={load_persons}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
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
            <Col span={24} className='content-end' style={{ gap: 8 }}>
                <Button htmlType='button' onClick={() => actionBack()}>
                    Cancelar
                </Button>
                <Form.Item shouldUpdate noStyle>
                    {() => (
                        <Button
                            htmlType='submit'
                            disabled={!!formRequest.getFieldsError().filter(({ errors }) => errors.length).length}
                        >
                            {action == 'add' ? 'Guardar' : 'Actualizar'}
                        </Button>
                    )}
                </Form.Item>
            </Col>
        </Row>
    )
}

export default VacactionForm