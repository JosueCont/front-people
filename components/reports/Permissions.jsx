import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Table,
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Tooltip,
  Button,
  Typography,
  InputNumber,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";
import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import jsCookie from "js-cookie";
import { userCompanyId } from "../../libs/auth";

const PermissionsReport = (props) => {
  const route = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const { Title } = Typography;

  /* Variables para el filtro */
  const [colaborator, setColaborator] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();

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
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Días solicitados",
      dataIndex: "requested_days",
      key: "requested_days",
    },
    {
      title: "Fecha de salida",
      dataIndex: "departure_date",
      key: "departure_date",
      render: (date) => {
        return moment(date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Fecha de regreso",
      dataIndex: "return_date",
      key: "return_date",
      render: (date) => {
        return moment(date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <>
            {status && status == 1
              ? "Pendiente"
              : status && status == 2
              ? "Aprobado"
              : "Rechazado"}
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.permits && (
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
    getPermissions();
  };

  const filterPermission = async (values) => {
    setColaborator(values.collaborator);
    setDepartmentId(values.department);

    getPermissions(values.collaborator, values.department, values.status);
  };

  const getPermissions = async (
    collaborator = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    setPermissionsList([]);
    try {
      let url = `/person/permit/?person__node__id=${nodeId}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }

      if (department) {
        url += `person__person_department__id=${department}&`;
      }

      if (status) {
        url += `status=${status}&`;
      }
      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      setPermissionsList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const download = async (item = null) => {
    let dataId = { business_id: nodeId };
    if (item) {
      dataId = { permit_id: item.id };
    } else {
      if (colaborator) {
        dataId.person__id = colaborator;
      }

      if (departmentId) {
        dataId.department_id = departmentId;
      }
    }

    try {
      let response = await Axios.post(
        API_URL + `/person/permit/download_data/`,
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
        ? "Reporte_de_permisos(" +
          (item.collaborator.first_name ? item.collaborator.first_name : null) +
          "_" +
          (item.collaborator.flast_name ? item.collaborator.flast_name : null) +
          "_" +
          (item.collaborator.mlast_name ? item.collaborator.mlast_name : null) +
          ").csv"
        : "Reporte_de_permisos.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
    });
    setCompanyId(val);
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getPermissions();
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.report.function.export_permits"))
        perms.permits = true;
    });
    setPermissions(perms);
  };

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Permisos</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={filterPermission}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              {/* <Col>
                <SelectCompany
                  name="company"
                  label="Empresa"
                  onChange={onChangeCompany}
                  key="SelectCompany"
                  style={{ width: 150 }}
                />
              </Col> */}
              <Col>
                <SelectDepartment
                  name="department"
                  companyId={nodeId}
                  key="selectDepartament"
                />
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
          {permissions.permits && (
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => download()}
              key="btn_new"
            >
              Descargar
            </Button>
          )}
        </Col>
      </Row>
      <Row style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Table
            dataSource={permissionsList}
            key="tableHolidays"
            columns={columns}
            loading={loading}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultadoss.",
            }}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default PermissionsReport;
