<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://vitejs.dev/guide/" target="_blank" rel="noopener">Vite documentation</a>.
    </p>
    <h3>Recommended Vite Plugins</h3>
    <ul>
      <li><a href="https://github.com/vitejs/vite-plugin-vue2" target="_blank" rel="noopener">@vitejs/plugin-vue</a></li>
      <li><a href="https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx" target="_blank" rel="noopener">@vitejs/plugin-vue-jsx</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Vue Docs</a></li>
      <li><a href="https://vitejs.dev" target="_blank" rel="noopener">Vite Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Vue Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Chat</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://pinia.vuejs.org" target="_blank" rel="noopener">Pinia</a></li>
      <li><a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.hello {
  max-width: 800px;
  margin: 0 auto;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>