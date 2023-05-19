import React, {Fragment} from 'react'
import {
    Document,
    StyleSheet,
    Page,
    Font, View, Text, Image
} from '@react-pdf/renderer'
import Html from "react-pdf-html";
import RichTextParser from "./RichTextParser";
import PDFStyles from "./PDFStyles";
const AssessmentQuestionsPDF = ({assessment, sections, questions }) =>{

    return(
        <Document>
            <Page size="LETTER" style={PDFStyles.page}>
                <View style={PDFStyles.evaluationTitle}>
                    <Text>{assessment && assessment.name}</Text>
                </View>
                <View style={PDFStyles.evaluationDescription}>
                    {assessment.description && <RichTextParser content={assessment.description}/>}
                </View>
                {sections && sections.map((section, idx) => (
                    <View key={idx} style={PDFStyles.pageSection}>
                        <View style={PDFStyles.sectionTitle}>
                            <Text>{section.name}</Text>
                        </View>
                        <View>
                            {section.instructions_es && <RichTextParser content={section.instructions_es}/>}
                        </View>
                        {questions && (questions.filter((q) => section.id === q.section.id)).map((question, index) =>(
                            <View key={index}>
                            <View style={PDFStyles.sectionQuestions}>
                                <View>
                                    <View>
                                        <Text style={PDFStyles.questionTitle}>{question.title}</Text>
                                    </View>
                                    {/*<RichTextParser content={question.description ? question.description : ''}/>*/}
                                    {question.description && <RichTextParser content={question.description}/>}
                                    <Text style={{fontFamily:'Helvetica-Bold', marginBottom: '0.25cm', marginTop: '0.25cm'}}>RESPUESTAS:</Text>
                                </View>
                                <View style={PDFStyles.questionAnswerSet}>
                                    {question.answer_set.map((answer, idx) => (<Fragment key={idx}>
                                        <View style={PDFStyles.listItem}>
                                            {/*<Text style={{ marginHorizontal: 8 }}>{idx + 1})</Text>*/}
                                            <Text style={PDFStyles.listItemText}>{answer.title}</Text>
                                        </View>
                                        {/*<RichTextParser content={answer.description ? answer.description : ''}/>*/}
                                        {answer.description && <RichTextParser content={answer.description}/>}
                            </Fragment>))}
                                </View>
                                {(questions.filter((q) => section.id === q.section.id)).length !== index+1 && <View style={PDFStyles.questionSeparator}/> }
                            </View>
                            </View>
                        ))}
                    </View>
                ))}
                <Text render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}

export default AssessmentQuestionsPDF
