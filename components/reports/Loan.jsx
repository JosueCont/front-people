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
import Axios from "axios";
import { API_URL } from "../../config/config";
import { DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment-timezone";
import SelectCollaborator from "../selects/SelectCollaboratorItemForm";
import jsCookie from "js-cookie";
import { userCompanyId } from "../../libs/auth";

const LoanReport = (props) => {
  const route = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const { Title } = Typography;

  const [dateLoan, setDateLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personList, setPersonList] = useState([]);
  const [lendingList, setLendingList] = useState([]);

  /* PAra la descarga */
  const [person_id, setPerson_id] = useState(null);
  const [type, setType] = useState(null);
  const [periodicity, setPeriodicity] = useState(null);
  const [timestampGte, setTimestampGte] = useState(null);
  const [timestampLte, setTimestampLte] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [status, setStatus] = useState(null);
  let nodeId = userCompanyId();

  /* Columnas de tabla */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "periodicity",
      key: "Colaborador",
      render: (person, item) => {
        return (
          <>
            {item.person.first_name}{" "}
            {item.person.mlast_name ? item.person.mlast_name : null}
          </>
        );
      },
    },
    {
      title: "Tipo de préstamo",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        return type == "EMP" ? "Empresa" : "E-Pesos";
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
      title: "Plazo",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Periodicidad",
      dataIndex: "periodicity",
      key: "periodicity",
      render: (periodicity) => {
        return periodicity === 1
          ? "Semanal"
          : periodicity === 2
          ? "Catorcenal"
          : periodicity === 3
          ? "Quincenal"
          : "Mensual";
      },
    },
    {
      title: "Fecha de solicitud",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => {
        return moment(timestamp).format("DD/MM/YYYY");
      },
    },
    {
      title: "Cantidad solicitada",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Monto a pagar",
      dataIndex: "periodicity_amount",
      key: "periodicity_amount",
      render: (periodicity_amount, row) => {
        return row.balance === 0 ? 0 : periodicity_amount;
      },
    },
    {
      title: "Saldo",
      dataIndex: "balance",
      key: "balance",
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
          : status === 3
          ? "Rechazado"
          : "Pagado";
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.loans && (
              <DownloadOutlined onClick={() => download(item)} />
            )}
          </>
        );
      },
    },
  ];

  /* Options for select */
  const optionsType = [
    {
      label: "Empresa",
      value: "EMP",
      key: "EMP",
    },
    /* {
                    label: 'E-Pesos' ,
                    value: 'EPS',
                    key: 'EPS',
                } */
  ];

  /* Select status */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
    { value: 4, label: "Pagado", key: "opt_4" },
  ];

  const optionPeriodicity = [
    {
      label: "Semanal",
      value: "1",
      key: "Semanal",
    },
    {
      label: "Catorcenal",
      value: "2",
      key: "Catorcenal",
    },
    {
      label: "Quincenal",
      value: "3",
      key: "Quincenal",
    },
    {
      label: "Mensual",
      value: "4",
      key: "Mensual",
    },
  ];

  const changeDate = (date, strDate) => {
    setDateLoan(strDate);
  };

  const download = async (item = null) => {
    let dataId = { person__node__id: nodeId };

    if (item) {
      dataId = {
        loan_id: item.id,
      };
    } else {
      if (person_id) {
        dataId.person__id = person_id;
      }
      if (type) {
        dataId.type = type;
      }
      if (periodicity) {
        dataId.periodicity = periodicity;
      }
      if (timestampGte && timestampLte) {
        dataId.timestamp__gte = timestampGte;
        dataId.timestamp__lte = timestampLte;
      }
    }

    try {
      let response = await Axios.post(
        API_URL + `/payroll/loan/download_data/`,
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
        ? "Reporte_de_prestamos(" +
          (item.person.first_name ? item.person.first_name : null) +
          "_" +
          (item.person.flast_name ? item.person.flast_name : null) +
          "_" +
          (item.person.mlast_name ? item.person.mlast_name : null) +
          ").csv"
        : "Reporte_de_prestamos.csv";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  const getAllPersons = async () => {
    try {
      let response = await axiosApi.get(`/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const getLending = async (
    personID = null,
    type = null,
    periodicity = null,
    timestamp__gte = null,
    timestamp__lte = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = API_URL + `/payroll/loan/?person__node__id=${nodeId}&`;
      if (personID) {
        url += `person__id=${personID}&`;
      }
      if (type) {
        url += `type=${type}&`;
      }
      if (periodicity) {
        url += `periodicity=${periodicity}&`;
      }
      if (timestamp__gte && timestamp__lte) {
        url += `timestamp__gte=${timestamp__gte}&timestamp__lte=${timestamp__lte}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }

      let response = await Axios.get(url);
      let data = response.data.results;

      setLendingList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    form.setFieldsValue({
      person__id: null,
      type: null,
      periodicity: null,
      timestamp: null,
      status: null,
    });
    getLending();
  };

  const filterReport = (values) => {
    console.log(values);
    setPerson_id(values.person__id);
    setType(values.type);
    setPeriodicity(values.periodicity);
    setStatus(values.status);
    setLendingList([]);

    let d1 = null;
    let d2 = null;
    if (dateLoan) {
      d1 = moment(`${dateLoan} 00:00:01`).tz("America/Merida").format();
      d2 = moment(`${dateLoan} 23:59:00`).tz("America/Merida").format();
      setTimestampGte(d1);
      setTimestampLte(d2);
    }
    getLending(
      values.person__id,
      values.type,
      values.periodicity,
      d1,
      d2,
      values.status
    );
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getLending();
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.report.function.export_loans")) perms.loans = true;
    });
    setPermissions(perms);
  };

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Préstamos</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={filterReport}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectCollaborator name="person__id" style={{ width: 150 }} />
              </Col>
              <Col>
                <Form.Item key="type" name="type" label="Tipo">
                  <Select
                    style={{ width: 150 }}
                    options={optionsType}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  key="periodicity"
                  name="periodicity"
                  label="Periodicidad"
                >
                  <Select
                    style={{ width: 150 }}
                    options={optionPeriodicity}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item key="timestamp" name="timestamp" label="Fecha">
                  <DatePicker format={"YYYY/MM/DD"} onChange={changeDate} />
                </Form.Item>
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
          {permissions.loans && (
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
          <Table
            scroll={{ x: 1300 }}
            loading={loading}
            dataSource={lendingList}
            key="tableHolidays"
            columns={columns}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default LoanReport;
