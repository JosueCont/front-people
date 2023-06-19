import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import MainLayout from "../../../layout/MainInter";
import FormGroup from "../../../components/intranet/FormGroup";
import { Table, Breadcrumb, Button, Popconfirm, message, ConfigProvider } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import DetailGroup from "../../../components/intranet/DetailGroup";
import { useRouter } from "next/router";
import { withAuthSync } from "../../../libs/auth";
import AddPeopleGroup from "../../../components/intranet/AddPeopleGroup";
import WebApiIntranet from "../../../api/WebApiIntranet";
import { useSelector } from 'react-redux'
import { verifyMenuNewForTenant } from "../../../utils/functions";
import esES from "antd/lib/locale/es_ES";

const GroupView = ({ ...props }) => {
  const router = useRouter();

  const { Column } = Table;
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [group, setGroup] = useState({});
  const [isDetail, setIsDetail] = useState(false);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const isBrowser = () => typeof window !== "undefined";
  const validateUser = useSelector((state) => state.userStore)
  const [validatePermition, setValidatePermition] = useState(true);

  useEffect(() => {
    if (isBrowser()) {
      setCompanyId(localStorage.getItem("data"));
    }
  }, []);

  useEffect(() => {
    let isUserKhor = validateUser?.user?.sync_from_khor
    if(isUserKhor){
      let permsUser = validateUser?.user?.khor_perms;
      if( permsUser != null){
        let permYnl = validateUser?.user?.khor_perms.filter(item => item === "Khor Plus Red Social")
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
  }, [validateUser]);

  useEffect(() => {
    if (companyId) {
      getGroups();
    }
  }, [companyId]);

  const showModal = () => {
    setEdit(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    getGroups();
  };

  const goToDetails = (group) => {
    setGroup(group);
    setIsDetail(true);
  };

  const goToAddUpdatePerson = (group) => {
    setGroup(group);
    setModalAddVisible(true);
  };
  const handleCancelAddUpdatePerson = () => {
    setModalAddVisible(false);
    getGroups();
  };

  const goToEdit = (group) => {
    setEdit(true);
    setGroup(group);
    setIsModalVisible(true);
  };

  function confirmDelete(group) {
    WebApiIntranet.deleteGroup(group.id)
      .then((res) => {
        getGroups();
        message.success("" + group.name + " fue eliminado");
      })
      .catch((e) => {});
  }

  const getGroups = async () => {
    if (companyId) {
      setLoading(true);
      setGroups([]);
      try {
        const res = await WebApiIntranet.getGroupList(companyId);
        if (res.data.count > 0) {
          setGroups(res.data.results);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    }
  };

  return (
    <MainLayout currentKey={["intranet_groups"]} defaultOpenKeys={["commitment","intranet"]}>
      <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          <FormattedMessage defaultMessage="Inicio" id="web.init" />
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Compromiso</Breadcrumb.Item>
        }
          <Breadcrumb.Item>KHOR Connect</Breadcrumb.Item>
        <Breadcrumb.Item>Grupos</Breadcrumb.Item>
      </Breadcrumb>
      { validatePermition ? (
        <div className="container" style={{ width: "100%" }}>
          <div className="top-container-border-radius">
            <Button type="primary" onClick={showModal}>
              + Agregar nuevo
            </Button>
          </div>

          {isModalVisible && (
            <FormGroup
              isEdit={edit}
              group={group}
              companyId={companyId}
              visible={isModalVisible}
              close={handleCancel}
            />
          )}
          {isDetail && (
            <DetailGroup group={group} visible={isDetail} close={setIsDetail} />
          )}

          {modalAddVisible && (
            <AddPeopleGroup
              group={group}
              visible={modalAddVisible}
              setVisible={handleCancelAddUpdatePerson}
            />
          )}
          <ConfigProvider locale={esES}>
          <Table
            dataSource={groups}
            pagination={{showSizeChanger:true}}
            key="table_groups"
            loading={loading}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          >
            <Column
              title="Imagen"
              dataIndex="image"
              key="image"
              render={(image) =>
                image ? <img src={image} style={{ width: 100 }} /> : "N/A"
              }
            />
            <Column title="Nombre" dataIndex="name" key="name" />
            <Column
              title="Acciones"
              key="actions"
              render={(text, record) => (
                <>
                  <UserOutlined
                    className="icon_actions"
                    onClick={() => goToAddUpdatePerson(record)}
                    key={"goAddPersons_" + record.id}
                  />

                  <EyeOutlined
                    className="icon_actions"
                    onClick={() => goToDetails(record)}
                    key={"goDetails_" + record.id}
                  />
                  <EditOutlined
                    className="icon_actions"
                    onClick={() => goToEdit(record)}
                    key={"edit_" + record.id}
                  />

                  <Popconfirm
                    title={"¿Deseas eliminar " + record.name + "?"}
                    okText="Aceptar"
                    cancelText="Cancelar"
                    onConfirm={() => confirmDelete(record)}
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <DeleteOutlined
                      className="icon_actions"
                      key={"delete_" + record.id}
                    />
                  </Popconfirm>
                </>
              )}
            />
          </Table>
          </ConfigProvider>
        </div>
      ) : (
        <div className="notAllowed" />
      )

      }
      
    </MainLayout>
  );
};
export default withAuthSync(GroupView);
