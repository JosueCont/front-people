import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import {
    Row,
    Col,
    Button,
    Table,
    Input,
    Form,
    Space,
    message,
    Select, Popover, Tooltip
} from 'antd';
import {
    SearchOutlined,
    PlusCircleOutlined,
    CloseOutlined, InfoCircleOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import { valueToFilter } from '../../../utils/functions';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';

const CreatePerfil = ({
    visible,
    close,
    actionForm,
    competences,
    load_competences,
    title,
    recordProfile = {},
    ...props
}) => {

    const [loading, setLoading] = useState(false);
    const [loadAdd, setLoadAdd] = useState(false);
    const [competencesSelected, setCompetencesSelected] = useState([]);
    const [listCompetences, setListCompetences] = useState([]);
    const [nameToSearch, setNameToSearch] = useState('');
    const [levelCompetence, setLevelCompetence] = useState({});
    const [formProfile] = Form.useForm();

    const optionsLevel = [
        {key: 1, value: 1, label: "1"},
        {key: 2, value: 2, label: "2"},
        {key: 3, value: 3, label: "3"},
        {key: 4, value: 4, label: "4"},
        {key: 5, value: 5, label: "5"}
    ]

    useEffect(()=>{
        if(competences.length > 0){
            setListCompetences(competences)
        }
    },[competences])

    useEffect(()=>{
        if(Object.keys(recordProfile).length > 0){
            formProfile.setFieldsValue({name: recordProfile.name})            
            if(
                recordProfile.competences &&
                recordProfile.competences.length > 0
            ){
                getLevelCompetence()
            }
        }
    },[recordProfile])

    const getLevelCompetence = () =>{
        let obj = {};
        let comps = [];
        recordProfile.competences.map((item) =>{
            let record = {competence: item.competence?.id, level: item.level};
            obj = {...obj, [item.competence.id]: record};
            comps.push(item.competence)
        })
        setCompetencesSelected(comps)
        setLevelCompetence(obj)
    }

    const onCloseModal = () => {
        close();
        setCompetencesSelected([]);
        formProfile.resetFields();
        setNameToSearch('');
        setLevelCompetence({});
    };

    const filterCompetence = () =>{
        let prevList = listCompetences;
        let newList = [];
        let newCurrent = [...competencesSelected];
        prevList.map((item)=>{
            let result = newCurrent.some(record => item.id === record.id);
            if(!result){
                newList.push(item)
            }
        })
        return newList;
    }

    const onSearchByName = ({target}) =>{
        setNameToSearch(target.value)
        const list = competences;
        if((target.value).trim()){
            let results = list.filter(item => valueToFilter(item.name).includes(valueToFilter(target.value)));
            setListCompetences(results)
        }else{
            setListCompetences(list)
        }
    }

    const getLevelSelected = () => {
        let list = [];
        Object.entries(levelCompetence).map(([key, value])=>{
            list.push(value)
        })
        return list;
    }

    const onFinish = (values) =>{
        if (competencesSelected.length > 0) {
            if(competencesSelected.length == Object.keys(levelCompetence).length){
                let data = {
                    name: values.name.trim(),
                    competences: getLevelSelected()
                }
                onFinishSave(data)
            }else{
                message.error("Selecciona los niveles")
            }
        } else {
            let data = {
                name: values.name.trim(),
                competences: []
            }
            onFinishSave(data)
        } 
    }

    const onFinishSave = (data) =>{
        setLoadAdd(true);
        setTimeout(() => {
            onCloseModal();
            setLoadAdd(false);
            actionForm(data)
        }, 2000);
    }

    const addCompetence = (item) =>{
        let newList = [...competencesSelected, item];
        setCompetencesSelected(newList);
        onChangeLevel(item, 1)
    }

    const deleteLevelSelected = (item) =>{
        let record = {...levelCompetence};
        if(record[item.id]) delete record[item.id];
        setLevelCompetence(record)
    }

    const deleteCompetence = (item, index) => {
        let newList = [...competencesSelected];
        newList.splice(index, 1);
        setCompetencesSelected(newList);
        deleteLevelSelected(item)
    };

    const onChangeLevel = (item, val) =>{
        let record = {competence: item.id, level: val};
        let newList = {...levelCompetence, [item.id]: record};
        console.log(newList)
        setLevelCompetence(newList)
    }

    const getLevel = (item) =>{
        let record = levelCompetence[item.id];
        return record ? record.level : null;
    }

    const columns_competencias= [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Acciones',
            width: 40,
            render: (item) =>{
                return (
                    <PlusCircleOutlined onClick={()=>addCompetence(item)}/>
                )
            }
        },
    ]

    const columns_selected= [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Level',
            width: 80,
            render: (item) =>{
                let _levelOptions = item.levels.map(e => ({key: e.level, value: e.level, label: `${e.level}`}))
                return(
                    <Select
                        size='small'
                        options={_levelOptions}
                        placeholder={'Nivel'}
                        value={getLevel(item)}
                        onChange={(val)=> onChangeLevel(item, val)}
                        style={{width:60}}
                    />
                )
            }
        },
        {
            title: 'Acciones',
            width: 60,
            render: (item, record, index) =>{
                let selectedLevel = getLevel(item) ? item.levels.find(e => e.level === getLevel(item)) : null
                return (<Space>
                    {selectedLevel &&
                        <Tooltip
                            placement="bottomRight"
                            title={<>
                                <b>{item.name} (Nivel {selectedLevel.level}):</b><br/>
                                <div className={'tooltip-scroll-content'}>
                                    {selectedLevel.description}
                                </div>
                            </>}
                            trigger="click">
                        <InfoCircleOutlined/>
                        </Tooltip>
                    }
                    <CloseOutlined onClick={()=>deleteCompetence(item, index)}/>
            </Space>)
            }
        },
    ]

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onCloseModal}
            widthModal={800}
        >
            <Form
                layout={'vertical'}
                form={formProfile}
                requiredMark={false}
                onFinish={onFinish}
            >
                <Row gutter={[16,16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Buscar competencia"
                            style={{marginBottom: '0px'}}
                        >
                            <Input
                                maxLength={50}
                                allowClear={true}
                                placeholder={'Ingrese un nombre'}
                                onChange={onSearchByName}
                                suffix={<SearchOutlined />}
                                value={nameToSearch}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nombre del perfil"
                            style={{marginBottom: '0px'}}
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={50}
                                allowClear={true}
                                placeholder={'Ingrese un nombre'}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Listado de competencias"
                        >
                            <Table
                                size={'small'}
                                rowKey={'id'}
                                showHeader={false}
                                columns={columns_competencias}
                                dataSource={filterCompetence()}
                                loading={load_competences}
                                scroll={{y: 300}}
                                pagination={false}
                                locale={{
                                emptyText: load_competences
                                    ? "Cargando..."
                                    : "No se encontraron resultados.",
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={`Competencias seleccionadas (${competencesSelected?.length})`}
                        >
                            <Table
                                size={'small'}
                                rowKey={'id'}
                                showHeader={false}
                                columns={columns_selected}
                                dataSource={competencesSelected}
                                scroll={{y: 300}}
                                pagination={false}
                                locale={{
                                emptyText: loading
                                    ? "Cargando..."
                                    : "No se encontraron resultados.",
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align={"end"}>
                    <Space>
                        <Button key="back" onClick={() => onCloseModal()}>
                            Cancelar
                        </Button>
                        <Button htmlType="submit" loading={loadAdd}>
                            Guardar
                        </Button>
                    </Space>
                </Row>
            </Form>
        </MyModal>
    )
}

const mapState = (state) => {
    return {
        competences: state.assessmentStore.competences,
        load_competences: state.assessmentStore.load_competences,
    };
};

export default connect(mapState)(CreatePerfil);