import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select, Tooltip } from "antd";
import WebApiFiscal from "../../api/WebApiFiscal";
const { Option } = Select;

const SelectIntegrationFactors = ({
  viewLabel= true,
  rules= [],
  chengeBenefit,
  ...props
}) => {

  const [nodeId, setNodeId] = useState(null)
  const [ options, setOptions ] = useState(null)

  useEffect(() => {
    console.log('dxdxdx', props.currentNode)
    props.currentNode && getIntegrationFactors()
  },[props.currentNode])

  const getIntegrationFactors = async () => {
    await WebApiFiscal.getIntegrationFactors(props.currentNode.id)
    .then((response) => {
      console.log('response', response)
      setOptions(response.data.results)
    })
    .catch((error) => {
      console.log('Error -->', error)
    })
  }

  const onChange = (value) => {
    chengeBenefit(value);
  };

  console.log('Options', options)
 
  return (
    <Form.Item
      name={props.benefit}
      label="Beneficios"
      rules={rules}
    >
      <Tooltip 
        placement="topLeft" 
        title="Si no se elige alguna opción, el sistema tomará las prestaciones de ley">
        <Select
          placeholder="Seleccionar beneficio"
          allowClear
          onChange={onChange}

        >
          {
            options && options.map((option) => (
              <Option key={option.id}> { option.description } </Option>
            ))
          }
        </Select>

      </Tooltip>
    </Form.Item>
  )
   
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(SelectIntegrationFactors);