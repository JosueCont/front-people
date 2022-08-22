import { Form, Input, Row, Col, Select } from "antd";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import WebApiFiscal from "../../../api/WebApiFiscal";
import { ruleRequired, ruleWhiteSpace } from "../../../utils/rules";
import SelectCountry from "../../selects/SelectCountry";
import SelectMunicipality from "../../selects/SelectMunicipality";
import SelectState from "../../selects/SelectState";
import SelectSuburb from "../../selects/SelectSuburb";

const FormFiscalAddress = ({ fiscalAddress, form, pos_cod, ...props }) => {
  const { Option } = Select;
  const [postalCode, setPostalCode] = useState([]);
  const [postalCodeSelect, setPostalCodeSelect] = useState(null);
  const [state, setState] = useState(null);
  const [value, setValue] = useState(null);

  // useEffect(() => {
  //   console.log("fiscal adress",fiscalAddress);
  //   if (fiscalAddress) setForm(fiscalAddress);
  // }, [fiscalAddress]);

  const getPostalCode = (value) => {
    if (props.versionCfdi)
      WebApiFiscal.getPostalCode(value, props.versionCfdi)
        .then((response) => {
          setPostalCode(response.data.results);
        })
        .catch((e) => {
          console.log(e);
        });
  };

  // const setForm = (data) => {
  //   console.log("setfomr data",data);
  //   setState(data.state.id);
  //   // setValue(data.postal_code);
  //   setPostalCodeSelect(data.postal_code);
  //   form.setFieldsValue({
  //     postal_code: data.postal_code.code,
  //     country: data.country.id,
  //     state: data.state.id,
  //     municipality: data.municipality.id,
  //     street: data.street,
  //     outdoor_number: data.outdoor_number,
  //     interior_number: data.interior_number,
  //     suburb: data.suburb,
  //   });
  // };

  useEffect(() => {
    if(pos_cod){
      setPostalCodeSelect(pos_cod);
    }
  }, [pos_cod]);


  const setPostalCodeSelected = (data) => {
    setState(data.state.id);
    setPostalCodeSelect(data);

    form.setFieldsValue({
      postal_code: data.code,
      country: data.state.country.id,
      state: data.state.id,
      municipality: data.municipality ? data.municipality.id : null,
    });
  };

  return (
    <>
      <Form layout={"vertical"} form={form}>
        <Row gutter={30}>
          <Col lg={8} xs={22} md={6}>
            <Form.Item
              rules={[ruleRequired, ruleWhiteSpace]}
              name="postal_code"
              label="Código postal"
            >
              <Select
                showSearch
                showArrow={false}
                notFoundContent={"No se encontraron resultados."}
                onSearch={getPostalCode}
                onChange={(value) =>
                  setPostalCodeSelected(
                    postalCode.find((item) => item.id === value)
                  )
                }
                filterOption={false}
                filterSort={false}
              >
                {postalCode.length > 0 &&
                  postalCode.map((item) => {
                    return (
                      <>
                        (
                        <Option key={item.code} value={item.id}>
                          {item.code}
                        </Option>
                        ; )
                      </>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectCountry />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectState setState={setState} />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectMunicipality state={state && state} />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectSuburb
              postal_code={pos_cod}
            />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="street" label="Calle">
              <Input maxLength={35} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="outdoor_number" label="Número exterior">
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="interior_number" label="Número interior">
              <Input maxLength={10} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const mapState = (state) => {
  return {
    versionCfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState)(FormFiscalAddress);
