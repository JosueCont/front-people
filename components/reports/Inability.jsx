import React, { useEffect, useState } from "react";
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
  ConfigProvider
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import SelectCollaborator from "../selects/SelectCollaborator";
import SelectDepartment from "../selects/SelectDepartment";
import Axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import { API_URL } from "../../config/config";
import moment from "moment";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import { connect } from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";
import esES from "antd/lib/locale/es_ES";
import {downLoadFileBlob} from "../../utils/functions";

const InabilityReport = ({ permissions, ...props }) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { Title } = Typography;

  const [incapacityList, setIncapacityList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [collaborator, setCollaborator] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [status, setStatus] = useState(null);
  const [dateOne, setDateOne] = useState(null);
  const [dateTwo, setDateTwo] = useState(null);

  const columns = [
    {
      title: "Colaborador",
      dataIndex: "person",
      key: "person",
      render: (collaborator) => {
        return (
          <>
            {collaborator?.first_name ? collaborator?.first_name + " " : null}
            {collaborator?.flast_name ? collaborator?.flast_name + " ": null}
            {collaborator?.mlast_name ? collaborator?.mlast_name : null}
          </>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: "collaborator",
      key: "company",
      render: (collaborator) => {
        return <>{props.currentNode.name}</>;
      },
    },
    {
      title: "Departamento",
      dataIndex: "collaborator",
      key: "department",
      render: (collaborator) => {
        return (
          <>
            {collaborator && collaborator.department
              ? collaborator.department.name
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
    // {
    //   title: "Acciones",
    //   key: "actions",
    //   render: (record, item) => {
    //     return (
    //       <>
    //         {permissions.export_inabilitys && (
    //           <DownloadOutlined onClick={() => download(item)} />
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];

  /* Select status */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const download = async (item = null) => {
    let dataId = { business_id: props.currentNode.id };
    if (item) {
      dataId = {
        incapacity_id: item.id,
      };
    } else {
      if (collaborator) {
        dataId.person__id = collaborator;
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

      downLoadFileBlob(API_URL + `/person/incapacity/download_data/`,
          "Reporte_de_Incapacidades.xlsx",
          "POST",dataId)
      let response = await Axios.post(
        API_URL + `/person/incapacity/download_data/`,
        dataId
      );
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
    department = null,
    status = null,
    date1 = null,
    date2 = null
  ) => {
    setLoading(true);
    try {
      setLoading(true);
      let url = `/person/incapacity/?person__node__id=${props.currentNode.id}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }

      if (department) {
        url += `person__person_department__id=${department}&`;
      }

      if (date1 && date2) {
        let d1 = moment(dateOne).format("YYYY-MM-DD");
        let d2 = moment(dateTwo).format("YYYY-MM-DD");
        url += `start_date=${d1}&end_date=${d2}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data;
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
  const clearFilter = () => {
    form.setFieldsValue({
      collaborator: null,
      department: null,
      status: null,
      send_date: null,
    });
    getIncapacity();
  };

  const filter = async (values) => {
    setIncapacityList([]);

    setCollaborator(values.collaborator);
    setDepartmentId(values.department);
    setStatus(values.status);
    getIncapacity(
      values.collaborator,
      values.department,
      values.status,
      dateOne,
      dateTwo
    );
  };

  useEffect(() => {
    if (props.currentNode) getIncapacity();
  }, [props.currentNode]);

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
            <Row gutter={[10]}>
              <Col>
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectDepartment
                  style={{ width: 100 }}
                  name="department"
                  companyId={props.currentNode && props.currentNode.id}
                />
              </Col>
              <Col>
                <SelectWorkTitle />
              </Col>
              <Col>
                <Form.Item key="status" name="status" label="Estatus">
                  <Select
                    style={{ width: 100 }}
                    key="select"
                    options={optionStatus}
                    allowClear
                    notFoundContent={"No se encontraron resultados."}
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
                  <RangePicker onChange={onchangeRange} locale={locale} />
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
          {permissions.export_inabilitys && (
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
          <ConfigProvider locale={esES}>
          <Table
            dataSource={incapacityList}
            key="tableHolidays"
            pagination={{showSizeChanger:true}}
            loading={loading}
            columns={columns}
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

export default connect(mapState)(InabilityReport);
