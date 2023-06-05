import React from "react";
import { withAuthSync } from "../../../../../libs/auth";
import AddOrEditIncapacity from "../../../../../components/comunication/inpacity/AddOrEditIncapacity";

const index = () => {
    return (
        <AddOrEditIncapacity action="edit" />
    )
}

export default withAuthSync(index)
