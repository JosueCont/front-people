import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";
import {getPersonType} from "../../redux/catalogCompany";
const { Option } = Select;
const SelectPersonType = ({ ...props }) => {
  const [personType, setPersonType] = useState([]);

  useEffect(() => {
    setPersonType([]);
    if (props.cat_person_type) {
      let cats = props.cat_person_type.map((a) => {
        return { label: a.name, value: a.id };
      });
      setPersonType(cats);
    }
  }, [props.cat_person_type]);

  useEffect(()=>{
    props.getPersonType()
  },[])

  return (
    <Form.Item name="person_type" label={props.label ? props.label : null}>
      <Select
        // options={personType}
        placeholder="Tipo de persona"
        showSearch
        optionFilterProp="children"
      >
        {personType.map((item) => {
          return (
            <>
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
              ;
            </>
          );
        })}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_person_type: state.catalogStore.cat_person_type,
  };
};

export default connect(mapState,{getPersonType})(SelectPersonType);
