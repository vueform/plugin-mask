import { toRefs, onMounted, ref, computed, watch } from 'vue'
import IMask from 'imask'

export default (options = {}) => ({
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
      return typeof options === 'function' ? options(IMask) : options
    })

    const resolvedMask = computed(() => {
      let resolvedMask = typeof mask.value === 'function' ? resolveFunction(mask.value) : resolveMask(mask.value)

      if (resolvedOptions.value.definitions) {
        resolvedMask = {
          ...resolvedMask,
          definitions: resolveMaskObjects({
            ...resolvedOptions.value.definitions,
            ...resolvedMask.definitions,
          })
        }
      }

      if (resolvedOptions.value.blocks) {
        resolvedMask = {
          ...resolvedMask,
          blocks: resolveMaskObjects({
            ...resolvedOptions.value.blocks,
            ...resolvedMask.blocks,
          })
        }
      }

      if (resolvedMask.definitions) {
        resolvedMask = {
          ...resolvedMask,
          definitions: resolveMaskObjects(resolvedMask.definitions)
        }
      }

      if (resolvedMask.blocks) {
        resolvedMask = {
          ...resolvedMask,
          blocks: resolveMaskObjects(resolvedMask.blocks)
        }
      }

      return resolvedMask
    })

    const model = computed({
      get: () => maskedModel.value,
      set: (val) => maskedModel.value = val
    })

    // =============== METHODS ===============

    const resolveMask = (mask) => {
      return typeof mask === 'string'
        ? { mask: escapeString(mask) }
        : mask instanceof RegExp
          ? { mask }
          : Array.isArray(mask)
            ? mask.map(resolveMask)
            : mask && typeof mask === 'object'
              ? resolveMaskObject(mask)
              : { mask }
    }

    const resolveMaskObjects = (obj) => {
      return Object.keys(obj).reduce((prev, curr) => ({
        ...prev,
        [curr]: resolveMask(obj[curr])
      }), {})
    }

    const resolveMaskObject = (obj) => {
      let resolved = {
        ...obj,
      }

      if (obj.placeholder !== undefined) {
        resolved.lazy = !resolved.placeholder
      }

      if (obj.caseInsensitive !== undefined) {
        resolved.matchValue = caseInsensitive
      }

      if (Array.isArray(obj.mask)) {
        resolved.mask = obj.mask.map(resolveMask)

        if (obj.mask.some(m => m.startsWith)) {
          resolved.dispatch = (appended, dynamicMasked) => {
            const number = (dynamicMasked.value + appended).replace(/\D/g,'')

            return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0)
          }
        }
      }


      return resolved
    }

    const resolveFunction = (func) => {
      return resolveMask(func(IMask))
    }

    const escapeString = (str) => {
      return str.replace(/\\\\/g, '\\');
    }

    const caseInsensitive = (estr, istr, matchFrom) => {
      return IMask.MaskedEnum.DEFAULTS.matchValue(estr.toLowerCase(), istr.toLowerCase(), matchFrom)
    }

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
      value.value = unmask.value ? Mask.value.masked.unmaskedValue : Mask.value.value
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
      
      Mask.value = IMask(el$.value.input, resolvedMask.value)

      Mask.value.on('accept', () => {
        syncMask()
      })

      syncMask()
    }

    const handleInput = () => {}

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

    watch(resolvedMask, (n, o) => {
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
})