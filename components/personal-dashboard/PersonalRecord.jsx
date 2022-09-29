import {React, useEffect, useState} from 'react'
import { Row, Col, Card, List, Avatar, Modal} from 'antd'
import { connect } from "react-redux";

const PersonalRecord = ({reportPerson,...props}) => {
    const [dataPerDay, setDataPerDay] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [allEmotions, setAllEmotions] = useState();
    
    useEffect(() => {
      let globalData = reportPerson?.data?.at(-1).per_day.reverse();
      //console.log("per_day",globalData);
      let filterLast = globalData?.filter(item => Object.keys(item.last).length > 0); 
      setDataPerDay(filterLast);
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
            title="Mi historial de emociones"
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
                                  <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item.last.name} </h2>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{item.last.createdAt.substring(0,10)}</p>
                              </Col>
                          </Row>
                      </div> 
                  )}
              />
            </Col>
                
        </Card>
        <Modal title={`Todas las emociones`} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
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
                                <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item?.name} </h2>
                                <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{item?.createdAt.substring(0,10)}</p>
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