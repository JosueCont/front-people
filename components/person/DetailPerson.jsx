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
import FiscalAddressPerson from '../forms/FiscalAddressPerson'
import DataPerson from "../forms/DataPerson";
import FormFamily from "../forms/FormFamily";
import FormEmergencyContact from "../forms/FormEmergencyContact";
import FormBankAccount from "../forms/FormBankAccount";
import FormGeneralData from "../forms/FormGeneralData";
import FormChangePassword from "../forms/FormChangePassword";
import FormDocument from "../forms/FormDocument";
import FormPayrollPerson from "../payroll/forms/FormPayrollPerson";
import FormImssInfonavit from "../payroll/forms/FormImssInfonavit";
import FormVacationRecord from "../payroll/forms/FormVacationRecord";
import Payment from '../payroll/Payment'
import TruoraCheck from '../TruoraCheck';
import { useEffect, useState } from "react";
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
  MedicineBoxOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  SecurityScanOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Router from "next/router";
import WebApiPeople from "../../api/WebApiPeople";
import { connect } from "react-redux";
import { getCompanyFiscalInformation } from "../../redux/fiscalDuck";
import ImssInfonavit from "../panes/person/ImssInfonavit";

/** */

const DetailPerson = ({
  config,
  person=null,
  setLoading,
  deletePerson = true,
  hideProfileSecurity = true,
  setPerson,  
  getCompanyFiscalInformation,
  companyFiscalInformation = null,
  ...props
}) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;
  const [deleted, setDeleted] = useState({});
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const [refreshTab12,setRefreshTab12] = useState(false)
  const [refreshTab10,setRefreshTab10] = useState(false)

  useEffect(()=>{
    getCompanyFiscalInformation();
  },[person])

  const showModal = () => {
    modal ? setModal(false) : setModal(true);
  };

  const setDeleteRegister = (props) => {
    setDeleted(props);
    showModal();
  };

  const deletePersons = (data) => {
    WebApiPeople.deletePerson({
      persons_id: person.id,
    }).then((response) => {
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
    if (deleted.api == "deletePerson") deletePersons(deleted.id);
    if (deleted.api == "deletePhone") deletePhone(deleted.id);
    if (deleted.api == "deleteContEm") deleteContEm(deleted.id);
    if (deleted.api == "deleteFamily") deleteFamily(deleted.id);
    if (deleted.api == "deleteDocument") deleteDocument(deleted.id);
  };

  const processTabs=(tab_code)=>{
    if(tab_code==='tab_12'){
      setRefreshTab12(true)
    }else if(tab_code==='tab_10'){
      setRefreshTab10(true)
    }else{
      setRefreshTab12(false)
      setRefreshTab10(false)
    }
  }

  const getNewFilters = () => {
    let newFilters = { ...router.query };
    if (newFilters.id) delete newFilters.id;
    return newFilters;
  };

  const actionBack = () => {
    let filters = getNewFilters();
    router.push({
      pathname: "/home/persons",
      query: filters,
    });
  };

  return (
    <>
      <Title level={3}>Información Personal</Title>      
      <Card bordered={true}>
        <Row>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 0 }}>
              {!person.mlast_name
                ? person.first_name + " " + person.flast_name
                : person.first_name +
                  " " +
                  person.flast_name +
                  " " +
                  person.mlast_name}
            </Title>
          </Col>
          <Col
            span={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button icon={<ArrowLeftOutlined />} onClick={() => actionBack()}>
              Regresar
            </Button>
          </Col>
        </Row>
        <DataPerson
          setPerson={(data)=> {
            setPerson(data)
            setRefreshTab10(true)
            setRefreshTab12(true)
          }}
          config={config}
          person={person}
          setLoading={setLoading}
          hideProfileSecurity={hideProfileSecurity}
          assimilated_pay={companyFiscalInformation?.assimilated_pay}
        />
        <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
        <Tabs onTabClick={(tabcode) => processTabs(tabcode)} tabPosition="left">
          {config?.nomina_enabled && (
            <TabPane
              tab={
                  <div className="container-title-tab">
                    <BookOutlined />
                    <div className="text-title-tab">Nómina</div>
                  </div>
              }
              key="tab_10"
            >
              <FormPayrollPerson
                refreshtab={refreshTab10}
                refreshTab12 = {refreshTab12}
                onFinishRefresh={()=>setRefreshTab10(false)}
                onFinishRefreshTab12 = {()=> setRefreshTab12(false)}
                person={person} 
                node={person.node}
                person_id={person.id}
                assimilated_pay={companyFiscalInformation?.assimilated_pay}
              />
             
            </TabPane>
          )}          

          {companyFiscalInformation?.assimilated_pay == false && 
           <TabPane
            tab={
                <div className="container-title-tab">
                  <MedicineBoxOutlined />
                  <div className="text-title-tab">INFONAVIT</div>
                </div>
            }
            key="tab_12"
          >
            <ImssInfonavit
            person={person}
            refreshtab={refreshTab12}
            onFinishRefresh={()=>setRefreshTab12(false)}
            person_id={person.id}
            node={person.node}/>
          </TabPane>}
          {config?.nomina_enabled && (
              <TabPane
                  tab={
                    <div className="container-title-tab">
                      <DollarOutlined />
                      <div className="text-title-tab">Pagos diferidos</div>
                    </div>
                  }
                  key="tab_16"
              >
                <Payment person_id={person.id} />
              </TabPane>
          )}

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
                <div className="container-title-tab">
                  <CalendarOutlined />
                  <div className="text-title-tab">Vacaciones</div>
                </div>
            }
            key="tab_13"
          >
            <FormVacationRecord
              person={person}
              person_id={person.id}
              node={person.node}
            />
          </TabPane>
          <TabPane
            tab={
                <div className="container-title-tab">
                  <PhoneOutlined />
                  <div className="text-title-tab">Teléfono</div>
                </div>
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
            <FiscalAddressPerson person_id={person.id} />
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
              <Tooltip title="Usuario">
                <div className="container-title-tab">
                  <KeyOutlined />
                  <div className="text-title-tab">Usuario</div>
                </div>
              </Tooltip>
            }
            key="tab_9"
          >
            <FormChangePassword
              config={config}
              khonnectId={person.khonnect_id}
              person_user={person}
            />
          </TabPane>

          {
            (props?.applications && (_.has(props.applications, "truora") && props.applications["truora"].active)) &&
            <TabPane
              tab={
                <Tooltip title="Usuario">
                  <div className="container-title-tab">
                    <SecurityScanOutlined />
                    <div className="text-title-tab">Truora</div>
                  </div>
                </Tooltip>
              }
              key="tab_14"
            >
              <TruoraCheck person={person} />
            </TabPane>
          }

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

              {
                  (props?.userStore?.id === person.id) ? <p>No puedes eliminar tu usuario</p> : <Row style={{ padding: "2%" }}>
                    <Col>
                      <p>Al eliminar a una persona perderá todos los datos relacionados a
                        ella de manera permanente.</p>
                      <Button
                          type="primary"
                          danger
                          icon={<WarningOutlined />}
                          onClick={() =>
                              setDeleteRegister({
                                id: person.id,
                                api: "deletePerson",
                              })
                          }
                      >
                        Eliminar persona
                      </Button>
                    </Col>
                  </Row>
              }

            </TabPane>
          )}

          
        </Tabs>
      </Card>
      <Modal
        title="Eliminar"
        visible={modal}
        onOk={deleteRegister}
        onCancel={showModal}
        okText="Sí, eliminar"
        cancelText="Cancelar"
      >
        Al eliminar este registro, perderá todos los datos relacionados a él de
        manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal>
    </>
  );
};

const mapState = (state) => {
  return {
    applications: state.userStore.applications,
    userStore: state.userStore.user,
    companyFiscalInformation: state.fiscalStore.company_fiscal_information
  };
};

export default connect(mapState, {getCompanyFiscalInformation})(DetailPerson);