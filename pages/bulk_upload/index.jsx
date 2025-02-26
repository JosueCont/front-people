import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import { Row, Col, Table, Breadcrumb, message, ConfigProvider } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { EyeOutlined } from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";
import { verifyMenuNewForTenant } from "../../utils/functions"
import esES from "antd/lib/locale/es_ES";

const ListBulkUpload = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataBulkUpload, setDataBulkUpload] = useState([]);

  /* Columns */
  const columns = [
    {
      title: "Responsable",
      dataIndex: "saved_by",
      key: "saved_by",
    },
    ,
    {
      title: "Fecha",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Estatus",
      key: "status",
      render: (row) => {
        return (
          <div>
            {row.status == 1
              ? "Por procesar"
              : row.status == 2
              ? "Procesando"
              : "Procesado"}
          </div>
        );
      },
    },
    {
      title: "Detalles",
      key: "actions",
      render: (row) => {
        return (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => {
              route.push("bulk_upload/" + row.id + "/details");
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    Axios.get(API_URL + `/person/bulk-upload-person/`)
      .then((response) => {
        setDataBulkUpload(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        message.error("Error al cargar.");
        console.log(e);
      });
  }, []);
  return (
    <MainLayout currentKey={["bulk_upload"]} defaultOpenKeys={["utilities","uploads"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Utilidades-Configuración</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Registro de log</Breadcrumb.Item>
        <Breadcrumb.Item>Carga masiva de personas</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <ConfigProvider locale={esES}>
            <Table
              dataSource={dataBulkUpload}
              key="tableLog"
              loading={loading}
              columns={columns}
              pagination={{showSizeChanger:true}}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            ></Table>
            </ConfigProvider>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(ListBulkUpload);
