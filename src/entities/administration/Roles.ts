export class Role {
    constructor(
        public readonly role_name: string,
        public readonly role_description: string,
        public readonly created_by?: boolean,
        public readonly role_id?: number

    ) { }
}