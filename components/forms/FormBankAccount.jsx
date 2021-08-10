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

const FormBanckAccount = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formBank] = Form.useForm();
  const { confirm } = Modal;
  const [idBankAcc, setIdBankAcc] = useState("");
  const [upBankAcc, setUpBankAcc] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  useEffect(() => {
    getBankAccount();
    Axios.get(API_URL + "/setup/banks/")
      .then((response) => {
        if (response.status === 200) {
          let bank = response.data.results;
          bank = bank.map((a) => {
            return { label: a.name, value: a.id };
          });
          setBanks(bank);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  /* functions CRUD*/
  const getBankAccount = () => {
    setLoadingTable(true);
    Axios.get(API_URL + `/person/bank-account/?person=${person_id}`)
      .then((response) => {
        setBankAccounts(response.data.results);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        setBankAccounts([]);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const saveBankAcc = (data) => {
    Axios.post(API_URL + `/person/bank-account/`, data)
      .then((response) => {
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });

        getBankAccount();
        formBank.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateBankAcc = (data) => {
    setLoadingTable(true);
    Axios.put(API_URL + `/person/bank-account/${data.id}/`, data)
      .then((response) => {
        message.success({
          content: "Actualizado correctamente.",
          className: "custom-class",
        });

        setUpBankAcc(false);
        setIdBankAcc(null);
        formBank.resetFields();
        getBankAccount();
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
  const deleteBankAcc = (data) => {
    setLoadingTable(true);
    Axios.delete(API_URL + `/person/bank-account/${data}/`)
      .then((response) => {
        message.success({
          content: "Eliminado con exito.",
          className: "custom-class",
        });

        if (upBankAcc) {
          formBank.resetFields();
          setUpBankAcc(false);
        }

        getBankAccount();
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
  const formBankAcc = (value) => {
    if (upBankAcc) {
      value.id = idBankAcc;
      updateBankAcc(value);
    } else {
      value.person = person_id;
      saveBankAcc(value);
    }
  };
  const updateFormbankAcc = (item) => {
    formBank.setFieldsValue({
      bank: item.bank.id,
      account_number: item.account_number,
      interbank_key: item.interbank_key,
      card_number: item.card_number,
      expiration_month: item.expiration_month,
      expiration_year: item.expiration_year,
    });
    setIdBankAcc(item.id);
    setUpBankAcc(true);
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
        if (id !== undefined) deleteBankAcc(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const colBank = [
    {
      title: "Banco",
      render: (item) => {
        return <>{item.bank.name}</>;
      },
      key: "id",
    },
    {
      title: "Número de cuenta",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Clabe interbancaria",
      dataIndex: "interbank_key",
      key: "interbank_key",
    },
    {
      title: "Número de tarjeta",
      dataIndex: "card_number",
      key: "card_number",
    },
    {
      title: "Fecha de vencimiento",
      render: (item) => {
        return (
          <>
            {item.expiration_month}/{item.expiration_year}
          </>
        );
      },
    },
    {
      title: "Estatus",
      render: (item) => {
        return <>{item.status ? "Activo" : "Inactivo"}</>;
        // <Switch checked={item.status} readOnly />;
      },
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
                  onClick={() => updateFormbankAcc(item)}
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
        <Title style={{ fontSize: "20px" }}>Cuentas bancarias</Title>
      </Row>
      <Form layout="vertical" form={formBank} onFinish={formBankAcc}>
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="bank" label="Banco" rules={[ruleRequired]}>
              <Select
                options={banks}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="account_number"
              label="Número de cuenta"
              rules={[ruleRequired]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="interbank_key" label="Clabe interbancaria">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="card_number"
              label="Número de tarjeta"
              rules={[
                ruleRequired,
                {
                  pattern: /^[\d]{0,19}$/,
                  message: "El no  debe tener más de 19 dígitos",
                },
              ]}
            >
              <Input type="number" maxLength={16} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="expiration_month"
              label="Mes de vencimiento"
              rules={[
                {
                  required: true,
                  message: "Este campo es requerido",
                },
                {
                  pattern: /^[\d]{0,2}$/,
                  message: "El campo debe tener 2 dígitos",
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input type="number" maxLength={2} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="expiration_year"
              label="Año de vencimiento"
              rules={[
                ruleRequired,
                {
                  pattern: /^[\d]{0,2}$/,
                  message: "El campo debe tener 2 dígitos",
                },
              ]}
            >
              <Input type="number" maxLength={2} />
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
          columns={colBank}
          dataSource={bankAccounts}
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
export default FormBanckAccount;
