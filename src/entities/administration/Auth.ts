export class Auth {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly first_name?: string,
        public readonly last_name?: string,
        public readonly ttl?: number,
        public readonly phone?: string
    ) { }
}