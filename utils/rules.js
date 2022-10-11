import { max } from "lodash";

export const ruleRequired = {
  required: true,
  message: "Este campo es requerido",
};

export const ruleMinArray = (min) => {
  return {
    min: min,
    type: "array",
    message: `Seleciona ${min} registros`,
  };
};

export const ruleMaxArray = (max) => {
  return {
    max: max,
    type: "array",
    message: `Máximo a seleccionar ${max} registros`,
  };
};

export const ruleWhiteSpace = {
  whitespace: true,
  message: 'Este campo no puede estar vacío'
}

export const ruleMinAge = (min)  => {
  return{
    type: 'number',
    min: min,
    message: `Edad mínima mayor igual a ${min}`
  }
}

export const ruleMaxAge = (max) =>{
  return{
    type: 'number',
    max: max,
    message: `Edad máxima menor o igual a ${max}`
  }
}

export const ruleURL = {
  type: 'url',
  message: 'Ingrese una url válida'
}

export const rulePhone = {
  pattern: /^[0-9]{0,10}$/,
  message: "El campo debe tener 10 dígitos numéricos",
};

export const ruleEmail = {
  type: "email",
  message: "Ingrese un correo electrónico válido",
};

export const onlyNumeric = {
  pattern: /^[0-9]+$/,
  message: "Ingrese un valor numérico.",
};

export const twoDigit = {
  pattern: /^[0-9]{0,2}$/,
  message: "El campo debe tener 2 dígitos numéricos",
};

export const treeDecimal = {
  pattern: /^\d+(?:\.\d{1,3})?$/,
  message: "El campo no puede tener más de tres decimales",
};

export const fourDecimal = {
  pattern: /^\d+(?:\.\d{1,4})?$/,
  message: "El campo no puede tener más de cuatro decimales",
};

// {pattern: /^[\d]{0,16}$/, message: "El no  debe tener más de 16 dígitos" }, numero menor  a 16 digitos

export const curpFormat = {
  pattern:
    /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
  message: "CURP no válido.",
};
export const rfcFormat = {
  pattern:
    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
  message: "RFC no válido.",
};

export const minLengthNumber = {
  pattern: /^[0-9]{11}$/,
  message: "El valor ingresado no puede ser menor a 11 caracteres.",
};

export const nameLastname = {
  pattern: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,
  message:
    "El valor ingresado no puede contener números y/o caracteres especiales.",
};
