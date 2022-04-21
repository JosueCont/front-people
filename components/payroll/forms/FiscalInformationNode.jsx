import { Row, Col, Typography, Divider, Form, Button, message } from "antd";
import { useLayoutEffect, useState } from "react";
import WebApiPeople from "../../../api/WebApiPeople";
import { messageError, messageSaveSuccess } from "../../../utils/constant";

import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from "../../forms/FiscalInformation";
import LegalRepresentative from "../../forms/LegalRepresentative";

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
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
    const data = {
      node: node_id,
      fiscal: formFiscal.getFieldsValue(),
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
    };
    WebApiPeople.savefiscalInformation(data)
      .then((response) => {
        message.success(messageSaveSuccess);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
      });
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
          />{" "}
          <Row>
            <Title style={{ fontSize: "15px" }}>Representante legal</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <LegalRepresentative
            legalRepresentative={fiscalData && fiscalData.legal_representative}
            form={formLegalRep}
          />
        </Col>
      </Row>
      <Button onClick={saveForms}>Click</Button>
    </>
  );
};

export default FiscalInformationNode;
