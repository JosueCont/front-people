import {
  ClearOutlined,
  FilePdfTwoTone,
  FileTextTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  message,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SelectPaymentCalendar from "../../components/selects/SelectPaymentCalendar";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import MainLayout from "../../layout/MainLayout";
import WebApiPayroll from "../../api/WebApiPayroll";
import { messageError } from "../../utils/constant";
import { useRouter } from "next/router";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";
import SelectYear from "../../components/selects/SelectYear";

const PayrollVaucher = ({ ...props }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cfdis, setCfdis] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [calendar, setCalendar] = useState(null);

  const columns = [
    {
      title: "Num. trabajador",
      key: "code",
      render: (item) => {
        return item.payroll_person.person.code;
      },
    },
    {
      title: "Colaborador",
      key: "collaborator",
      render: (item) => {
        return !item.payroll_person.person.mlast_name
          ? item.payroll_person.person.first_name +
              " " +
              item.payroll_person.person.flast_name
          : item.payroll_person.person.first_name +
              " " +
              item.payroll_person.person.flast_name +
              " " +
              item.payroll_person.person.mlast_name;
      },
    },
    {
      title: "Periodo",
      key: "timestamp",
      render: (item) => {
        return `${item.payment_period.name}.- ${item.payment_period.start_date} - ${item.payment_period.end_date}`;
      },
    },
    {
      title: "Fecha emisión",
      key: "timestamp",
      render: (item) => {
        return item.emission_date;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (item) => {
        return (
          <>
            {item.id_facturama ? (
              <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                <FileTextTwoTone
                  onClick={() => downLoadFile(item, 1)}
                  style={{ fontSize: "25px" }}
                />
              </Tooltip>
            ) : (
              item.xml_file && (
                <a href={item.xml_file} target="_blank" download>
                  <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                    <FileTextTwoTone style={{ fontSize: "25px" }} />
                  </Tooltip>
                </a>
              )
            )}
            {item.id_facturama ? (
              <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                <FilePdfTwoTone
                  onClick={() => downLoadFile(item, 2)}
                  style={{ fontSize: "25px" }}
                />
              </Tooltip>
            ) : (
              item.pdf_file && (
                <a href={item.pdf_file} target="_blank" download>
                  <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                    <FilePdfTwoTone style={{ fontSize: "25px" }} />
                  </Tooltip>
                </a>
              )
            )}
          </>
        );
      },
    },
  ];

  const downLoadFile = (item, file) => {
    let data = {
      type_request: 3,
      type_file: file,
      id_facturama: item.id_facturama,
    };
    let url = `${getDomain(
      API_URL_TENANT
    )}/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`;

    downLoadFileBlob(
      url,
      `${item.payroll_person.person.rfc}_${item.payment_period.start_date}_${
        item.payment_period.end_date
      }.${file == 1 ? "xml" : "pdf"}`,
      "POST",
      data
    );
  };

  useEffect(() => {
    if (router.query && router.query.calendar && router.query.period) {
      form.setFieldsValue({
        calendar: router.query.calendar,
        period: router.query.period,
      });
      setCalendar(router.query.calendar);
      getVaucher(
        `calendar=${router.query.calendar}&period=${router.query.period}`
      );
    }
  }, [router.query]);

  const onFinish = (value) => {
    setLoading(true);
    let url = "";
    if (value.calendar && value.calendar != "")
      url = `calendar=${value.calendar}`;
    if (value.period && value.period != "")
      url = url + `&period=${value.period}`;
    if (value.person && value.person != "")
      url = url + `&person=${value.person}`;
    if (value.year && value.year != "") url = url + `&year=${value.year}`;
    getVaucher(url);
  };

  const getVaucher = (data) => {
    WebApiPayroll.getCfdiPayrrol(data)
      .then((response) => {
        setCfdis(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error(messageError);
        console.log(error);
        setLoading(false);
      });
  };

  const clearFilter = () => {
    form.resetFields();
    setPeriods([]);
    setCalendar(null);
    setCfdis([]);
    getVaucher("");
  };

  useEffect(() => {
    let period = [];
    if (calendar && props.payment_calendar.length > 0) {
      period = props.payment_calendar.find(
        (item) => item.id == calendar
      ).periods;
      setPeriods(
        period
          .sort((a, b) => a.name - b.name)
          .map((item) => {
            return {
              value: item.id,
              label: `${item.name}.- ${item.start_date} - ${item.end_date}`,
            };
          })
      );
    }
  }, [calendar, props.payment_calendar]);

  return (
    <MainLayout currentKey={["persons"]}>
      <Breadcrumb>
        <Breadcrumb.Item href="/home/persons">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <div className="top-container-border-radius">
          <Form
            name="filter"
            form={form}
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={onFinish}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectPaymentCalendar
                  setCalendarId={(value) => setCalendar(value)}
                  name="calendar"
                  style={{ width: 300 }}
                />
              </Col>
              {calendar && (
                <Col>
                  <Form.Item name="period" label="Periodo">
                    <Select
                      options={periods}
                      style={{ width: 250 }}
                      placeholder="Periodo"
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}
              <Col>
                <SelectCollaborator name="person" style={{ width: 250 }} />
              </Col>
              {!calendar && (
                <Col>
                  <SelectYear
                    size="middle"
                    name={"year"}
                    label={"Año"}
                    placeholder={"Año"}
                  />
                </Col>
              )}
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
                    <ClearOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form>
        </div>
        <Row>
          <Col span={24}>
            <Table
              dataSource={cfdis}
              key="tableHolidays"
              columns={columns}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    payment_calendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(PayrollVaucher);
