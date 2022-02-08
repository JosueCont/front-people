import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";

const SelectWorkTitle = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Plaza laboral",
  forDepto = false,
  forPerson = false,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    console.log('change props');
    setOptions([]);
    console.log('cat_work_title =>', props.cat_work_title);
    if (props.cat_work_title) {
      let data = [];
      if(props.department !== null && props.job !== null){
        data = props.cat_work_title.filter((item) => item.department.id === props.department && item.job.id === props.job)
        .map(function(item) {
          return {
            label: forDepto
              ? `${item.department.name} - ${item.name}`
              : item.name,
            value: item.id,
            key: item.id,
          };
        })
        /* data = props.cat_work_title.map((item, index) => {
          return {
            label: forDepto
              ? `${item.department.name} - ${item.name}`
              : item.name,
            value: item.id,
            key: item.id + index,
          };
        }); */
      }


      /* let data = props.cat_work_title.map((item, index) => {
        return {
          label: forDepto
            ? `${item.department.name} - ${item.name}`
            : item.name,
          value: item.id,
          key: item.id + index,
        };
      }); */
      setOptions(data);
    }
  }, [props.department, props.job]);

  return (
    <Form.Item
      key="itemPlace"
      name={"cat_work_title"}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectPlace"
        options={options}
        placeholder="Plaza laboral"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_work_title: state.catalogStore.cat_work_title,
  };
};

export default connect(mapState)(SelectWorkTitle);
