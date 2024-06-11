<script lang="ts">
    export let data
    import { onMount } from 'svelte'
    import { page } from '$app/stores'
    import { User } from '$lib/classes/User'
    import { LinkBucket } from '$lib/classes/LinkBucket'
    import LinkCard from '$lib/components'

    let { supabase, session } = data
    $: ({ supabase, session } = data)

    let user: User
    let userBucket: LinkBucket
    let email: string = $page.params.email
    let linkBucket: any = []
    let linkList: any = []
    let isModalOpen: boolean = false
    let searchInput: string = ''
    let profile: any = {
        username: 'Przykładowa Nazwa',
        email: email,
        phonenumber: 'Twój nr telefonu',
        description:
            'To opis Twojego linkBucket. Możesz go edytować w dowolnym momencie.',
        links: [1, 2, 3]
    }

    async function createClassInstances() {
        user = new User(
            profile.username,
            profile.email,
            profile.phonenumber,
            profile.description,
            profile.links
        )
        userBucket = new LinkBucket(user)
        await userBucket.createLinkBucket()
        await userBucket.getLinkList()
        linkBucket = userBucket.linkBucket
        linkList = userBucket.linkList
    }

    async function saveProfile() {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)

            if (profileError) {
                console.error('Error fetching profile:', profileError)
            }

            if (profileData?.length === 0) {
                const { data, error } = await supabase.from('profiles').insert({
                    ...profile,
                    user_id: session?.user?.id,
                    email: session?.user?.email
                })

                if (error) {
                    console.error('Error inserting profile:', error)
                } else {
                    console.log('Profile inserted:', data)
                }
            } else {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({
                        username: profile.username,
                        phonenumber: profile.phonenumber,
                        description: profile.description,
                        links: profile.links
                    })
                    .eq('user_id', session?.user?.id)

                if (error) {
                    console.error('Error updating profile:', error)
                } else {
                    console.log('Profile updated:', data)
                }
            }
        } catch (error) {
            console.error('Unexpected error in saveProfile:', error)
        }
    }

    onMount(() => {
        const unsubscribe = page.subscribe(async ($page) => {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, email, phonenumber, description, links')
                .eq('email', email)

            if (profileError) {
                console.error('Error fetching profile:', profileError)
            }

            if (profileData?.length == 0 && email == session?.user?.email) {
                // saveProfile
                console.log('SAVE PROFILE')
                await saveProfile()
            } else if (profileData != null && profileData.length > 0) {
                profile = profileData[0]
            } else {
                console.log('NO PROFILE')
                profile = {
                    username: '',
                    email: '',
                    phonenumber: '',
                    description: 'Ten użytkownik nie posiada jeszcze profilu!',
                    links: []
                }
            }

            await createClassInstances()
            console.log(linkList)
        })

        return () => {
            unsubscribe()
        }
    })

    async function savePageEdits() {
        await saveProfile()
        await createClassInstances()
        isModalOpen = false
    }

    async function toggleLink(id: number) {
        let linkIDs: any = profile.links

        if (linkIDs.length >= 3 && !linkIDs.includes(id)) {
            alert('Możeszy wybrać tylko 3 linki!')
            return
        }

        if (linkIDs.includes(id)) {
            let index = linkIDs.indexOf(id)
            linkIDs.splice(index, 1)
        } else {
            linkIDs.push(id)
        }

        profile.links = [...linkIDs]
    }
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content">
        <div class="max-w-3xl text-center">
            {#if user && linkBucket}
                <h1 class="text-white font-bold text-4xl">{user.username}</h1>
                <p class="py-5 max-w-md mx-auto text-sky-400">
                    {user.description}
                </p>
                <div class="grid grid-cols-3 gap-4 mb-8">
                    {#if linkBucket.length === 0 || linkBucket === undefined}
                        <p class="col-span-3 text-sky-400">
                            Dzielnie walczymy o Twoje wiaderko pełne linków...
                        </p>
                    {:else}
                        {#each linkBucket as link (link.id)}
                            {#if link}
                                <LinkCard {link} />
                            {:else}
                                <p>Ładowanie linku...</p>
                            {/if}
                        {/each}
                    {/if}
                </div>
                <div class="flex flex-col items-center">
                    <a
                        href="mailto:{user.email}"
                        class="py-2 max-w-md mx-auto text-xl ext-slate-400 hover:text-sky-400"
                        >{user.email}</a
                    >
                    <a
                        href="tel:{user.phonenumber}"
                        class="py-2 max-w-md mx-auto text-xl ext-slate-400 hover:text-sky-400"
                    >
                        {user.phonenumber}
                    </a>
                    {#if email == session?.user?.email}
                        <button
                            class="btn btn-info mt-8 max-w-md"
                            on:click={() => (isModalOpen = true)}
                            >Edytuj wiaderko</button
                        >
                        <dialog
                            class="modal min-w-lg"
                            class:modal-open={isModalOpen}
                        >
                            <div
                                class="modal-box h-full max-w-xl flex flex-col gap-2 justify-center items-center"
                            >
                                <div class="w-full">
                                    <h2
                                        class="text-white font-bold text-2xl mb-2"
                                    >
                                        Edytuj swoje wiaderko
                                    </h2>
                                    <p>
                                        Tutaj możesz edytować swoje dane takie
                                        jak nazwa użytkownika, numer telefonu,
                                        opis wiaderka i jego zawartość.
                                    </p>
                                </div>
                                <div class="w-full">
                                    <p class="text-white p-2">
                                        Edytuj nazwę użytkownika
                                    </p>
                                    <textarea
                                        bind:value={profile.username}
                                        class="textarea textarea-bordered textarea-xs w-full max-w-md"
                                    />
                                </div>
                                <div class="w-full">
                                    <p class="text-white p-2">
                                        Edytuj numer telefonu
                                    </p>
                                    <textarea
                                        bind:value={profile.phonenumber}
                                        class="textarea textarea-bordered textarea-xs w-full max-w-md"
                                    />
                                </div>
                                <div class="w-full">
                                    <p class="text-white p-2">
                                        Edytuj opis wiaderka
                                    </p>
                                    <textarea
                                        bind:value={profile.description}
                                        class="textarea textarea-bordered textarea-md w-full max-w-md"
                                    />
                                </div>
                                <div class="w-full">
                                    <p class="text-white p-2">
                                        Wybierz swoje linki
                                    </p>
                                    <div
                                        class="grid grid-cols-3 overflow-y-scroll m-3 place-content-center h-md"
                                    >
                                        <div class="col-span-3">
                                            <input
                                                type="text"
                                                class="input input-bordered w-full max-w-md mb-4"
                                                placeholder="Znajdź link!"
                                                bind:value={searchInput}
                                            />
                                        </div>
                                        {#each linkList as singleLink, index}
                                            {#if singleLink.name
                                                .toLowerCase()
                                                .includes(searchInput.toLowerCase())}
                                                <button
                                                    class={'card bg-slate-700 h-10 p-1 m-1 justify-center items-center ' +
                                                        (profile.links.includes(
                                                            index + 1
                                                        )
                                                            ? 'border-2 border-blue-600'
                                                            : '')}
                                                    on:click={() =>
                                                        toggleLink(index + 1)}
                                                >
                                                    <div class="text-center">
                                                        <h3
                                                            class="text-white text-xl"
                                                        >
                                                            {singleLink.name}
                                                        </h3>
                                                    </div>
                                                </button>
                                            {/if}
                                        {/each}
                                    </div>
                                </div>
                                <button
                                    class="btn btn-success"
                                    on:click={() => savePageEdits()}
                                    >Zapisz zmiany</button
                                >
                            </div>
                        </dialog>
                    {/if}
                </div>
            {:else}
                <p>Ładowanie danych użytkownika...</p>
            {/if}
        </div>
    </div>
</div>
