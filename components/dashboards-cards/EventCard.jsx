import { Card, Row, Col, Button } from 'antd'
import React from 'react'

const EventCard = ({buttonText="Ok", buttonIcon=null, buttonStyle=null, icon, ...props}) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col>
                    
                </Col>
                <Col>
                    <Button icon={buttonIcon?buttonIcon:null} style={buttonStyle?buttonStyle:null}>
                        {buttonText}
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

export default EventCard
