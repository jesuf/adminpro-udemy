export class Usuario {

    // Definiendolas así, nos evitamos crear las propiedades fuera y setearlas en el cuerpo del constructor
    // Esto es como inyectar servicios pero con propiedades en una clase
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string,
        public role: string = 'USER_ROLE',
        public google?: boolean,
        public _id?: string
    ) {}
}
