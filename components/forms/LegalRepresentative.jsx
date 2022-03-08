import { Form, Input, Button, message, Row, Col, Select } from "antd";
import Title from "antd/lib/skeleton/Title";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../../config/config";

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
    axios
      .get(API_URL + `/fiscal/country/`)
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
    axios
      .get(API_URL + `/fiscal/state/?country=${country}`)
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
          if (response.data.results.length > 0) {
            form.setFieldsValue({
              curp: "",
              tax_regime: "",
            });
            /* let states = response.data.results.map((a) => {
              return { value: a.id, label: a.name_state };
            });
            setStates(states); */
          }
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
          <Form.Item name="name_representative" label="Nombre">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="position_representative" label="Plaza">
            <Select
              options={states}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="email_representative" label="Email">
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
