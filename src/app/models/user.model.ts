export interface User {
    uid: string;
    email?: string;
    name?: string;
    phone?: string;
    address?: string;
    rol: {
        val: string;
    };
}