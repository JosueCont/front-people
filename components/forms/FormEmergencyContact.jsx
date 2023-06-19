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
import {
  messageDeleteSuccess,
  messageDialogDelete,
  messageSaveSuccess,
  messageUpdateSuccess,
  titleDialogDelete,
} from "../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";

const FormEmergencyContact = ({ person_id = null, ...props }) => {
  const { Title } = Typography;
  const [formContactEmergency] = Form.useForm();
  const { confirm } = Modal;
  const [idContEm, setIdContEm] = useState("");
  const [upContEm, setUpContEm] = useState(false);
  const [contactEmergency, setContactEmergency] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    getContactEmergency();
  }, []);

  const getContactEmergency = async () => {
    setContactEmergency([]);
    await WebApiPeople.getContactEmergency(person_id)
      .then((response) => {
        setContactEmergency(response.data);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setContactEmergency([]);
        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };

  const saveContactE = async (data) => {
    await WebApiPeople.createContactEmergency(data)
      .then((response) => {
        message.success(messageSaveSuccess);
        getContactEmergency();
        formContactEmergency.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateContEm = async (data) => {
    setLoadingTable(true);
    await WebApiPeople.updateContactEmergency(data)
      .then((response) => {
        message.success(messageUpdateSuccess);
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

  const deleteContEm = async (data) => {
    setLoadingTable(true);
    await WebApiPeople.deleteContactEmergency(data)
      .then((response) => {
        message.success(messageDeleteSuccess);
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
      title: titleDialogDelete,
      icon: <ExclamationCircleOutlined />,
      content: messageDialogDelete,
      okText: "Si",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        if (id !== undefined) deleteContEm(id);
      },
      onCancel() {},
    });
  };

  const colContact = [
    {
      title: "Parentesco",
      width: 300,
      render: (item) => {
        return <div style={{ maxWidth: 300 }}>{item.relationship.name}</div>;
      },
    },
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
        className="inputs_form_responsive form-details-person"
      >
        <Row gutter={20}>
          <Col lg={6} xs={22} md={8}>
            <Form.Item
              name="relationship"
              label="Parentesco"
              rules={[ruleRequired]}
            >
              <Select
                options={props.relationship.map((item) => {
                  return { value: item.id, label: item.name };
                })}
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

const mapState = (state) => {
  return { relationship: state.catalogStore.cat_relationship };
};

export default connect(mapState)(FormEmergencyContact);
