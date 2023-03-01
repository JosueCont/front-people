import {connect} from "react-redux";
import {withAuthSync} from "../../libs/auth";
import {DownloadOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {downLoadFileBlob, getDomain} from "../../utils/functions";
import {API_URL, API_URL_TENANT} from "../../config/config";
import {useState} from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { message } from "antd";


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
            node_id : node,
            patronal_registration : regPatronal &&  regPatronal[0].id
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

        // try {

        //     let response = await axios.post(API_URL + '/payroll/confront', params)
        //     const blob = new Blob([response.data]);
        //     const link = document.createElement("a");
        //     link.href = window.URL.createObjectURL(blob);
        //     link.download = "Confronta.xlsx";
        //     link.click();
            
        // } catch (e) {
        //     let errorMessage = e.response?.data?.message || ""
        //     if (errorMessage !== ""){
        //      message.error(errorMessage)
        //    }
            
        // } finally{
        //     setLoading(false)
        // }

    };


      return (
          <Button
              loading={loading}
              icon={<DownloadOutlined />}
              onClick={()=> downloadConfronta()}
          >
              Generar confronta
          </Button>
      )
}


export default ButtonDownloadConfronta;
