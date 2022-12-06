import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, message, Modal } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { EyeOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";

const DocumentLog = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLoading(true);
    Axios.get(API_URL + `/person/document-log/`)
      .then((response) => {
        setLog(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        message.error("Error al cargar.");
        console.log(e);
      });
  }, []);

  const viewDetails = (data) => {
    if (data !== "") {
      setErrors(data.split(","));
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  /* Columns */
  const columns = [
    {
      title: "Fecha",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Operación",
      key: "operation",
      render: (row) => {
        return (
          <div>
            {row.operation == 1
              ? "Creación"
              : row.status == 2
              ? "Actualización"
              : "Eliminación"}
          </div>
        );
      },
    },
    {
      title: "Estatus",
      key: "status",
      render: (row) => {
        return (
          <div>
            {row.status == 1
              ? "Por sincronizar"
              : row.status == 2
              ? "Sincronizado"
              : "Error al sincronizar"}
          </div>
        );
      },
    },
    {
      title: "Detalles",
      key: "actions",
      render: (row) => {
        return row.errors != "" ? (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => viewDetails(row.errors)}
          />
        ) : null;
      },
    },
  ];

  return (
    <MainLayout currentKey={["documentsLog"]} defaultOpenKeys={["utilities","uploads"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Utilidades-Configuración</Breadcrumb.Item>
        <Breadcrumb.Item>Registro de errores</Breadcrumb.Item>
        <Breadcrumb.Item>Carga de documentos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <Table
              dataSource={log}
              key="tableDocumentLog"
              loading={loading}
              columns={columns}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            ></Table>
          </Col>
        </Row>
      </div>
      <Modal
        title="Errores"
        visible={isModalVisible}
        onOk={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {errors &&
          errors.map((e) => {
            return <p>{e}</p>;
          })}
      </Modal>
    </MainLayout>
  );
};

export default withAuthSync(DocumentLog);
