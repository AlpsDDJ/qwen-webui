<script lang="tsx">
  export default defineComponent({
    name: 'Icon',
    props: {
      iconName: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'ionicons4'
      }
    },
    render() {
      const { iconName, type } = this.$props

      const _iconName = ref(iconName)
      const _type = ref(type)
      if (iconName.indexOf(':') > 0) {
        _iconName.value = iconName.split(':')[1]
        _type.value = iconName.split(':')[0]
      }

      const IconComponent = defineAsyncComponent(async (): Promise<any> => {
        switch (_type.value) {
          case 'tabler':
            return (await import('@vicons/tabler'))[_iconName.value]
          default:
            return (await import('@vicons/ionicons4'))[_iconName.value]
        }
      })
      return (
        <n-icon {...this.$attrs}>
          <IconComponent />
        </n-icon>
      )
    }
  })
</script>
