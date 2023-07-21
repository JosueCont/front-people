import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, List, Modal, Row, Space, Spin, Upload, message } from 'antd'
import React, { useState } from 'react'
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";
import WebApiPayroll from '../../api/webApi'
const ModalUploadCatalog = ({isVisible=false, setIsVisible=null, node, ...props}) => {
    const [fileName, setFileName] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [messagesSuccess, setMessagesSuccess] = useState([])
    const [uploadFinally, setUploadFinally] = useState(false)
    const uploadFileCatalogs = async () => {
        if(!currentFile){
            message.error("No se ha cargado ninguna arvhivo")
            return
        }
        setLoading(true)
        let data = new FormData();
        data.append('file', currentFile)
        data.append('node_id', node?.id)
        try {
            let resp = await WebApiPayroll.uploadAllCatalogs(data)
            if(resp.status === 200){
                setLoading(false)
                message.info("Catalogos Cargados")
                setMessagesSuccess(resp.data)
                setUploadFinally(true)
            }
        } catch (error) {
            setLoading(false)
            message.error(error?.response?.data?.message)
        }
    }
    const closeModal = () =>{
        setIsVisible(false)
        setUploadFinally(false)
        setCurrentFile(null)
        setFileName(null)
        setLoading(false)
        setMessagesSuccess([])
    }
  return (
    <Modal 
        visible={isVisible}
        onCancel={closeModal}
        destroyOnClose
        footer={<>
            {
                uploadFinally ?
                <Button onClick={closeModal}>
                    Aceptar
                </Button>
                :
                <Space>
                    <Button onClick={closeModal}>
                        Cancelar
                    </Button> 
                    <Button onClick={uploadFileCatalogs}>
                        Enviar
                    </Button>
                </Space>
            }
        
        </>}
    >   
        <Spin spinning={loading}>
            <Row style={{ paddingTop:10 }}>
            <Col span={24}>
                <Alert
                style={{ marginBottom: 20 }}
                showIcon
                message={"Actualiza el archivo de catalogos y cargalo para actualizar los registros"}
                type={"info"}
                />
            </Col>
            <Col span={24}>
                <Space direction={"vertical"}>
                    <Upload
                    {...{
                        showUploadList: false,
                        beforeUpload: (file) => {
                        const isXlsx = file.name.includes(".xlsx");
                        if (!isXlsx) {
                            message.error(` no es un xlsx.`);
                        }
                        return isXlsx || Upload.LIST_IGNORE;
                        },
                        onChange(info) {
                        const { status } = info.file;
                        if (status !== "uploading") {
                            if (info.file) {
                            setFileName(info?.file?.originFileObj?.name);
                            setCurrentFile(info?.file?.originFileObj);
                            info.file = null;
                            } else {
                            setCurrentFile(null);
                            setFileName(null);
                            }
                        }
                        },
                    }}
                    >
                    {
                        !uploadFinally &&    
                            <Button
                            size="middle"
                            icon={<UploadOutlined />}
                            style={{ marginBottom: "10px" }}
                            disabled={loading}
                        >
                            Importar datos
                        </Button>
                    }
                    </Upload>
                    {
                        fileName &&
                        <p style={{ fontWeight:'bold' }}>
                            {"Archivo: "} {fileName}
                        </p>
                    }
                    
                </Space>
            </Col>
            <Col span={24}>
                {
                    messagesSuccess.length > 0 &&
                    <List
                        size="small"
                        header={null}
                        footer={null}
                        dataSource={messagesSuccess}
                        renderItem={(item) => <List.Item>
                                {item}
                            </List.Item>}
                    />
                }
                </Col>
            </Row>
        </Spin>
    </Modal>
  )
}
export default ModalUploadCatalog