import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Form,
    Alert,
    Checkbox,
    Row,
    Col
} from 'antd';
import FileUpload from '../../jobbank/FileUpload';
import { useSelector } from 'react-redux';

const ModalImport = ({
    visible = false,
    close = () => { },
    actionForm = () => { }
}) => {

    const {
        general_config
    } = useSelector(state => state.userStore);
    const [formImport] = Form.useForm();
    const [file, setFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const typeFile = ['xlsx'];

    const onFinish = (values) => {
        setLoading(true)
        if (file?.length > 0) values.file = file[0];
        setTimeout(() => {
            actionForm(values)
            setLoading(false)
            onClose()
        }, 2000)
    }

    const onClose = () => {
        formImport.resetFields();
        setFile([])
        close()
    }

    return (
        <MyModal
            title='Importar personas'
            closable={!loading}
            visible={visible}
            widthModal={400}
            close={onClose}
        >
            <Form
                form={formImport}
                onFinish={onFinish}
                initialValues={{
                    types_imss: true,
                    types_stamp: true
                }}
                layout="vertical"
            >
                <Row>
                    {general_config?.nomina_enabled && (
                        <>
                            <Col span={24}>
                                <label style={{ padding: '0px 0px 8px' }}>
                                    Selecciona los datos que estas por importar
                                </label>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="types_imss"
                                    valuePropName="checked"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox>IMSS</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="types_stamp"
                                    valuePropName="checked"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox>Timbrado</Checkbox>
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    <Col span={24}>
                            <Alert
                                description="Para actujalizar personas el sistema hace uso del RFC o CURP, si no se encuentra ninguno de éstos entonces el sistema generará una nuevo persona."
                                type="info"
                            />
                        <br/>
                        <FileUpload
                            label='Seleccionar archivo'
                            keyName='file_name'
                            isRequired={true}
                            tooltip={`Archivos permitidos: ${typeFile.join(', ')}.`}
                            setFile={setFile}
                            typeFile={typeFile}
                            revertColor={true}
                            setNameFile={e => formImport.setFieldsValue({
                                file_name: e
                            })}
                        />
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>

                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            htmlType='submit'
                            loading={loading}
                        >
                            Cargar
                        </Button>
                    </Col>


                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalImport