<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession'
import {useChatModelConfig} from '@/store/ChatModelConfig'

const chatSessionStore = useChatSessionStore();
const {setCurrentModel} = chatSessionStore;
const {model} = storeToRefs(chatSessionStore);
const {models} = storeToRefs(useChatModelConfig());
const modelConfigOptions = computed(() => models.value.filter(({name, id, apiKey, appId, enabled}) => enabled && name && id && apiKey && appId).map(({name, id}) => ({label: name, value: id})))
const selectedModel = ref<string | undefined>(model.value?.id)
// const currectModel = computed(() => models.value.find(item => item.id === selectedModel.value))
const handleSelectModel = (value: string) => {
  selectedModel.value = value
  const model = models.value.find(item => item.id === value);
  model && setCurrentModel(unref(model))
}
</script>

<template>
  <div class="ml-12px">
    <n-popselect :value="selectedModel" :options="modelConfigOptions" @update:value="handleSelectModel" scrollable>
      <n-button size="small" type="primary" quaternary>{{ model?.name ?? '选择模型' }}</n-button>
    </n-popselect>
  </div>
</template>

<style scoped lang="less">

</style>