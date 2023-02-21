export class Account{
    constructor(
        public id: string,
        public name: string,
        public firstname: string,
        public email: string,
        public role: string
    ){}
}

export class AccountJWT{
    constructor(
        public id: string,
        public name: string,
        public firstname: string,
        public email: string,
        public role: string,
        public jwt: string
    ){}
}