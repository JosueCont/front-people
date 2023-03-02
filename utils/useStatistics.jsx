import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WebApiAssessment from "../api/WebApiAssessment";

export const useStatistics = () =>{
    const dataUser = useSelector(state => state.userStore.user);
    const [listAssessments, setListAssessments] = useState([]);
    const [generalPercent, setGeneralPercent] = useState(0);
    const [toAnswer, setToAnswer] = useState(0);
    const [completed, setCompleted] = useState(0);

    useEffect(()=>{
        if(listAssessments.length > 0){
            calculateIndicators()
        }
    },[listAssessments])

    useEffect(() => {
        if(dataUser){
            getAssessments(dataUser.id)
        }
    }, [dataUser]);

    const getAssessments = async (id) =>{
        let data = {person: id}
        WebApiAssessment.getAssessmentsByPerson(data)
        .then((response) => {
            setListAssessments(response.data)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const calculateIndicators = () => {
        let toAnswer = 0;
        let completed = 0;
        let progress = 0;
        let percent = 100 / (listAssessments.length * 100);
        listAssessments.map((item)=> {
            if (item?.apply){
                if(item.apply.length > 0){
                    progress+=item?.apply[0]?.progress;
                }
                if(
                    item?.apply[0]?.progress == 100 ||
                    item?.apply[0]?.status == 2
                ){
                    completed+=1;
                }else{
                    toAnswer+=1;
                }
            }else{
                toAnswer+=1;
            }
        })
        let total = percent * progress;
        setGeneralPercent(total.toFixed(0))
        setToAnswer(toAnswer)
        setCompleted(completed)
    }

    return { generalPercent, toAnswer, completed };
}