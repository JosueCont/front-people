import {
  ClearOutlined,
  FilePdfTwoTone,
  FileTextTwoTone,
  SearchOutlined,
  StopOutlined,
  EllipsisOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Dropdown,
  Space,
  Form,
  Input,
  Menu,
  message,
  Row,
  Select,
  Table,
  Tooltip,
  Pagination,
} from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SelectPaymentCalendar from "../../components/selects/SelectPaymentCalendar";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import WebApiPayroll from "../../api/WebApiPayroll";
import {messageError, TYPE_LOGS} from "../../utils/constant";
import { useRouter } from "next/router";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";
import SelectYear from "../../components/selects/SelectYear";
import GenericModal from "../modal/genericModal";
import { set } from "lodash";

const CfdiVaucher = ({
  calendar = null,
  period = null,
  viewFilter = true,
  setKeys,
  department = null,
  job = null,
  movementType = null,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [valuesFilter, setValuesFilter] = useState(null);
  const [lenData, setLenData] = useState(0);
  const [page, setPage] = useState(1);
  const [dataTypesLog, setDataTypesLog] = useState([]);


  useEffect(() => {
    let _dataTypes = []
    for (const property in TYPE_LOGS) {
      _dataTypes.push({
        label:TYPE_LOGS[property],
        value: property
      })
    }
    setDataTypesLog(_dataTypes)
  }, []);


  const getVoucherTypeStr=(type)=>{
   // 1 aguinaldo,2 finiquito , 3 liquidacion, 0 ordinaria
     switch (type){
       case 0:
         return 'Ordinaria';
       case 1:
         return 'Aguinaldo';
       case 2:
         return 'Finiquito';
       case 3:
         return 'Liquidacion';
       default:
         return 'Extraordinario'
     }
  }

  const downloadReceipt = async (data) => {
    let req = {
      cfdi_id: data?.id
      // person_id: data?.payroll_person?.person?.id,
      // payment_period_id: data?.payment_period?.id,
      // receipt_type: getVoucherTypeStr(data.movement_type)
    }

    try {
      let response = await WebApiPayroll.downLoadReceipt(req);
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "comprobante_2.pdf";
      link.click();
    } catch (error) {
      error &&
      error.response &&
      error.response.data &&
      error.response.data.message &&
      message.error(error.response.data.message);
    }
  };

  const pagination = async (page, pageSize) => {
    setPage(page);
    if (calendar) {
      getVoucher(`calendar=${calendar}&period=${period}`, page);
    } else {
      onFinish(valuesFilter, page);
    }
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Núm. trabajador",
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
      title: "UUID",
      key: "uuid",
      render: (item) => {
        return `${item.uuid}`;
      },
    },
    {
      title: "Tipo",
      key: "type_movement",
      render: (item) => {
        return `${item?.movement_type===0?'Ordinario':'Extraordinario'}`;
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


            <Tooltip title="Comprobante" key={item.id} color={"#3d78b9"}>
              <FilePdfTwoTone
                  twoToneColor="#34495E"
                  onClick={() => downloadReceipt(item)}
                  style={{ fontSize: "25px" }}
              />
            </Tooltip>


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
              <Tooltip title="PDF timbrado" color={"#3d78b9"} key={"#3d78b9"}>
                <FilePdfTwoTone
                  twoToneColor="#C0392B"
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





            {item?.extraordinary_stamp_id && (
                <Tooltip title="XML indemnización" color={"#f68f49"} key={"#c27e51"}>
                  <FileTextTwoTone
                      twoToneColor="#f68f49"
                      onClick={() => downLoadFile(item, 1, item?.extraordinary_stamp_id)}
                      style={{ fontSize: "25px" }}
                  />
                </Tooltip>)
            }

            {item?.extraordinary_stamp_id && (
                <Tooltip title="PDF indemnización" color={"#f68f49"} key={"#c27e51"}>
                  <FilePdfTwoTone
                      twoToneColor="#C0392B"
                      onClick={() => downLoadFile(item, 2, item?.extraordinary_stamp_id)}
                      style={{ fontSize: "25px" }}
                  />
                </Tooltip>)
            }


            {!viewFilter && item.id_facturama && (
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
      let filter = `calendar=${calendar}&period=${period}`;
      if (department) filter = filter + `&department=${department}`;
      if (job) filter = filter + `&job=${job}`;
      if (movementType) filter = filter + `&movement_type=${movementType}`;
      getVoucher(filter);
    }
  }, [router.query]);

  const downLoadFile = (item, type_file, extraordinary_stamp_id=null ) => {
    let data = {
      type_request: 3,
      type_file: type_file
    };


    if(!extraordinary_stamp_id){
      data.id_facturama = item.id_facturama
    }else{
      data.extraordinary_stamp_id =  extraordinary_stamp_id
    }

    let url = `${getDomain(
      API_URL_TENANT
    )}/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`;

    downLoadFileBlob(
      url,
      `${item.payroll_person.person.rfc}_${item.payment_period.start_date}_${
        item.payment_period.end_date
      }.${type_file == 1 ? "xml" : "pdf"}`,
      "POST",
      data
    );
  };

  const generate_url = (new_page) => {
    if (new_page) {
      return `&page=${new_page}`;
    }
    return `&page=${page}`;
  };

  const onFinish = (value, new_page) => {
    setValuesFilter(value);
    setLoading(true);
    let url = `&node=${props.currentNode.id}`;
    if (value.calendar && value.calendar !== "")
      url = url + `&calendar=${value.calendar}`;
    if (value.period && value.period !== "")
      url = url + `&period=${value.period}`;
    if (value.person && value.person !== "")
      url = url + `&person=${value.person}`;
    let type = value.movement_type;
    if (type && type !== "")
      url = url + `&movement_type=${value.movement_type}`;
    if (value.uuid && value.uuid !== "")
      url = url + `&uuid=${value.uuid}`;

    if (value.year && value.year != "") url = url + `&year=${value.year}`;
    if(!new_page) setCurrentPage(1)
    getVoucher(url, new_page?new_page:1);
  };

  const getVoucher = (data, new_page) => {
    data = data + generate_url(new_page);

    setLoading(true);
    setCfdis([]);
    WebApiPayroll.getCfdiPayrrol(data)
      .then((response) => {
        setLenData(response.data.count);
        let cfdi_data = response.data.results.map((item) => {
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
    setCurrentPage(1)
    setPage(1)
    setCalendarSelect(null);
    setCfdis([]);
    setLenData(0)
    setValuesFilter({})
    
    getVoucher(`&node=${props.currentNode.id}`, 1);
  };

  useEffect(() => {
    let periodos = [];
    if (calendarSelect && props.payment_calendar.length > 0) {
      periodos = props.payment_calendar.find(
        (item) => item.id === calendarSelect
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
                <Col md={3} xs={12}>
                  <Form.Item name="movement_type" label="Tipo de nómina">
                    <Select
                        placeholder="Todos"
                        style={{ width: '100%' }}
                        allowClear
                        options={[
                          {
                            label:'Ordinario',
                            value:'0'
                          },
                          {
                            label:'Extraordinario',
                            value:'4'
                          },
                        ]}
                    />
                  </Form.Item>
                </Col>
                <Col md={3} xs={12}>
                  <SelectPaymentCalendar
                    setCalendarId={(value) => setCalendarSelect(value)}
                    name="calendar"
                    style={{ width: 300 }}
                  />
                </Col>
                {calendarSelect && (
                  <Col md={3} xs={12}>
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
                <Col md={3} xs={12}>
                  <SelectCollaborator  showSearch={true} name="person" style={{width:'100%'}}  />
                </Col>
                {!calendarSelect && (
                  <Col md={3} xs={12}>
                    <SelectYear
                      size="middle"
                      name={"year"}
                      label={"Año"}
                      placeholder={"Año"}
                    />
                  </Col>
                )}
                <Col md={3} xs={12}>
                  <Form.Item name="uuid" label="UUID">
                  <Input allowClear placeholder={'UUID'} />
                  </Form.Item>
                </Col>
                <Col style={{ display: "flex" }} md={3} xs={12}>
                  <Space style={{paddingTop:30}}>
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
                  </Space>

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
              pagination={false}
            />
          </Col>
          {lenData > 0 && (
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Pagination
                current={currentPage}
                total={lenData}
                onChange={pagination}
                showSizeChanger={false}
                // defaultPageSize={10}
              />
            </Col>
          )}
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
