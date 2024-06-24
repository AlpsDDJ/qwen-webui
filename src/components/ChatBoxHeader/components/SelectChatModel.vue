<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession'
import {useChatModelConfig} from '@/store/ChatModelConfig'

const {setCurrentModel, model} = useChatSessionStore();
const {models} = storeToRefs(useChatModelConfig());
const modelConfigOptions = computed(() => models.value.filter(({name, id, apiKey, appId, enabled}) => enabled && name && id && apiKey && appId).map(({name, id}) => ({label: name, key: id})))
const selectedModel = ref<string | undefined>(model?.name)
// const currectModel = computed(() => models.value.find(item => item.id === selectedModel.value))
const handleSelectModel = (value: string) => {
  const model = models.value.find(item => item.id === value);
  selectedModel.value = model?.name
  model && setCurrentModel(unref(model))
}
</script>

<template>
  <div class="ml-12px">
    <n-dropdown class="" trigger="click" :options="modelConfigOptions" @select="handleSelectModel" placement="bottom-start">
      <n-button size="small" type="primary" quaternary>{{ selectedModel ?? '选择模型' }}</n-button>
    </n-dropdown>
  </div>
</template>

<style scoped lang="less">

</style>