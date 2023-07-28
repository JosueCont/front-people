import React, { useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { optionsStatusVacation } from '../../../utils/constant';
import SelectPeople from '../../people/utils/SelectPeople';

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
        user_filters_data
    } = useSelector(state => state.userStore);
    const [loading, setLoading] = useState(false);
    const period = Form.useWatch('period', formSearch);
    const statusIn = Form.useWatch('status__in', formSearch);
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

    const onChangeStatus = (value) => {
        let valid = !value?.includes('6')
            && value?.length
            >= optionsStatusVacation?.length;
        if (value.includes('6') || valid) {
            formSearch.setFieldsValue({
                status__in: ['6']
            })
            return;
        }
    }

    const optionsStatus = useMemo(() => {
        let all = [{ value: '6', key: '6', label: 'Todas' }];
        let options = all.concat(optionsStatusVacation);
        const map_ = item => ({ ...item, disabled: item.value !== '6' });
        if (statusIn?.includes('6')) return options.map(map_);
        return options;
    }, [statusIn])

    const itemPerson = useMemo(()=>{
        let person = user_filters_data?.person__id || {};
        if(Object.keys(person).length > 0) return [person];
        return [];
    },[user_filters_data?.person__id])

    const itemSupervisor = useMemo(()=>{
        let supervisor = user_filters_data?.immediate_supervisor || {};
        if(Object.keys(supervisor).length > 0) return [supervisor];
        return [];
    },[user_filters_data?.immediate_supervisor])

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
                    status__in: ['1']
                }}
            >
                <Row gutter={[16, 0]}>
                    {showCollaborator && (
                        <Col span={12}>
                            <SelectPeople
                                name='person__id'
                                label='Colaborador'
                                itemSelected={itemPerson}
                            />
                        </Col>
                    )}
                    {showSupervisor && (
                        <Col span={12}>
                            <SelectPeople
                                name='immediate_supervisor'
                                label='Jefe inmediato'
                                itemSelected={itemSupervisor}
                            />
                        </Col>
                    )}
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='status__in'
                            tooltip={`El estatus predeterminado es "Pendiente",
                                se activará en caso de que no se haya seleccionado ninguna opción.`}
                        >
                            <Select
                                // allowClear
                                showSearch
                                mode='multiple'
                                maxTagCount='responsive'
                                placeholder='Seleccionar una opción'
                                onChange={onChangeStatus}
                                options={optionsStatus}
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