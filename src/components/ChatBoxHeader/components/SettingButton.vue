<script setup lang="ts">
import {generateRandomString} from "@/utils";
import {ChatModelConfigState, useChatModelConfig} from "@/store/ChatModelConfig";

defineOptions({name: 'SettingButton'})

const showSetting = ref<boolean>(false)
const activeTab = ref<string>('settings')
const handleShowSetting = () => {
  showSetting.value = true
}
const chatModels = ['qwen-max', 'qwen-pro', 'qwen-lite', 'qwen-turbo']
// type ChatModel = (typeof chatModels)[number]

const chatModelOptions = chatModels.map((model: string) => ({
  label: model,
  value: model
}))

const defaultConfig: () => ChatModelConfig = () => {
  const id = generateRandomString();
  return <ChatModelConfig>{
    id,
    name: `Max-${id}`,
    appId: '',
    apiKey: settings.value.qwenApiKey ?? '',
    apiBaseUrl: '/api/v1/apps/{appId}/completion',
    model: 'qwen-max',
    enabled: false,
    isDefault: false
  }
}

const useChatModelConfigStore = useChatModelConfig();
const {models: configData, settings} = storeToRefs(useChatModelConfigStore)

const addConfigHandler = () => {
  configData.value.push({...defaultConfig(), id: generateRandomString(), apiKey: settings.value.qwenApiKey ?? ''})
}

// const isDefaultUpdateHandler = (flag: boolean, id: string) => {
//   if(flag) {
//     configData.value.forEach((item) => {
//       item.isDefault = item.id === id;
//     })
//   } else {
//     configData.value[0]!.isDefault = true
//   }
// }

const required = (message?: string) => ({required: true, message: `${message ? message : '该项不可为空'}`, trigger: 'blur'})

</script>

<template>
  <n-button @click="handleShowSetting" text>
    <template #icon>
      <svg-icon name="MdSettings"/>
    </template>
  </n-button>
  <n-drawer v-model:show="showSetting" placement="top" height="70%" title="设置">
    <n-drawer-content title="设置">
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane name="settings" tab="基础配置">
          <n-form :model="settings" label-placement="left" :show-require-mark="false">
            <n-grid>
              <n-form-item-gi :span="8" label="千问ApiKey" path="qwenApiKey" :rule="required('请输入千问ApiKey')">
                <n-input v-model:value="settings.qwenApiKey" placeholder="千问ApiKey"/>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="models" tab="模型配置">
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
                <th>是否启用</th>
                <th class="text-center">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(conf, index) in configData" :key="conf.id">
                <td>
                  <n-form-item :path="`[${index}].name`" :rule="required('请输入名称')">
                    <n-input v-model:value="conf.name" placeholder="请输入名称"/>
                  </n-form-item>
                </td>
                <td>
                  <n-form-item :path="`[${index}].appId`" :rule="required('请输入AppId')">
                    <n-input v-model:value="conf.appId" placeholder="请输入AppId"/>
                  </n-form-item>
                </td>
                <td>
                  <n-form-item :path="`[${index}].apiKey`" :rule="required('请输入ApiKey')">
                    <n-input v-model:value="conf.apiKey" placeholder="请输入ApiKey"/>
                  </n-form-item>
                </td>
                <td>
                  <n-form-item :path="`[${index}].apiBaseUrl`" :rule="required('请输入ApiBaseUrl')">
                    <n-input v-model:value="conf.apiBaseUrl" placeholder="请输入ApiBaseUrl"/>
                  </n-form-item>
                </td>
                <td>
                  <n-form-item :path="`[${index}].model`" :rule="required('请选择模型')">
                    <n-select v-model:value="conf.model" :options="chatModelOptions" placeholder="请选择模型"/>
                  </n-form-item>
                </td>
                <td class="text-center">
                  <n-form-item :path="`[${index}].enabled`">
                    <n-switch v-model:value="conf.enabled"/>
                  </n-form-item>
                </td>
                <td class="text-center">
                  <n-button text type="error" @click="() => {configData.splice(configData.indexOf(conf), 1)}">删除
                  </n-button>
                </td>
              </tr>
              </tbody>
            </n-table>
          </n-form>
        </n-tab-pane>
      </n-tabs>
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