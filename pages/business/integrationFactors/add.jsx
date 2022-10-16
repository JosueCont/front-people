import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Upload,
  Input,
  Image,
  DatePicker,
  Modal,
  Select,
  InputNumber,
} from "antd";
import moment from "moment";

import { connect } from 'react-redux'

const add = ({ ...props }) => {

  const [ nodeId, setNodeId ] = useState(null)

  useEffect(() => {
    props.currentNode && setNodeId(props.currentNode.id)
  },[props.currentNode])

  return (<>
    <MainLayout
      currentKey={["integrationFactors"]}
      defaultOpenKeys={["company"]}
    >

      { nodeId }
    </MainLayout>
  </>)
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(add)