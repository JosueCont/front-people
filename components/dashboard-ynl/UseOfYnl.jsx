import {React, useEffect, useState} from 'react';
import { Breadcrumb,
    Row,
    Col,
    Card} from 'antd'
import { connect } from 'react-redux';

const UseOfYnl = ({ynlStore, ...props}) => {
  const [previuosPeriod, setPreviuosPeriod] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  useEffect(() => {
    setPreviuosPeriod(ynlStore.data?.previo);
    setCurrentPeriod(ynlStore.data?.actual);
  }, [ynlStore]);

  return (
    <>
        <Card  
            className='card-dashboard'
            title="Uso de YNL"
            style={{
                width: '100%',
            }}>
            <Row className='aligned-to-center' gutter={[16,16]}>
                <div>
                    <br />
                    <Col span={24}><h3 className='subtitles'><b>Periodo anterior</b></h3></Col>
                    <Col lg={12} xs={24}>
                        <div className='container-circle'>
                            <h1><b>{previuosPeriod}</b></h1>
                            {previuosPeriod == 1 && <h2>Día</h2>}
                            {previuosPeriod != 1 && <h2>Días</h2>}
                        </div>
                    </Col>
                </div>
                <div>
                    <br />
                    <Col span={24}><h3 className='subtitles'><b>Periodo actual</b></h3></Col>
                    <Col lg={12} xs={24}>
                        <div className='container-circle'>
                            <h1><b>{currentPeriod}</b></h1>
                            {currentPeriod == 1 && <h2>Día</h2>}
                            {currentPeriod != 1 && <h2>Días</h2>}
                        </div>
                    </Col>
                </div>
            </Row>
            <Row className='aligned-to-center' gutter={[16,16]}>
                <div>
                    <br />
                    <Col span={24}><h3 className='subtitles'><b>Uso de la app</b></h3></Col>
                    <Col lg={24} xs={24}>
                        { previuosPeriod > currentPeriod && (
                            <img src="/images/arrowDown.png" alt="" />
                        )}
                        { currentPeriod > previuosPeriod && (
                            <img src="/images/arrowUp.png" alt="" />
                        )}
                        
                    </Col>
                </div>
            </Row>
        </Card>
    </>
  )
}

const mapState = (state) => {
    return {
        ynlStore: state.ynlStore.reportUser,
    };
};
  
export default connect(mapState)(UseOfYnl);
