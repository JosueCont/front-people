import {useEffect, useState} from "react";
import {connect, useSelector} from "react-redux";
import moment from "moment";
import {Table, Typography, Row, Col, Tabs} from "antd";
import {movementsTypes} from "../../../utils/constant";
import TableMovements from "./TableMovements";
import {getMovementsIMSS} from "../../../redux/payrollDuck";

const { Title } = Typography;


const MovementsSection=({getMovementsIMSS,...props})=>{

    const tabs = [
        {
            key:1,
            tabText: movementsTypes[1]
        },
        {
            key:2,
            tabText: movementsTypes[2]
        },
        {
            key:3,
            tabText: movementsTypes[3]
        }
    ]

    return (
        <Row>
            <Col span={24}>
                <Tabs defaultActiveKey="1">
                    {
                        tabs && tabs.map((t)=>{
                            return  <Tabs.TabPane tab={t.tabText} key={t.key}>
                                <TableMovements movementType={t.key} />
                            </Tabs.TabPane>
                        })
                    }
                </Tabs>
            </Col>

        </Row>
    )
}


const mapState = (state) => {
    return {
        config: state.userStore.general_config,
        permissions: state.userStore.permissions.person,
    };
};


export default connect(mapState, {getMovementsIMSS})(MovementsSection);