import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Modal, message, Button } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import {
  EyeOutlined,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const DetailsBulkUpload = () => {
  const route = useRouter();
  const { id } = route.query;
  const [logRegister, setLogRegister] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Axios.get(
        API_URL +
          `/person/Log-external-services/?person__bulk_load_person=${id}`
      )
        .then((response) => {
          setLogRegister(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          message.error("Error al cargar.");
          console.log(e);
        });
    }
  }, [id]);

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
      title: "Persona",
      dataIndex: "person",
      key: "person",
    },

    {
      title: "Estatus",
      key: "status_log",
      render: (row) => {
        return row.errors != "" ? (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        ) : (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        );
      },
    },
    {
      title: "Guardado",
      key: "guardado",
      render: (row) => {
        return row.person == "" ? (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        ) : (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        );
      },
    },
    {
      title: "Sincronización",
      key: "status",
      render: (row) => {
        return (
          <div>
            {row.status == 1
              ? "Por sincronizar"
              : row.status == 2
              ? "Sincronizado"
              : "Error de sincronización"}
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
    <MainLayout currentKey="det-bulk">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/bulk_upload" })}
        >
          Cargas masivas
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detalles de carga masiva</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify={"end"} style={{ padding: "1% 0" }}>
          <Button
            onClick={() => route.push("/bulk_upload")}
            className={"ml-20"}
            type="primary"
            size={{ size: "large" }}
            icon={<ArrowLeftOutlined />}
          >
            Regresar
          </Button>
        </Row>

        <Row>
          <Col span={24}>
            <Table
              dataSource={logRegister}
              key="tableLog"
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
        title="Errores en la carga"
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
export default DetailsBulkUpload;
