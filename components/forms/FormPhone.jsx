import {
  Form,
  Input,
  Spin,
  Button,
  message,
  Row,
  Col,
  Typography,
  Table,
  Modal,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useEffect } from "react";

const FormPhone = ({ person_id = null, ruleRequired, setLoading }) => {
  const { Title } = Typography;
  const [formPhone] = Form.useForm();
  const { confirm } = Modal;
  const [idPhone, setIdPhone] = useState("");
  const [upPhone, setUpPhone] = useState(false);
  const [phones, setPhones] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    getPhone();
  }, []);

  /*Functions CRUD */
  const getPhone = () => {
    Axios.get(API_URL + `/person/person/${person_id}/phone_person/`)
      .then((response) => {
        setPhones(response.data);
        setLoading(false);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        setPhones([]);
        setLoading(false);
        setLoadingTable(false);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const savePhone = (data) => {
    Axios.post(API_URL + `/person/phone/`, data)
      .then((response) => {
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });
        setLoading(false);
        getPhone();
        formPhone.resetFields();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const updatePhone = (data) => {
    setLoading(true);
    setLoadingTable(true);
    Axios.put(API_URL + `/person/phone/${data.id}/`, data)
      .then((response) => {
        message.success({
          content: "Actualizado correctamente.",
          className: "custom-class",
        });
        setLoading(false);
        setUpPhone(false);
        setIdPhone(null);
        formPhone.resetFields();
        getPhone();
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const deletePhone = (id) => {
    setLoadingTable(true);
    Axios.delete(API_URL + `/person/phone/${id}/`)
      .then((response) => {
        message.success({
          content: "Eliminado con exito.",
          className: "custom-class",
        });
        setLoading(false);

        getPhone();
        if (upPhone) {
          formPhone.resetFields();
          setUpPhone(false);
        }
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };

  /*Events */
  const formFinishPhone = (value) => {
    if (upPhone) {
      value.id = idPhone;
      value.person = person_id;
      updatePhone(value);
    } else {
      value.person = person_id;
      savePhone(value);
    }
  };
  const updateFormPhone = (item) => {
    formPhone.setFieldsValue({
      country_code: item.country_code,
      international_code: item.international_code,
      line_type: item.line_type,
      national_code: item.national_code,
      phone: item.phone,
      phone_type: item.phone_type,
    });
    setIdPhone(item.id);
    setUpPhone(true);
  };
  const showModalDelete = (id) => {
    confirm({
      title: "¿Está seguro de querer eliminarlo?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Al eliminar este registro perderá todos los datos relacionados a el de manera permanente",
      okText: "Si",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        if (id !== undefined) deletePhone(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const typePhones = [
    {
      label: "Alterno",
      value: 1,
    },
    {
      label: "Principal",
      value: 2,
    },
    {
      label: "Recados",
      value: 3,
    },
  ];

  const typeLines = [
    {
      label: "Celular",
      value: 1,
    },
    {
      label: "Fijo",
      value: 2,
    },
  ];

  const colPhone = [
    {
      title: "Código de país",
      dataIndex: "national_code",
    },
    {
      title: "Número",
      dataIndex: "phone",
    },
    {
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => updateFormPhone(item)}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
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
        <Title style={{ fontSize: "20px" }}>Teléfono</Title>
      </Row>
      <Form layout={"vertical"} form={formPhone} onFinish={formFinishPhone}>
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="phone_type"
              label="Tipo de teléfono"
              rules={[ruleRequired]}
            >
              <Select
                options={typePhones}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="line_type"
              label="Tipo de línea"
              rules={[ruleRequired]}
            >
              <Select
                options={typeLines}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="international_code"
              label="Código internacional"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="national_code"
              label="Código de país"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="country_code"
              label="Código de ciudad"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="phone"
              label="Número telefónico"
              rules={[ruleRequired]}
            >
              <Input type="number" />
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
          columns={colPhone}
          dataSource={phones}
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

export default FormPhone;
