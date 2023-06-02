import React from "react";
import { withAuthSync } from "../../../../../libs/auth";
import AddOrEditInpacity from "../../../../../components/comunication/inpacity/AddOrEditInpacity";

const index = () => {
    return (
        <AddOrEditInpacity action="edit" />
    )
}

export default withAuthSync(index)
