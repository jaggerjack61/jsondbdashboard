<template>
  <div>
    <h2>{{$store.state.database.replace('.json','')}}</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody v-if="$store.state.tables">
        <tr v-for="table in $store.state.tables">
            <td>{{ table.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
</script>