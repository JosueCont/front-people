import React, { useEffect, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import {
    Modal, Col, Space, Button, message,
    Spin, Upload
} from "antd";
import { ruleRequired } from "../../utils/rules";
import WebApiPayroll from "../../api/WebApiPayroll";
import WebApiPeople from "../../api/WebApiPeople";
import Router from "next/router";

const { Dragger } = Upload;

const ModalAddPersonCFI = ({
    visible,
    setVisible,
    node_id
}) => {

    useEffect(() => {
        setFile(null);
    }, [visible])

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const props = {
        name: 'file',
        multiple: true,
        accept: "application/pdf",
        beforeUpload(file) {
            const isPdf = file.name.includes(".pdf");
            if (!isPdf) {
                message.error(`${file.name} no es un pdf.`);
            }
            return isPdf || Upload.LIST_IGNORE;
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setFile(info.fileList[0].originFileObj)
            } else if (status === 'error') {
                message.error(`${info.file.name} error al cargar archivo`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },

    };

    const sendClose = async () => {
        try {
            setLoading(true)
            // console.log(node_id, file)
            let formData = new FormData();
            formData.append("File", file);
            formData.append("node_id", node_id);
            const addPerson = await WebApiPeople.sendFilesToAddPerson(formData);
            setLoading(false)
            if (addPerson?.data?.id) {
                message.success('Se agregó correctamente a ' + addPerson?.data?.first_name + addPerson?.data?.flast_name);
                setVisible(false);
                setTimeout(() => {
                    Router.push(`/home/persons/${addPerson?.data?.id}`)
                }, 2000)
            }
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Intenta nuevamente')
        }
    }
    return (
        <Modal
            title='Crear persona utilizando comprobante de situación fiscal'
            visible={visible}
            onCancel={()=> setVisible(false)}
            maskClosable={false}
            footer={[
                <Space>
                    <Button
                        onClick={() => setVisible(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={() => sendClose()}
                        disabled={file == null}
                    >
                        Enviar
                    </Button>

                </Space>
            ]}
        >
            <Spin tip="Cargando..." spinning={loading}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Selecciona o arrastra un archivo para cargarlo</p>
                    <p className="ant-upload-hint">
                        Soporte para una carga única o masiva. Prohibir estrictamente la carga de datos de la empresa u otros
                        archivos sensibles.
                    </p>
                </Dragger>
            </Spin>
        </Modal>
    )
}

export default ModalAddPersonCFI;