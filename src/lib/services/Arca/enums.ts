export const FACTURA = {
	A: 1,
	B: 6,
	C: 11
} as const;

export const CONCEPTO = {
	PRODUCTOS: 1,
	SERVICIOS: 2,
	PRODUCTOS_Y_SERVICIOS: 3
} as const;

export const TIPO_DE_DOCUMENTO = {
	DNI: 96,
	CUIT: 80,
	CUIL: 86,
	CONSUMIDOR_FINAL: 99
} as const;

export const CONCIDICION_IVA_RECEPTOR = {
	IVA_RESPONSABLE_INSCRIPTO: 1,
	RESPONSABLE_MONOTRIBUTO: 6,
	MONOTRIBUTISTA_SOCIAL: 13,
	MONOTRIBUTO_TRABAJADOR_INDEPENDIENTE_PROMOVIDO: 16,
	IVA_SUJETO_EXENTO: 4,
	CONSUMIDOR_FINAL: 5,
	SUJETO_NO_CATEGORIZADO: 7,
	PROVEEDOR_DEL_EXTERIOR: 8,
	CLIENTE_DEL_EXTERIOR: 9,
	IVA_LIBERADO_LEY_N_19_640: 10,
	IVA_NO_ALCANZADO: 15
} as const;

export const ID_IVA = [
	{ id: 3, percentage: 0 },
	{ id: 4, percentage: 10.5 },
	{ id: 5, percentage: 21 },
	{ id: 6, percentage: 27 },
	{ id: 8, percentage: 5 },
	{ id: 9, percentage: 2.5 }
] as const;
