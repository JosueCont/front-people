import {React, useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainInter'
import { Breadcrumb, Tabs, Row, Col, Select,Form, Menu, Avatar, Input, Radio, Space, Spin} from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { css, Global } from "@emotion/core";
import { useSelector, useDispatch } from 'react-redux'
import { verifyMenuNewForTenant } from '../../../utils/functions';
import LisPeopleYNL from '../../../components/dashboard-ynl/PepleYNL';
import { getListPeopleYNL } from '../../../redux/ynlDuck';


const index = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const reportPerson = useSelector((state) => state.ynlStore)
    const validateUser = useSelector((state) => state.userStore)
    const loader = useSelector(state => state?.ynlStore.loadPeople)

    const [validatePermition, setValidatePermition] = useState(true);

    useEffect(() => {
        let isUserKhor = validateUser?.user?.sync_from_khor;
        let isAdmin = validateUser?.user?.is_admin;
        if (isAdmin) {
            setValidatePermition(true);
        } else {
            if (isUserKhor){
                let permsUser = validateUser?.user?.khor_perms;
                if (permsUser != null) {
                    let permYnl = validateUser.user.khor_perms.filter(item => item === "Khor Plus YNL")
                    if (permYnl.length > 0 ) {
                        setValidatePermition(true);
                    } else {
                        setValidatePermition(false);
                    }
                } else {
                    setValidatePermition(false);
                }
            } else {
                setValidatePermition(false);
            }
        }
    }, [validateUser]);

    useEffect(() => {
        getDataPeople()
    },[])


    const getDataPeople = async() => {
        let dataSend = {
            "page": 1,
            "pageSize": 15,
            "filter": ''
        }
        dispatch(getListPeopleYNL(dataSend) )
    }

    return(
        <Spin spinning={loader}>
            <MainLayout currentKey={["ynl_people_dashboard"]} defaultOpenKeys={["commitment","ynl"]}>
                <Global />
                <Breadcrumb>
                  <Breadcrumb.Item
                      className={"pointer"}
                      onClick={() => router.push({ pathname: "/home/persons/" })}
                  >
                      <FormattedMessage defaultMessage="Inicio" id="web.init" />
                  </Breadcrumb.Item>
                  {verifyMenuNewForTenant() && 
                    <Breadcrumb.Item>Compromiso</Breadcrumb.Item>
                  }
                  <Breadcrumb.Item>YNL</Breadcrumb.Item>
                  <Breadcrumb.Item>Personas YNL</Breadcrumb.Item>
              </Breadcrumb>
              { validatePermition ? (
                <div className="container" style={{ width: "100%" }}>
                  <Row>
                      <Col lg={24} xs={24} md={18}>
                          <LisPeopleYNL setReload={() => getDataPeople()}/>
                      </Col>
                  </Row>
                </div>
              ) : (
                <div className="notAllowed" />
              )
              }
            </MainLayout>
        </Spin>
    )
}

export default index;