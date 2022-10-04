import React, { useEffect, useState } from "react";
import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Table, Typography } from "antd";
import { FormattedMessage } from "react-intl";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../../../config/config";
import PersonalizationForm from "../../../components/personalization/PersonalizationForm";
const personalizationConfig = () => {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(null);
  const [getImage, setImage] = useState(null);

  const [getIcon, setIcon] = useState(null);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = () => {
    setLoading(true);

    axios
      .get(API_URL + "/setup/site-configuration/")
      .then((res) => {
        setConfig(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const saveData = (data, type, id = 0) => {
    if (type === "add") {
      axios
        .post(API_URL + "/setup/site-configuration/", data)
        .then((res) => {
          getConfig();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .put(API_URL + `/setup/site-configuration/${id}/`, data)
        .then((res) => {
          getConfig();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const saveImage = (data, type, id = 0) => {
    if (type === "add") {
      axios
        .post(API_URL + "/setup/site-configuration/", data)
        .then((res) => {
          if (res.data.concierge_logo) {
            setImage(res.data.concierge_logo);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .put(API_URL + `/setup/site-configuration/${id}/`, data)
        .then((res) => {
          if (res.data.concierge_logo) {
            setImage(res.data.concierge_logo);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const saveIcon = (data, type, id = 0) => {
    if (type === "add") {
      axios
        .post(API_URL + "/setup/site-configuration/", data)
        .then((res) => {
          if (res.data.concierge_icon) {
            setIcon(res.data.concierge_icon);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .put(API_URL + `/setup/site-configuration/${id}/`, data)
        .then((res) => {
          if (res.data.concierge_icon) {
            setIcon(res.data.concierge_icon);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <MainLayout currentKey="11.2">
      <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => Router.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Configuración</Breadcrumb.Item>
          <Breadcrumb.Item>Personalización</Breadcrumb.Item>
        </Breadcrumb>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 380, height: "100%" }}
      >
        <PersonalizationForm
          config={config}
          save={saveData}
          saveImage={saveImage}
          saveIcon={saveIcon}
          getImage={getImage}
          getIcon={getIcon}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default withAuthSync(personalizationConfig);
