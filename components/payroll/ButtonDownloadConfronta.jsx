import {connect} from "react-redux";
import {withAuthSync} from "../../libs/auth";
import {DownloadOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {downLoadFileBlob, getDomain} from "../../utils/functions";
import {API_URL, API_URL_TENANT} from "../../config/config";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import { message,Modal,Row,Col } from "antd";
import SelectPatronalRegistration from "../selects/SelectPatronalRegistration";
import { getPatronalRegistration } from "../../redux/catalogCompany";

const ButtonDownloadConfronta=({getPatronalRegistration})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [regPatronalSelected, setRegPatronalSelected] = useState(null)
    const regPatronal = useSelector(state => state?.catalogStore?.cat_patronal_registration);

    useEffect(()=>{
        getPatronalRegistration()
    },[])


    useEffect(()=>{
        if(regPatronal && regPatronal.length===1){
            setRegPatronalSelected(regPatronal[0]?.id)
        }
    },[regPatronal])

    const downloadConfronta =async  () => {
        let node = localStorage.getItem('data');


        setLoading(true);

        let params = {
            node_id : parseInt(node),
            patronal_registration_id : regPatronalSelected
        }

        await downLoadFileBlob(
            `${getDomain(API_URL_TENANT)}/payroll/confront`,
            "confronta.xlsx",
            "POST",
            params,
            "No se encontró el documento de emisión"
        );

        setTimeout(() => {
            setLoading(false);
        }, 1000)

    };


      return (
          <>
              <Button
                  loading={loading}
                  icon={<DownloadOutlined />}
                  onClick={()=> (regPatronal && regPatronal.length===1)?downloadConfronta():setShowModal(true)}
              >
                  Generar confronta
              </Button>

              <Modal title="Generar confronta"
                     footer={[
                         <Button key="cancel" type="primary" loading={loading} onClick={()=>setShowModal(false)}>
                             Cancelar
                         </Button>,
                         <Button key="submit" type="primary" loading={loading} onClick={()=>downloadConfronta()}>
                             Generar
                         </Button>
                     ]}
                     visible={showModal}
                     onCancel={()=>setShowModal(false)}
              >
                  <Row>
                      <Col span={24}>
                            <SelectPatronalRegistration onChange={(val)=> setRegPatronalSelected(val) }/>
                      </Col>
                  </Row>

              </Modal>
          </>

      )
}

const mapState = (state) => {
    return {
        cat_patronal_registration: state.catalogStore.cat_patronal_registration,
        errorData: state.catalogStore.errorData,
    };
};
export default connect(mapState, { getPatronalRegistration })(
    ButtonDownloadConfronta
);