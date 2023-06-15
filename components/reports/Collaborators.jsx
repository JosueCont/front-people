import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Table,
  Row,
  Col,
  Tooltip,
  Form,
  DatePicker,
  Button,
  Typography,
  ConfigProvider
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import SelectDepartment from "../selects/SelectDepartment";
import SelectJob from "../selects/SelectJob";
import SelectCollaborator from "../selects/SelectCollaborator";
import jsCookie from "js-cookie";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import { connect } from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";
import esES from "antd/lib/locale/es_ES";

const CollaboratorsReport = ({ permissions, ...props }) => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;

  const [loading, setLoading] = useState(false);
  const [dateOfAdmission, SetDateOfAdmission] = useState(null);
  const [collaboratorList, setCollaboratorList] = useState([]);

  const [collaborator, setCollaborator] = useState(null);
  const [department, setDepartment] = useState(null);
  const [job, setJob] = useState(null);

  const columns = [
    {
      title: "Colaborador",
      dataIndex: "name",
      key: "name",
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
      title: "Puesto",
      dataIndex: "job",
      key: "job",
    },
    {
      title: "Fecha de ingreso",
      dataIndex: "date_of_admission",
      key: "date_of_admission",
      render: (date) => {
        return date ? moment(date).format("DD / MM / YYYY") : null;
      },
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.export_collaborators && (
              <DownloadOutlined onClick={() => download(item)} />
            )}
          </>
        );
      },
    },
  ];

  const download = async (item = null) => {
    let dataId = { node: props.currentNode.id };
    if (item) {
      dataId = {
        id: item.id,
      };
    } else {
      if (collaborator) {
        dataId.collaborator = collaborator;
      }
      if (department) {
        dataId.department = department;
      }
      if (job) {
        dataId.job = job;
      }
      if (dateOfAdmission) {
        dataId.date_of_admission = dateOfAdmission;
      }
    }

    try {
      let response = await Axios.post(
        API_URL + `/person/employee-report-export`,
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
        ? "Reporte_de_colaboradores(" + item.name + ").csv"
        : "Reporte_de_colaboradores.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  const getCollaborators = async (values = null) => {
    setCollaboratorList([]);
    setLoading(true);
    let QueryData = { node: props.currentNode.id };
    if (values && values.collaborator) {
      QueryData["collaborator"] = values.collaborator;
    }

    if (values && values.company) {
      QueryData["node"] = values.company.toString();
    }

    if (values && values.department) {
      QueryData["department"] = values.department;
    }
    if (values && values.job) {
      QueryData["job"] = values.job;
    }
    if (values && values.date_of_admission) {
      QueryData["date_of_admission"] = values.date_of_admission;
    }
    try {
      let response = await Axios.post(
        API_URL + `/person/employee-report/`,
        QueryData
      );
      let data = response.data;
      if (data.lenght === 1) {
        data = [data];
      }
      setCollaboratorList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartaments = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/department/`);
      let data = response.data.results;
      data = data.map((a, index) => {
        let item = {
          label: a.name,
          value: a.id,
          key: a.id + index,
        };
        return item;
      });
      setDepartmentList(data);
    } catch (error) {
      console.log(error);
    }
  };
  /* /business/department/ */

  const clearFilter = () => {
    form.resetFields();
    SetDateOfAdmission(null);
    // setDepartmentId(null);
    getCollaborators();
  };

  const filterReport = async (values) => {
    values["date_of_admission"] = dateOfAdmission;
    // setCompany(values.company);
    setCollaborator(values.collaborator);
    setDepartment(values.department);
    setJob(values.job);
    getCollaborators(values);
  };

  const changeDate = (date, dateString) => {
    SetDateOfAdmission(dateString);
  };

  useEffect(() => {
    if (props.currentNode) getCollaborators();
  }, [props.currentNode]);

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Colaboradores</Title>
          <hr />
        </Col>
        <Col>
          <Form
            name="filter"
            form={form}
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={filterReport}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectCollaborator style={{ width: 150 }} />
              </Col>
              <Col>
                <SelectDepartment
                  name="department"
                  companyId={props.currentNode && props.currentNode.id}
                  style={{ maxWidth: 150 }}
                />
              </Col>
              <Col>
                <SelectWorkTitle />
              </Col>
              <Col>
                <SelectJob
                  name="job"
                  label="Puesto"
                  style={{ maxWidth: 150 }}
                />
              </Col>
              <Col>
                <Form.Item
                  key="date_of_admission"
                  name="date_of_admission"
                  label="Fecha"
                >
                  <DatePicker format={"YYYY-MM-DD"} onChange={changeDate} locale = { locale }/>
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
          {permissions.export_collaborators && (
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
      <Row style={{ paddingRight: 20 }}>
        <Col span={24} style={{ marginTop: 20 }}>
          <ConfigProvider locale={esES}>
          <Table
            dataSource={collaboratorList}
            key="tableHolidays"
            columns={columns}
            loading={loading}
            scroll={{ x: 400 }}
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
    </>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.report,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(CollaboratorsReport);
