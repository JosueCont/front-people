import { Card, Tabs, Typography } from "antd";
import FormTraining from "../forms/FormTraining";
import FormPhone from "../forms/FormPhone";
import FormAddress from "../forms/FormAddress";
import DataPerson from "../forms/DataPerson";
import FormFamily from "../forms/FormFamily";
import FormEmergencyContact from "../forms/FormEmergencyContact";
import FormBankAccount from "../forms/FormBankAccount";

const DetailPerson = ({ person, setLoading, deletePerson, ...props }) => {
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
        <DataPerson person={person} setLoading={setLoading} />
      </Card>
      <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
      <Tabs tabPosition={"left"}>
        <TabPane tab="Datos generales" key="tab_1"></TabPane>
        <TabPane tab="Teléfono" key="tab_2">
          <FormPhone person_id={person.id} />
        </TabPane>
        <TabPane tab="Dirección" key="tab_3">
          <FormAddress person_id={person.id} />
        </TabPane>
        <TabPane tab="Familia" key="tab_4">
          <FormFamily person_id={person.id} />
        </TabPane>
        <TabPane tab="Contactos de emergencia" key="tab_5">
          <FormEmergencyContact person_id={person.id} />
        </TabPane>
        <TabPane tab="Formación/Habilidades" key="tab_6">
          <FormTraining person_id={person.id} />
        </TabPane>
        <TabPane tab="Cuentas bancarias" key="tab_7">
          <FormBankAccount person_id={person.id} />
        </TabPane>
        <TabPane tab="Cambiar contraseña" key="tab_8"></TabPane>
        {deletePerson && <TabPane tab="Eliminar persona" key="tab_9"></TabPane>}
      </Tabs>
    </>
  );
};

export default DetailPerson;
