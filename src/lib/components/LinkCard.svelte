<script lang="ts">
    export let link: {
        id: number
        logoClearbitAPI: string
        name: string
        description: string
        url: string
    }
</script>

<div>
    <div class="card bg-slate-700 m-4 shadow-lg shadow-blue-900">
        <a href={link.url} class="card-body">
            <img
                src={link.logoClearbitAPI}
                alt={link.name}
                class="w-32 h-32 mx-auto"
            />
            <div class="text-center">
                <h2 class="text-white text-2xl font-bold">{link.name}</h2>
                <p class="text-sky-400">{link.description}</p>
            </div>
        </a>
    </div>
</div>

<style>
</style>
