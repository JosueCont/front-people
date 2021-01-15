import {
  Layout,
  Breadcrumb,
  Tabs,
  Form,
  Input,
  Modal,
  InputNumber,
  Row,
  Col,
  Spin,
  Card,
  Typography,
  Select,
  DatePicker,
  Button,
  Image,
  Switch,
  Collapse,
} from "antd";
import HeaderCustom from "../../components/Header";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useEffect, useState } from "react";

const { Content } = Layout;
const { TabPane } = Tabs;
import { useRouter } from "next/router";
const { Option } = Select;
import moment from "moment";
import FormItem from "antd/lib/form/FormItem";
const { Panel } = Collapse;
const { Meta } = Card;

const userDetailForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formPerson] = Form.useForm();
  const [formGeneralTab] = Form.useForm();
  const { Title } = Typography;
  const [personFullName, setPersonFullName] = useState("");
  const [groups, setGroups] = useState([]);
  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [photo, setPhoto] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");

  useEffect(() => {
    getValueSelects();
    if (router.query.id) {
      Axios.get(API_URL + `/person/person/${router.query.id}`)
        .then((response) => {
          console.log("RESPONSE PERSON-->> ", response.data);
          formPerson.setFieldsValue({
            first_name: response.data.first_name,
            flast_name: response.data.flast_name,
            mlast_name: response.data.mlast_name,
            gender: response.data.gender,
            email: response.data.email,
            curp: response.data.curp,
            rfc: response.data.rfc,
            imss: response.data.imss,
            is_active: response.data.is_active,
            photo: response.data.photo,
            civil_status: response.data.civil_status,
          });
          if (response.data.person_type)
            formPerson.setFieldsValue({
              person_type: response.data.person_type.id,
            });
          if (response.data.job)
            formPerson.setFieldsValue({ person_type: response.data.job.id });

          // if (response.data.date_of_admission)
          //   formPerson.setFieldsValue({
          //     date_of_admission: moment(response.data.date_of_admission),
          //   });

          if (response.data.birth_date)
            formPerson.setFieldsValue({
              birth_date: moment(response.data.birth_date),
            });
          setBirthDate(response.data.birth_date);
          setStatus(response.data.is_active);
          if (response.data.photo) setPhoto(response.data.photo);
          else
            setPhoto(
              "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg"
            );
          setLoading(false);
          setPersonFullName(
            response.data.first_name +
              " " +
              response.data.flast_name +
              " " +
              response.data.mlast_name
          );
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });

      Axios.get(API_URL + `/person/person/${router.query.id}/general_person/`)
        .then((response) => {
          // console.log("RESPONSE GENERAL PERSON-->> ", response.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [router.query.id]);

  const onFinish = (value) => {
    value.birth_date = birthDate;
    // value.date_of_admission = admissionDate;
    value.id = router.query.id;
    console.log("Form-->>> ", value);
    updatePerson(value);
  };

  const updatePerson = (value) => {
    setLoading(true);
    Axios.put(
      `http://demo.localhost:8000/person/person/${router.query.id}/`,
      value
    )
      .then((response) => {
        console.log("PErson UPDATE-->>> ", response.data);
        formPerson.setFieldsValue({
          first_name: response.data.first_name,
          flast_name: response.data.flast_name,
          mlast_name: response.data.mlast_name,
          gender: response.data.gender,
          email: response.data.email,
          birth_date: moment(response.data.birth_date),
          curp: response.data.curp,
          rfc: response.data.rfc,
          imss: response.data.imss,
          is_active: response.data.is_active,
          person_type: response.data.person_type.id,
          job: response.data.job.id,
          photo: response.data.photo,
          civil_status: response.data.civil_status,
          date_of_admission: null,
        });
        setStatus(response.data.is_active);
        if (response.data.photo) setPhoto(response.data.photo);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
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

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 10 },
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

  const civilStatus = [
    {
      label: "Soltero(a)",
      value: 1,
    },
    {
      label: "Casado(a)",
      value: 2,
    },
    {
      label: "Viudo(a)",
      value: 3,
    },
  ];

  function onChange(date, dateString) {
    console.log(date, dateString);
    setBirthDate(dateString);
  }

  return (
    <>
      <Layout>
        <HeaderCustom />
        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/home/">Person</Breadcrumb.Item>
            <Breadcrumb.Item>Expediente de empleados</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <Title level={3}>Información Personal</Title>
            <Title level={4} style={{ marginTop: 0 }}>
              {personFullName}
            </Title>
            <Spin tip="Loading..." spinning={loading}>
              <Form onFinish={onFinish} layout={"vertical"} form={formPerson}>
                <Card bordered={true}>
                  <Row>
                    <Col span={18} pull={1}>
                      <Row flex>
                        <Col span={10} offset={2}>
                          <Form.Item
                            name="flast_name"
                            label="Apellido Paterno"
                            rules={[{ message: "Ingresa un apellido paterno" }]}
                          >
                            <Input size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={10} offset={2}>
                          <Form.Item
                            name="mlast_name"
                            label="Apellido Materno"
                            rules={[{ message: "Ingresa un apellido paterno" }]}
                          >
                            <Input size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={10} offset={2}>
                          <Form.Item
                            name="first_name"
                            label="Nombre(s)"
                            rules={[{ message: "Ingresa un nombre" }]}
                          >
                            <Input size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={10} offset={2}>
                          <Form.Item name="job" label="Puesto">
                            <Select
                              options={jobs}
                              placeholder="Selecciona un puesto"
                              size="small"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={10} offset={2}>
                          <Form.Item name="node" label="Unidad organizacional">
                            <Input size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={10} offset={2}>
                          <Form.Item name="unit" label="Reporta a ">
                            <Input size="small" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={5}>
                      <Image width={200} src={photo} />
                      <Row>
                        <Form.Item name="date_of_admission">
                          <DatePicker
                            onChange={onChange}
                            moment={"YYYY-MM-DD"}
                          />
                        </Form.Item>
                        <Switch
                          checked={status}
                          checkedChildren="Activo"
                          unCheckedChildren="Inactivo"
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Collapse>
                    <Panel header="Informacion adicional">
                      <Col span={18} pull={1}>
                        <Row flex>
                          <Col span={10} offset={2}>
                            <Form.Item
                              name="email"
                              label="Dirección de E-Mail"
                              rules={[{ message: "Ingresa un email" }]}
                            >
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item
                              name="birth_date"
                              label="Fecha de nacimiento"
                            >
                              <DatePicker
                                onChange={onChange}
                                moment={"YYYY-MM-DD"}
                                placeholder="Fecha de nacimiento"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item name="civil_status" label="Estado Civil">
                              <Select options={civilStatus} size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item name="gender" label="Género">
                              <Select options={genders} />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item name="curp" label="CURP">
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item name="rfc" label="RFC">
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={2}>
                            <Form.Item name="imss" label="IMSS">
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Panel>
                  </Collapse>

                  <Row flex>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                      <Button htmlType="button">Regresar</Button>
                    </Form.Item>
                  </Row>
                </Card>
              </Form>
              <Tabs
                type="card"
                defaultActiveKey="1"
                style={{ marginTop: "40px" }}
              >
                <TabPane tab="Generales" key="2">
                  Content of Tab Pane 2
                </TabPane>

                <TabPane tab="Adicionales" key="3">
                  Content of Tab Pane 3
                </TabPane>
              </Tabs>
            </Spin>
          </div>
        </Content>
      </Layout>
    </>
  );
};
export default userDetailForm;
