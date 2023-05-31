import React, { useEffect, useState } from 'react';
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

const PermissionForm = ({
    formPermit,
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

    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [nonWorkingWeekDays, setNonWorkingWeekDays] = useState([]);

    const departureDate = Form.useWatch('departure_date', formPermit);

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
        try {
            let params = {
                node_id: current_node.id,
                start_date: start?.format('YYYY-MM-DD'),
                end_date: end?.format('YYYY-MM-DD')
            }
            let response = await WebApiPeople.getWorkingDaysFromRange(params)
            formPermit.setFieldsValue({ requested_days: response.data.total_days });
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

    const onChangePerson = (value) => {
        let person = getPerson(value);
        setCurrentPerson(person)
    }

    const onChangeStart = (value) => {
        if (value) return true;
        formPermit.setFieldsValue({
            requested_days: undefined,
            return_date: undefined
        })
    }

    const onChangeEnd = (date) => {
        if (!date) {
            formPermit.setFieldsValue({ requested_days: undefined });
            return false;
        }
        getWorkingDaysFromRange(departureDate, date)
    }

    const getDefaultEnd = () => {
        return departureDate ? departureDate : moment();
    }

    const disabledEnd = (current) => {
        let actually = current?.format('YYYY-MM-DD');
        let present = current?.locale('en').format('dddd').toLowerCase();
        let exist = nonWorkingDays.includes(actually) || nonWorkingWeekDays.includes(present);
        let valid_start = current < departureDate?.startOf("day");
        return current && (valid_start || exist);
    }

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
                    name='departure_date'
                    label='Fecha de salida'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder='Seleccionar una fecha'
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
                    label='Fecha de regreso'
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
            <Col span={24}>
                <Form.Item
                    name='reason'
                    label='Motivo'
                    rules={[ruleRequired]}
                >
                    <Input.TextArea
                        showCount
                        maxLength={200}
                        placeholder='Especificar motivo'
                        autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                </Form.Item>
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

export default PermissionForm