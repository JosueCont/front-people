import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";

const SelectPersonType = ({ ...props }) => {
  const [personType, setPersonType] = useState([]);

  useEffect(() => {
    setPersonType([]);
    if(props.cat_person_type){
      setPersonType(props.cat_person_type);
    }
  }, [props.cat_person_type]);

  return (
    <Form.Item name="person_type">
      <Select options={personType} placeholder="Tipo de persona" />
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_person_type: state.catalogStore.cat_person_type,
  };
};

export default connect(mapState)(SelectPersonType);
