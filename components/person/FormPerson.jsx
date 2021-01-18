import {
  Form,
  Input,
  Layout,
  Modal,
  DatePicker,
  Button,
  Space,
  Select,
  message,
} from "antd";
import Axios from "axios";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";

const FormPerson = (props) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const company_id = "5f417a53c37f6275fb614104";
    if (company_id !== undefined) {
      getValueSelects(company_id);
    }
  }, []);

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = date;
    }
    createPerson(value);
  };

  const getValueSelects = async (id) => {
    const headers = {
      "client-id": "5f417a53c37f6275fb614104",
      "Content-Type": "application/json",
    };

    Axios.get("https://khonnect.hiumanlab.com/group/list/", {
      headers: headers,
    })
      .then((response) => {
        if (response.status === 200) {
          let group = response.data.data;
          group = group.map((a) => {
            return { label: a.name, value: a.id };
          });
          setGroups(group);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    Axios.get("http://demo.localhost:8000/person/person-type/")
      .then((response) => {
        if (response.status === 200) {
          let typesPerson = response.data.results;
          typesPerson = typesPerson.map((a) => {
            return { label: a.name, value: a.id };
          });
          setPersonType(typesPerson);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    Axios.get("http://demo.localhost:8000/person/job/")
      .then((response) => {
        if (response.status === 200) {
          let job = response.data.results;
          job = job.map((a) => {
            return { label: a.name, value: a.id };
          });
          setJobs(job);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createPerson = (value) => {
    console.log("Crear-->> ", value);

    Axios.post("http://demo.localhost:8000/person/person/", value)
      .then((response) => {
        console.log("Agreagdo-->> ", response);
        message.success("Agregado correctamente");
        props.close(false)
      })
      .catch((response) => {
        message.error("Error al agregar, intente de nuevo");
      });
  };

  const genders = [
    {
      label: "Maculino",
      value: 1,
    },
    {
      label: "Femenino",
      value: 2,
    },
    {
      label: "Otro",
      value: 3,
    },
  ];

  const ruleEmail = {
    type: "email",
    message: "Ingrese un correo electronico valido",
  };

  function onChange(date, dateString) {
    console.log(date, dateString);
    setDate(dateString);
  }

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title="Alta de personas"
          centered
          visible={props.visible}
          onOk={() => props.close(false)}
          onCancel={() => props.close(false)}
          footer={null}
        >
          <Form
            onFinish={onFinish}
            form={form}
            initialValues={{
              name: "",
              flast_name: "",
              mlast_name: "",
              birth_date: "",
              perms: [],
              email: "",
              password: "",
            }}
          >
            <Space>
              <Form.Item name="person_type">
                <Select options={personType} placeholder="Tipo de persona" />
              </Form.Item>

              <Form.Item name="job">
                <Select options={jobs} placeholder="Puesto de trabajo" />
              </Form.Item>
            </Space>
            <Form.Item rules={[ruleRequired]} name="first_name">
              <Input type="text" placeholder="Nombre" />
            </Form.Item>
            <Form.Item rules={[ruleRequired]} name="flast_name">
              <Input type="text" placeholder="Apellido paterno..." />
            </Form.Item>
            <Form.Item name="mlast_name">
              <Input type="text" placeholder="Apellido materno..." />
            </Form.Item>
            <Space>
              <Form.Item name="gender">
                <Select options={genders} placeholder="Género" />
              </Form.Item>
              <Form.Item>
                <DatePicker
                  onChange={onChange}
                  moment={"YYYY-MM-DD"}
                  placeholder="Fecha de nacimiento"
                />
              </Form.Item>
            </Space>
            <Form.Item rules={[ruleEmail, ruleRequired]} name="email">
              <Input type="email" placeholder="E-mail" />
            </Form.Item>
            <Form.Item rules={[ruleRequired]} name="password">
              <Input.Password type="text" placeholder="Contraseña" />
            </Form.Item>
            <Form.Item name="groups">
              <Select
                mode="multiple"
                options={groups}
                showArrow
                style={{ width: "100%" }}
                placeholder="Permisos..."
              ></Select>
            </Form.Item>
            <Form.Item labelAlign="right">
              <Space style={{ float: "right" }}>
                <Button type="danger" onClick={() => props.close(false)}>
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};
export default FormPerson;
