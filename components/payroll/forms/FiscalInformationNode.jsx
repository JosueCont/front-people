import { Spin, Row, Col, Typography, Divider, Form, Button } from "antd";
import { useLayoutEffect, useState } from "react";
import WebApiPeople from "../../../api/WebApiPeople";

import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from "../../forms/FiscalInformation";

const FiscalInformationNode = ({ node_id = nuull, fiscal }) => {
  const { Title } = Typography;
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);

  useLayoutEffect(() => {
    if (node_id) {
      WebApiPeople.getfiscalInformationNode(node_id)
        .then((response) => {
          console.log(response.data);
          setFiscalData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [node_id]);

  const saveForms = () => {
    console.log("FISCAL-->> ", formFiscal.getFieldsValue());
    console.log("FISCAL-->> ", formAddress.getFieldsValue());
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Divider style={{ marginTop: "2px" }} />
          <FiscalInformation
            form={formFiscal}
            fiscalData={fiscalData && fiscalData}
          />
          <Row>
            <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <FiscalAddress
            fiscalAddress={fiscalData && fiscalData.fiscal_address}
            form={formAddress}
          />
        </Col>
      </Row>
      <Button onClick={saveForms}>Click</Button>
    </>
  );
};

export default FiscalInformationNode;
