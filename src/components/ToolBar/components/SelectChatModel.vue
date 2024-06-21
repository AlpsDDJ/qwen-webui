<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {useChatModelConfig} from "@/store/ChatModelConfig";

const {setCurrentModel, model} = useChatSessionStore();
const {models} = storeToRefs(useChatModelConfig());
const modelConfigOptions = computed(() => models.value.map(({name, id}) => ({label: name, value: id})))
const selectModel = ref<string>(model.id ?? '')
const handleSelectModel = (value) => {
  setCurrentModel(unref(models.value.find(item => item.id === value)))
}
</script>

<template>
  <n-select class="w-120px" v-model:value="selectModel" :options="modelConfigOptions" @update:value="handleSelectModel" placeholder="选择模型"/>
</template>

<style scoped lang="less">

</style>