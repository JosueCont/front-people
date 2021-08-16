import { useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Spin } from "antd";
import { useState } from "react";
import DetailPerson from "../../../components/person/DetailPerson";
import WebApi from "../../../api/webApi";
import { connect } from "react-redux";
import { companySelected } from "../../../redux/UserDuck";
import FormSelfRegistration from "../../../components/forms/FormSelfRegistration";
import jsCookie from "js-cookie";

const userRegister = ({ ...props }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visibleForm, setVisibleForm] = useState(false);
  const [person, setPerson] = useState();
  const [khonnectId, setKhonnectId] = useState();
  const [modal, setModal] = useState(false);
  const [hideProfile, setHideProfile] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(jsCookie.get("token"));
      if (user) setHideProfile(true);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (router.query.uid) {
      let id = sessionStorage.getItem("tok");
      getCompany(router.query.uid);
      if (id) getPerson(id);
    }
  }, [router.query.uid]);

  const getCompany = async (data) => {
    try {
      let response = await WebApi.getCompanyPermanentCode(data);
      if (response.data.results.length > 0)
        props
          .companySelected(response.data.results[0].id)
          .then((res) => {
            if (!person) setVisibleForm(true);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
    } catch (error) {
      console.log(error);
    }
  };

  const getPerson = async (data) => {
    try {
      let response = await WebApi.getPerson(data);
      setPerson(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (person) {
      setVisibleForm(false);
    }
  }, [person]);

  useEffect(() => {
    if (khonnectId) {
      getPersonKhonnectId();
    }
  }, [khonnectId]);

  const getPersonKhonnectId = async () => {
    try {
      let response = await WebApi.personForKhonnectId({
        id: khonnectId,
      });
      sessionStorage.setItem("tok", response.data.id);
      setPerson(response.data);
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {props.currentNode && props.config ? (
        <MainLayout
          logoNode={props.currentNode.image}
          companyName={props.currentNode.name}
          hideMenu={true}
          hideProfile={hideProfile}
          onClickImage={false}
        >
          <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item>/Registro</Breadcrumb.Item>
          </Breadcrumb>
          <Spin tip="Cargando..." spinning={loading}>
            {props.currentNode && !person ? (
              <FormSelfRegistration
                node={props.currentNode.id}
                visible={visibleForm}
                hideProfileSecurity={false}
                intranetAccess={false}
                close={(value) => setVisibleForm(value)}
                nameNode={props.currentNode.name}
                setPerson={setPerson}
                setKhonnectId={setKhonnectId}
                login={true}
                modal={modal}
                setModal={setModal}
                config={props.config}
              />
            ) : (
              person && (
                <div
                  className="site-layout-background"
                  style={{ padding: 24, minHeight: 380, height: "100%" }}
                >
                  <DetailPerson
                    person={person}
                    setLoading={setLoading}
                    deletePerson={false}
                    hideProfileSecurity={false}
                  />
                </div>
              )
            )}
          </Spin>
        </MainLayout>
      ) : (
        <div
          style={{
            padding: "10%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin tip="Cargando..." spinning={loading} />
        </div>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
  };
};

export default connect(mapState, { companySelected })(userRegister);
