import React, { useState, useEffect } from 'react'
import {
    CardItem,
    CardInfo
} from './Styled';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import { getMovementsIMSS } from '../../redux/payrollDuck'
import { connect } from 'react-redux';
import { Select } from 'antd';

const WidgetImss = ({
    node,
    imss_movements,
    getMovementsIMSS,
    loading,
    cat_patronal_registration,
    load_patronal_registration,
}) => {

    const [selectPR, setSelectPR] = useState(null)
    const [nPeding, setNPeding] = useState(0)
    
    const getImssInfo = (val) => {
        setSelectPR(val)
    }

    const getMovsInfo = async (node, selectPR) => {
        getMovementsIMSS(node, selectPR)
    }

    useEffect(() => {
        if (selectPR) {
            getMovsInfo(node, selectPR)
        }
    }, [selectPR])

    useEffect(() => {
        if (imss_movements) {
            let nProcessingPending = imss_movements.filter(item => item.status === 1)
            setNPeding(nProcessingPending)
        }
    }, [imss_movements])

    const SelectPatronal = (
        <Select
            allowClear
            showSearch
            className='select-jb'
            style={{ width: '100%' }}
            disabled={load_patronal_registration || loading}
            loading={load_patronal_registration || loading}
            placeholder='Regristro patronal'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='children'
            onChange={getImssInfo}
        >
            {cat_patronal_registration.length > 0
                && cat_patronal_registration.map(item => (
                    <Select.Option value={item.id} key={item.id}>
                        {item.code}
                    </Select.Option>
                ))}
        </Select>
    )

    return (
        <CardInfo>
        <CardItem
            title={<>
                <img src={'/images/logo_imss.png'} width={20} />
                <p><FormattedMessage id={'dashboard.imssPending'} /></p>
            </>}
            extra={selectPR ? <a href={`/payroll/imssMovements?regPatronal=${selectPR}`}>{nPeding?.length}</a>  : null}
        >
            {SelectPatronal}
        </CardItem>
        </CardInfo>
    )
}

const mapState = (state) => {
    return {
        current_node: state.userStore.current_node,
        imss_movements: state.payrollStore.imss_movements,
        loading: state.payrollStore.loading,
        cat_patronal_registration: state.catalogStore.cat_patronal_registration,
        load_patronal_registration: state.catalogStore.load_patronal_registration
    };
};


export default connect(mapState, { getMovementsIMSS })(WidgetImss)