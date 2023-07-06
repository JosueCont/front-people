import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getFullName } from '../../../utils/functions';
import { optionsStatusVacation } from '../../../utils/constant';

const FiltersRequests = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch,
    range = 1,
    showCollaborator = true,
    showSupervisor = true
}) => {

    const {
        persons_company,
        load_persons
    } = useSelector(state => state.userStore);
    const [loading, setLoading] = useState(false);
    const period = Form.useWatch('period', formSearch);
    const noWorking = ['saturday', 'sunday'];

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

    const optionsPeriod = useMemo(() => {
        let year = moment().year();
        let size = (range * 2) + 1;
        return Array(size).fill(null).map((_, idx) => {
            let result = idx > range ? year + (idx - range) : year - (range - idx);
            let label = `${result} - ${result + 1}`;
            return { value: `${result}`, key: `${idx}`, label };
        })
    }, [])

    const onChangePeriod = (value) => {
        formSearch.setFieldsValue({
            range: null
        })
    }

    const yearStart = useMemo(() => {
        return period ? parseInt(period) : moment().year();
    }, [period])

    const disabledDate = (current) => {
        let day = current?.locale('en').format('dddd').toLowerCase();
        let exist = noWorking.includes(day);
        if (!period) return exist;
        let valid_start = current?.year() < yearStart;
        let valid_end = current?.year() > yearStart;
        return current && (valid_start || valid_end || exist);
    }

    return (
        <MyModal
            title='Configurar filtros'
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={700}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
                initialValues={{
                    status: '1'
                }}
            >
                <Row gutter={[16, 0]}>
                    {showCollaborator && (
                        <Col span={12}>
                            <Form.Item
                                name='person__id'
                                label='Colaborador'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    disabled={load_persons}
                                    loading={load_persons}
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {persons_company.length > 0 && persons_company.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {getFullName(item)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    {showSupervisor && (
                        <Col span={12}>
                            <Form.Item
                                name='immediate_supervisor'
                                label='Jefe inmediato'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    disabled={load_persons}
                                    loading={load_persons}
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {persons_company.length > 0 && persons_company.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {getFullName(item)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                // allowClear
                                placeholder='Seleccionar una opción'
                                options={[{ value: '6', key: '6', label: 'Todas' }].concat(optionsStatusVacation)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Periodo'
                            name='period'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsPeriod}
                                onChange={onChangePeriod}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='range'
                            label='Fechas'
                            dependencies={['period']}
                        >
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                placeholder={['Fecha inicio', 'Fecha fin']}
                                dropdownClassName='picker-range-jb'
                                disabledDate={disabledDate}
                                format='DD-MM-YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button onClick={() => close()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                        >
                            Aplicar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default FiltersRequests