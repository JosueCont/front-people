import React, { useMemo, useState } from 'react';
import MyModal from '../../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';

const FiltersPlaces = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        list_org_nodes_options,
        load_org_nodes_options,
        list_jobs_options,
        load_jobs_options,
        list_ranks_options,
        load_ranks_options,
        list_places_options,
        load_places_options
    } = useSelector(state => state.orgStore);
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
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name__unaccent__icontains'
                            label='Nombre'
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Buscar por nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='description__unaccent__icontains'
                            label='Descripción'
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Buscar por descripción'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='job'
                            label='Puesto de trabajo'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_jobs_options}
                                loading={load_jobs_options}
                                optionFilterProp='children'
                            >
                                {list_jobs_options?.length > 0 && list_jobs_options.map(item => (
                                    <Select.Option value={`${item.id}`} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='hierarchical_level'
                            label='Nivel jerárquico'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_ranks_options}
                                loading={load_ranks_options}
                                optionFilterProp='children'
                            >
                                {list_ranks_options?.length > 0 && list_ranks_options.map(item => (
                                    <Select.Option value={`${item.id}`} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='organizational_node'
                            label='Nodo organizacional'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_org_nodes_options}
                                loading={load_org_nodes_options}
                                optionFilterProp='children'
                            >
                                {list_org_nodes_options?.length > 0 && list_org_nodes_options.map(item => (
                                    <Select.Option value={`${item.id}`} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='position_report'
                            label='Plaza a la que reporta'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_places_options}
                                loading={load_places_options}
                                optionFilterProp='children'
                            >
                                {list_places_options?.length > 0 && list_places_options.map(item => (
                                    <Select.Option value={`${item.id}`} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_active'
                            label='Estatus'
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={[
                                    { label: 'Todos', value: 'all', key: '3' },
                                    { label: 'Activo', value: 'true', key: '1' },
                                    { label: 'Inactivo', value: 'false', key: '2' }
                                ]}
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

export default FiltersPlaces