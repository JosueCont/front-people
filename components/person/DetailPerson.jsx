import {
  Card,
  Tabs,
  Typography,
  Modal,
  Row,
  Col,
  Button,
  message,
  Tooltip,
} from "antd";
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
import { useState } from "react";
import {
  BankOutlined,
  BookOutlined,
  ContactsOutlined,
  DeleteOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FormOutlined,
  KeyOutlined,
  PhoneOutlined,
  UsergroupDeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Router from "next/router";
import WebApiPeople from "../../api/WebApiPeople";

const DetailPerson = ({
  config,
  person,
  setLoading,
  deletePerson = true,
  hideProfileSecurity = true,
  setPerson,
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
    WebApiPeople.deletePerson
      .then((response) => {
        setLoading(false);
        showModal();
        message.success("Eliminado correctamente.");
        Router.push("/home/persons/");
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
      <Card bordered={true}>
        <Title level={4} style={{ marginTop: 0 }}>
          {!person.mlast_name
            ? person.first_name + " " + person.flast_name
            : person.first_name +
              " " +
              person.flast_name +
              " " +
              person.mlast_name}
        </Title>
        <DataPerson
          setPerson={setPerson}
          config={config}
          person={person}
          setLoading={setLoading}
          hideProfileSecurity={hideProfileSecurity}
        />
        <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
        <Tabs tabPosition="left">
          <TabPane
            tab={
              <Tooltip title="Datos generales">
                <div className="container-title-tab">
                  <FormOutlined />
                  <div className="text-title-tab">Datos generales</div>
                </div>
              </Tooltip>
            }
            key="tab_1"
          >
            <FormGeneralData person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Teléfono">
                <div className="container-title-tab">
                  <PhoneOutlined />
                  <div className="text-title-tab">Teléfono</div>
                </div>
              </Tooltip>
            }
            key="tab_2"
          >
            <FormPhone person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Dirección">
                <div className="container-title-tab">
                  <EnvironmentOutlined />
                  <div className="text-title-tab">Dirección</div>
                </div>
              </Tooltip>
            }
            key="tab_3"
          >
            <FormAddress person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Familia">
                <div className="container-title-tab">
                  <UsergroupDeleteOutlined />
                  <div className="text-title-tab">Familia</div>
                </div>
              </Tooltip>
            }
            key="tab_4"
          >
            <FormFamily person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Contactos de emergencia">
                <div className="container-title-tab">
                  <ContactsOutlined />
                  <div className="text-title-tab">Contactos de emergencia</div>
                </div>
              </Tooltip>
            }
            key="tab_5"
          >
            <FormEmergencyContact person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Formación y habilidades">
                <div className="container-title-tab">
                  <BookOutlined />
                  <div className="text-title-tab">Formación y habilidades</div>
                </div>
              </Tooltip>
            }
            key="tab_6"
          >
            <FormTraining person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Cuentas bancarias">
                <div className="container-title-tab">
                  <BankOutlined />
                  <div className="text-title-tab">Cuentas bancarias</div>
                </div>
              </Tooltip>
            }
            key="tab_7"
          >
            <FormBankAccount person_id={person.id} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Documentos">
                <div className="container-title-tab">
                  <FileTextOutlined />
                  <div className="text-title-tab">Documentos</div>
                </div>
              </Tooltip>
            }
            key="tab_8"
          >
            <FormDocument person_id={person.id} node={person.node} />
          </TabPane>
          <TabPane
            tab={
              <Tooltip title="Cambiar contraseña">
                <div className="container-title-tab">
                  <KeyOutlined />
                  <div className="text-title-tab">Cambiar contraseña</div>
                </div>
              </Tooltip>
            }
            key="tab_9"
          >
            <FormChangePassword
              config={config}
              khonnectId={person.khonnect_id}
            />
          </TabPane>

          {config.nomina_enabled && (
            <TabPane
              tab={
                <Tooltip title="Nómina">
                  <div className="container-title-tab">
                    <DollarOutlined />
                    <div className="text-title-tab">Nómina</div>
                  </div>
                </Tooltip>
              }
              key="tab_10"
            >
              <FormPayrollPerson person={person} node={person.node} />
            </TabPane>
          )}
          {deletePerson && (
            <TabPane
              tab={
                <Tooltip title="Eliminar persona">
                  <div className="container-title-tab">
                    <DeleteOutlined />
                    <div className="text-title-tab">Eliminar persona</div>
                  </div>
                </Tooltip>
              }
              key="tab_11"
            >
              Al eliminar a una persona perderá todos los datos relacionados a
              ella de manera permanente.
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
        </Tabs>
      </Card>
      <Modal
        title="Eliminar"
        visible={modal}
        onOk={deleteRegister}
        onCancel={showModal}
        okText="SíEliminar"
        cancelText="Cancelar"
      >
        Al eliminar este registro perderá todos los datos relacionados a el de
        manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal>
    </>
  );
};

export default DetailPerson;
