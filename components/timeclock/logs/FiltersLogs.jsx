import React, { useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, DatePicker } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import SelectPeople from '../../people/utils/SelectPeople';
import { optionsTypeEvents } from '../../../utils/constant';

const FiltersLogs = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        list_companies,
        load_companies,
        list_work_centers_options,
        load_work_centers_options,
        timeclock_filters_data
    } = useSelector(state => state.timeclockStore);
    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
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
                    workcenter: 'all'
                }}
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <SelectPeople
                            name='person'
                            label='Colaborador'
                            itemSelected={timeclock_filters_data?.person
                                ? [timeclock_filters_data.person]
                                : []
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Tipo'
                            name='type'
                        >
                            <Select
                                allowClear
                                placeholder='Selecciona una opción'
                                notFoundContent='No se encontraron resultados'
                                options={optionsTypeEvents}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='timestamp__date'
                            label='Fecha'
                        >
                            <DatePicker
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                style={{ width: '100%' }}
                                inputReadOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Empresa'
                            name='node'
                        >
                            <Select
                                showSearch
                                disabled={load_companies}
                                loading={load_companies}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                <Select.Option value='all' key='all'>Todas</Select.Option>
                                {list_companies?.length > 0
                                    && list_companies?.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Centro de trabajo'
                            name='workcenter'
                        >
                            <Select
                                showSearch
                                disabled={load_work_centers_options}
                                loading={load_work_centers_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                <Select.Option value='all' key='all'>Todas</Select.Option>
                                {list_work_centers_options?.length > 0
                                    && list_work_centers_options?.map(item => (
                                        <Select.Option value={`${item.id}`} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                            </Select>
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

export default FiltersLogs