<script lang="ts">
    export let data

    import { Auth } from '@supabase/auth-ui-svelte'
    import { ThemeSupa } from '@supabase/auth-ui-shared'

    let { supabase, session } = data
    $: ({ supabase, session } = data)
</script>

<div class="hero min-h-screen bg-base-300">
  <div class="hero-content w-[800px]">
    <div class="flex flex-col">
        <p>Stwórz konto lub zaloguj się poniżej!</p>
        <Auth
        supabaseClient = {supabase}
        theme = "dark"
        appearance = {{
            theme: ThemeSupa,
            style: {
                input: "width: 400px;"
            }
        }}
        />
    </div>
  </div>
</div>
