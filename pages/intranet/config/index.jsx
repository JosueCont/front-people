import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Table, Typography } from "antd";
import { FormattedMessage } from "react-intl";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import FormConfig from "../../../components/intranet/FormConfig";
import axios from "axios";
import { API_URL } from "../../../config/config";

const configIntranet = () => {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(null);
  const [getImage, setImage] = useState(null);

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
        setLoadingImg(false);
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
          if (res.data.intranet_logo) {
            setImage(res.data.intranet_logo);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .put(API_URL + `/setup/site-configuration/${id}/`, data)
        .then((res) => {
          if (res.data.intranet_logo) {
            setImage(res.data.intranet_logo);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <MainLayout currentKey={["config"]} defaultOpenKeys={["intranet"]}>
      <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          <FormattedMessage defaultMessage="Inicio" id="web.init" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage defaultMessage="Configuración" id="header.config" />
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container-border-radius"
        style={{ padding: 24, minHeight: 380, height: "100%" }}
      >
        <FormConfig
          config={config}
          save={saveData}
          saveImage={saveImage}
          getImage={getImage}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default withAuthSync(configIntranet);
