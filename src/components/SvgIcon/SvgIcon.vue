<script setup lang="ts">
import {getSvg, SvgNames} from './svgs';

defineOptions({name: 'SvgIcon'})

const props = defineProps<{ svg?: string | string[], name?: SvgNames, viewBox?: string }>()

const paths = computed<string[]>(() => {
  if (props.svg) {
    return typeof props.svg === 'string' ? [props.svg] : props.svg
  }
  if (props.name) {
    return getSvg(props.name)
  }
  return []
})
</script>

<template>
  <n-icon>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="viewBox ?? '0 0 512 512'" enable-background="new 0 0 512 512" xml:space="preserve">
      <g><path v-for="p in paths" :d="p"></path></g>
    </svg>
  </n-icon>
</template>

<style scoped>

</style>