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
import WebApiPeople from "../../api/WebApiPeople";
import { messageDialogDelete, titleDialogDelete } from "../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../utils/rules";

const FormEmergencyContact = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formContactEmergency] = Form.useForm();
  const { confirm } = Modal;
  const [idContEm, setIdContEm] = useState("");
  const [upContEm, setUpContEm] = useState(false);
  const [contactEmergency, setContactEmergency] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    getContactEmergency();
    getRelationShip();
  }, []);

  const getRelationShip = async () => {
    try {
      let response = await WebApiPeople.getRelationShip();
      let relation = response.data.results;
      relation = relation.map((a) => {
        return { label: a.name, value: a.id };
      });
      setRelationship(relation);
    } catch (error) {
      console.log(error);
    }
  };

  const getContactEmergency = async () => {
    setContactEmergency([]);
    try {
      let response = await WebApiPeople.getContactEmergency(person_id);
      setContactEmergency(response.data);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setContactEmergency([]);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    }
  };

  const saveContactE = async (data) => {
    try {
      let response = await WebApiPeople.createContactEmergency(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      getContactEmergency();
      formContactEmergency.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const updateContEm = async (data) => {
    setLoadingTable(true);
    try {
      let response = await WebApiPeople.updateContactEmergency(data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
      setUpContEm(false);
      setIdContEm(null);
      getContactEmergency();
      formContactEmergency.resetFields();
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

  const deleteContEm = async (data) => {
    setLoadingTable(true);
    try {
      let response = await WebApiPeople.deleteContactEmergency(data);
      message.success({
        content: "Eliminado correctamente.",
        className: "custom-class",
      });

      if (upContEm) {
        formContactEmergency.resetFields();
        setUpContEm(false);
      }

      getContactEmergency();
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

  /* Events */
  const formFinishContactE = (value) => {
    if (upContEm) {
      value.id = idContEm;
      updateContEm(value);
    } else {
      value.person = person_id;
      saveContactE(value);
    }
  };
  const updateFormContEm = (item) => {
    formContactEmergency.setFieldsValue({
      relationship: item.relationship.id,
      address: item.address,
      fullname: item.fullname,
      phone_one: item.phone_one,
      phone_two: item.phone_two,
    });
    setIdContEm(item.id);
    setUpContEm(true);
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
        if (id !== undefined) deleteContEm(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const colContact = [
    {
      title: "Nombre",
      width: 300,
      render: (item) => {
        return <div style={{ maxWidth: 300 }}>{item.fullname}</div>;
      },
    },
    {
      title: "Teléfono 1",
      width: 100,
      render: (item) => {
        return <div style={{ maxWidth: 100 }}>{item.phone_one}</div>;
      },
    },
    {
      title: "Teléfono 2",
      width: 100,
      render: (item) => {
        return <div style={{ maxWidth: 100 }}>{item.phone_two}</div>;
      },
    },
    {
      title: "Dirección",
      width: 200,
      render: (item) => {
        return <div style={{ maxWidth: 200 }}>{item.address}</div>;
      },
    },
    {
      title: "Opciones",
      width: 100,
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => updateFormContEm(item)}
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
        <Title style={{ fontSize: "20px" }}>Contactos de emergencia</Title>
      </Row>
      <Form
        layout="vertical"
        form={formContactEmergency}
        onFinish={formFinishContactE}
        className="inputs_form_responsive"
      >
        <Row gutter={20}>
          <Col lg={6} xs={22} md={8}>
            <Form.Item
              name="relationship"
              label="Parentesco"
              rules={[ruleRequired]}
            >
              <Select
                options={relationship}
                notFoundContent={"No se encontraron resultados."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={8}>
            <Form.Item
              name="fullname"
              label="Nombre completo"
              rules={[ruleRequired]}
            >
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={8}>
            <Form.Item
              name="phone_one"
              label="Teléfono 1"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={8}>
            <Form.Item
              name="phone_two"
              label="Teléfono 2"
              rules={[ruleRequired, onlyNumeric]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={13} xs={22} offset={1}>
            <Form.Item name="address" label="Dirección" rules={[ruleRequired]}>
              <Input maxLength={100} />
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
          className={"mainTable"}
          size="small"
          columns={colContact}
          dataSource={contactEmergency}
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
export default FormEmergencyContact;
