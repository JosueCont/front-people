import {StyleSheet} from "@react-pdf/renderer";

const PDFStyles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
        padding: '1.25cm',
        fontSize: 11,
        color: '#000000d9',
        fontFamily:'Helvetica',
        lineHeight: 1.25,
    },
    evaluationTitle: {
        textTransform:'uppercase',
        fontSize: 16,
        lineHeight: 1.5,
        fontFamily:'Helvetica-Bold',
        fontWeight:700,
        textAlign: 'center',
        marginBottom: '0.25cm',
    },
    evaluationDescription:{
        marginBottom: '0.25cm',
    },
    pageSection: {
        fontWeight: 'normal',
    },
    sectionTitle:{
        backgroundColor: '#fafafa',
        border: '1px solid #d9d9d9',
        textTransform:'uppercase',
        fontSize: 12,
        padding: '0.25cm',
        marginBottom: '0.5cm',
    },
    sectionQuestions:{
        paddingLeft: '0.25cm',
        paddingRight: '0.25cm',
        /*border: '1px solid #d9d9d9',*/
        marginBottom: '0.5cm',
    },
    questionSeparator:{
        borderBottom: '1px solid #d9d9d9'
    },
    questionTitle:{
        fontFamily:'Helvetica-Bold',
        marginBottom: '0.125cm',
    },
    questionDescription:{
        paddingLeft: '0.25cm',
        marginBottom: '0.125cm',
    },
    questionAnswerSet:{
        paddingLeft: '0.75cm',
        marginBottom: '0.5cm',
        flexDirection: 'column',
        width: '17.5cm',
    },
    answerSetAnswer:{
        flexDirection: "row",
        marginBottom: '0.125cm',
    },
    /* RICH TEXT ELEMENTS */
    headingOne: {
        marginBottom: '0.25cm',
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: 12,
    },
    text: {
        marginBottom: '0.125cm',
    },
    list: {
        flexDirection: 'column',
        width: '100%'
    },
    listItem: {
        flexDirection: "row",
        marginBottom: '0.125cm',
    },
    listItemText: {
    },
    textBold:{
        fontFamily: 'Helvetica-Bold'
    },
    textBoldItalic:{
        fontFamily: 'Helvetica-BoldOblique'
    },
    textItalic:{
        fontFamily: 'Helvetica-Oblique'
    },
})
export default PDFStyles