import { Form, Input, Row, Col, Select, Button } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";

const FiscalAddress = ({ node, formAddress, ...props }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  onchange = (value) => {
    getStates(value);
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    WebApiFiscal.getCountries()
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
    WebApiFiscal.getStates(country)
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

  const submitForm = (values) => {};

  return (
    <Form layout={"vertical"} form={formAddress} onFinish={submitForm}>
      <Row gutter={30}>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="postal_code" label="Codigo postal">
            <Input />
            {/* <Select
              options={countries}
              notFoundContent={"No se encontraron resultados."}
              onChange={onchange}
            /> */}
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="country" label="Pais">
            <Select
              options={countries}
              notFoundContent={"No se encontraron resultados."}
              onChange={onchange}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="state" label="Estado">
            <Select
              showSearch
              options={states}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="municipality" label="Municipio">
            <Input maxLength={100} />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="suburb" label="Suburbio">
            <Input maxLength={100} />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="street" label="Calle">
            <Input maxLength={35} />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="outdoor_number" label="Numero exterior">
            <Input maxLength={10} />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={6}>
          <Form.Item name="interior_number" label="Numero interior">
            <Input maxLength={10} />
          </Form.Item>
        </Col>
        <Col span={24} style={{ textAlign: "end" }}>
          <Form.Item>
            <Button type="submit">Guardar</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default FiscalAddress;
