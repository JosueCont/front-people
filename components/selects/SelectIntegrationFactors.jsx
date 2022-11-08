import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";
import WebApiFiscal from "../../api/WebApiFiscal";
const { Option } = Select;

const SelectIntegrationFactors = ({
  viewLabel= true,
  rules= [],
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

  console.log('Options', options)
 
  return (
    <Form.Item
      name="benefits"
      label="Beneficios"
      rules={rules}
    >
      <Select
        placeholder="Seleccionar beneficio"
      >
        <Option key={'ley'} value={'ley'}>Utilizar prestaciones de ley</Option>
        {
          options && options.map((option) => (
            <Option key={option.id}> { option.description } </Option>
          ))
        }
      </Select>
    </Form.Item>
  )
   
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(SelectIntegrationFactors);