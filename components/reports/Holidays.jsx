import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Tooltip,
  Select,
  Form,
  Button,
  Typography,
  ConfigProvider
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { DownloadOutlined } from "@ant-design/icons";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import SelectDepartment from "../../components/selects/SelectDepartment";
import jsCookie from "js-cookie";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import { connect } from "react-redux";
import esES from "antd/lib/locale/es_ES";
import {downLoadFileBlob} from "../../utils/functions";

const HolidaysReport = ({ permissions, ...props }) => {
  const [form] = Form.useForm();
  const { Title } = Typography;

  /* Variables para el filtro */
  const [colaborator, setColaborator] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [holidayList, setHolidayList] = useState([]);

  /* Columnas de tabla */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "collaborator",
      key: "collaborator",
      render: (collaborator) => {
        return (
          <>
            {collaborator.first_name ? collaborator.first_name : null}
            {collaborator.flast_name ? collaborator.flast_name : null}
          </>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: "business",
      key: "business",
      render: (bussines) => {
        return bussines == "N/A" ? "" : bussines;
      },
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
      render: (department) => {
        return department == "N/A" ? "" : department;
      },
    },
    {
      title: "Días solicitados",
      dataIndex: "days_requested",
      key: "days_requested",
    },
    {
      title: "Días disponibles",
      dataIndex: "collaborator",
      key: "available_days",
      render: (collaborator) => {
        return (
          <>{collaborator ? collaborator.Available_days_vacation : null}</>
        );
      },
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === 1
          ? "Pendiente"
          : status === 2
          ? "Aprobado"
          : "Rechazado";
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.export_vacations && (
              <DownloadOutlined onClick={() => download(item)} />
            )}
          </>
        );
      },
    },
  ];

  /* Select status */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const clearFilter = () => {
    form.setFieldsValue({
      collaborator: null,
      department: null,
      status: null,
    });
    getAllHolidays();
  };

  const filterHolidays = async (values) => {
    setColaborator(values.collaborator);
    setDepartmentId(values.department);
    getAllHolidays(values.collaborator, values.department, values.status);
  };

  const getAllHolidays = async (
    collaborator = null,
    department = null,
    status = null
  ) => {
    setHolidayList([]);
    setLoading(true);
    try {
      let url = `/person/vacation/?person__node__id=${props.currentNode.id}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }

      if (department) {
        url += `person__person_department__id=${department}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data;
      data.map((item, index) => {
        item.key = index;
        return item;
      });

      setHolidayList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const download = async (item = null) => {
    let dataId = { node: props.currentNode.id };

    if (item) {
      dataId = {
        vacation_id: item.id,
        collaborator: item.collaborator.id,
      };
    } else {
      if (colaborator) {
        dataId.collaborator = colaborator;
      }
      if (departmentId) {
        dataId.department = departmentId;
      }
    }

    try {
      // downLoadFileBlob(
      //     API_URL + `/person/vacation-report-export`,
      //     "Reporte_de_Vacaciones.xlsx",
      //     "POST",
      //     dataId
      // )
      let response = await Axios.post(
        API_URL + `/person/vacation-report-export`,
        dataId
      );
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = item
        ? "Reporte_de_Vacaciones(" +
          (item.collaborator.first_name ? item.collaborator.first_name : null) +
          "_" +
          (item.collaborator.flast_name ? item.collaborator.flast_name : null) +
          "_" +
          (item.collaborator.mlast_name ? item.collaborator.mlast_name : null) +
          ").csv"
        : "Reporte_de_Vacaciones.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    getAllHolidays();
  }, []);

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Vacaciones</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={filterHolidays}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectDepartment
                  name="department"
                  companyId={props.currentNode.id}
                />
              </Col>
              <Col>
                <SelectWorkTitle />
              </Col>
              <Col>
                <Form.Item key="status" name="status" label="Estatus">
                  <Select
                    style={{ width: 150 }}
                    key="select"
                    options={optionStatus}
                    allowClear
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
                <Tooltip title="Filtrar" color={"#3d78b9"} key={"#3d78b9"}>
                  <Button
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginTop: "auto",
                    }}
                    key="buttonFilter"
                    htmlType="submit"
                    loading={loading}
                  >
                    <SearchOutlined />
                  </Button>
                </Tooltip>
              </Col>
              <Col style={{ display: "flex" }}>
                <Tooltip
                  title="Limpiar filtro"
                  color={"#3d78b9"}
                  key={"#3d78b9"}
                >
                  <Button
                    onClick={clearFilter}
                    style={{
                      fontWeight: "bold",
                      marginTop: "auto",
                    }}
                    key="buttonClearFilter"
                  >
                    <SyncOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="columnRightFilter">
          {permissions.export_vacations && (
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => download()}
              key="btn_new"
              disabled={loading}
            >
              Descargar
            </Button>
          )}
        </Col>
      </Row>
      <Row style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <ConfigProvider locale={esES}>
          <Table
            loading={loading}
            dataSource={holidayList}
            key="tableHolidays"
            columns={columns}
            pagination={{showSizeChanger:true}}
            scroll={{ x: 350 }}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          ></Table>
          </ConfigProvider>
        </Col>
      </Row>
    </>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.report,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(HolidaysReport);
