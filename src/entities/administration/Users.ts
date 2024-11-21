export class User {
    constructor(
        public readonly username: string,
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly password: string,
        public readonly ttl: number,
        public readonly phone: string
    ) { }
} 