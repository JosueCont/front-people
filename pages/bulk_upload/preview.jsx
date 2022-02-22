import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, message, Modal } from "antd";
import router, { useRouter } from "next/router";
import { connect } from "react-redux";
import { withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";
import {
  EyeOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import WebApiPeople from "../../api/WebApiPeople";
const PreviewBulkUpload = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataUpload, setDataUpload] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [arrColumns, setArrColumns] = useState([]);

  /* Columns */
  const columns = [
    {
      title: "Nombre",
      key: "name",
      render: (item) => {
        return item.name ? (
          <span>{item.name}</span>
        ) : (
          <span>
            {item.first_name + " " + item.flast_name + " " + item.mlast_name}
          </span>
        );
      },
    },
    {
      title: "Guardado",
      key: "id",
      render: (item) => {
        return item.status && item.status != "Exists" ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        );
      },
    },
    {
      title: "Detalles",
      key: "actions",
      render: (item) => {
        return (
          !item.status &&
          item.message && (
            <EyeOutlined
              className="icon_actions"
              onClick={() => viewDetails(item.message)}
            />
          )
        );
      },
    },
  ];

  const viewDetails = (data, type) => {
    setErrors(data);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (props.formData) {
      WebApiPeople.BulkMassivePerson(props.formData)
        .then((response) => {
          setArrColumns(columns);
          setDataUpload(response.data.data);
          setLoading(false);
          message.success("Excel importado correctamente.");
        })
        .catch((e) => {
          setLoading(false);
          message.error("Error al importar.");
          console.log(e);
        });
    }
  }, [props.formData]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const savePersons = () => {
    Modal.confirm({
      title: "¿Está seguro de guardar?",
      content:
        "Los datos importados correctos se guardarán, los que contengan errores serán omitidos ",
      icon: <ExclamationCircleOutlined />,
      okText: "Si, guardar",
      okButtonProps: {
        danger: true,
      },
      onCancel() {},
      cancelText: "Cancelar",
      onOk() {
        if (dataUpload && dataUpload.length > 0) {
          const user_session = JSON.parse(jsCookie.get("token"));
          setLoading(true);
          setDisabledButton(true);
          const data = {
            persons: dataUpload,
          };

          WebApiPeople.saveMassivePerson(data)
            .then((response) => {
              setDataUpload(response.data.persons);
              message.success("Cargado correctamente");
              setLoading(false);
            })
            .catch((response) => {
              setLoading(false);
              message.error("Error al agregar, intente de nuevo");
            });
        } else {
          message.error("No se encontraron datos.");
        }
      },
    });
  };

  return (
    <MainLayout currentKey="det-bulk">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Vista previa de carga</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify={"end"} style={{ padding: "1% 0" }}>
          {!disabledButton && (
            <Button
              onClick={savePersons}
              className={"ml-20"}
              type="primary"
              size={{ size: "large" }}
              icon={<SaveOutlined />}
            >
              Guardar
            </Button>
          )}

          <Button
            onClick={() => router.push("/home")}
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
              dataSource={dataUpload}
              key="tableLog"
              loading={loading}
              columns={arrColumns}
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
        {errors && <p>{errors}</p>}
      </Modal>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    formData: state.userStore.data_upload,
  };
};

export default connect(mapState)(withAuthSync(PreviewBulkUpload));
