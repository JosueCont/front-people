import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Table, Typography, notification } from "antd";
import { FormattedMessage } from "react-intl";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import FormConfig from "../../../components/intranet/FormConfig";
import axios from "axios";
import { API_URL } from "../../../config/config";
import { connect } from "react-redux";
import WebApiIntranet from "../../../api/WebApiIntranet";

const configIntranet = ({user, ...props}) => {
  const { currentNode } = props;
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(null);
  const [getImage, setImage] = useState(null);
  const [validatePermition, setValidatePermition] = useState(true);

  useEffect(() => {
    getConfig();
  }, []);
  
  useEffect(() => {
    let isUserKhor = user?.sync_from_khor
    if(isUserKhor){
      let permsUser = user?.khor_perms;
      if( permsUser != null){
        let permYnl = user?.khor_perms.filter(item => item === "Khor Plus Red Social")
        if( permYnl.length > 0 ){
          setValidatePermition(true);
        }else{
          setValidatePermition(false);
        }
      }else{
        setValidatePermition(false);
      }
    }else{
      setValidatePermition(true);
    }
  }, [user]);

  const getConfig = async () => {
    setLoading(true);

    await WebApiIntranet.getConfig()
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

  const saveData = async (data, type, id = 0) => {
    if (type === "add") {
      await WebApiIntranet.saveIntranetConfig(data)
        .then((res) => {
          getConfig();
          notification["success"]({
            message: "Información guardada",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await WebApiIntranet.updIntranetConfig(id, data)
        .then((res) => {
          getConfig();
          notification["success"]({
            message: "Información actualizada",
          });
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
    <MainLayout currentKey={["intranet_configuration"]} defaultOpenKeys={["intranet"]}>
      <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
          <Breadcrumb.Item
              className={"pointer"}
              onClick={() => router.push({ pathname: "/home/persons/" })}
          >
          <FormattedMessage defaultMessage="Inicio" id="web.init" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Intranet</Breadcrumb.Item>
          <Breadcrumb.Item>Configuración</Breadcrumb.Item>
      </Breadcrumb>
      { validatePermition ? (
        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <FormConfig
            nodeId={currentNode ? currentNode.id : ""}
            config={config}
            save={saveData}
            saveImage={saveImage}
            getImage={getImage}
            loading={loading}
          />
        </div>
      ) : (
        <div className="notAllowed" />
      )
      }
      
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    user: state.userStore.user,
  };
};

export default connect(mapState)(withAuthSync(configIntranet));
