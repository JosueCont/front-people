import {React, useEffect, useState} from 'react';
import { Breadcrumb,
    Row,
    Col,
    Card,
    Tooltip} from 'antd'
import { connect } from 'react-redux';

const UseOfYnl = ({ynlStore, ...props}) => {
  const [previuosPeriod, setPreviuosPeriod] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [rangePeriod, setRangePeriod] = useState(0);
  useEffect(() => {
    setPreviuosPeriod(ynlStore.data?.previo);
    setCurrentPeriod(ynlStore.data?.actual);
    setRangePeriod(ynlStore.data?.total_days);
  }, [ynlStore]);

  return (
    <>
        <Card  
            className='card-dashboard'
            title="Uso de YNL"
            style={{
                width: '100%',
            }}>  
            <Row style={{display:"flex", justifyContent:"space-evenly", alignItems:"center" }} gutter={[16,16]}>
                <div>
                    <br />
                    <Col span={24} style={{paddingLeft:0, paddingRight:0}}>
                        <h3 className='subtitles' style={{textAlign:"center"}}><b>Periodo anterior</b></h3>
                    </Col>
                    <Col lg={12} xs={24}>
                        <div>
                            <Tooltip title={"El periodo anterior corresponde a la misma cantidad de días del periodo actual, pero anteriores con respecto a la fecha inicial"}>
                                <div className='container-circle'>
                                    <h1><b>{previuosPeriod}</b></h1>
                                    {previuosPeriod == 1 && <h2>Día</h2>}
                                    {previuosPeriod != 1 && <h2>Días</h2>}
                                </div>
                            </Tooltip>
                        </div>                       
                    </Col>
                </div>
                <div>
                    <br />   
                    <Col span={24} style={{paddingRight:0, paddingLeft:0}}>
                        <h3 className='subtitles' style={{textAlign:"center"}}><b>Periodo actual</b></h3> 
                    </Col>
                    <Col lg={12} xs={24}>
                        <div>
                            <Tooltip title={"El periodo actual corresponde al intervalo de días seleccionados en el filtro"}>
                                <div className='container-circle'>
                                    <h1><b>{currentPeriod}</b></h1>
                                    {currentPeriod == 1 && <h2>Día</h2>}
                                    {currentPeriod != 1 && <h2>Días</h2>}
                                </div>
                            </Tooltip>
                        </div>
                    </Col>
                </div>
            </Row>
            <Row className='aligned-to-center'>
                <div>
                    <h3 className='subtitles' style={{textAlign:"center", fontSize:"13px", marginTop:"8px"}}>Días del periodo de la consulta: {rangePeriod }</h3>
                </div>
            </Row>
            <Row style={{display:"flex", justifyContent:"space-evenly", alignItems:"center" }} gutter={[16,16]}>
                <div>
                    <Col span={24} style={{paddingLeft:0, paddingRight:0}} >
                        <h3 className='subtitles' style={{textAlign:"center"}}><b>Uso de la app</b></h3>
                    </Col>
                    <Col lg={24} xs={24}>
                        { previuosPeriod > currentPeriod && (
                            <img src="/images/arrowDown.png" alt="" />
                        )}
                        { currentPeriod > previuosPeriod && (
                            <img src="/images/arrowUp.png" alt="" />
                        )}
                        { currentPeriod == previuosPeriod && (
                            <img src="/images/same.png" alt="" />
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
