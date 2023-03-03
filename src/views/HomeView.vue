<template>
  <div class="home">

    <div class="row">
      <div class="col-3">
        <Sidebar />
      </div>
      <div class="col-9">
        <Tables />
      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar'
import Tables from "@/components/Tables.vue";

export default {
  name: 'HomeView',
  components: {
    Tables,
    Sidebar
  }
}
</script>
