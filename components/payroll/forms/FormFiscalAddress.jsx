import { Form, Input, Row, Col, Select, Typography } from "antd";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import WebApiFiscal from "../../../api/WebApiFiscal";
import { ruleRequired, ruleWhiteSpace } from "../../../utils/rules";
import SelectCountry from "../../selects/SelectCountry";
import SelectMunicipality from "../../selects/SelectMunicipality";
import SelectState from "../../selects/SelectState";
import AddPostalCodeModal from '../../../components/modal/AddPostalCodeModal'
import SelectSuburb from "../../selects/SelectSuburb";
import { PlusOneOutlined } from "@material-ui/icons";
import { PlusOutlined } from "@ant-design/icons";

const FormFiscalAddress = ({ fiscalAddress, form, ...props }) => {
  const { Option } = Select;
  const { Text } = Typography

  const [postalCode, setPostalCode] = useState([]);
  const [postalCodeSelect, setPostalCodeSelect] = useState(null);
  const [state, setState] = useState(null);
  const [suburb, setSuburb] = useState(null);
  const [openModalCP, setOpenModalCP] = useState(false)

  useEffect(() => {
    if (fiscalAddress) setForm(fiscalAddress);
  }, [fiscalAddress]);

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

  const setForm = (data) => {
    console.log('Data', data)
    setState(data.state.id);
    setPostalCodeSelect(data.postal_code);
    if (data.suburb) setSuburb(data.suburb.description);
    form.setFieldsValue({
      postal_code: data.postal_code.code,
      country: data?.country?.id,
      state: data?.state?.id,
      municipality: data?.municipality?.id,
      street: data.street,
      suburb: data.suburb_name ? data.suburb_name : null,
      outdoor_number: data.outdoor_number,
      interior_number: data.interior_number,
    });
  };


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
              extra={
              <Text onClick={() => setOpenModalCP(true)} style={{ cursor:'pointer', textDecoration:'underline' }} >Agregar nuevo <PlusOutlined /> </Text>
            }
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
                        <Option key={item.id} value={item.id}>
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
            <SelectCountry disabled={true} />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectState disabled={true} setState={setState} />
          </Col>
          <Col lg={8} xs={22} md={6}>
            <SelectMunicipality state={state && state} />
          </Col>
          <Col lg={8} xs={22} md={6}>
          <Form.Item
            key="itemPlace"
            name={"suburb"}
            label={"Colonia"}
          >
            <Input />
          </Form.Item>
            {/* <SelectSuburb
               postal_code={postalCodeSelect && postalCodeSelect.id}
              suburb={suburb}
            /> */}
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="street" label="Calle">
              <Input maxLength={35} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="outdoor_number" label="Número exterior">
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={6}>
            <Form.Item name="interior_number" label="Número interior">
              <Input maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <AddPostalCodeModal isVisible={openModalCP} setIsVisible={setOpenModalCP}  getPostalCode={getPostalCode} onSuccess={setPostalCodeSelected} />
    </>
  );
};

const mapState = (state) => {
  return {
    versionCfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState)(FormFiscalAddress);
