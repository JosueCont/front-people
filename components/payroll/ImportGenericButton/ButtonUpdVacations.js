import { Alert, Button, Col, Modal, Row, Spin, Upload, message } from 'antd'
import React, {useState} from 'react'
import WebApiPayroll from "../../../api/WebApiPayroll";

import {
    DownloadOutlined,
    DownOutlined,
    UploadOutlined,
    FileExcelOutlined,
    RightOutlined,
  } from "@ant-design/icons";


const ButtonUpdVacations = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [personsListErrors, setPersonsListErrors] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    const importDataVacations = async () => {
        let formdata = new FormData();
        formdata.append("File", fileList[0]);
        setLoading(true)
        try {
            const resp = await WebApiPayroll.importVacationModification(formdata);
            console.log(resp);
            message.info(resp.data.message);    
            setLoading(false);
            setFileName(null);
            setCurrentFile(null);
            setShowModal(false)
            setFileList([])
          } catch (e) {
            setLoading(false);
            message.error(
              "Hubo un error al cargar la información, por favor intente nuevamente o verifique que el formato de archivo sea correcto."
            );
            console.log(e);
          }
    }

    const closeModal = () => {
        setShowModal(false);
        setFileName(null);
        setCurrentFile(null);
        setFileList([])
    }

    return (
    <> 
        <Button
            style={{
            //   marginBottom: "10px",
            paddingTop: 0,
            background: "#434343",
            color: "#ffff",
            }}
            onClick={() => setShowModal(true)}
            // style={menuDropDownStyle}
        >
            Actualizar vacaciones
        </Button>
        <Modal
            title={'Actualizar vacaciones'}
            visible={showModal}
            onOk={() => importDataVacations()}
            onCancel={() => closeModal()}
            okText="Aceptar"
            confirmLoading={loading}
            cancelText="Cancelar"
        >
            <Row>
                <Col span={24}>
                    <Alert
                        style={{ marginBottom: 20 }}
                        showIcon
                        message={'Esta sección te permite actualizar las vacaciones de manera masiva, descarga el reporte de vacaciones, puedes modificar la columna "Días de vacaciones disponibles" y por último importa el excel para realizar los ajustes.'}
                        type={"info"}
                    />
                    <Spin spinning={loading} tip="Cargando archivo..." >
                    <Upload
                        maxCount={1}
                        {...{
                            onRemove: (file) => {
                                const index = fileList.indexOf(file);
                                const newFileList = fileList.slice();
                                newFileList.splice(index, 1);
                                setFileList(newFileList);
                            },
                            beforeUpload: (file) => {
                                if (file) {
                                    const { status } = file;
                                    const isXlsx = file.name.includes(".xlsx");
                                    if (!isXlsx) {
                                        message.error(`${file.name} no es un xlsx.`);
                                    }else{
                                        setFileName(file?.originFileObj?.name);
                                        setCurrentFile(file?.originFileObj);
                                        setFileName(file?.originFileObj?.name);
                                        setFileList([file])    
                                    }
                                } else {
                                    setCurrentFile(null);
                                    setFileName(null);
                                    setFileList([])
                                }   
                                return false;
                            },
                            fileList,
                            
                        }}
                        >
                        <Button
                            size="middle"
                            icon={<UploadOutlined />}
                            style={{ marginBottom: "10px" }}
                        >
                            Importar datos
                        </Button>
                    </Upload>
                    </Spin>
                </Col> 
            </Row>
        </Modal>
    </>
  )
}

export default ButtonUpdVacations