<script lang="ts">
  import { page } from "$app/stores"

  $: email = $page.params.email;
</script>

<div class="hero min-h-screen bg-base-300">
  <div class="hero-content">
    <div class="max-w-2xl text-center">
      <h1 class="text-white font-bold text-4xl">{email}</h1>
      <p class="py-5 max-w-md mx-auto">User description here...</p>
      <div class="grid grid-cols-3">
        <div class="card bg-slate-700 m-4 shadow-lg shadow-blue-900">
          <div class="card-body">
            <div class="text-center">
              <img src={""} alt="Link" class="w-32 h-32 mx-auto bg-gray-500" />
              <h2 class="text-white text-2xl font-bold">Github</h2>
              <p class="text-info">Projects Portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
