export declare type OBJECT_TYPE<T> = {
    [key: string]: T;
};

export type DEFAULT_RES_SINGLE<T> =
    { success: false, errors: string[], data?: T, warnings?: string[], code?:number}
    | { success: true, data: T, warnings?: string[]};

export type DEFAULT_RES_SINGLE_P<T> = Promise<DEFAULT_RES_SINGLE<T>>;

export type DEFAULT_RES_ARR<T> =
    { success: false, errors: string[], data?: T[], warnings?: string[], code?: number }
    | { success: true, data: T[], warnings?: string[]};

export type DEFAULT_RES_ARR_P<T> = Promise<DEFAULT_RES_ARR<T>>

export const GEN_SINGLE_SUCCESS = <T>( data: T ): DEFAULT_RES_SINGLE<T> => {
	return {
		success: true,
		data
	};
};

export const GEN_SINGLE_FAILURE = <T>( errors: string[], data?: T ): DEFAULT_RES_SINGLE<T> => {
	return {
		success: false,
		errors,
		data
	};
};

export const GEN_ARR_SUCCESS = <T>( data: T[] ): DEFAULT_RES_ARR<T> => {
	return {
		success: true,
		data
	};
};

export const GEN_ARR_FAILURE = <T>( errors: string[], data?: T[] ): DEFAULT_RES_ARR<T> => {
	return {
		success: false,
		errors,
		data
	};
};

export default {}