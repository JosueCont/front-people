import { Form, Input, Row, Col, Select, Divider, Typography } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import WebApiPeople from "../../api/WebApiPeople";
import FiscalAddress from "./FiscalAddress";

const PatronalRegistration = ({ node, formAddress, ...props }) => {
  const { Title } = Typography;

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  onchange = (value) => {
    getStates(value);
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    WebApiPeople.getCountries()
      .then((response) => {
        if (response.status === 200) {
          if (response.data.results.length > 0) {
            let countries = response.data.results.map((st) => {
              return { value: st.id, label: st.description };
            });
            setCountries(countries);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getStates = async (country) => {
    WebApiPeople.getStates(country)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.results.length > 0) {
            let states = response.data.results.map((a) => {
              return { value: a.id, label: a.name_state };
            });
            setStates(states);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Form layout={"vertical"} form={formAddress}>
      <Row gutter={20}>
        <Col lg={6} xs={22} >
          <Form.Item name="code" label="Codigo">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="postal_code" label="Actividad economica">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="phone" label="Telefono">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="subsidy_reimbursement_agreement" label="Acuerdo de reembolso de subsidio">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="state" label="Tipo de contribución">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="state" label="Representante legal">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} >
          <Form.Item name="state" label="Direccion fiscal">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* <Row>
        <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
      </Row>
      <Divider style={{ marginTop: "2px" }} />
      <FiscalAddress /> */}
    </Form>
  );
};
export default PatronalRegistration;
