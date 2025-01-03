export class Auth {
    constructor(
        public readonly username: string,
        public readonly password?: string,
        public readonly user_id?: string,
        public readonly token?: string,
        public readonly roles?: [number],
        public readonly shift_id?: number,
        public readonly staff_id?: number

    ) { }
}