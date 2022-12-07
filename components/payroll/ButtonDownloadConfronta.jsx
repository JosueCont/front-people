import {connect} from "react-redux";
import {withAuthSync} from "../../libs/auth";
import {DownloadOutlined} from "@ant-design/icons";
import {Button, message} from "antd";
import {downLoadFileBlob, getDomain} from "../../utils/functions";
import {API_URL_TENANT, API_URL} from "../../config/config";
import {useState} from "react";
import { useSelector } from 'react-redux';
import Axios from "axios";


const ButtonDownloadConfronta=()=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const regPatronal = useSelector(state => state.catalogStore.cat_patronal_registration);

    const downloadConfronta = async  () => {
        let url = '/payroll/confront'
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

        try {

            let response = await Axios.post(API_URL + url, params)
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = item && "confronta.xlsx";
              link.click();
            
        } catch (error) {
            let errorMessage = error?.response?.data?.message || ""
            errorMessage !== "" && message.error(errorMessage)
        } finally {
            setLoading(false);
        }
        
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
