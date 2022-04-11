import { Spin, Row, Col, Typography, Divider, Form, Button } from "antd";
import WebApiPeople from "../../../api/WebApiPeople";

import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from "../../forms/FiscalInformation";

const FiscalInformationNode = ({ node_id = nuull, fiscal }) => {
  const { Title } = Typography;
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();

  useLayoutEffect(() => {
    if (node_id) {
      WebApiPeople.getfiscalInformationNode(node_id)
        .then((response) => {
          console.log("EMPRESA-->> ", response.data);
          setCompany(response.data.name);
        })
        .catch(() => {
          console.error(error);
        });
    }
  }, [node_id]);

  const saveForms = () => {
    console.log("FISCAL-->> ", formFiscal.getFieldsValue());
  };

  const setForms = (data) => {
    form.setFieldsValue({
      person_type: data.person_type,
      curp: data.curp,
      rfc: data.rfc,
      tax_regime: data.tax_regime,
      assimilated_pay: data.assimilated_pay,
      has_personnel_outsourcing: data.has_personnel_outsourcing,
    });
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={false}>
        <Row>
          <Col span={24}>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalInformation form={formFiscal} node={node_id} />
            <Row>
              <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalAddress node={node_id} form={formAddress} />
          </Col>
        </Row>
        <Button onClick={saveForms}>Click</Button>
      </Spin>
    </>
  );
};

export default FiscalInformationNode;
