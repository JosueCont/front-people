import React from 'react';
import { Breadcrumb,
    Row,
    Col,
    Card} from 'antd'

export const UseOfYnl = () => {
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
                    <Col span={24}><h3>Periodo anterior</h3></Col>
                    <Col lg={12} xs={24}>
                        <div className='container-circle'>
                            <h1><b>1</b></h1>
                            <h2>Días</h2>
                        </div>
                    </Col>
                </div>
                <div>
                    <br />
                    <Col span={24}><h3>Periodo actual</h3></Col>
                    <Col lg={12} xs={24}>
                        <div className='container-circle'>
                            <h1><b>1</b></h1>
                            <h2>Días</h2>
                        </div>
                    </Col>
                </div>
            </Row>
            <Row className='aligned-to-center' gutter={[16,16]}>
                <div>
                    <br />
                    <Col span={24}><h3>Uso de la app</h3></Col>
                    <Col lg={24} xs={24}>
                        <div className='container-circle'>
                            
                        </div>
                    </Col>
                </div>
            </Row>
        </Card>
    </>
  )
}
