import {
  Form,
  Input,
  Spin,
  DatePicker,
  Button,
  message,
  Row,
  Col,
  Typography,
  Checkbox,
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
import moment from "moment";
import { genders } from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import { messageDialogDelete, titleDialogDelete } from "../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";

const FormFamily = ({ person_id = null, ...props }) => {
  const { Title } = Typography;
  const [formFamily] = Form.useForm();
  const { confirm } = Modal;
  const [lifeFamily, setLifeFamily] = useState(false);
  const [birthDateFam, setBirthDateFam] = useState("");
  const [idFamily, setIdFamily] = useState("");
  const [upFamily, setUpFamily] = useState(false);
  const [family, setFamily] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    getFamily();
  }, []);

  const getFamily = async () => {
    try {
      let response = await WebApiPeople.getFamily(person_id);
      response.data.map((a) => {
        a.relation = a.relationship.name;
        a.fullname = a.name + " " + a.flast_name + " " + a.mlast_name;
      });
      setFamily(response.data);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setFamily([]);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
    }
  };
  const saveFamily = async (data) => {
    try {
      let response = await WebApiPeople.createFamily(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      getFamily();
      formFamily.resetFields();
      setLifeFamily(false);
    } catch (error) {
      console.log(error);
    }
  };
  const updateFamily = async (data) => {
    try {
      setLoadingTable(true);
      let response = await WebApiPeople.updateFamily(data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
      setUpFamily(false);
      setIdFamily(null);
      formFamily.resetFields();
      setLifeFamily(false);
      getFamily();
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
  const deleteFamily = async (data) => {
    try {
      setLoadingTable(true);
      let response = await WebApiPeople.deleteFamily(data);
      message.success({
        content: "Eliminado con éxito.",
        className: "custom-class",
      });
      if (upFamily) {
        formFamily.resetFields();
        setUpFamily(false);
      }
      getFamily();
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
  const lifeFamilyShip = () => {
    lifeFamily ? setLifeFamily(false) : setLifeFamily(true);
  };
  const onChangeBDFamily = (date, dateString) => {
    setBirthDateFam(moment(date).format('YYYY-MM-DD'));
  };
  const formFinishFamily = (value) => {
    if (upFamily) {
      value.person = person_id;
      value.id = idFamily;
      value.birth_date = moment(birthDateFam).format('YYYY-MM-DD');
      // setLifeFamily(value.life);
      value.life = lifeFamily;
      updateFamily(value);
    } else {
      value.person = person_id;
      value.birth_date = moment(birthDateFam).format('YYYY-MM-DD');
      value.life = lifeFamily;
      saveFamily(value);
    }
  };

  const updateFormFamily = (item) => {
    formFamily.setFieldsValue({
      relationship: item.relationship.id,
      job: item.job,
      name: item.name,
      flast_name: item.flast_name,
      mlast_name: item.mlast_name,
      gender: item.gender,
      life: lifeFamily,
      benefit: item.benefit,
      place_birth: item.place_birth,
      nationality: item.nationality,
      other_nationality: item.other_nationality,
    });
    setLifeFamily(item.life);
    setBirthDateFam(item.birth_date);
    if (item.birth_date)
      formFamily.setFieldsValue({
        birth_date: moment(item.birth_date),
      });
    setIdFamily(item.id);
    setUpFamily(true);
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
        if (id !== undefined) deleteFamily(id);
      },
      onCancel() {},
    });
  };

  const colFamily = [
    {
      title: "Nombre",
      dataIndex: "fullname",
    },
    {
      title: "Parentesco",
      dataIndex: "relation",
    },
    {
      title: "Beneficio",
      render: (item) => {
        return <>{item.benefit} %</>;
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
                  style={{ fontSize: "20px" }}
                  onClick={() => updateFormFamily(item)}
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
        <Title style={{ fontSize: "20px" }}>Familia</Title>
      </Row>
      <Form
        layout={"vertical"}
        form={formFamily}
        onFinish={formFinishFamily}
        className="inputs_form_responsive form-details-person"
      >
        <Row gutter={20}>
          <Col lg={8} xs={22} md={12}>
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
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="job" label="Puesto de trabajo">
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="flast_name"
              label="Apellido paterno"
              rules={[ruleRequired]}
            >
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="mlast_name"
              label="Apellido materno"
              rules={[ruleRequired]}
            >
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="gender" label="Género" rules={[ruleRequired]}>
              <Select
                options={genders}
                notFoundContent={"No se encontraron resultados."}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="life" label="¿Vive?">
              <Checkbox checked={lifeFamily} onChange={lifeFamilyShip} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="birth_date"
              label="Fecha de nacimiento"
              rules={[ruleRequired]}
            >
              <DatePicker
                locale={ locale }
                style={{ width: "100%" }}
                onChange={onChangeBDFamily}
                format={"DD-MM-YYYY"}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="place_birth" label="Lugar de nacimiento">
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="nationality" label="Nacionalidad">
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="other_nationality" label="Otra nacionalidad">
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="benefit"
              label="% Beneficio"
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
          columns={colFamily}
          dataSource={family}
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

export default connect(mapState)(FormFamily);
