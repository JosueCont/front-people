import {
  Form,
  Input,
  Spin,
  DatePicker,
  Button,
  Space,
  message,
  Row,
  Col,
  Typography,
  Checkbox,
  Table,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import {
  messageDialogDelete,
  messageSaveSuccess,
  titleDialogDelete,
} from "../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../utils/rules";
import WebApiPeople from "../../api/WebApiPeople";
import locale from "antd/lib/date-picker/locale/es_ES";

const FormTraining = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formTraining] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { confirm } = Modal;
  const [currenlyStuding, setCurrenlyStuding] = useState(false);
  const [dateTraining, setDateTraining] = useState("");
  const [idTraining, setIdTraining] = useState("");
  const [upTraining, setUpTraining] = useState(false);
  const [training, setTraining] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    getTraining();
  }, []);

  const getTraining = async () => {
    setLoadingTable(true);
    await WebApiPeople.trainingPerson(
      "get",
      `person/${person_id}/training_person/`
    )
      .then((response) => {
        setTraining(response.data);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        setTraining([]);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };

  const saveTraining = async (data) => {
    await WebApiPeople.trainingPerson("post", "training/", data)
      .then((response) => {
        message.success(messageSaveSuccess);
        getTraining();
        formTraining.resetFields();
        setCurrenlyStuding(false);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const updateTraining = async (data) => {
    setLoadingTable(true);
    await WebApiPeople.trainingPerson("put", `training/${data.id}/`, data)
      .then((response) => {
        message.success({
          content: "Actualizado correctamente.",
          className: "custom-class",
        });
        setUpTraining(false);
        setIdTraining(null);
        getTraining();
        formTraining.resetFields();
        setCurrenlyStuding(false);
        setDateTraining("");
        setCurrenlyStuding(false);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const deleteTraining = async (id) => {
    await WebApiPeople.trainingPerson("delete", `training/${id}/`)
      .then((response) => {
        message.success({
          content: "Eliminado con éxito.",
          className: "custom-class",
        });
        if (upTraining) {
          formTraining.resetFields();
          setUpTraining(false);
        }
        getTraining();
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const formFinishTraining = (value) => {
    if (upTraining) {
      debugger;
      value.id = idTraining;
      value.since = moment(dateTraining[0]).format('YYYY-MM-DD');
      value.until = moment(dateTraining[1]).format('YYYY-MM-DD');
      value.currently_studing = currenlyStuding;
      updateTraining(value);
      setDateRange("");
    } else {
      value.since = moment(dateTraining[0]).format('YYYY-MM-DD');
      value.until = moment(dateTraining[1]).format('YYYY-MM-DD');
      value.currently_studing = currenlyStuding;
      value.person = person_id;
      saveTraining(value);
      setDateRange("");
    }
  };
  const onChangeDateTrainig = (date, dateString) => {
    setDateTraining([
      moment(date[0], "YYYY-MM-DD"),
      moment(date[1], "YYYY-MM-DD"),
    ]);
    setDateRange([
      moment(date[0], "YYYY-MM-DD"),
      moment(date[1], "YYYY-MM-DD"),
    ]);
    formTraining.setFieldsValue({ since: dateString });
  };
  const changeCurreStud = () => {
    currenlyStuding ? setCurrenlyStuding(false) : setCurrenlyStuding(true);
  };
  const updateFormTraining = (item) => {
    setDateRange([
      moment(item.since, "YYYY-MM-DD"),
      moment(item.until, "YYYY-MM-DD"),
    ]);
    formTraining.setFieldsValue({
      school: item.school,
      accreditation_document: item.accreditation_document,
      completed_period: item.completed_period,
      since: [moment(item.since), moment(item.until)],
    });
    setDateTraining([item.since, item.until]);
    setCurrenlyStuding(item.currently_studing);
    setIdTraining(item.id);
    setUpTraining(true);
  };
  const showModalDelete = (id) => {
    confirm({
      title: titleDialogDelete,
      icon: <ExclamationCircleOutlined />,
      content: messageDialogDelete,
      okText: "Si",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        if (id !== undefined) deleteTraining(id);
      },
      onCancel() {},
    });
  };

  const colTraining = [
    {
      key: "school",
      title: "Escuela",
      width: 200,
      render: (item) => {
        return <div style={{ maxWidth: 200 }}>{item.school}</div>;
      },
    },
    {
      key: "since",
      width: 100,
      title: "Fecha inicio",
      render: (item) => {
        return <div style={{ maxWidth: 100 }}>{moment(item.since).format('DD-MM-YYYY')}</div>;
      },
    },
    {
      key: "until",
      width: 100,
      title: "Fecha fin",
      render: (item) => {
        return <div style={{ maxWidth: 100 }}>{moment(item.until).format('DD-MM-YYYY')}</div>;
      },
    },
    {
      key: "accreditation_document",
      width: 100,
      title: "Documento",
      render: (item) => {
        return (
          <div style={{ maxWidth: 100 }}>{item.accreditation_document}</div>
        );
      },
    },
    {
      key: "options",
      width: 100,
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => updateFormTraining(item)}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    showModalDelete(item.id);
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>Formación/Habilidades</Title>
      </Row>
      <Form
        key={"form-training"}
        layout="vertical"
        form={formTraining}
        onFinish={formFinishTraining}
        className="inputs_form_responsive form-details-person"
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="school" label="Escuela" rules={[ruleRequired]}>
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="since"
              label="Fecha Inicio-Fin"
              rules={[ruleRequired]}
            >
              <Space direction="vertical" size={13}>
                <RangePicker
                  style={{ width: "100%", border: "1px green solid" }}
                  format={"DD-MM-YYYY"}
                  value={dateRange}
                  onChange={onChangeDateTrainig}
                  locale = { locale }
                  allowClear
                />
              </Space>
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="accreditation_document"
              label="Documento de acreditación"
            >
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="currently_studing" label="Estudia actualmente">
              <Checkbox onChange={changeCurreStud} checked={currenlyStuding} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="completed_period"
              label="No. Periodo completado"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Row>
      </Form>
      <Spin tip="Cargando..." spinning={loadingTable}>
        <Table
          key={"trainings-key"}
          columns={colTraining}
          dataSource={training}
          locale={{
            emptyText: loadingTable
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
    </>
  );
};

export default FormTraining;
