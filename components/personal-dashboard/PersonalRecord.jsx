import {React, useEffect, useState} from 'react'
import { Row, Col, Card, List, Avatar, Modal} from 'antd'
import { connect } from "react-redux";
import moment from 'moment/moment';

const PersonalRecord = ({reportPerson,...props}) => {
    const [dataPerDay, setDataPerDay] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [allEmotions, setAllEmotions] = useState();
    
    useEffect(() => {
      if(Object.keys(reportPerson).length > 0){
        let globalData = [...reportPerson?.data?.at(-1).per_day].reverse();
        let filterLast = globalData?.filter(item => Object.keys(item.last).length > 0); 
        setDataPerDay(filterLast);
      }
    }, [reportPerson]);

    const ShowModalAllEmotions = (item) =>{
      setIsOpenModal(true)
      setAllEmotions(item.all.reverse())
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
              <List
                  dataSource={dataPerDay}
                  renderItem={(item) => (
                      <div className='item-feeling' style={{backgroundColor: `#${item.last.color}` }}
                        onClick={() => ShowModalAllEmotions(item)}>
                          <Row>
                              <Col span={8} className="aligned-to-center">
                                <Avatar size={60} src={item.last.animation} />
                              </Col>
                              <Col span={16}>
                                  <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item.last.feeling_name} </h2>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}><b>{item.last.name}</b></p>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{ moment(item.last.createdAt).format('LL')}</p>
                                  <span style={{color:"white", textAlign:"rigth", marginBottom:"0px"}}> <b>{item.all.length}</b> {item.all.length > 1 ? " emociones registradas" : " emoción registrada"}</span>
                              </Col>
                          </Row>
                      </div> 
                  )}
              />
            </Col>
                
        </Card>
        <Modal title={`Historial de emociones`} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
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
                                <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{ moment(item?.createdAt).format('LLL')}</p>
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
  };
};

export default connect(mapState)(PersonalRecord);