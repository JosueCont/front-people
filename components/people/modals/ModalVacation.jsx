import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Form,
    Row,
    Col,
    Alert,
    message
} from 'antd';
import FileUpload from '../../jobbank/FileUpload';
import WebApiPayroll from '../../../api/WebApiPayroll';

const ModalVacation = ({
    visible = false,
    close = () => { },
}) => {

    const [formVacation] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState([]);
    const typeFile = ['xlsx'];

    const onFinish = async () => {
        try {
            setLoading(true)
            let data = new FormData();
            data.append('File', file[0])
            let response = await WebApiPayroll.importVacationModification(data);
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
            let errors = ['Hubo un error al cargar la información, por favor intente nuevamente o verifique que el formato del archivo sea correcto.']
            formSalary.setFields([{ name: 'file_name', errors }]);
        }
    }

    const onClose = () => {
        formVacation.resetFields();
        setFile([])
        close()
    }

    return (
        <MyModal
            title='Actualizar vacaciones'
            closable={!loading}
            visible={visible}
            widthModal={500}
            close={onClose}
        >
            <Form
                form={formVacation}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    generate_movement: false
                }}
            >
                <Row>
                    <Col span={24} style={{ marginBottom: 12 }}>
                        <Alert
                            message={`Esta sección te permite actualizar las vacaciones de manera masiva,
                                descarga el reporte, modifica la columna "Días de vacaciones disponibles" y vuelve a subirlo.`}
                            type='info'
                        />
                    </Col>
                    <Col span={24}>
                        <FileUpload
                            label='Seleccionar archivo'
                            keyName='file_name'
                            isRequired={true}
                            tooltip={`Archivos permitidos: ${typeFile.join(', ')}.`}
                            setFile={setFile}
                            typeFile={typeFile}
                            revertColor={true}
                            setNameFile={e => formVacation.setFieldsValue({
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
                            Actualizar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalVacation