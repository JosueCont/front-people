import {React, useEffect, useState} from 'react'
import { Row, Col, Card, List, Avatar, Modal, Empty, Button} from 'antd'
import { connect } from "react-redux";
import moment from 'moment/moment';
import {API_YNL} from '../../api/axiosApi'
import { RightOutlined, DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import Axios from "axios";

const PersonalRecord = ({reportPerson, user, dates, ...props}) => {
    const [dataPerDay, setDataPerDay] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [allEmotions, setAllEmotions] = useState();
    const [appId, setAppId] = useState("");
    const [khonectId, setKhonectId] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [isLoadReport, setIsLoadReport] = useState(false);
    const [dataUser, setDataUser] = useState({});
    
    useEffect(() => {
      setIsLoadReport(false); 
      if(Object.keys(reportPerson).length > 0){
        let globalData = [...reportPerson?.data?.at(-1).per_day].reverse();
        let filterLast = globalData?.filter(item => Object.keys(item.last).length > 0);
        setDataUser(reportPerson?.data.at(-1).user);
        if(filterLast.length > 0){
          setIsLoadReport(true); 
        }
        setDataPerDay(filterLast);   
      }
    }, [reportPerson]);

    useEffect(() => {
        console.log('dates redux',dates)
      if(dates)
      if(Object.keys(dates).length > 0){
        let KhId = dates?.khonnect_ids ? dates?.khonnect_ids.toString() : "";
        setKhonectId(KhId+"");
        setStartDate(dates?.start_date+"");
        setEndDate(dates?.end_date+"");
      }
    }, [dates]);

    useEffect(() => {
      setAppId(user?.general_config?.client_khonnect_id+"");
    }, [user]);

    const downloadCsv = async () => {
      let data = {
        startdate: startDate,
        enddate: endDate,
        app_id: appId,
        khonnect_id: khonectId
      }
      // console.log("data consulta csv", data);
      try {
        let response = await Axios.post(
          `https://api.ynl.khorplus.com/api/feeling-records/emotionsHistoryCsv`,
          data
        );
        // console.log("respuesta api",response);
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = dataUser
        ? "Historial_de_Emociones(" +
          (dataUser.firstName ? dataUser.firstName : null) +
          "_" +
          (dataUser.lastName ? dataUser.lastName : null) +
          ").csv"
        : "Historial_de_Emociones.csv";
        link.click();
      } catch (e) {
        console.log(e);
      }
    };

    const ShowModalAllEmotions = (item) =>{
      setIsOpenModal(true)
      setAllEmotions([...item.all])
    }

    const handleOk = () => {
      setIsOpenModal(false);
    };
  
    const handleCancel = () => {
        setIsOpenModal(false);
    };
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Historial de emociones"
            style={{
                width: '100%',
            }}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
              { isLoadReport &&
                <Row justify='end' >
                  <Button style={{marginBottom:"8px"}} onClick={downloadCsv}><DownloadOutlined style={{color:'white', fontSize:15}} /><FileExcelOutlined style={{color:'white', fontSize:15}} /></Button>
                </Row>
              }
              <List
                  dataSource={dataPerDay}
                  locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No se registraron emociones" />}}
                  renderItem={(item) => (
                      <div className='item-feeling' style={{backgroundColor: `#${item.last.color}`, cursor:"pointer" }}
                        onClick={() => ShowModalAllEmotions(item)}>
                          <Row>
                              <Col span={8} className="aligned-to-center">
                                <Avatar size={60} src={item.last.animation} />
                              </Col>
                              <Col span={12}>
                                  <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item.last.feeling_name} </h2>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}><b>{item.last.name}</b></p>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}><b>{item.last.comments}</b></p>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{ moment.parseZone(item.last.createdAt).format('LL')}</p>
                                  <span style={{color:"white", textAlign:"rigth", marginBottom:"0px"}}> <b>{item.all.length}</b> {item.all.length > 1 ? " emociones registradas" : " emoción registrada"}</span>
                              </Col>
                              <Col span={4} className="aligned-to-center">
                                <RightOutlined style={{color:'white', fontSize:30}} />
                              </Col>
                          </Row>
                      </div> 
                  )}
              />
            </Col>
                
        </Card>
        <Modal title={`Historial de emociones`} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel} footer={[]}>
          <Col span={24} className='content-feeling-scroll scroll-bar'>
            <List
                dataSource={allEmotions}
                renderItem={(item) => (
                    <div className='item-feeling' style={{backgroundColor: `#${item?.color}` }}>
                        <Row>
                            <Col span={8} className="aligned-to-center">
                              <Avatar size={60} src={item?.animation} />
                            </Col>
                            <Col span={16}>
                                <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item?.feeling_name} </h2>
                                <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}><b>{item?.name}</b></p>
                                <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}><b>{item?.comments}</b></p>
                                <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{ moment.parseZone(item?.createdAt).format('LL')}, { moment.parseZone(item?.createdAt).format('LT')} </p>
                            </Col>
                        </Row>
                    </div> 
                )}
            />
          </Col>
        </Modal>
    </>
  )
}

const mapState = (state) => {
  return {
    reportPerson: state.ynlStore.reportPerson,
    user: state.userStore,
    dates: state.ynlStore.dates,
  };
};

export default connect(mapState)(PersonalRecord);