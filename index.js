import { toRefs, onMounted, ref, computed, watch } from 'vue'
import IMask from 'imask'

// - TTextElement ?

export default {
  apply: 'TextElement',
  props: {
    mask: {
      required: false,
      type: [String, Object, Array, Function],
    },
    unmask: {
      require: false,
      type: Boolean,
      default: false,
    },
    allowIncomplete: {
      require: false,
      type: Boolean,
      default: false,
    },
  },
  setup(props, context, component) {
    const {
      mask, inputType, formatLoad, unmask, allowIncomplete,
    } = toRefs(props)

    if (!mask.value) {
      return component
    }

    const {
      nullValue,
      value,
      el$,
      path,
      form$,
    } = component

    // ================ DATA =================

    const Mask = ref(null)

    const maskedModel = ref(value.value)

    // ============== COMPUTED ===============

    const resolvedOptions = computed(() => {
      return  typeof mask.value === 'string' ? {
        mask: mask.value,
      } : (
        typeof mask.value === 'fuction'
          ? mask.value(IMask)
          : mask.value
      )
    })

    const model = computed({
      get: () => maskedModel.value,
      set: (val) => maskedModel.value = val
    })

    // =============== METHODS ===============

    const handleInput = () => {}

    const load = (val, format = false) => {
      let loadValue = format && formatLoad.value ? formatLoad.value(val, form$.value) : val 

      value.value = loadValue

      if (Mask.value) {
        Mask.value[unmask.value ? 'unmaskedValue' : 'value'] = loadValue
      }
    }

    const update = (val) => {
      value.value = val

      if (Mask.value) {
        Mask.value[unmask.value ? 'unmaskedValue' : 'value'] = val
      }
    }

    const checkInputType = () => {
      if (inputType.value !== 'text') {
        console.error(`Input mask only works with type="text" (found at: '${path.value}').`)
        return false
      }

      return true
    }

    const syncMask = () => {
      // Setting value for <INPUT>
      model.value = Mask.value.displayValue

      // Setting null value for <TextElement>
      if (!allowIncomplete.value && !Mask.value.masked.isComplete) {
        value.value = nullValue.value
        return
      }
      
      // Setting value for <TextElement>
      value.value = unmask.value ? Mask.value.masked.unmaskedValue : Mask.value.displayValue
    }

    const destroyMask = () => {
      if (!Mask.value) {
        return
      }

      Mask.value.destroy()
    }

    const initMask = () => {
      if (Mask.value) {
        destroyMask()
      }

      Mask.value = IMask(el$.value.input, resolvedOptions.value)

      Mask.value.on('accept', () => {
        syncMask()
      })

      syncMask()
    }

    // =============== HOOKS =================

    onMounted(() => {
      if (!checkInputType()) {
        return
      }

      initMask()
    })

    // ============== WATCHERS ===============

    watch(inputType, (n) => {
      checkInputType()
    })

    watch(resolvedOptions, (n, o) => {
      if (!Mask.value) {
        return
      }

      initMask()
    }, { deep: true })

    return {
      ...component,
      Mask,
      destroyMask,
      initMask,
      syncMask,
      handleInput,
      model,
      load,
      update,
    }
  }
}






    // maskAutofix: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskLazy: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskOverwrite: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskEager: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // // Pattern
    // maskDefinitions: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskPlaceholderChar: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskDisplayChar: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskBlocks: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // // Number
    // maskScale: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskThousandSeparator: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskPadFractionalZeros: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskNormalizeZeros: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskRadix: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskMapToRadix: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskMin: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskMax: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // // Range
    // maskFrom: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskTo: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskMaxLength: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // // Enum
    // maskEnum: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // // Date
    // maskPattern: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskFormat: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },
    // maskParse: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // maskExpose: {
    //   required: false,
    //   // type: ____,
    //   default: undefined,
    // },

    // maskValue: {
    //   require: false,
    //   type: Boolean,
    //   default: true,
    // },
    // maskPlaceholder: {
    //   require: false,
    //   type: String,
    //   default: '_',
    // },
    // showMask: {
    //   require: false,
    //   type: Boolean,
    //   default: true,
    // },