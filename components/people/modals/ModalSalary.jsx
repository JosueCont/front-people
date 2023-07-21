import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Form,
    Row,
    Col,
    Alert,
    Checkbox,
    Typography,
    Space,
    message
} from 'antd';
import { useSelector } from 'react-redux';
import FileUpload from '../../jobbank/FileUpload';
import { FileExcelOutlined } from '@ant-design/icons';
import WebApiPayroll from '../../../api/WebApiPayroll';
import { downloadBLOB } from '../../../utils/functions';

const ModalSalary = ({
    visible = false,
    close = () => { },
    itemsKeys = []
}) => {

    const {
        user,
        current_node,
    } = useSelector(state => state.userStore);

    const [formSalary] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState([]);
    const [personsError, setPersonsError] = useState([]);
    const typeFile = ['xlsx'];

    const generate = Form.useWatch('generate_movement', formSalary);

    const onFinish = async (values) => {
        try {
            setLoading(true)
            let data = new FormData();
            data.append("modified_by", user?.id);
            data.append("File", file[0]);
            data.append("generate_movement", values?.generate_movement);
            let response = await WebApiPayroll.importSalaryModification(data);
            const filter_ = item => !item.status;
            let persons = response.data?.data?.length > 0
                ? response?.data?.data.filter(filter_)
                : [];
            if (persons?.length > 0) {
                let errors = [response?.data?.message];
                setTimeout(() => {
                    setLoading(false)
                    formSalary.setFields([{ name: 'file_name', errors }]);
                    setPersonsError(persons)
                }, 2000)
                return;
            }
            setTimeout(() => {
                onClose()
                setLoading(false)
            }, 1000)
            setTimeout(() => {
                message.success(response?.data?.message)
            }, 2000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            let errors = ['Hubo un error al cargar la información, por favor intente nuevamente o revise su archivo.']
            formSalary.setFields([{ name: 'file_name', errors }]);
        }
    }

    const onClose = () => {
        formSalary.resetFields();
        setFile([])
        setPersonsError([])
        close()
    }

    const downloadTemplate = async () => {
        try {
            let body = {
                person_id_array: itemsKeys,
                node: current_node?.id,
                generate_movement: generate,
            }
            let response = await WebApiPayroll.downloadTemplateSalary(body);
            downloadBLOB({ data: response.data, name: 'Actualizar salarios.xlsx' })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <MyModal
            title='Actualizar salarios'
            closable={!loading}
            visible={visible}
            widthModal={500}
            close={onClose}
        >
            <Form
                form={formSalary}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    generate_movement: false
                }}
            >
                <Row>
                    <Col span={24} style={{ marginBottom: 12 }}>
                        <Alert
                            message={`Esta sección te permite actualizar salarios de manera masiva,
                                descarga el template, modifica y vuelve a subirlo.`}
                            type='info'
                        />
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name='generate_movement'
                            valuePropName='checked'
                            noStyle
                        >
                            <Checkbox>¿Generar movimientos en IMSS?</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Typography.Link onClick={() => downloadTemplate()}>
                            <FileExcelOutlined /> Descargar plantilla
                        </Typography.Link>
                    </Col>
                    <Col span={24} style={{marginTop: 12}}>
                        <FileUpload
                            label='Seleccionar archivo'
                            keyName='file_name'
                            isRequired={true}
                            tooltip={`Archivos permitidos: ${typeFile.join(', ')}.`}
                            setFile={setFile}
                            typeFile={typeFile}
                            revertColor={true}
                            setNameFile={e => formSalary.setFieldsValue({
                                file_name: e
                            })}
                        />
                    </Col>
                    {personsError?.length > 0 && (
                        <Col span={24} style={{ marginBottom: 24 }}>
                            <Space size={[0,0]} direction='vertical' style={{ width: '100%' }}>
                                <p style={{ marginBottom: 0, fontWeight: 500 }}>
                                    Resumen no actualizado
                                </p>
                                <div className='items-selected scroll-bar' style={{ maxHeight: 150 }}>
                                    {personsError.map((item, idx) => (
                                        <div key={idx}>
                                            <p>{item.person}: <span style={{ color: '#ff4d4f' }}>{item.message}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </Space>
                        </Col>
                    )}
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            htmlType='submit'
                            loading={loading}
                        >
                            Generar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalSalary