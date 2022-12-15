import { Button, Form, Input, message, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";
import { useSelector, connect } from "react-redux";
import {showHideMessage} from "../../redux/NotificationDuck";



const ModalGenericNotification = ({
                                     showHideMessage,
                                      ...props}) => {


  const modalData = useSelector(state => state.NotificationStore);

  useEffect(()=>{
     if(modalData){
         if(modalData.type===1 && modalData.showMessage){
             showModal()
         }else if(modalData.type===2 && modalData.showMessage){
             showNotification()
         }
     }
  },[modalData])

    const hideModal=()=>{
        showHideMessage(false)
    }


    const showNotification=()=>{
        if(modalData.level==='error'){
            message.error(modalData.title);
        }else if (modalData.level==='warning'){
            message.warning(modalData.title)
        }else if(modalData.level==='success'){
            message.success(modalData.title)
        }else{
            message.info(modalData.title)
        }

    }


    const showModal=async ()=>{
      let info = {
          title: modalData.title,
          content: (
              modalData?.message ?  <div>
                  <p>{modalData?.message}</p>
              </div> : <></>
          ),
          onOk:()=> {
              hideModal()
          },
      }

      if(modalData.level==='error'){
          Modal.error(info);
      }else if (modalData.level==='warning'){
          Modal.warning(info)
      }else if(modalData.level==='success'){
          Modal.success(info)
      }else{
          Modal.info(info)
      }


    }



  return (
    <>
    </>
  );
};


const mapState = (state) => {
    return {
    };
};


export default connect(mapState, {showHideMessage})(ModalGenericNotification);
