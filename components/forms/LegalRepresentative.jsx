import { Form, Input, Button, message, Row, Col, Select } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import WebApiPeople from "../../api/WebApiPeople";

const LegalRepresentative = ({ node, ...props }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [form] = Form.useForm();

  console.log('node ====>', node);

  onchange = (value) => {
    getStates(value);
  };

  useEffect(() => {
    getCountries();
    getLegalRepresentative();
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

  const getLegalRepresentative = async () => {
    axios
      .get(API_URL + `/business/legal-representative/?node=${node}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          /* if (response.data.results.length > 0) {
            let states = response.data.results.map((a) => {
              return { value: a.id, label: a.name_state };
            });
            setStates(states);
          } */
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  

  return (
    <Form layout={"vertical"} form={form}>
      <Row>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="postal_code" label="Nombre">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="state" label="Plaza">
            <Select
              options={states}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="country" label="Email">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="country" label="Telefono">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={13} xs={22} offset={1}>
          <Form.Item name="country" label="Direccion">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default LegalRepresentative;
