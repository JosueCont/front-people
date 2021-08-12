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
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { genders } from "../../utils/functions";
import WebApi from "../../api/webApi";

const FormFamily = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formFamily] = Form.useForm();
  const { confirm } = Modal;
  const [lifeFamily, setLifeFamily] = useState(false);
  const [birthDateFam, setBirthDateFam] = useState("");
  const [idFamily, setIdFamily] = useState("");
  const [upFamily, setUpFamily] = useState(false);
  const [family, setFamily] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  useEffect(() => {
    getFamily();
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

  const getFamily = async () => {
    try {
      let response = await WebApi.getFamily(person_id);
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
      let response = await WebApi.createFamily(data);
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
      let response = await WebApi.updateFamily(data);
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
      let response = await WebApi.deleteFamily(data);
      message.success({
        content: "Eliminado con exito.",
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
    setBirthDateFam(dateString);
  };
  const formFinishFamily = (value) => {
    if (upFamily) {
      value.person = person_id;
      value.id = idFamily;
      value.birth_date = birthDateFam;
      setLifeFamily(value.life);
      updateFamily(value);
    } else {
      value.person = person_id;
      value.birth_date = birthDateFam;
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
      title: "¿Está seguro de querer eliminarlo?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Al eliminar este registro perderá todos los datos relacionados a el de manera permanente",
      okText: "Si",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        if (id !== undefined) deleteFamily(id);
      },
      onCancel() {
        console.log("Cancel");
      },
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
                  style={{ fontSize: "25px" }}
                  onClick={() => updateFormFamily(item)}
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
        <Title style={{ fontSize: "20px" }}>Familia</Title>
      </Row>
      <Form layout={"vertical"} form={formFamily} onFinish={formFinishFamily}>
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
            <Form.Item name="job" label="Puesto de trabajo">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="flast_name"
              label="Apellido paterno"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="mlast_name"
              label="Apellido materno"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="gender" label="Género" rules={[ruleRequired]}>
              <Select
                options={genders}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="liffe" label="¿Vive?">
              <Checkbox checked={lifeFamily} onChange={lifeFamilyShip} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="birth_date"
              label="Fecha de nacimiento"
              rules={[ruleRequired]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={onChangeBDFamily}
                moment={"YYYY-MM-DD"}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="place_birth" label="Lugar de nacimiento">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="nationality" label="Nacionalidad">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="other_nationality" label="Otra nacionalidad">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="benefit"
              label="% Beneficio"
              rules={[ruleRequired]}
            >
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

export default FormFamily;
