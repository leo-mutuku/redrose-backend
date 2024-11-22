export class User {
    constructor(
        public readonly user_id: number,
        public readonly ttl: number,
        public readonly username: string,
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly password: string,
        public readonly phone: string,
        public readonly is_active?: boolean,
    ) { }
} 