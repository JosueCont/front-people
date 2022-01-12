import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Table,
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  Typography,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../config/config";
import Axios from "axios";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import SelectCompany from "../selects/SelectCompany";
import SelectDepartment from "../selects/SelectDepartment";
import SelectJob from "../selects/SelectJob";
import SelectCollaborator from "../selects/SelectCollaborator";
import jsCookie from "js-cookie";
import { userCompanyId } from "../../libs/auth";
import SelectWorkTitle from '../selects/SelectWorkTitle';
import { connect } from 'react-redux'


const PayrollReport = ({ permissions, ...props}) => {
  const route = useRouter();
  const { Option } = Select;
  const { Title, Text } = Typography;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [personList, setPersonList] = useState([]);
  const [payrollList, setPayrollList] = useState([]);
  const [jobList, setJobList] = useState([]);

  /* Variables para el filtro */
  const [collaborator, setCollaborator] = useState(null);
  const [code, setCode] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  const [departmentId, setDepartmentId] = useState(null);
  const [job, setJob] = useState(null);
  
  let nodeId = userCompanyId();

  /* Columnas de tabla */
  const columns = [
    {
      title: "Num. trabajador",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Colaborador",
      dataIndex: "person",
      key: "collaborator",
      render: (person) => {
        return (
          <>
            {person.first_name ? person.first_name : null}{" "}
            {person.flast_name ? person.flast_name : null}{" "}
            {person.mlast_name ? person.mlast_name : null}
          </>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: "node",
      key: "node",
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
      title: "Fecha emisión",
      dataIndex: "timestamp",
      key: "timestamp",

      render: (date) => {
        return moment(date).format("DD-MMM-YYYY");
      },
    },
    {
      title: "Percepción",
      dataIndex: "total_perceptions",
      key: "total_perceptions",
    },
    {
      title: "Deducción",
      dataIndex: "total_deductions",
      key: "total_deductions",
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Días trabajados",
      dataIndex: "number_of_days_paid",
      key: "number_of_days_paid",
      render: (number) => {
        return parseInt(number);
      },
    },
    {
      title: "IMSS",
      dataIndex: "imss",
      key: "imss",
    },
    {
      title: "ISR",
      dataIndex: "Dias disponibles",
      key: "Dias disponibles",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.export_payrolls && (
              <DownloadOutlined onClick={() => download(item)} />
            )}
          </>
        );
      },
    },
  ];

  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
      job: null,
    });
    setCompanyId(val);
  };

  const onChangeDepartment = (val) => {
    form.setFieldsValue({
      job: null,
    });
    setDepartmentId(val);
  };

  const clearFilter = () => {
    form.setFieldsValue({
      collaborator: null,
      code: null,
      department: null,
      job: null,
    });
    getPayroll();
  };

  const filterReport = (values) => {
    setCollaborator(values.collaborator);
    setCode(values.code);
    setDepartmentId(values.department);
    setJob(values.job);

    getPayroll(values.collaborator, values.code, values.department, values.job);
    /* let d1 = null;
                let d2 = null;
                if (dateLoan) {
                    d1 = moment(`${dateLoan} 00:00:01`).tz("America/Merida").format();
                    d2 = moment(`${dateLoan} 23:59:00`).tz("America/Merida").format();
                    setTimestampGte(d1);
                    setTimestampLte(d2);
                }
                getPatroll(values.person__id, values.type, values.periodicity, d1, d2); */
  };

  const getPayroll = async (
    collaborator = null,
    code = null,
    department = null,
    job = null
  ) => {
    setLoading(true);
    setPayrollList([]);
    try {
      let info = { node: nodeId };
      if (collaborator) {
        info["collaborator"] = collaborator;
      }
      if (code) {
        info["code"] = code;
      }
      if (department) {
        info["department"] = department;
      }
      if (job) {
        info["job"] = job;
      }

      let response = await Axios.post(
        API_URL + `/payroll/payroll-voucher/get_report/`,
        info
      );

      let data = response.data;
      data = data.map((item) => {
        item.key = item.id;
        return item;
      });
      setPayrollList(data);
      /* setLendingList(data); */
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const download = async (item = null) => {
    let dataId = { node: nodeId };

    if (item) {
      dataId = {
        id: item.id,
      };
    } else {
      if (collaborator) {
        dataId.collaborator = collaborator;
      }
      if (code) {
        dataId.code = code;
      }
      /* if (company) {
                            dataId.company = company;
                        } */
      if (departmentId) {
        dataId.department = departmentId;
      }
      if (job) {
        dataId.job = job;
      }
    }

    try {
      let response = await Axios.post(
        API_URL + `/payroll/payroll-voucher/export_report/`,
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
        ? "Reporte_de_nomina(" +
          (item.person.first_name ? item.person.first_name : null) +
          "_" +
          (item.person.flast_name ? item.person.flast_name : null) +
          "_" +
          (item.person.mlast_name ? item.person.mlast_name : null) +
          ").csv"
        : "Reporte_de_nomina.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    /* getAllPersons(); */
    getPayroll();
  }, []);

  return (
    <>
      <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Title level={5}>Nóminas</Title>
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
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <Form.Item key="numUSer" name="code" label="Num. trabajador">
                  <Input style={{ width: 120 }} allowClear />
                </Form.Item>
              </Col>
              {/* <Col>
                                <SelectCompany
                                    onChange={onChangeCompany}
                                    style={{ width: 150 }}
                                    key="company"
                                    name="company"
                                    label="Empresa"
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
                <SelectWorkTitle />
              </Col>
              <Col>
                <SelectJob
                  name="job"
                  departmentId={departmentId}
                  label="Puesto"
                  style={{ width: 120 }}
                />
                {/* <Form.Item key="job" name="job" label="Puesto">
                                    <Select style={{ width: 120 }} options={jobList} allowClear />
                                </Form.Item> */}
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
          {permissions.export_payrolls && (
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
      <Row>
        <Col span={24}>
          <Table
            dataSource={payrollList}
            key="tableHolidays"
            columns={columns}
            scroll={{ x: 1300 }}
            loading={loading}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.report
  };
};

export default connect(mapState)(PayrollReport);
