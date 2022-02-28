import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Layout, Modal, Row, Upload } from "antd";
import { useState } from "react";

const { Dragger } = Upload;

const ModalUploadFileDrag = ({
  title,
  setModal,
  visible,
  setFiles,
  ...porps
}) => {
  const [upload, setUpload] = useState([]);

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        if (info.fileList.length > 0) {
          let files = [];
          info.fileList.forEach((element) => {
            if (element.type == "text/xml") {
              files.push(element);
            }
          });
          if (files.length > 0) {
            setUpload(files);
          }
        }
      }
    },
  };

  const setSendFile = () => {
    setFiles(upload);
    setModal(false);
  };

  return (
    <Layout>
      <Modal
        maskClosable={false}
        title={title}
        centered
        visible={visible}
        onCancel={() => setModal(false)}
        footer={null}
        width={"50%"}
      >
        <Row>
          <Col span={24} style={{ marginBottom: 50 }}>
            <Dragger
              {...props}
              style={{
                marginTop: "30px",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Haga clic o arrastre el archivo a esta área para cargar
              </p>
              <p className="ant-upload-hint">
                Soporte para una carga única o masiva. Sólo se permitan archivos
                xml de recibos de nómina
              </p>
            </Dragger>
          </Col>
          <Col span={24} style={{ margin: "10px 0px", textAlign: "right" }}>
            <Button
              style={{ marginRight: "5px" }}
              onClick={() => setModal(false)}
            >
              Cancelar
            </Button>
            <Button type="primary" onClick={() => setSendFile()}>
              Enviar
            </Button>
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default ModalUploadFileDrag;
