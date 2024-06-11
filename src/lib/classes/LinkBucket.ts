import { User } from '$lib/classes/User'

const LINK_BUCKET_API = './src/data/links.json'

export class LinkBucket {
    user: User
    linkBucket: any
    linkList: unknown

    constructor(user: User) {
        this.user = user
        this.linkBucket = []
        this.linkList = []
    }

    async getLinkList() {
        const response = await fetch(LINK_BUCKET_API)
        const data = await response.json()
        this.linkList = data
    }

    async getLink(id: number) {
        const response = await fetch(LINK_BUCKET_API)
        const data = await response.json()
        const link = data.find((link: { id: number }) => link.id === id)
        return link ? link : null
    }

    async createLinkBucket() {
        this.linkBucket = await Promise.all(
            this.user.links.map(async (id: number) => {
                const data = await this.getLink(id)
                return data
            })
        )
        return this.linkBucket
    }
}
