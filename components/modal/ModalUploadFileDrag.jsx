import { InboxOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Col, Layout,Spin, message, Modal, Row, Tag, Upload, Typography } from "antd";
import { useState } from "react";
import _ from 'lodash'
const { Dragger } = Upload;
const { Text, Link,Title } = Typography;

const ModalUploadFileDrag = ({
  title,
  setVisible,
  visible,
  setFiles,
  extensionFile = "text/xml",
  ...props
}) => {
  const [upload, setUpload] = useState([]);
  const [numFiles, setNumFiles] = useState(null)
  const [loading, setLoading] = useState(false)

  const _props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      console.log(file.type)
      const isXMLZIP = (file.type === extensionFile  || file.type === 'application/zip');
      if (!isXMLZIP) {
        message.error(`${file.name} no es un archivo válido.`);
      }
      return isXMLZIP || Upload.LIST_IGNORE;
    },
    onDrop(info){
      setLoading(true)
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        if (info.fileList.length > 0) {
          setNumFiles(info.fileList.length)
          let files = [];
          info.fileList.forEach((element, i) => {
            files.push(element);
          });
          if (files.length > 0) {
            setUpload(files);
            setLoading(false)
          }
          info.file = null;
          info.fileList = [];

        }
      }
    },
  };

  const setSendFile = () => {
    setFiles(upload);
    setVisible(false);
  };

  const RenderFileUpload = () => {
    return _.take(upload, 200).map((item, i) => {
      return (
        <Tag
          key={i}
          style={{
            minWidth: "125px",
            textAlign: "center",
          }}
          color={"blue"}
        >
          {item.name}
        </Tag>
      );
    });
  };

  return (
      <Modal
        maskClosable={false}
        title={title}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        heigth={200}
        width={"50%"}
      >
        <Row>
          <Col span={24} >

            <Dragger
              {..._props}
              style={{
              }}
            >


              {upload.length > 0 ? (
                  <>
                    <FileTextOutlined style={{fontSize:50}} />
                    { upload.length>0 && <Title level={2}>{ upload.length} elementos</Title>  }
                  </>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Haga clic o arrastre el archivo a esta área para cargar
                  </p>
                  <p className="ant-upload-hint">
                    Soporte para una carga única o masiva. Sólo se permiten
                    archivos xml de recibos de nómina ó archivos .zip que contengan elementos xmls. En caso de elegir archivos comprimidos considerar que dentro sólo debe contener carpetas y xmls.
                  </p>
                </>
              )}
            </Dragger>

          </Col>

        </Row>
        <Row style={{marginTop:20}}>
          <Col span={24} style={{ textAlign: "right" }}>
            {
                loading && <Spin/>
            }
            <Button
                style={{ marginRight: "5px" }}
                onClick={() => setVisible(false)}
            >
              Cancelar
            </Button>
            {upload.length > 0 && (
                <Button type="primary" onClick={() => setSendFile()}>
                  Enviar
                </Button>
            )}
          </Col>
        </Row>
      </Modal>
  );
};

export default ModalUploadFileDrag;
