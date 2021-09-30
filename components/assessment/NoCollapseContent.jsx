import React from 'react'

const NoCollapseContent = ({itemTitle, contentTitle}) => {
    return (
        <div className="collapse-no-content">
            No existen <i>{itemTitle}</i> agregadas en esta <i>{contentTitle}</i>
        </div>
    )
}

export default NoCollapseContent;