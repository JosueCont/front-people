import { connect, useDispatch } from "react-redux";
import { Form, Popconfirm, Select, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { deprecate } from "util";
import WebApiPeople from "../../api/WebApiPeople";
import { getWorkTitle } from "../../redux/catalogCompany";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const SelectWorkTitle = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Plaza laboral",
  department = null,
  job = null,
  name = "cat_work_title",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState(null)
  const [workTitleFocus, setWorkTitleFocus] = useState(false)
  const [optionsWorkPlace, setOptionsWorkPlace] = useState([])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('jobs', job)
    console.log('departments', department)
  }, [job, department])

  useEffect(() => {
    setOptions([]);
    if (props.cat_work_title) {
      let data = []
      if(!props.foReport){
        data = props.cat_work_title;

        if (department && job) {
          data = data.filter(
            (item) => item.department.id === department && item.job.id === job
          );
        } else if (department) {
          data = data.filter((item) => item.department.id === department);
        } else if (job) {
          data = data.filter((item) => item.job.id === job);
        }
      }else{
        data = props.cat_work_title
        
        if (department) {
          data = data.filter((item) => !department.includes(item));
        }

        if (job) {
          data = data.filter((item) => !job.includes(item) );
        }

      }


      data = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id,
        };
      });

      setOptions(data);
    }
  }, [department, job, props.cat_work_title]);

  const validateWorkTitle = () => {
    let department = formPeople.getFieldValue('person_department')
    let job = formPeople.getFieldValue('job')
    if(department && job){
        return false
    }else{
        formPeople.setFieldsValue({'work_title_id': null})
        return true
    }
}

  const addWorkTitle = async () => {
    console.log('props?.currentNode',props?.currentNode)
    try {
        setLoading(true)
        let data = {
            "name": searchValue,
            "department": department,
            "job": job,
            "node": props?.currentNode?.id
        }
        const res = await WebApiPeople.createRegisterCatalogs(
            "/business/work-title/",
            data
        );
        if(res.status === 201){
            dispatch(getWorkTitle(props?.currentNode?.id))
            setLoading(false)
        }
        /* message.success(messageSaveSuccess); */
        /* setLoading(false); */
      } catch (error) {
        console.log('error===>', error)
        setLoading(false)
        /* setLoading(false);
        console.log(error);
        message.error(messageError); */
      }   
}

  const ButtonAddWorkTitle = () => {

    return (<div style={{ width:'100%', textAlign:'end' }} > 
                <Popconfirm
                    title="¿Agregar nueva plaza laboral?"
                    onConfirm={addWorkTitle}
                    okText="Si"
                    cancelText="No"
                    disabled={!searchValue}
                >   
                
                    <Spin spinning={loading}>
                        <a href='#' style={{ cursor: 'pointer' }} >
                            <Typography.Text ><PlusOutlined/> Agregar</Typography.Text> 
                        </a>
                    </Spin>
                </Popconfirm>
            </div>)
}

  return (
    <Form.Item
      key="itemPlace"
      name={name ? name : "cat_work_title"}
      label={viewLabel ? labelText : ""}
      rules={options.length >0 ? rules : []}
      dependencies={props.dependencies ? props.dependencies : null}
      
    >
      <Select
        disabled={disabled}
        key="SelectPlace"
        // options={options}
        placeholder={props.placeholder ? props.placeholder : "Plaza laboral"}
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={ searchValue ? <ButtonAddWorkTitle /> : "No se encontraron resultados"}
        showSearch
        optionFilterProp="children"
        mode={props.multiple ? "multiple" : null}
        maxTagCount="responsive"

        onSearch={(val) => setSearchValue(val)}
        open={ searchValue || workTitleFocus}
        onFocus={() => setWorkTitleFocus(true)}
        onBlur={() => setWorkTitleFocus(false)}
        onSelect={(val) => {
                setSearchValue(null), 
                setWorkTitleFocus(false)
                
            } 
        }

      >
        {options.map((item) => {
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
    cat_work_title: state.catalogStore.cat_work_title,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(SelectWorkTitle);
