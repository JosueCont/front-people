import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;

const SelectTags = ({ multiple=false,name='tag', viewLabel='',placeholder='Etiquetas', required = true,cat_tags, ...props }) => {

  return (
    <Form.Item
      name={name}
      key="itemTags"
      label={viewLabel}
    >
      <Select
        showArrow
        mode={multiple && 'multiple'}
        style={{ width: "100%" }}
        placeholder={placeholder}
        notFoundContent="No se encontraron resultados"
        showSearch
        optionFilterProp="children"
        allowClear={props.allowClear ? true : false}
      >
        {cat_tags && cat_tags.map((item) => {
          return (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
          )
        })}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_tags: state.catalogStore.cat_tags,
  };
};

export default connect(mapState)(SelectTags);
