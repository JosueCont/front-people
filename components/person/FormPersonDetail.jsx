import {
    Layout,
    Breadcrumb,
    Tabs,
    Form,
    Input,
    Modal,
    Space,
    Row,
    Col,
    Spin,
    Card,
    Typography,
    Select,
    DatePicker,
    Button,
    Image,
    Switch,
    Collapse,
    message,
    Checkbox,
    Alert,
    Table,
    Upload,
} from "antd";
import MainLayout from "../../layout/MainLayout";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useEffect, useState } from "react";
import {
    WarningOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    InboxOutlined,
    UploadOutlined,
    PlusOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import DocumentModal from "../../components/modal/document";

const { Content } = Layout;
const { TabPane } = Tabs;
import { useRouter } from "next/router";
import Router from "next/router";
const { Option } = Select;
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import Link from "next/link";
const { Panel } = Collapse;
const { Meta } = Card;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const personDetailForm = () => {
    const router = useRouter();
    const { Title } = Typography;
    const [loading, setLoading] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);
    const [modal, setModal] = useState(false);
    const [personFullName, setPersonFullName] = useState("");
    const [photo, setPhoto] = useState("");
    const [modalDoc, setModalDoc] = useState(false);
    const [deleted, setDeleted] = useState({});
    const [people, setPeople] = useState([]);

    ////STATE BOLEAN SWITCH AND CHECKBOX
    const [isActive, setIsActive] = useState(false);
    const [checkedTravel, setCheckedTravel] = useState(false);
    const [checkedResidence, setCheckedResidence] = useState(false);
    const [currenlyStuding, setCurrenlyStuding] = useState(false);

    /////ID UPDATE
    const [idBankAcc, setIdBankAcc] = useState("");
    const [upBankAcc, setUpBankAcc] = useState(false);
    const [idPhone, setIdPhone] = useState("");
    const [upPhone, setUpPhone] = useState(false);
    const [idContEm, setIdContEm] = useState("");
    const [upContEm, setUpContEm] = useState(false);
    const [idFamily, setIdFamily] = useState("");
    const [upFamily, setUpFamily] = useState(false);
    const [idTraining, setIdTraining] = useState("");
    const [upTraining, setUpTraining] = useState(false);
    const [idExperienceJob, setIdExperienceJob] = useState("");
    const [upExperienceJob, setUpExperienceJob] = useState(false);
    const [idGeneralP, setIdGeneralP] = useState("");
    const [idAddressP, setIdAddressP] = useState("");

    ////FORMS
    const [formPerson] = Form.useForm();
    const [formGeneralTab] = Form.useForm();
    const [formPhone] = Form.useForm();
    const [formAddress] = Form.useForm();
    const [formFamily] = Form.useForm();
    const [formContactEmergency] = Form.useForm();
    const [formTraining] = Form.useForm();
    const [formExperiencejob] = Form.useForm();
    const [formBank] = Form.useForm();

    ////STATE SELECTS
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [personType, setPersonType] = useState([]);
    const [groups, setGroups] = useState([]);
    const [banks, setBanks] = useState([]);
    const [relationship, setRelationship] = useState([]);
    const [experienceType, setExperienceType] = useState([]);
    const [reasonSeparation, setReasonSeparation] = useState([]);
    const [laborRelationship, setLaborRelationship] = useState([]);

    ////STATE TABLES
    const [phones, setPhones] = useState([]);
    const [family, setFamily] = useState([]);
    const [contactEmergency, setContactEmergency] = useState([]);
    const [training, setTraining] = useState([]);
    const [experineceJob, setExperienceJob] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [documents, setDocuments] = useState([]);

    /////STATE DATE
    const [birthDate, setBirthDate] = useState("");
    const [birthDateFam, setBirthDateFam] = useState("");
    const [dateAdmission, setDateAdmission] = useState("");
    const [dateTraining, setDateTraining] = useState("");
    const [dateExpjob, setDateExpjob] = useState("");

    ////DEFAULT SELECT
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 10 },
    };
    const genders = [
        {
            label: "Masculino",
            value: 1,
        },
        {
            label: "Femenino",
            value: 2,
        },
        {
            label: "Otro",
            value: 3,
        },
    ];
    const civilStatus = [
        {
            label: "Soltero(a)",
            value: 1,
        },
        {
            label: "Casado(a)",
            value: 2,
        },
        {
            label: "Viudo(a)",
            value: 3,
        },
    ];
    const typePhones = [
        {
            label: "Alterno",
            value: 1,
        },
        {
            label: "Principal",
            value: 2,
        },
        {
            label: "Recados",
            value: 3,
        },
    ];
    const typeLines = [
        {
            label: "Celular",
            value: 1,
        },
        {
            label: "Fijo",
            value: 2,
        },
    ];
    const typeStreet = [
        {
            label: "Avenida",
            value: 1,
        },
        {
            label: "Boulevard",
            value: 2,
        },
        {
            label: "Calle",
            value: 3,
        },
    ];

    ////CHANGE DATE
    const onChangeBirthDate = (date, dateString) => {
        setBirthDate(dateString);
    };
    const onChangeDateAdmission = (date, dateString) => {
        setDateAdmission(dateString);
    };
    const onChangeBDFamily = (date, dateString) => {
        setBirthDateFam(dateString);
    };
    const onChangeDateTrainig = (date, dateString) => {
        setDateTraining(dateString);
    };
    const onChangeDExJ = (date, dateString) => {
        setDateExpjob(dateString);
    };

    /////CHANGE CHECKBOX
    const checkTravel = () => {
        checkedTravel ? setCheckedTravel(false) : setCheckedTravel(true);
    };
    const checkResidence = () => {
        checkedResidence ? setCheckedResidence(false) : setCheckedResidence(true);
    };
    const changeCurreStud = () => {
        currenlyStuding ? setCurrenlyStuding(false) : setCurrenlyStuding(true);
    };

    /////CHANGE SWITCH
    const changeStatus = () => {
        isActive ? setIsActive(false) : setIsActive(true);
    };

    ////LOAD PAGE
    useEffect(() => {
        getValueSelects();
        if (router.query.id) {
            ///GET PERSON
            Axios.get(API_URL + `/person/person/${router.query.id}`)
                .then((response) => {
                    formPerson.setFieldsValue({
                        first_name: response.data.first_name,
                        flast_name: response.data.flast_name,
                        mlast_name: response.data.mlast_name,
                        gender: response.data.gender,
                        email: response.data.email,
                        curp: response.data.curp,
                        rfc: response.data.rfc,
                        imss: response.data.imss,
                        is_active: response.data.is_active,
                        photo: response.data.photo,
                        civil_status: response.data.civil_status,
                    });
                    if (response.data.person_type)
                        formPerson.setFieldsValue({
                            person_type: response.data.person_type.id,
                        });
                    if (response.data.job_department.department) {
                        formPerson.setFieldsValue({
                            department: response.data.job_department.department.id,
                        });
                        Axios.get(
                            API_URL +
                            `/business/department/${response.data.job_department.department.id}/job_for_department/`
                        )
                            .then((resp) => {
                                if (resp.status === 200) {
                                    let job = resp.data;
                                    job = job.map((a) => {
                                        return { label: a.name, value: a.id };
                                    });
                                    setJobs(job);
                                    if (response.data.job_department.job)
                                        formPerson.setFieldsValue({
                                            job: response.data.job_department.job.id,
                                        });
                                }
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    }

                    if (response.data.date_of_admission)
                        formPerson.setFieldsValue({
                            date_of_admission: moment(response.data.date_of_admission),
                        });

                    if (response.data.birth_date)
                        formPerson.setFieldsValue({
                            birth_date: moment(response.data.birth_date),
                        });
                    setDateAdmission(response.data.date_of_admission);
                    setBirthDate(response.data.birth_date);
                    setIsActive(response.data.is_active);
                    if (response.data.photo) setPhoto(response.data.photo);
                    else
                        setPhoto(
                            "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg"
                        );
                    setLoading(false);
                    let personName =
                        response.data.first_name + " " + response.data.flast_name;
                    if (response.data.mlast_name)
                        personName = person + " " + response.data.mlast_name;
                    setPersonFullName(personName);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                });

            ///GET GENERAL PERSON
            Axios.get(API_URL + `/person/person/${router.query.id}/general_person/`)
                .then((response) => {
                    formGeneralTab.setFieldsValue({
                        place_birth: response.data.place_birth,
                        nationality: response.data.nationality,
                        other_nationality: response.data.other_nationality,
                        availability_travel: response.data.availability_travel,
                        availability_change_residence:
                            response.data.availability_change_residence,
                        allergies: response.data.allergies,
                        blood_type: response.data.blood_type,
                    });
                    if (response.data.availability_travel)
                        setCheckedTravel(response.data.availability_travel);
                    if (response.data.availability_change_residence)
                        setCheckedResidence(response.data.availability_change_residence);
                    setIdGeneralP(response.data.id);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                });

            ///PHONE
            Axios.get(API_URL + `/person/person/${router.query.id}/phone_person/`)
                .then((response) => {
                    setPhones(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///ADDRESS
            Axios.get(API_URL + `/person/person/${router.query.id}/address_person/`)
                .then((response) => {
                    formAddress.setFieldsValue({
                        street_type: response.data[0].street_type,
                        street: response.data[0].street,
                        numberOne: response.data[0].numberOne,
                        numberTwo: response.data[0].numberTwo,
                        building: response.data[0].building,
                        postalCode: response.data[0].postalCode,
                        suburb: response.data[0].suburb,
                        location: response.data[0].location,
                        reference: response.data[0].reference,
                    });
                    setIdAddressP(response.data.id);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                });

            ///FAMILY
            Axios.get(API_URL + `/person/person/${router.query.id}/family_person/`)
                .then((response) => {
                    response.data.map((a) => {
                        a.relation = a.relationship.name;
                        a.fullname = a.name + " " + a.flast_name + " " + a.mlast_name;
                    });
                    setFamily(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///CONTACT EMERGENCY
            Axios.get(
                API_URL + `/person/person/${router.query.id}/contact_emergency_person/`
            )
                .then((response) => {
                    setContactEmergency(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///TRAINIG
            Axios.get(API_URL + `/person/person/${router.query.id}/training_person/`)
                .then((response) => {
                    setTraining(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///JOB EXPERIENCE
            Axios.get(
                API_URL + `/person/person/${router.query.id}/job_experience_person/`
            )
                .then((response) => {
                    setExperienceJob(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///GET BANK ACCOUNTS
            Axios.get(
                API_URL + `/person/person/${router.query.id}/bank_account_person/`
            )
                .then((response) => {
                    setBankAccounts(response.data);
                    setLoading(false);
                    setLoadingTable(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    setLoadingTable(false);
                });

            ///GET DOCUMENTS
            Axios.get(API_URL + `/person/person/${router.query.id}/document_person/`)
                .then((response) => {
                    setDocuments(response.data);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                });

            ////GET PERSONS

            Axios.get(API_URL + `/person/person/`)
                .then((response) => {
                    let persons = response.data.results;
                    persons = persons.map((a) => {
                        a.name = a.first_name + " " + a.flast_name;
                        if (a.mlast_name) a.name = a.name + " " + a.mlast_name;
                        return { label: a.name, value: a.id };
                    });
                    setPeople(persons);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [router.query.id]);

    /////GET DATA SELCTS
    const getValueSelects = async (id) => {
        const headers = {
            "client-id": "5f417a53c37f6275fb614104",
            "Content-Type": "application/json",
        };

        ///GROUPS
        Axios.get("https://khonnect.hiumanlab.com/group/list/", {
            headers: headers,
        })
            .then((response) => {
                if (response.status === 200) {
                    let group = response.data.data;
                    group = group.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setGroups(group);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        /////PERSON TYPE
        Axios.get(API_URL + `/person/person-type/`)
            .then((response) => {
                if (response.status === 200) {
                    let typesPerson = response.data.results;
                    typesPerson = typesPerson.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setPersonType(typesPerson);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        ////BANK
        Axios.get(API_URL + "/setup/banks/")
            .then((response) => {
                if (response.status === 200) {
                    let bank = response.data.results;
                    bank = bank.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setBanks(bank);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        ////RELATIONSHIP
        Axios.get(API_URL + "/setup/relationship/")
            .then((response) => {
                if (response.status === 200) {
                    let relation = response.data.results;
                    relation = relation.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setRelationship(relation);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        ////LABOR RELATIONSHIP
        Axios.get(API_URL + "/setup/labor-relationship/")
            .then((response) => {
                if (response.status === 200) {
                    let relation = response.data.results;
                    relation = relation.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setLaborRelationship(relation);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        ////RELATIONSHIP
        Axios.get(API_URL + "/setup/experience-type/")
            .then((response) => {
                if (response.status === 200) {
                    let experinece = response.data.results;
                    experinece = experinece.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setExperienceType(experinece);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        ////REASON SEPARATION
        Axios.get(API_URL + "/setup/reason-separation/")
            .then((response) => {
                if (response.status === 200) {
                    let reason = response.data.results;
                    reason = reason.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setReasonSeparation(reason);
                }
            })
            .catch((e) => {
                console.log(e);
            });

        /////DEPARTMENTS
        Axios.get(API_URL + `/business/department/`)
            .then((response) => {
                if (response.status === 200) {
                    let dep = response.data.results;
                    dep = dep.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setDepartments(dep);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    ////PERSON
    const onFinishPerson = (value) => {
        value.birth_date = birthDate;
        value.date_of_admission = dateAdmission;
        value.id = router.query.id;
        value.is_active = isActive;
        updatePerson(value);
    };
    const updatePerson = (value) => {
        setLoading(true);
        Axios.put(API_URL + `/person/person/${router.query.id}/`, value)
            .then((response) => {
                formPerson.setFieldsValue({
                    first_name: response.data.first_name,
                    flast_name: response.data.flast_name,
                    mlast_name: response.data.mlast_name,
                    gender: response.data.gender,
                    email: response.data.email,
                    birth_date: moment(response.data.birth_date),
                    curp: response.data.curp,
                    rfc: response.data.rfc,
                    imss: response.data.imss,
                    is_active: response.data.is_active,
                    civil_status: response.data.civil_status,
                    date_of_admission: null,
                });
                if (response.data.person_type)
                    formPerson.setFieldsValue({
                        person_type: response.data.person_type.id,
                    });
                if (response.data.job_department.department) {
                    formPerson.setFieldsValue({
                        department: response.data.job_department.department.id,
                    });
                    Axios.get(
                        API_URL +
                        `/business/department/${response.data.job_department.department.id}/job_for_department/`
                    )
                        .then((resp) => {
                            if (resp.status === 200) {
                                let job = resp.data;
                                job = job.map((a) => {
                                    return { label: a.name, value: a.id };
                                });
                                setJobs(job);
                                if (response.data.job_department.job)
                                    formPerson.setFieldsValue({
                                        job: response.data.job_department.job.id,
                                    });
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }
                if (response.data.job_department.job)
                    formPerson.setFieldsValue({
                        job: response.data.job_department.job.id,
                    });
                if (response.data.date_of_admission)
                    formPerson.setFieldsValue({
                        date_of_admission: moment(response.data.date_of_admission),
                    });
                if (response.data.birth_date)
                    formPerson.setFieldsValue({
                        birth_date: moment(response.data.birth_date),
                    });
                setBirthDate(response.data.birth_date);
                setIsActive(response.data.is_active);
                if (response.data.photo) setPhoto(response.data.photo);
                setLoading(false);
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
            })
            .catch((e) => {
                setLoading(false);
                message.error("Error al actualizar, intente de nuevo.");
                console.log(e);
            });
    };
    const deletePerson = (data) => {
        Axios.post(API_URL + `/person/person/delete_by_ids/`, {
            persons_id: router.query.id,
        })
            .then((response) => {
                setLoading(false);
                showModal();
                message.success("Eliminado correctamente.");
                Router.push("/home");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    //////DATOS GENERALES
    const formGeneralData = (value) => {
        if (idGeneralP != "" && idGeneralP != undefined) {
            value.availability_travel = checkedTravel;
            value.availability_change_residence = checkedResidence;
            updateGeneralData(value);
        } else {
            value.person = router.query.id;
            value.availability_travel = checkedTravel;
            value.availability_change_residence = checkedResidence;
            saveGeneralData(value);
        }
    };
    const saveGeneralData = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/general-person/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const updateGeneralData = (data) => {
        setLoading(true);
        Axios.put(API_URL + `/person/general-person/${idGeneralP}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    /////TELEFONO
    const getPhone = () => {
        Axios.get(API_URL + `/person/person/${router.query.id}/phone_person/`)
            .then((response) => {
                setPhones(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setLoadingTable(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const formFinishPhone = (value) => {
        if (upPhone) {
            value.id = idPhone;
            value.person = router.query.id;
            updatePhone(value);
        } else {
            value.person = router.query.id;
            savePhone(value);
        }
    };
    const updateFormPhone = (item) => {
        formPhone.setFieldsValue({
            country_code: item.country_code,
            international_code: item.international_code,
            line_type: item.line_type,
            national_code: item.national_code,
            phone: item.phone,
            phone_type: item.phone_type,
        });
        setIdPhone(item.id);
        setUpPhone(true);
    };
    const savePhone = (data) => {
        Axios.post(API_URL + `/person/phone/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getPhone();
                formPhone.resetFields();
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };
    const updatePhone = (data) => {
        setLoading(true);
        setLoadingTable(true);
        Axios.put(API_URL + `/person/phone/${data.id}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                setUpPhone(false);
                setIdPhone(null);
                formPhone.resetFields();
                getPhone();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const deletePhone = (data) => {
        setLoadingTable(true);
        Axios.delete(API_URL + `/person/phone/${data}/`)
            .then((response) => {
                message.success({
                    content: "Eliminado con exito.",
                    className: "custom-class",
                });
                setLoading(false);
                showModal();
                getPhone();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const colPhone = [
        {
            title: "Código de pais",
            dataIndex: "national_code",
        },
        {
            title: "Número",
            dataIndex: "phone",
        },
        {
            title: "Opciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <EditOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => updateFormPhone(item)}
                                />
                            </Col>
                            <Col className="gutter-row" offset={1}>
                                <DeleteOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => {
                                        setDeleteRegister({ id: item.id, api: "deletePhone" });
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    /////ADDRESS
    const formAddressPerson = (value) => {
        if (idAddressP != "" && idAddressP != undefined) {
            updateAddress(value);
        } else {
            value.person = router.query.id;
            saveAddress(value);
        }
    };
    const saveAddress = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/address/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                setIdAddressP(response.data.id);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const updateAddress = (data) => {
        setLoading(true);
        Axios.put(API_URL + `/person/address/${idAddressP}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    /////FAMILIA
    const getFamily = () => {
        Axios.get(API_URL + `/person/person/${router.query.id}/family_person/`)
            .then((response) => {
                response.data.map((a) => {
                    a.relation = a.relationship.name;
                    a.fullname = a.name + " " + a.flast_name + " " + a.mlast_name;
                });
                setFamily(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const formFinishFamily = (value) => {
        if (upFamily) {
            value.person = router.query.id;
            value.id = idFamily;
            value.birth_date = birthDateFam;
            updateFamily(value);
        } else {
            value.person = router.query.id;
            value.birth_date = birthDateFam;
            saveFamily(value);
        }
    };
    const updateFormFamily = (item) => {
        formFamily.setFieldsValue({
            relationship: item.relationship.id,
            name: item.name,
            flast_name: item.flast_name,
            mlast_name: item.mlast_name,
            gender: item.gender,
            life: item.life,
            benefit: item.benefit,
            place_birth: item.place_birth,
            nationality: item.nationality,
            other_nationality: item.other_nationality,
        });
        setBirthDateFam(item.birth_date);
        if (item.birth_date)
            formFamily.setFieldsValue({
                birth_date: moment(item.birth_date),
            });
        if (item.job)
            formFamily.setFieldsValue({
                job: item.job.id,
            });
        setIdFamily(item.id);
        setUpFamily(true);
    };
    const saveFamily = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/family/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getFamily();
                formFamily.resetFields();
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const updateFamily = (data) => {
        setLoading(true);
        setLoadingTable(true);
        Axios.put(API_URL + `/person/family/${data.id}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                setUpFamily(false);
                setIdFamily(null);
                formFamily.resetFields();
                getFamily();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const deleteFamily = (data) => {
        setLoadingTable(true);
        Axios.delete(API_URL + `/person/family/${data}/`)
            .then((response) => {
                message.success({
                    content: "Eliminado con exito.",
                    className: "custom-class",
                });
                setLoading(false);
                showModal();
                getFamily();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const colFamily = [
        {
            title: "Nombre",
            dataIndex: "fullname",
        },
        {
            title: "Parentesco",
            dataIndex: "relation",
        },
        {
            title: "Beneficio",
            dataIndex: "benefit",
        },
        {
            title: "Opciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <EditOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => updateFormFamily(item)}
                                />
                            </Col>
                            <Col className="gutter-row" offset={1}>
                                <DeleteOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => {
                                        setDeleteRegister({ id: item.id, api: "deleteFamily" });
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    /////CONTACTO DE EMERGENCIA
    const getContactEmergency = () => {
        Axios.get(
            API_URL + `/person/person/${router.query.id}/contact_emergency_person/`
        )
            .then((response) => {
                setContactEmergency(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const formFinishContactE = (value) => {
        if (upContEm) {
            value.id = idContEm;
            updateContEm(value);
        } else {
            value.person = router.query.id;
            saveContactE(value);
        }
    };
    const updateFormContEm = (item) => {
        formContactEmergency.setFieldsValue({
            relationship: item.relationship.id,
            address: item.address,
            fullname: item.fullname,
            phone_one: item.phone_one,
            phone_two: item.phone_two,
        });
        setIdContEm(item.id);
        setUpContEm(true);
    };
    const saveContactE = (data) => {
        Axios.post(API_URL + `/person/contact-emergency/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getContactEmergency();
                formContactEmergency.resetFields();
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const updateContEm = (data) => {
        setLoading(true);
        setLoadingTable(true);
        Axios.put(API_URL + `/person/contact-emergency/${data.id}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                setUpContEm(false);
                setIdContEm(null);
                getContactEmergency();
                formContactEmergency.resetFields();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const deleteContEm = (data) => {
        setLoading(true);
        setLoadingTable(true);
        Axios.delete(API_URL + `/person/contact-emergency/${data}/`)
            .then((response) => {
                message.success({
                    content: "Eliminado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getContactEmergency;
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const colContact = [
        {
            title: "Nombre",
            dataIndex: "fullname",
        },
        {
            title: "Teléfono 1",
            dataIndex: "phone_one",
        },
        {
            title: "Teléfono 2",
            dataIndex: "phone_two",
        },
        {
            title: "Dirección",
            dataIndex: "address",
        },
        {
            title: "Opciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <EditOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => updateFormContEm(item)}
                                />
                            </Col>
                            <Col className="gutter-row" offset={1}>
                                <DeleteOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => {
                                        setDeleteRegister({ id: item.id, api: "deleteContEm" });
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    /////FORMACION Y HABILIDADES
    const getTraining = () => {
        setLoadingTable(true);
        Axios.get(API_URL + `/person/person/${router.query.id}/training_person/`)
            .then((response) => {
                setTraining(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const formFinishTraining = (value) => {
        if (upTraining) {
        } else {
            value.since = dateTraining[0];
            value.until = dateTraining[1];
            value.currently_studing = currenlyStuding;
            value.person = router.query.id;
            saveTraining(value);
        }
    };
    const saveTraining = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/training/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getTraining();
                formTraining.resetFields();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const colTraining = [
        {
            title: "Escuela",
            dataIndex: "school",
        },
        {
            title: "Fecha inicio",
            dataIndex: "since",
        },
        {
            title: "Fecha fin",
            dataIndex: "until",
        },
        {
            title: "Documento",
            dataIndex: "accreditation_document",
        },
    ];

    /////EPERIENCIA LABORAL
    const getJobExperience = () => {
        Axios.get(
            API_URL + `/person/person/${router.query.id}/job_experience_person/`
        )
            .then((response) => {
                setExperienceJob(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };
    const formFinishJobExp = (value) => {
        if (upExperienceJob) {
        } else {
            value.person = router.query.id;
            value.since = dateExpjob[0];
            value.until = dateExpjob[1];
            saveJobExp(value);
        }
    };
    const saveJobExp = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/experience-job/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                formExperiencejob.resetFields();
                getJobExperience();
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const colExpJob = [
        {
            title: "Empresa",
            dataIndex: "company",
        },
        {
            title: "Puesto",
            dataIndex: "function",
        },
    ];

    /////CUENTAS BANCARIAS
    const getBankAccount = () => {
        setLoadingTable(true);
        Axios.get(
            API_URL + `/person/person/${router.query.id}/bank_account_person/`
        )
            .then((response) => {
                setBankAccounts(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const formBankAcc = (value) => {
        if (upBankAcc) {
            value.id = idBankAcc;
            updateBankAcc(value);
        } else {
            value.person = router.query.id;
            saveBankAcc(value);
        }
    };
    const updateFormbankAcc = (item) => {
        formBank.setFieldsValue({
            bank: item.bank.id,
            account_number: item.account_number,
            interbank_key: item.interbank_key,
        });
        setIdBankAcc(item.id);
        setUpBankAcc(true);
    };
    const saveBankAcc = (data) => {
        setLoading(true);
        Axios.post(API_URL + `/person/bank-account/`, data)
            .then((response) => {
                message.success({
                    content: "Guardado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                getBankAccount();
                formBank.resetFields();
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };
    const updateBankAcc = (data) => {
        setLoading(true);
        setLoadingTable(true);
        Axios.put(API_URL + `/person/bank-account/${data.id}/`, data)
            .then((response) => {
                message.success({
                    content: "Actualizado correctamente.",
                    className: "custom-class",
                });
                setLoading(false);
                setUpBankAcc(false);
                setIdBankAcc(null);
                formBank.resetFields();
                getBankAccount();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const deleteBankAcc = (data) => {
        setLoadingTable(true);
        Axios.delete(API_URL + `/person/bank-account/${data}/`)
            .then((response) => {
                message.success({
                    content: "Eliminado con exito.",
                    className: "custom-class",
                });
                setLoading(false);
                showModal();
                getBankAccount();
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const colBank = [
        {
            title: "Banco",
            render: (item) => {
                return <>{item.bank.name}</>;
            },
            key: "id",
        },
        {
            title: "Número de cuenta",
            dataIndex: "account_number",
            key: "account_number",
        },
        {
            title: "Clabe interbancaria",
            dataIndex: "interbank_key",
            key: "interbank_key",
        },
        {
            title: "Opciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <EditOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => updateFormbankAcc(item)}
                                />
                            </Col>
                            <Col className="gutter-row" offset={1}>
                                <DeleteOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => {
                                        setDeleteRegister({ id: item.id, api: "deleteBankAcc" });
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    ////DOCUMENT
    const getDocument = () => {
        setLoading(true);
        setLoadingTable(true);
        Axios.get(API_URL + `/person/person/${router.query.id}/document_person/`)
            .then((response) => {
                setDocuments(response.data);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    };
    const getModalDoc = (value) => {
        setModalDoc(value);
        getDocument();
    };
    const deleteDocument = (value) => {
        setLoading(true);
        Axios.delete(API_URL + `/person/document/${value}/`)
            .then((response) => {
                getDocument();
                showModal();
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };
    const colDoc = [
        {
            title: "Tipo documento",
            render: (item) => {
                return <>{item.document_type.name}</>;
            },
        },
        {
            title: "Descripción",
            dataIndex: "description",
            key: "id",
        },
        {
            title: "Documento",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <a href={item.document}>
                                    <FileTextOutlined style={{ fontSize: "30px" }} />
                                </a>
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
        {
            title: "Opciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" offset={1}>
                                <DeleteOutlined
                                    style={{ fontSize: "25px" }}
                                    onClick={() => {
                                        setDeleteRegister({ id: item.id, api: "deleteDocument" });
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    /////DELETE REGISTER
    const setDeleteRegister = (props) => {
        setDeleted(props);
        showModal();
    };
    const deleteRegister = () => {
        if (deleted.api == "deleteBankAcc") deleteBankAcc(deleted.id);
        if (deleted.api == "deletePerson") deletePerson();
        if (deleted.api == "deletePhone") deletePhone(deleted.id);
        if (deleted.api == "deleteContEm") deleteContEm(deleted.id);
        if (deleted.api == "deleteFamily") deleteFamily(deleted.id);
        if (deleted.api == "deleteDocument") deleteDocument(deleted.id);
    };

    //////SHOW MODAL DELETE
    const showModal = () => {
        modal ? setModal(false) : setModal(true);
    };

    /////GET JOBS
    const onChangeDepartment = (value) => {
        Axios.get(API_URL + `/business/department/${value}/job_for_department/`)
            .then((response) => {
                if (response.status === 200) {
                    let job = response.data;
                    job = job.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setJobs(job);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <MainLayout currentKey="1">
            <Content className="site-layout">
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/home/">Person</Breadcrumb.Item>
                    <Breadcrumb.Item>Expediente de empleados</Breadcrumb.Item>
                </Breadcrumb>
                <Spin tip="Loading..." spinning={loading}>
                    <div
                        className="site-layout-background"
                        style={{ padding: 24, minHeight: 380, height: "100%" }}
                    >
                        <Title level={3}>Información Personal</Title>
                        <Title level={4} style={{ marginTop: 0 }}>
                            {personFullName}
                        </Title>
                        <Card bordered={true}>
                            <Form
                                onFinish={onFinishPerson}
                                layout={"vertical"}
                                form={formPerson}
                            >
                                <Row>
                                    <Col span={17}>
                                        <Row>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item
                                                    name="flast_name"
                                                    label="Apellido Paterno"
                                                    rules={[{ message: "Ingresa un apellido paterno" }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item
                                                    name="mlast_name"
                                                    label="Apellido Materno"
                                                    rules={[{ message: "Ingresa un apellido paterno" }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item
                                                    name="first_name"
                                                    label="Nombre(s)"
                                                    rules={[{ message: "Ingresa un nombre" }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="node" label="Unidad organizacional">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="unit" label="Reporta a ">
                                                    <Select options={people} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="department" label="Departamento">
                                                    <Select
                                                        options={departments}
                                                        onChange={onChangeDepartment}
                                                        placeholder="Departamento"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="job" label="Puesto">
                                                    <Select
                                                        options={jobs}
                                                        placeholder="Selecciona un puesto"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row >
                                            <hr />
                                            <Col offset={1} span={23}>
                                                <Title level={5} style={{ marginBottom: 15 }}>
                                                    Información adicional
                                            </Title>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item
                                                    name="email"
                                                    label="Dirección de E-Mail"
                                                    rules={[{ message: "Ingresa un email" }]}
                                                >
                                                    <Input disabled />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item
                                                    name="birth_date"
                                                    label="Fecha de nacimiento"
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        onChange={onChangeBirthDate}
                                                        moment={"YYYY-MM-DD"}
                                                        placeholder="Fecha de nacimiento"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="civil_status" label="Estado Civil">
                                                    <Select options={civilStatus} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="gender" label="Género">
                                                    <Select options={genders} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="curp" label="CURP">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="rfc" label="RFC">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={7} xs={22} offset={1}>
                                                <Form.Item name="imss" label="IMSS">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={6}>
                                        <Row justify="center" align="top">
                                            <Image width={200} src={photo} />
                                            <Col>
                                                <Form.Item
                                                    name="date_of_admission"
                                                    label="Fecha de ingreso"
                                                >
                                                    <DatePicker
                                                        onChange={onChangeDateAdmission}
                                                        moment={"YYYY-MM-DD"}
                                                    />
                                                </Form.Item>
                                                <Switch
                                                    checked={isActive}
                                                    onClick={changeStatus}
                                                    checkedChildren="Activo"
                                                    unCheckedChildren="Inactivo"
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row justify={'end'}>
                                    <Col>
                                        <Button type="primary" htmlType="submit">
                                            Guardar
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                            <hr style={{ border: 'solid 1px #efe9e9', margin: 20 }} />
                            <Tabs tabPosition={'left'}>
                                <TabPane tab="Datos Generales" key="tab_1">
                                    <Form
                                        layout={"vertical"}
                                        form={formGeneralTab}
                                        onFinish={formGeneralData}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="place_birth"
                                                    label="Lugar de nacimiento"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="nationality" label="Nacionalidad">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="other_nationality"
                                                    label="Otra nacionalidad"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="allergies" label="Alergias">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="blood_type" label="Tipo de sangre">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="availability_travel"
                                                    label="Disponibilidad para viajar"
                                                >
                                                    <Checkbox
                                                        onClick={checkTravel}
                                                        checked={checkedTravel}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item label="Cambio de residencia">
                                                    <Checkbox
                                                        onClick={checkResidence}
                                                        checked={checkedResidence}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                </TabPane>
                                <TabPane tab="Teléfpono" key="tab_2">
                                    <Form
                                        layout={"vertical"}
                                        form={formPhone}
                                        onFinish={formFinishPhone}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="phone_type" label="Tipo de telefono">
                                                    <Select options={typePhones} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="line_type" label="Tipo de linea">
                                                    <Select options={typeLines} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="international_code"
                                                    label="Código internacional"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="national_code"
                                                    label="Código de pais"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="country_code"
                                                    label="Código de ciudad"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="phone" label="Número telefónico">
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colPhone} dataSource={phones} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Dirección" key="tab_3">
                                    <Form
                                        layout={"vertical"}
                                        form={formAddress}
                                        onFinish={formAddressPerson}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="street_type" label="Tipo de calle">
                                                    <Select options={typeStreet} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="street" label="Calle">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="numberOne" label="Número exterior">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="numberTwo" label="Número interior">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="building" label="Edificio">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="postalCode" label="Código postal">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="suburb" label="Suburbio">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="location" label="Ubicacion">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="reference" label="Referencia">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                </TabPane>
                                <TabPane tab="Familia" key="tab_4">
                                    <Form
                                        layout={"vertical"}
                                        form={formFamily}
                                        onFinish={formFinishFamily}
                                    >
                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="relationship" label="Parentesco">
                                                    <Select options={relationship} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="job" label="Puesto de trabajo">
                                                    <Select options={jobs} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="name" label="Nombre">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="flast_name" label="Apellido paterno">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="mlast_name" label="Apellido materno">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="gender" label="Genero">
                                                    <Select options={genders} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="liffe" label="¿Vive?">
                                                    <Checkbox />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="birth_date"
                                                    label="Fecha de nacimiento"
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        onChange={onChangeBDFamily}
                                                        moment={"YYYY-MM-DD"}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="place_birth"
                                                    label="Lugar de nacimiento"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="nationality" label="Nacionalidad">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="other_nationality"
                                                    label="Otra nacionalidad"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="benefit" label="% Beneficio">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colFamily} dataSource={family} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Contactos de Emergencia" key="tab_5">
                                    <Form
                                        layout="vertical"
                                        form={formContactEmergency}
                                        onFinish={formFinishContactE}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="relationship" label="Parentesco">
                                                    <Select options={relationship} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="fullname" label="Nombre completo">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="phone_one" label="Teléfono 1">
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="phone_two" label="Teléfono 2">
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={13} xs={22} offset={1}>
                                                <Form.Item name="address" label="Dirección">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colContact} dataSource={contactEmergency} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Formación/Habilidades" key="tab_6">
                                    <Form
                                        layout="vertical"
                                        form={formTraining}
                                        onFinish={formFinishTraining}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="school" label="Escuela">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="since" label="Fecha Inicio-Fin">
                                                    <Space direction="vertical" size={12}>
                                                        <RangePicker
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeDateTrainig}
                                                        />
                                                    </Space>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="accreditation_document"
                                                    label="Documento de acreditación"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="currently_studing"
                                                    label="Estudia actualmente"
                                                >
                                                    <Checkbox
                                                        onChange={changeCurreStud}
                                                        checked={currenlyStuding}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="completed_period"
                                                    label="Periodo completado"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colTraining} dataSource={training} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Cuentas bancarias" key="tab_7">
                                    <Form
                                        layout="vertical"
                                        form={formBank}
                                        onFinish={formBankAcc}
                                    >

                                        <Row>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item name="bank" label="Banco">
                                                    <Select options={banks} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="account_number"
                                                    label="Número de cuenta"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} xs={22} offset={1}>
                                                <Form.Item
                                                    name="interbank_key"
                                                    label="Clabe interbancaria"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify={'end'}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colBank} dataSource={bankAccounts} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Documentos" key="tab_8">
                                    <Row>
                                        <Col style={{ padding: "2%" }}>
                                            <Button
                                                icon={<PlusOutlined />}
                                                type="primary"
                                                onClick={() => getModalDoc(true)}
                                            >
                                                Agregar
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Spin tip="Loading..." spinning={loadingTable}>
                                        <Table columns={colDoc} dataSource={documents} />
                                    </Spin>
                                </TabPane>
                                <TabPane tab="Eliminar" key="tab_9">
                                    <Alert
                                        message="Warning"
                                        description="Al eliminar a una persona perderá todos los datos
                                        relacionados a ella de manera permanente."
                                        type="warning"
                                        showIcon
                                    />
                                    <Row style={{ padding: "2%" }}>
                                        <Col>
                                            <Button
                                                type="primary"
                                                danger
                                                icon={<WarningOutlined />}
                                                onClick={() =>
                                                    setDeleteRegister({
                                                        id: "",
                                                        api: "deletePerson",
                                                    })
                                                }
                                            >
                                                Eliminar persona
                                            </Button>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                            <Row flex>
                                <Col style={{ paddingTop: "2%", paddingBottom: "4%" }}>
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        type="primary"
                                        onClick={() => Router.push("/home")}
                                    >
                                        Regresar
                  </Button>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Spin>
            </Content>
            <Modal
                title="Modal"
                visible={modal}
                onOk={deleteRegister}
                onCancel={showModal}
                okText="Si, Eliminar"
                cancelText="Cancelar"
            >
                <Alert
                    message="Warning"
                    description="Al eliminar este registro perderá todos los datos
                    relacionados a el de manera permanente.
                    ¿Está seguro de querer eliminarlo?"
                    type="warning"
                    showIcon
                />
            </Modal>
            <DocumentModal
                close={getModalDoc}
                visible={modalDoc}
                person={router.query.id}
            />
        </MainLayout>
    );
};
export default personDetailForm;
