<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    }
  }
}
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: #fff;
  border: 1px solid #1B2B47;
  color: #1B2B47;
  cursor: pointer;
  border-radius: 20px;
  margin-right: 0.5rem;
  display: inline-block;
  min-width: 150px;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #1B2B47;
  border-color: white;
  color: white;
}

.flat {
  background-color: transparent;
  color: #1B2B47;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #1B2B47;
  color: #1B2B47;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #1B2B47;
  color: white;
}
</style>