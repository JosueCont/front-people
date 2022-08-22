import React,{useEffect,useState} from 'react'
import { 
    Row,
    Col,
    Select,
    Form,
} from 'antd';
import { connect } from "react-redux";
import WebApiPeople from '../../api/WebApiPeople';
import { getPatronalRegistration } from '../../redux/catalogCompany';



const SelectPatronalRegistration = ({ name,
   value_form,
   textLabel,
   currentNode,
   cat_patronal_registration, ...props}) => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    getPatronalRegistration(currentNode.id)
    //console.log(cat_patronal_registration)
  }, []);

  useEffect(() => {
    if(cat_patronal_registration.length > 0){
      setOptions(cat_patronal_registration);
      //console.log("entramos aqui por que viene con datos");
    }
  }, [cat_patronal_registration]);


  return (
    <>
        <Form.Item
            name={name}
            label={textLabel}
        >
            <Select
                key="SelectPatronalRegistration"
                allowClear
                placeholder="Registro Patronal"
                onChange={props.onChange ? props.onChange : null}
                notFoundContent={"No se encontraron resultados."}
                showSearch
                optionFilterProp="children"
            >
              {options.map((item) => {
                return (
                  <>
                    <Option key={item.id} value={item.id}>
                      {item.code}
                    </Option>;
                  </>
                );
              })}
            </Select>
        </Form.Item>        
    </>
  )
}

const mapState = (state) => {
    return {
        cat_patronal_registration: state.catalogStore.cat_patronal_registration,
        errorData: state.catalogStore.errorData
    };
  };
export default connect(mapState, { getPatronalRegistration })(SelectPatronalRegistration);