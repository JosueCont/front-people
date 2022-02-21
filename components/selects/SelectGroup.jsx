import { Select, Form } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ruleRequired } from "../../utils/rules";

const SelectGroup = ({ viewLabel, ...props }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (props.cat_groups) {
      setGroups(
        props.cat_groups.map((a) => {
          return { label: a.name, value: a.id };
        })
      );
    }
  }, [props.cat_groups]);

  return (
    <Form.Item
      rules={[ruleRequired]}
      name="groups"
      label={viewLabel ? "Perfil de seguridad" : ""}
    >
      <Select
        options={groups}
        showArrow
        style={{ width: "100%" }}
        placeholder="Perfiles de seguridad"
      />
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_groups: state.catalogStore.cat_groups,
  };
};

export default connect(mapState)(SelectGroup);
