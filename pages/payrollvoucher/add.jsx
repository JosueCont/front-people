import {
  Input,
  Layout,
  Breadcrumb,
  Button,
  Row,
  Col,
  Modal,
  message,
  Upload,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";

const { Dragger } = Upload;

const AddUploadPayroll = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const sendPayroll = async () => {
    if (files.length > 0) {
      let data = new FormData();
      //   data.append("File", element);
      files.forEach((element) => {
        data.append("File", element.originFileObj);
      });
      setLoading(true);

      Axios.post(API_URL + `/payroll/import-xml-payroll`, data)
        .then((response) => {
          if (response.data.message === "not_uuid") {
            message.error("El recibo no ha sido timbrado");
          }
          if (response.data.message === "success") {
            message.success(response.data.data.message);
            router.push("/payrollvoucher");
          }

          setLoading(false);
        })
        .catch((response) => {
          setLoading(false);
          message.error("Error al agregar, intente de nuevo");
        });
    } else {
      message.error("Debe cargar al menos 1 xml");
    }
  };

  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
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
            setFiles(files);
          }
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} recibo cargado correctamente.`);
      } else if (status === "error") {
        message.error(`${info.file.name} error al cargar el recibo.`);
      }
    },
  };

  return (
    <MainLayout currentKey="9">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/payrollvoucher" })}
        >
          Recibos de nómina
        </Breadcrumb.Item>
        <Breadcrumb.Item>Agregar recibos de nómina</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <div className="container-border-radius">
          <Col span={24}>
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
                    Haga clic o arrastre el archivo a esta área para cargar{" "}
                  </p>
                  <p className="ant-upload-hint">
                    Soporte para una carga única o masiva. Sólo se permitan
                    archivos xml de recibos de nómina
                  </p>
                </Dragger>
              </Col>
              <Col span={24} style={{ margin: "10px 0px", textAlign: "right" }}>
                <Button
                  style={{ marginRight: "5px" }}
                  onClick={() => router.push({ pathname: "/payrollvoucher" })}
                >
                  Regresar
                </Button>
                <Button type="primary" onClick={() => sendPayroll()}>
                  Guardar
                </Button>
              </Col>
            </Row>
          </Col>
        </div>
      </Content>
    </MainLayout>
  );
};
export default withAuthSync(AddUploadPayroll);
