import React, { useState, useEffect } from 'react'
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import {getMovementsIMSS} from '../../redux/payrollDuck'
import { connect } from 'react-redux';
import SelectPatronalRegistration from '../../components/selects/SelectPatronalRegistration'
import { Col, Row, Typography } from 'antd';
import {
    ReloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';

const WidgetImss = ({node, imss_movements, getMovementsIMSS, loading, ...props}) => {
    const [selectPR, setSelectPR] = useState(null)
    const [nPeding, setNPeding] = useState(0)
    
    
    const getImssInfo = (val) => {
        setSelectPR(val)
    }

    const getMovsInfo =  async (node, selectPR) => {
        getMovementsIMSS(node, selectPR)
    }

    useEffect(() => {
      if(selectPR){
        getMovsInfo(node, selectPR)
      }
    }, [selectPR])
    
    useEffect(()=>{
        if(imss_movements){
            let nProcessingPending = imss_movements.filter(item => item.status === 1)
            setNPeding(nProcessingPending)
            
        }
    },[imss_movements])

  return (
    <CardItem hg='50%'
        title={<img src={'/images/logo_imss.png'} width={20}/>}
        extra={<SelectPatronalRegistration showLabel={false} style={{ margin:'auto' }} onChange={getImssInfo} />}
    >
        <Row>
            <Col span={24}>
                <p><FormattedMessage id={'dashboard.imssPending'} />:</p>
            </Col>
            {
            !selectPR && 
            <Col span={24}>
                <Typography.Title style={{ cursor: 'pointer', marginBottom: 0 }} level={4}>
                    Selecciona un registro  patronal
                </Typography.Title>
            </Col>
        }
        {
            selectPR ?
                !loading ?
                <Col span={24}>
                    <Typography.Title
                        style={{ cursor: 'pointer', marginBottom: 0 }}
                        /* onClick={() => router.push(`/home/persons/`)} */
                        level={1}
                    >
                        {nPeding.length}
                    </Typography.Title>
                </Col>
                    : <LoadingOutlined className="card-load" spin />
                :
            ""
        }
        </Row>
    </CardItem>
  )
}

const mapState = (state) => {
    return {
        node: state.userStore.current_node,
        imss_movements : state.payrollStore.imss_movements,
        loading: state.payrollStore.loading,
    };
};


export default connect(mapState, {getMovementsIMSS})(WidgetImss)