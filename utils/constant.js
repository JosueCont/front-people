import { APP_ID } from "../config/config";

export const genders = [
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

export const civilStatus = [
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

export const typePhones = [
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

export const typeLines = [
  {
    label: "Celular",
    value: 1,
  },
  {
    label: "Fijo",
    value: 2,
  },
];

export const typeStreet = [
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

export const periodicity = [
  {
    label: "Semanal",
    value: 1,
  },
  {
    label: "Catorcenal",
    value: 2,
  },
  {
    label: "Quincenal",
    value: 3,
  },
  {
    label: "Mensual",
    value: 4,
  },
];

export const statusSelect = [
  {
    label: "Todos",
    value: -1,
  },
  {
    label: "Activos",
    value: true,
  },
  {
    label: "Inactivos",
    value: false,
  },
];

export const periodicityNom = [
  {
    label: "Diaria",
    value: 1,
  },
  {
    label: "Semanal",
    value: 2,
  },
  {
    label: "Decenal",
    value: 3,
  },
  {
    label: "Catorcenal",
    value: 4,
  },
  {
    label: "Quincenal",
    value: 5,
  },
  {
    label: "Mensual",
    value: 6,
  },
  {
    label: "Anual",
    value: 7,
  },
];

export const typeMessage = [
  {
    label: "Noticias",
    value: 2,
  },
  {
    label: "Aviso",
    value: 1,
  },
];

export const headersApiKhonnect = {
  "client-id": APP_ID,
  "Content-Type": "application/json",
};

export const monthsName = [
  {
    label: "Enero",
    value: 1,
  },
  {
    label: "Febrero",
    value: 2,
  },
  {
    label: "Marzo",
    value: 3,
  },
  {
    label: "Abril",
    value: 4,
  },
  {
    label: "Mayo",
    value: 5,
  },
  {
    label: "Junio",
    value: 6,
  },
  {
    label: "Julio",
    value: 7,
  },
  {
    label: "Agosto",
    value: 8,
  },
  {
    label: "Septiembre",
    value: 9,
  },
  {
    label: "Octubre",
    value: 10,
  },
  {
    label: "Noviembre",
    value: 11,
  },
  {
    label: "Diciembre",
    value: 12,
  },
];

export const intranetAccess = [
  {
    label: "No",
    value: 1,
  },
  {
    label: "Escritura",
    value: 2,
  },
  {
    label: "Lectura",
    value: 3,
  },
];

export const statusActivePost = [
  {
    label: 'Inactivo',
    value: 0,
    key: 0
  },
  {
    label: 'Activo',
    value: 1,
    key: 1
  }
]

export const messageSaveSuccess = "Agregado correctamente.";
export const messageUpdateSuccess = "Actualizado correctamente.";
export const messageDeleteSuccess = "Eliminado correctamente.";
export const messageError = "Ocurrio un error, intente de nuevo.";
export const titleDialogDelete = "¿Está seguro de eliminarlo?";
export const messageDialogDelete =
  "Al eliminar este registro se perderán todos los datos relacionados de manera permanente.";
