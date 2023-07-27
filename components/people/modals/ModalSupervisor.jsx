import React, {
    useState,
    useMemo
} from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Space
} from 'antd';
import { ruleRequired } from '../../../utils/rules';
import { getFullName } from '../../../utils/functions';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SelectPeople from '../utils/SelectPeople';

const ModalSupervisor = ({
    visible = false,
    close = () => { },
    actionForm = async () => { },
    itemsSelected = [],
    typeAssign = 1
}) => {

    const [formAssign] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(async () => {
            let resp = await actionForm(values)
            if (resp && resp != 'ERROR') formAssign.setFields([{ name: 'immediate_supervisor', errors: [resp] }]);
            else if (!resp) onClose();
            setLoading(false)
        }, 2000)
    }

    const onClose = () => {
        close()
        formAssign.resetFields()
    }

    const disabledSubmit = useMemo(()=>{
        if(typeAssign == 1) return false;
        const some_ = item => item.immediate_supervisor;
        return !itemsSelected?.some(some_);
    },[itemsSelected, typeAssign])

    const watchCallback = (options) =>{
        if (typeAssign == 1) return options;
        if (itemsSelected?.length <= 0) return options;
        if (itemsSelected?.length > 1) return options;
        let ids = itemsSelected.map(item => item?.immediate_supervisor?.id);
        return options.filter(item => !ids.includes(item.id));
    }

    return (
        <MyModal
            title={typeAssign == 1
                ? 'Asignar jefe inmediato'
                : 'Asignar jefe suplente'
            }
            visible={visible}
            close={onClose}
            widthModal={450}
            closable={!loading}
        >
            <Form
                form={formAssign}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row>
                    <Col span={24}>
                        <SelectPeople
                            name='immediate_supervisor'
                            label={typeAssign == 1
                                ? 'Jefe inmediato'
                                : 'Suplete de jefe inmediato'
                            }
                            rules={[ruleRequired]}
                            watchParam={itemsSelected}
                            watchCallback={watchCallback}
                        />
                    </Col>
                    {itemsSelected?.length > 0 && (
                        <Col span={24} style={{ marginBottom: 24 }}>
                            <Space size={[0,0]} direction='vertical' style={{ width: '100%' }}>
                                <p style={{ marginBottom: 0, fontWeight: 500 }}>
                                    {itemsSelected?.length > 1
                                        ? 'Colaboradores a asignar'
                                        : 'Colaborador a asignar'
                                    }
                                </p>
                                <div className='items-selected scroll-bar'>
                                    {itemsSelected.length > 0 && itemsSelected.map((item, idx) => (
                                        <div key={idx}>
                                            <p>
                                                {getFullName(item)}
                                            </p>
                                            {!item.immediate_supervisor && typeAssign == 2 && (
                                                <ExclamationCircleOutlined style={{
                                                    color: 'red'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {itemsSelected?.some(item => !item.immediate_supervisor)
                                    && typeAssign == 2 && (
                                        <div style={{
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffff',
                                            padding: '4px 8px',
                                            borderRadius: 10,
                                            marginTop: 4
                                        }}>
                                            <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
                                            No se asignará el suplente a personas sin un jefe inmediato
                                        </div>
                                    )}
                            </Space>
                        </Col>
                    )}
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                            disabled={disabledSubmit}
                        >
                            Asignar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalSupervisor