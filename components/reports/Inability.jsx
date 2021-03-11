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
  Typography,
} from "antd";
import SelectCollaborator from "../selects/SelectCollaboratorItemForm";
import SelectCompany from "../selects/SelectCompany";
import SelectDepartment from "../selects/SelectDepartment";
import Axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import { API_URL } from "../../config/config";
import moment from "moment";
import jsCookie from "js-cookie";

const InabilityReport = (props) => {
  const route = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { Title, Text } = Typography;

  const [incapacityList, setIncapacityList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [collaborator, setCollaborator] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [status, setStatus] = useState(null);
  const [dateOne, setDateOne] = useState(null);
  const [dateTwo, setDateTwo] = useState(null);

  const [personList, setPersonList] = useState([]);
  const [collaboratorList, setCollaboratorList] = useState([]);
  const [permissions, setPermissions] = useState({});

  /* Columnas de tabla */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "collaborator",
      key: "collaborator",
      render: (collaborator) => {
        return (
          <>
            {collaborator.first_name ? collaborator.first_name + " " : null}
            {collaborator.flast_name ? collaborator.flast_name : null}
          </>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: "collaborator",
      key: "company",
      render: (collaborator) => {
        return (
          <>
            {collaborator &&
            collaborator.job[0] &&
            collaborator.job[0].department &&
            collaborator.job[0].department.node
              ? collaborator.job[0].department.node.name
              : null}
          </>
        );
      },
    },
    {
      title: "Departamento",
      dataIndex: "collaborator",
      key: "department",
      render: (collaborator) => {
        return (
          <>
            {collaborator &&
            collaborator.job[0] &&
            collaborator.job[0].department
              ? collaborator.job[0].department.name
              : null}
          </>
        );
      },
    },
    {
      title: "Fecha inicio de incapacidad",
      dataIndex: "departure_date",
      key: "departure_date",
      render: (departure_date) => {
        return moment(departure_date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Fecha fin de incapacidad",
      dataIndex: "return_date",
      key: "return_date",
      render: (return_date) => {
        return moment(return_date).format("DD/MMM/YYYY");
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
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.inabilitys && (
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

  const download = async (item = null) => {
    let dataId = {};
    if (item) {
      dataId = {
        incapacity_id: item.id,
      };
    } else {
      if (collaborator) {
        dataId.person__id = collaborator;
      }
      if (companyId) {
        dataId.business_id = companyId;
      }

      if (departmentId) {
        dataId.department_id = departmentId;
      }
      if (status) {
        dataId.status = status;
      }

      if (dateOne && dateTwo) {
        dataId.start_date = dateOne;
        dataId.end_date = dateTwo;
      }
    }

    try {
      let response = await Axios.post(
        API_URL + `/person/incapacity/download_data/`,
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
        ? "Reporte_de_Incapacidades(" +
          (item.collaborator.first_name ? item.collaborator.first_name : null) +
          "_" +
          (item.collaborator.flast_name ? item.collaborator.flast_name : null) +
          "_" +
          (item.collaborator.mlast_name ? item.collaborator.mlast_name : null) +
          ").csv"
        : "Reporte_de_Incapacidades.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  const onchangeRange = (date, dateString) => {
    setDateOne(dateString[0]);
    setDateTwo(dateString[1]);
  };

  const getIncapacity = async (
    collaborator = null,
    company = null,
    department = null,
    status = null,
    date1 = null,
    date2 = null
  ) => {
    setLoading(true);
    try {
      setLoading(true);
      let url = `/person/incapacity/?`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }

      if (company) {
        url += `person__job__department__node__id=${company}&`;
      }

      if (department) {
        url += `person__job__department__id=${department}&`;
      }

      if (date1 && date2) {
        let d1 = moment(dateOne).format("YYYY-MM-DD");
        let d2 = moment(dateTwo).format("YYYY-MM-DD");
        url += `departure_date__gte=${d1}&departure_date__lte=${d2}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      data = data.map((item) => {
        item.key = item.id;
        return item;
      });

      setIncapacityList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const filter = async (values) => {
    setIncapacityList([]);

    setCollaborator(values.collaborator);
    setCompanyId(values.company);
    setDepartmentId(values.department);
    setStatus(values.status);
    getIncapacity(
      values.collaborator,
      values.company,
      values.department,
      values.status,
      dateOne,
      dateTwo
    );
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
    getIncapacity();
  }, []);
  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.report.function.export_inabilitys"))
        perms.inabilitys = true;
    });
    setPermissions(perms);
  };

  return (
    <>
      <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Title level={5}>Incapacidades</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={filter}
          >
            <Row gutter={[24, 8]}>
              <Col>
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectCompany
                  name="company"
                  label="Empresa"
                  onChange={onChangeCompany}
                  key="SelectCompany"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectDepartment
                  style={{ width: 100 }}
                  name="department"
                  companyId={companyId}
                  key="selectDepartament"
                />
              </Col>
              <Col>
                <Form.Item key="status" name="status" label="Estatus">
                  <Select
                    style={{ width: 100 }}
                    key="select"
                    options={optionStatus}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="send_date"
                  label="Fecha de envio"
                  key="send_date"
                  labelCol={24}
                >
                  <RangePicker onChange={onchangeRange} />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
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
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="columnRightFilter">
          {permissions.inabilitys && (
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
            dataSource={incapacityList}
            key="tableHolidays"
            loading={loading}
            columns={columns}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default InabilityReport;
