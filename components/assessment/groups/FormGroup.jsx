import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Modal,
} from "antd";
import { ruleRequired } from "../../../utils/rules";
import SelectMembers from "./SelectMembers";
import SelectSurveys from "./SelectSurveys";
import SelectCategory from "./SelectCategory";

const FormGroup = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const [listMembers, setListMembers] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(()=>{
        if(Object.keys(props.loadData).length > 0){
            let fakeCategory = [{name: 'categoria de prueba 1', id:1}];
            let surveys = getSelectedSurveys(props.loadData.assessments)
            let members = getSelectedMembers(props.loadData.persons)
            let categories = getSelectedCategories(fakeCategory)
            formGroup.setFieldsValue({
                name: props.loadData.name,
                assessments: surveys,
                persons: members,
                categories: categories
            })
        }
    },[props.loadData])

    const getSelectedCategories = (categories) =>{
        if(categories?.length > 0){
            let list = [];
            categories.map((item)=>{
                let row = {
                    label: item.name,
                    key: item.id,
                    value: item.id
                }
                list.push(row)
            })
            return list
        }else{
            return []
        }
    }

    const getSelectedSurveys = (surveys) =>{
        if(surveys?.length > 0){
          let list = [];
          surveys.map((item)=>{
            let row = {
              label: item.name_es,
              key: item.id,
              value: item.id
            }
            list.push(row)
          })
          return list
        }else{
          return []
        }
    }

    const getSelectedMembers = (members) =>{
        if(members?.length > 0){
          let list = [];
          members.map((item)=>{
            let row = {
              label: `${item.first_name} ${item.flast_name} ${item.mlast_name}`,
              value: item.id,
              key: item.id
            }
            list.push(row)
          })
          return list
        }else{
          return []
        }
    }

    const createData = (object) => {
        let queryObject = Object.assign(object);
        if (listMembers.length > 0) {
            queryObject.persons = listMembers;
        }else if(listMembers.length <= 0 && !props.hiddenMembers){
            queryObject.persons = [];
        }else{
            delete queryObject.persons
        }
        if(listSurveys.length > 0){
            queryObject.assessments = listSurveys;
        }else if(listSurveys.length <= 0 && !props.hiddenSurveys){
            queryObject.assessments = [];
        }else{
            delete queryObject.assessments
        }
        if(queryObject.name == "" || queryObject.name == null){
            delete queryObject.name
        }
        return queryObject;
    };

    const onFinish = (values) =>{
        // const data = createData(values)
        setLoading(true)
        setTimeout(()=>{
            props.close()
            setLoading(false)
            props.actionForm(values)
        },2000)
    }

    return(
        <Modal
            title={props.title}
            visible={props.visible}
            onCancel={() => props.close()}
            afterClose={()=> props.close()}
            maskClosable={false}
            width={500}
            footer={[
                <>
                    <Button key="back" onClick={() => props.close()}>
                        Cancelar
                    </Button>
                    <Button
                        form="formGroup"
                        type="primary"
                        key="submit"
                        htmlType="submit"
                        loading={loading}
                    >
                        Guardar
                    </Button>
                </>
            ]}
        >
            <Form
                onFinish={onFinish}
                id="formGroup"
                form={formGroup}
                requiredMark={false}
                layout={'vertical'}
            >

                {!props.hiddenName && (
                    <Form.Item name="name" label={"Nombre del grupo"} rules={[ruleRequired]}>
                        <Input maxLength={50} allowClear={true} placeholder="Ingresa un nombre" />
                    </Form.Item>
                )}
                {!props.hiddenMembers && (
                    <SelectMembers
                        name={'persons'}
                        label={'Añadir persona'}
                        multiple={props.multipleMembers}
                        setMembers={setListMembers}
                    />
                )}
                {!props.hiddenCategories && (
                    <SelectCategory
                        name={'categories'}
                        label={'Añadir categoría'}
                        multiple={props.multipleCategories}
                        setCategories={setListCategories}
                    />
                )}
                {!props.hiddenSurveys && (
                    <SelectSurveys
                        name={'assessments'}
                        label={'Añadir encuesta'}
                        multiple={props.multipleSurveys}
                        setSurveys={setListSurveys}
                    />
                )}
            </Form>
        </Modal>
    )
}

export default FormGroup