import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Select,
  Form,
  Tooltip,
  Button,
  Typography,
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

const ProvisionsReport = ({ permissions, ...props }) => {

  const [form] = Form.useForm();
  const { Title } = Typography;

  console.log('Calendars', props.payment_calendar)

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Provisiones</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
          >

          </Form>
        </Col>
      </Row>
    </>
  )
}

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.report,
    currentNode: state.userStore.current_node,
    payment_calendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(ProvisionsReport);