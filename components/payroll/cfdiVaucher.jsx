import {
  ClearOutlined,
  FilePdfTwoTone,
  FileTextTwoTone,
  SearchOutlined,
  StopOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
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
import WebApiPayroll from "../../api/WebApiPayroll";
import { messageError } from "../../utils/constant";
import { useRouter } from "next/router";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";
import SelectYear from "../../components/selects/SelectYear";
import GenericModal from "../modal/genericModal";

const CfdiVaucher = ({
  calendar = null,
  period = null,
  viewFilter = true,
  setKeys,
  ...props
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cfdis, setCfdis] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [calendarSelect, setCalendarSelect] = useState(null);
  const [personsKeys, setPersonsKeys] = useState([]);
  const [genericModal, setGenericModal] = useState(false);

  const columns = [
    {
      title: "Num. trabajador",
      key: "collaborator",
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
      // fixed: "right",
      title: () => {
        return (
          <>
            {!viewFilter && (
              <Dropdown overlay={menuGeneric}>
                <Button
                  style={{
                    background: "#434343",
                    color: "#ffff",
                  }}
                  size="small"
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
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
            {!viewFilter && (
              <Tooltip title="Cancelar" color={"#3d78b9"} key={"#3d78b9"}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<StopOutlined />}
                  size={"large"}
                  onClick={() => {
                    props.clickCancelStamp(item.id);
                  }}
                />
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  const menuGeneric = () => {
    return (
      <Menu>
        {personsKeys.length > 0 && (
          <Menu.Item
            key="2"
            onClick={() => props.clickCancelStamp(2)}
            icon={<StopOutlined />}
          >
            Cancelar cfdis seleccionados
          </Menu.Item>
        )}
      </Menu>
    );
  };

  useEffect(() => {
    if (calendar && period) {
      if (viewFilter)
        form.setFieldsValue({
          calendar: calendar,
          period: period,
        });
      setCalendarSelect(calendar);
      getVoucher(`calendar=${calendar}&period=${period}`);
    }
  }, [router.query]);

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

  const onFinish = (value) => {
    setLoading(true);
    let url = `node=${props.currentNode.id}`;
    if (value.calendar && value.calendar != "")
      url = url + `&calendar=${value.calendar}`;
    if (value.period && value.period != "")
      url = url + `&period=${value.period}`;
    if (value.person && value.person != "")
      url = url + `&person=${value.person}`;
    if (value.year && value.year != "") url = url + `&year=${value.year}`;
    getVoucher(url);
  };

  const getVoucher = (data) => {
    setLoading(true);
    setCfdis([]);
    WebApiPayroll.getCfdiPayrrol(data)
      .then((response) => {
        let cfdi_data = response.data.map((item) => {
          item.key = item.id;
          return item;
        });
        setCfdis(cfdi_data);
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
    setCalendarSelect(null);
    setCfdis([]);
    getVoucher("");
  };

  useEffect(() => {
    let periodos = [];
    if (calendarSelect && props.payment_calendar.length > 0) {
      periodos = props.payment_calendar.find(
        (item) => item.id == calendarSelect
      ).periods;
      setPeriods(
        periodos
          .sort((a, b) => a.name - b.name)
          .map((item) => {
            return {
              value: item.id,
              label: `${item.name}.- ${item.start_date} - ${item.end_date}`,
            };
          })
      );
    }
  }, [calendarSelect, props.payment_calendar]);

  const rowSelectionPerson = {
    selectedRowKeys: personsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsKeys(selectedRowKeys);
      setKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <div className="container" style={{ width: "100%" }}>
        {viewFilter && (
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
                    setCalendarId={(value) => setCalendarSelect(value)}
                    name="calendar"
                    style={{ width: 300 }}
                  />
                </Col>
                {calendarSelect && (
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
                {!calendarSelect && (
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
        )}
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
              rowSelection={rowSelectionPerson}
            />
          </Col>
        </Row>
      </div>
      {genericModal && (
        <GenericModal
          visible={genericModal}
          setVisible={setGenericModal}
          title={"Cancelar nómina"}
          viewActionButton={true}
          actionButton={cancelStamp}
          titleActionButton={"Cancelar nómina"}
        >
          <Row>
            <Alert
              style={{ width: "100%" }}
              description={
                "Al cancelar nómina se debera iniciar el proceso de cierre de nómina de nuevo. Para poder completar la cancelación es necesario capturar el motivo por el caul se cancela."
              }
              type={"warning"}
              showIcon
            />
            <Row
              style={{
                width: "100%",
                marginTop: "5px",
              }}
            >
              <Input.TextArea
                id="motive"
                placeholder="Capture el motivo de cancelacion."
              />
            </Row>
          </Row>
        </GenericModal>
      )}
    </>
  );
};
const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    payment_calendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(CfdiVaucher);
