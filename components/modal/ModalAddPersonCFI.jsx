import React,{ useEffect, useState} from "react";
import {  InboxOutlined } from '@ant-design/icons';
import {  
    Modal,Col, Space,Button, message,
    Spin,Upload} from "antd";
import { ruleRequired } from "../../utils/rules";
import WebApiPayroll from "../../api/WebApiPayroll";
import WebApiPeople from "../../api/WebApiPeople";
const { Dragger } = Upload;


const ModalAddPersonCFI = ({visible,setVisible,node_id}) => {
    useEffect(() => {
        setFile(null)
    },[visible])

    const [file,setFile] = useState(null);
    const [loading,setLoading] = useState(false);

    const props = {
        name: 'file',
        multiple: true,
        accept:"application/pdf",
        beforeUpload(file){
            const isPdf = file.name.includes(".pdf");
            if (!isPdf) {
              message.error(`${file.name} no es un pdf.`);
            }
            return isPdf || Upload.LIST_IGNORE;
        },
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} se cargó el archivo con exito`);
            setFile(info.fileList[0].originFileObj)
          } else if (status === 'error') {
            message.error(`${info.file.name} error al cargar archivo`);
          }
        },
        onDrop(e) {
          console.log('Dropped files', e.dataTransfer.files);
        },
        
      };

      const sendClose = async() => {
        try {
            setLoading(true)
            console.log(node_id,file)
            let formData = new FormData();
            formData.append("File", file);
            formData.append("node_id", node_id);
            const addPerson = await WebApiPeople.sendFilesToAddPerson(formData);
            setLoading(false)
            if(addPerson?.data?.message){
                message.success(addPerson?.data?.message)
                
            }else{
                message.error('Error al mandar archivo')
            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
      }
    return(
        <Modal
            title='Crear persona utilizando comprobante de situación fiscal'
            centered
            visible={visible}
            onCancel={setVisible}
            footer={
                <Col >
                  <Space>
                      <Button
                        size="large"
                        htmlType="button"
                        onClick={() => setVisible(false)}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                      >
                        Cancelar
                      </Button>
                    
                      <Button
                        size="large"
                        htmlType="button"
                        onClick={() => sendClose()}
                        //disabled={check.length < 1}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                      >
                        Enviar
                      </Button>

                  </Space>
                </Col>
              }
            width={"70%"}>
                <Spin tip="Cargando..." spinning={loading}> 
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Selecciona o arrastra un archivo para cargrlo</p>
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