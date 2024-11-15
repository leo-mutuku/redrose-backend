export class Users {
    constructor(
        public readonly user_id: number,
        public readonly username: string,
        public readonly password: string,
        public readonly ttl: number,
        public readonly phone: string
    ) { }
}