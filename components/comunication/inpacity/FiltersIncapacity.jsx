import React, { useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select } from 'antd';
import { optionsStatusPermits } from '../../../utils/constant';
import SelectPeople from '../../people/utils/SelectPeople';

const FiltersIncapacity = ({
    visible,
    listData = {},
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

    const itemPerson = useMemo(()=>{
        if(!visible) return [];
        let person = listData?.person || {};
        if(Object.keys(person).length <=0) return [];
        return [person];
    },[listData?.person, visible])

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
            >
                <Row>
                    <Col span={24}>
                        <SelectPeople
                            name='person__id'
                            label='Colaborador'
                            itemSelected={itemPerson}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusPermits}
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

export default FiltersIncapacity