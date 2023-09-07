import React, { useMemo, useState } from 'react';
import MyModal from '../../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import SelectPeople from '../../../people/utils/SelectPeople';
import { useSelector } from 'react-redux';

const FiltersHistory = ({
    visible,
    listData = {},
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
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

    const itemPerson = useMemo(() => {
        if (!visible) return [];
        let person = listData?.person || {};
        if (Object.keys(person).length <= 0) return [];
        return [person];
    }, [listData?.person, visible])

    return (
        <MyModal
            title='Configurar filtros'
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={500}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
                initialValues={{is_current: 'true'}}
            >
                <Row gutter={[16, 0]}>
                    <Col span={24}>
                        <Form.Item
                            name='position'
                            label='Plaza'
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
                    <Col span={24}>
                        <SelectPeople
                            name='person'
                            label='Persona'
                            itemSelected={itemPerson}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='is_current'
                            label='¿Es actual?'
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={[
                                    { label: 'Sí', value: 'true', key: '1' },
                                    { label: 'No', value: 'false', key: '2' }
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

export default FiltersHistory