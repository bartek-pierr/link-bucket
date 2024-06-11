export class User {
    username: string
    email: string
    phonenumber: string
    description: string
    links: number[]

    constructor(
        username: string,
        email: string,
        phonenumber: string,
        description: string,
        links: number[]
    ) {
        this.username = username
        this.email = email
        this.phonenumber = phonenumber
        this.description = description
        this.links = links
    }
}
