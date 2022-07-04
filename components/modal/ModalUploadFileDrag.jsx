import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Layout, message, Modal, Row, Tag, Upload } from "antd";
import { useState } from "react";

const { Dragger } = Upload;

const ModalUploadFileDrag = ({
  title,
  setVisible,
  visible,
  setFiles,
  extensionFile = "text/xml",
  ...porps
}) => {
  const [upload, setUpload] = useState([]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const isXML = file.type === extensionFile;
      if (!isXML) {
        message.error(`${file.name} no es un ${extensionFile}.`);
      }
      return isXML || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        if (info.fileList.length > 0) {
          let files = [];
          info.fileList.forEach((element, i) => {
            files.push(element);
          });
          if (files.length > 0) {
            setUpload(files);
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
    return upload.map((item, i) => {
      return (
        <Tag
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
    <Layout>
      <Modal
        maskClosable={false}
        title={title}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
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
              {upload.length > 0 ? (
                <RenderFileUpload />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Haga clic o arrastre el archivo a esta área para cargar
                  </p>
                  <p className="ant-upload-hint">
                    Soporte para una carga única o masiva. Sólo se permitan
                    archivos xml de recibos de nómina
                  </p>
                </>
              )}
            </Dragger>
          </Col>
          <Col span={24} style={{ margin: "10px 0px", textAlign: "right" }}>
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
    </Layout>
  );
};

export default ModalUploadFileDrag;
