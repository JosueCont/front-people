import {connect} from "react-redux";
import {withAuthSync} from "../../libs/auth";
import {DownloadOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {downLoadFileBlob, getDomain} from "../../utils/functions";
import {API_URL_TENANT} from "../../config/config";
import {useState} from "react";
import { useSelector } from 'react-redux';


const ButtonDownloadConfronta=()=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const regPatronal = useSelector(state => state.catalogStore.cat_patronal_registration);

    const downloadConfronta =async  () => {
        let node = localStorage.getItem('data');
        //validamos si hay mas de un reg patronal
        if(regPatronal && regPatronal.length>1){
            setShowModal(true)
            return
        }

        setLoading(true);

        let params = {
            node : node,
            patronal_registration : regPatronal &&  regPatronal[0].id
        }
        await downLoadFileBlob(
            `${getDomain(API_URL_TENANT)}/payroll/confront`,
            "confronta.xlsx",
            "POST",
            params
        );
        setLoading(false);
    };


      return (
          <Button
              className={"ml-20"}
              style={{ marginBottom: "10px" }}
              loading={loading}
              icon={<DownloadOutlined />}
              onClick={()=> downloadConfronta()}
          >
              Generar confronta
          </Button>
      )
}


export default ButtonDownloadConfronta;
