import { Spin, Row, Col, Typography, Divider } from "antd";

import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from "../../forms/FiscalInformation";

const FiscalInformationNode = ({ node_id, fiscal }) => {
  const { Title } = Typography;

  return (
    <>
      <Spin tip="Cargando..." spinning={false}>
        <Row>
          <Col span={24}>
            <Row>
              <Title style={{ fontSize: "15px" }}>Informacion fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalInformation node={node_id} />
            <Row>
              <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalAddress node={node_id} />
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default FiscalInformationNode;
