const LINK_BUCKET_API = "./src/api/links.json/"

// get links list
export async function getLinkList() {
    const response = await fetch(LINK_BUCKET_API)
    const data = await response.json()
    // return data.results
    console.log(data.results);
}

// get link info