export class Role {
    constructor(
        public readonly role_name: string,
        public readonly description: string,
        public readonly role_id?: number

    ) { }
}