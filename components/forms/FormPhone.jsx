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
import { useState, useEffect } from "react";
import WebApi from "../../api/webApi";
import {
  messageDialogDelete,
  onlyNumeric,
  titleDialogDelete,
} from "../../utils/constant";

const FormPhone = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formPhone] = Form.useForm();
  const { confirm } = Modal;
  const [idPhone, setIdPhone] = useState("");
  const [upPhone, setUpPhone] = useState(false);
  const [phones, setPhones] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  useEffect(() => {
    getPhone();
  }, []);

  const getPhone = async () => {
    try {
      let response = await WebApi.getPhone(person_id);
      setPhones(response.data);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setPhones([]);
      setLoadingTable(false);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    }
  };

  const savePhone = async (data) => {
    try {
      let response = await WebApi.createPhone(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      formPhone.resetFields();
      getPhone();
    } catch (error) {
      console.log(error);
    }
  };

  const updatePhone = async (data) => {
    try {
      setLoadingTable(true);
      let response = await WebApi.updatePhone(data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
      formPhone.resetFields();
      setUpPhone(false);
      setIdPhone(null);
      getPhone();
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    }
  };
  const deletePhone = async (id) => {
    try {
      let response = await WebApi.deletePhone(id);
      setLoadingTable(true);

      message.success({
        content: "Eliminado con exito.",
        className: "custom-class",
      });
      getPhone();
      if (upPhone) {
        formPhone.resetFields();
        setUpPhone(false);
      }
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    }
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
      title: titleDialogDelete,
      icon: <ExclamationCircleOutlined />,
      content: messageDialogDelete,
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
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="national_code"
              label="Código de país"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="country_code"
              label="Código de ciudad"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="phone"
              label="Número telefónico"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
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
