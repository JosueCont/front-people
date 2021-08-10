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
import Axios from "axios";
import { API_URL } from "../../config/config";

const FormEmergencyContact = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formContactEmergency] = Form.useForm();
  const { confirm } = Modal;
  const [idContEm, setIdContEm] = useState("");
  const [upContEm, setUpContEm] = useState(false);
  const [contactEmergency, setContactEmergency] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  useEffect(() => {
    getContactEmergency();
    Axios.get(API_URL + "/setup/relationship/")
      .then((response) => {
        if (response.status === 200) {
          let relation = response.data.results;
          relation = relation.map((a) => {
            return { label: a.name, value: a.id };
          });
          setRelationship(relation);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  /* functions CRUD */
  const getContactEmergency = () => {
    setContactEmergency([]);
    Axios.get(API_URL + `/person/person/${person_id}/contact_emergency_person/`)
      .then((response) => {
        setContactEmergency(response.data);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        setContactEmergency([]);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const saveContactE = (data) => {
    Axios.post(API_URL + `/person/contact-emergency/`, data)
      .then((response) => {
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });

        getContactEmergency();
        formContactEmergency.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateContEm = (data) => {
    setLoadingTable(true);
    Axios.put(API_URL + `/person/contact-emergency/${data.id}/`, data)
      .then((response) => {
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
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const deleteContEm = (data) => {
    setLoadingTable(true);
    Axios.delete(API_URL + `/person/contact-emergency/${data}/`)
      .then((response) => {
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
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
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
      title: "¿Está seguro de querer eliminarlo?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Al eliminar este registro perderá todos los datos relacionados a el de manera permanente",
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
      dataIndex: "fullname",
    },
    {
      title: "Teléfono 1",
      dataIndex: "phone_one",
    },
    {
      title: "Teléfono 2",
      dataIndex: "phone_two",
    },
    {
      title: "Dirección",
      dataIndex: "address",
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
                  onClick={() => updateFormContEm(item)}
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
        <Title style={{ fontSize: "20px" }}>Contactos de emergencia</Title>
      </Row>
      <Form
        layout="vertical"
        form={formContactEmergency}
        onFinish={formFinishContactE}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="relationship"
              label="Parentesco"
              rules={[ruleRequired]}
            >
              <Select
                options={relationship}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="fullname"
              label="Nombre completo"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="phone_one"
              label="Teléfono 1"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="phone_two"
              label="Teléfono 2"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={13} xs={22} offset={1}>
            <Form.Item name="address" label="Dirección" rules={[ruleRequired]}>
              <Input />
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
