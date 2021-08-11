import { Button, Card, Col, Row, Tabs, Typography } from "antd";
// import GeneralDataPErson from "../../components/forms/GeneralDataPerson";
import FormTraining from "../forms/FormTraining";
import FormPhone from "../forms/FormPhone";
import { ArrowLeftOutlined } from "@ant-design/icons";

const DetailPerson = ({ person, setLoading, ...props }) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;

  return (
    <>
      <Title level={3}>Información Personal</Title>
      <Title level={4} style={{ marginTop: 0 }}>
        {/* {personFullName} */}
        Jasson Manuel
      </Title>
      <Card bordered={true}>
        {/* <GeneralDataPErson person={person} setLoading={setLoading} /> */}
      </Card>
      <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
      <Tabs tabPosition={"left"}>
        <TabPane tab="Teléfono" key="tab_2">
          <FormPhone setLoading={setLoading} person_id={person.id} />
        </TabPane>
        <TabPane tab="Formación/Habilidades" key="tab_6">
          <FormTraining setLoading={setLoading} person_id={person.id} />
        </TabPane>
      </Tabs>
      <Row flex>
        <Col style={{ paddingTop: "2%", paddingBottom: "4%" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="primary"
            onClick={() => Router.push("/home")}
          >
            Regresar
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default DetailPerson;
