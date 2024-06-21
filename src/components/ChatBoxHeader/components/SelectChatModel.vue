<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession'
import {useChatModelConfig} from '@/store/ChatModelConfig'

const {setCurrentModel, model} = useChatSessionStore();
const {models} = storeToRefs(useChatModelConfig());
const modelConfigOptions = computed(() => models.value.map(({name, id}) => ({label: name, value: id})))
const selectedModel = ref<string>(model?.id ?? '')
const handleSelectModel = (value) => {
  const model = models.value.find(item => item.id === value);
  model && setCurrentModel(unref(model))
}
</script>

<template>
  <n-select class="w-120px" v-model:value="selectedModel" :options="modelConfigOptions" @update:value="handleSelectModel" placeholder="选择模型"/>
</template>

<style scoped lang="less">

</style>