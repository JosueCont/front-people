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
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import {
  messageDialogDelete,
  onlyNumeric,
  titleDialogDelete,
} from "../../utils/constant";

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
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    getTraining();
  }, []);

  /**CRUD training */
  const getTraining = () => {
    setLoadingTable(true);
    Axios.get(API_URL + `/person/person/${person_id}/training_person/`)
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
  const saveTraining = (data) => {
    Axios.post(API_URL + `/person/training/`, data)
      .then((response) => {
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });
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
  const updateTraining = (data) => {
    setLoadingTable(true);
    Axios.put(API_URL + `/person/training/${data.id}/`, data)
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
  const deleteTraining = (id) => {
    Axios.delete(API_URL + `/person/training/${id}/`)
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

  /*Events */
  const formFinishTraining = (value) => {
    if (upTraining) {
      value.id = idTraining;
      value.since = dateTraining[0];
      value.until = dateTraining[1];
      value.currently_studing = currenlyStuding;
      updateTraining(value);
      setDateRange("");
    } else {
      value.since = dateTraining[0];
      value.until = dateTraining[1];
      value.currently_studing = currenlyStuding;
      value.person = person_id;
      saveTraining(value);
      setDateRange("");
    }
  };
  const onChangeDateTrainig = (date, dateString) => {
    setDateTraining(dateString);
    setDateRange([
      moment(dateString[0], "YYYY-MM-DD"),
      moment(dateString[1], "YYYY-MM-DD"),
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
      onCancel() {
        console.log("Cancel");
      },
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
        return <div style={{ maxWidth: 100 }}>{item.since}</div>;
      },
    },
    {
      key: "until",
      width: 100,
      title: "Fecha fin",
      render: (item) => {
        return <div style={{ maxWidth: 100 }}>{item.until}</div>;
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
                  format={"YYYY-MM-DD"}
                  value={dateRange}
                  onChange={onChangeDateTrainig}
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
