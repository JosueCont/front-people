import { Card, Tabs, Typography, Modal, Row, Col, Button, message} from "antd";
import FormTraining from "../forms/FormTraining";
import FormPhone from "../forms/FormPhone";
import FormAddress from "../forms/FormAddress";
import DataPerson from "../forms/DataPerson";
import FormFamily from "../forms/FormFamily";
import FormEmergencyContact from "../forms/FormEmergencyContact";
import FormBankAccount from "../forms/FormBankAccount";
import FormGeneralData from "../forms/FormGeneralData";
import FormChangePassword from "../forms/FormChangePassword";
import FormDocument from "../forms/FormDocument";
import FormPayrollPerson from "../payroll/forms/FormPayrollPerson";
import { useEffect, useState } from "react";
import {WarningOutlined} from "@ant-design/icons";
import { API_URL } from "../../config/config";
import Axios from "axios";
import { useRouter } from "next/router";
import Router from "next/router";

const DetailPerson = ({
  config,
  person,
  setLoading,
  deletePerson = true,
  hideProfileSecurity = true,
  ...props
}) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;
  const [deleted, setDeleted] = useState({});
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const showModal = () => {
    modal ? setModal(false) : setModal(true);
  };

  const setDeleteRegister = (props) => {
    setDeleted(props);
    showModal();
  };

  const deletePersons = (data) => {
    Axios.post(API_URL + `/person/person/delete_by_ids/`, {
      persons_id: router.query.id,
    })
      .then((response) => {
        setLoading(false);
        showModal();
        message.success("Eliminado correctamente.");
        Router.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const deleteRegister = () => {
    if (deleted.api == "deleteBankAcc") deleteBankAcc(deleted.id);
    if (deleted.api == "deletePerson") deletePersons();
    if (deleted.api == "deletePhone") deletePhone(deleted.id);
    if (deleted.api == "deleteContEm") deleteContEm(deleted.id);
    if (deleted.api == "deleteFamily") deleteFamily(deleted.id);
    if (deleted.api == "deleteDocument") deleteDocument(deleted.id);
  };


  return (
    <>
      <Title level={3}>Información Personal</Title>
      <Title level={4} style={{ marginTop: 0 }}>
        {!person.mlast_name
          ? person.first_name + " " + person.flast_name
          : person.first_name +
            " " +
            person.flast_name +
            " " +
            person.mlast_name}
      </Title>
      <Card bordered={true}>
        <DataPerson
          config={config}
          person={person}
          setLoading={setLoading}
          hideProfileSecurity={hideProfileSecurity}
        />
        <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
        <Tabs tabPosition={"left"}>
          <TabPane tab="Datos generales" key="tab_1">
            <FormGeneralData person_id={person.id} />
          </TabPane>
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
          <TabPane tab="Documentos" key="tab_8">
            <FormDocument person_id={person.id} node={person.node} />
          </TabPane>
          <TabPane tab="Cambiar contraseña" key="tab_9">
            <FormChangePassword
              config={config}
              khonnectId={person.khonnect_id}
            />
          </TabPane>
          {deletePerson && (
            <TabPane tab="Eliminar persona" key="tab_10">
              Al eliminar a una persona perderá todos los datos
              relacionados a ella de manera permanente.
              <Row style={{ padding: "2%" }}>
                <Col>
                  <Button
                    type="primary"
                    danger
                    icon={<WarningOutlined />}
                    onClick={() =>
                      setDeleteRegister({
                        id: "",
                        api: "deletePerson",
                      })
                    }
                  >
                    Eliminar persona
                  </Button>
                </Col>
              </Row>
            </TabPane>
          )}
          {config.nomina_enabled && (
            <TabPane tab="Nomina" key="tab_11">
              <FormPayrollPerson person_id={person.id} node={person.node} />
            </TabPane>
          )}
        </Tabs>
      </Card>
       <Modal
        title="Eliminar"
        visible={modal}
        onOk={deleteRegister}
        onCancel={showModal}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      >
        Al eliminar este registro perderá todos los datos relacionados a el de
        manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal>
    </>
  );
};

export default DetailPerson;
