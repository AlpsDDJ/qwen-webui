<script setup lang="ts">
import {generateRandomString} from "@/utils";
import {useChatModelConfig} from "@/store/ChatModelConfig";

defineOptions({name: 'SettingButton'})

const showSetting = ref<boolean>(false)
const handleShowSetting = () => {
  showSetting.value = true
}
const chatModels = ['qwen-max', 'qwen-pro', 'qwen-lite', 'qwen-turbo']
// type ChatModel = (typeof chatModels)[number]

const chatModelOptions = chatModels.map((model: string) => ({
  label: model,
  value: model
}))

const defaultConfig: ChatConfig = {
  id: '',
  name: '',
  appId: '',
  apiKey: '',
  apiBaseUrl: '/api/v1/apps/{appId}/completion',
  model: 'qwen-max',
  isDefault: false
}

const { models: configData } = storeToRefs(useChatModelConfig())

const addConfigHandler = () => {
  configData.value.push({...defaultConfig, id: generateRandomString()})
}

const isDefaultUpdateHandler = (flag: boolean, id: string) => {
  if(flag) {
    configData.value.forEach((item) => {
      item.isDefault = item.id === id;
    })
  } else {
    configData.value[0]!.isDefault = true
  }
}

</script>

<template>
  <n-button @click="handleShowSetting" text>
    <template #icon>
      <svg-icon name="MdSettings"/>
    </template>
  </n-button>
  <n-drawer v-model:show="showSetting" placement="top" height="70%" title="设置">
    <n-drawer-content title="设置">
      <n-button type="primary" @click="addConfigHandler">添加配置</n-button>
      <n-form :model="configData" :show-feedback="false">
        <n-table :single-line="false" class="mt-16px">
          <thead>
          <tr>
            <th>名称</th>
            <th>AppId</th>
            <th>ApiKey</th>
            <th>ApiBaseUrl</th>
            <th>模型</th>
            <th class="text-center">是否默认</th>
            <th class="text-center">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(conf, index) in configData" :key="conf.id">
            <td>
              <n-form-item :path="`configData[${index}].name`" required>
                <n-input v-model:value="conf.name" placeholder="请输入名称"/>
              </n-form-item>
            </td>
            <td>
              <n-form-item :path="`configData[${index}].appId`">
                <n-input v-model:value="conf.appId" placeholder="请输入AppId"/>
              </n-form-item>
            </td>
            <td>
              <n-form-item :path="`configData[${index}].apiKey`" required>
                <n-input v-model:value="conf.apiKey" placeholder="请输入ApiKey"/>
              </n-form-item>
            </td>
            <td>
              <n-form-item :path="`configData[${index}].apiBaseUrl`">
                <n-input v-model:value="conf.apiBaseUrl" placeholder="请输入ApiBaseUrl"/>
              </n-form-item>
            </td>
            <td>
              <n-form-item :path="`configData[${index}].model`" required>
                <n-select v-model:value="conf.model" :options="chatModelOptions" placeholder="请选择模型" />
              </n-form-item>
            </td>
            <td class="text-center">
              <n-switch v-model:value="conf.isDefault" @update:value="(value) => { isDefaultUpdateHandler(value, conf.id) }"/>
            </td>
            <td class="text-center">
              <n-button text type="error" @click="() => {configData.splice(configData.indexOf(conf), 1)}">删除</n-button>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped lang="less">
:deep(.n-table) {
  td {
    padding: 0;
    .n-form-item.n-form-item--top-labelled {
      grid-template-rows: none;
    }
  }
}
</style>