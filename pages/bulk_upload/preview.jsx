import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, message, Modal } from "antd";
import router, { useRouter } from "next/router";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../../config/config";
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
const PreviewBulkUpload = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataUpload, setDataUpload] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  /* Columns */
  const columns = [
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    ,
    {
      title: "Departamento",
      dataIndex: "code_department",
      key: "person_department",
    },
    {
      title: "Puesto",
      dataIndex: "code_job",
      key: "job",
    },
    {
      title: "Estatus",
      key: "status_log",
      render: (row) => {
        return row.status_log != "" ? (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        ) : (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        );
      },
    },
    {
      title: "Guardado",
      key: "id",
      render: (row) => {
        return row.id == "" ? (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        ) : (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        );
      },
    },
    {
      title: "Sincronizado",
      key: "bulk_load_person",
      render: (row) => {
        return row.bulk_load_person && row.sync == 2 ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        );
      },
    },
    {
      title: "Detalles",
      key: "actions",
      render: (row) => {
        return row.status_log != "" ? (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => viewDetails(row.status_log)}
          />
        ) : row.sync == !2 ? (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => viewDetails("Error de sincronización")}
          />
        ) : null;
      },
    },
  ];

  const viewDetails = (data) => {
    if (data !== "") {
      setErrors(data.split(","));
      setIsModalVisible(true);
    }
  };

  useEffect(() => {
    if (props.formData) {
      Axios.post(
        API_URL + `/person/bulk-upload-person/upload_xls/`,
        props.formData
      )
        .then((response) => {
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

  useEffect(() => {}, [dataUpload]);

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
            credentials: {
              user: user_session.email,
              password: "",
            },
          };

          Axios.post(API_URL + "/person/person/massive_save_person/", data)
            .then((response) => {
              if (response.data.persons.length > 0) {
                setDataUpload(response.data.persons);
              }
              message.success("Guardado correctamente");
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
          <Button
            onClick={savePersons}
            className={"ml-20"}
            type="primary"
            size={{ size: "large" }}
            icon={<SaveOutlined />}
            disabled={disabledButton}
          >
            Guardar
          </Button>

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

const mapState = (state) => {
  return {
    formData: state.userStore.data_upload,
  };
};

export default connect(mapState)(withAuthSync(PreviewBulkUpload));
