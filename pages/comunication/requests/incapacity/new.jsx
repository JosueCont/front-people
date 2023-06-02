import React from "react";
import { withAuthSync } from "../../../../libs/auth";
import AddOrEditInpacity from "../../../../components/comunication/inpacity/AddOrEditInpacity";

const index = () => {
    return (
        <AddOrEditInpacity action="add" />
    )
}

export default withAuthSync(index)
