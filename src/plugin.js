import { toRefs, onMounted, ref, computed, watch, nextTick } from 'vue'

export default (options = {}, IMask = null) => ({
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
      defaultValue,
      resetting,
      resetValidators,
      input,
    } = component

    // ================ DATA =================

    const Mask = ref(null)

    const maskedModel = ref(value.value)

    const watchers = ref([])

    const preventClear = ref(false)

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

    const empty = computed(() => {
      return [undefined, null, ''].indexOf(model.value) !== -1
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

      if (obj.mask === 'number') {
        resolved.mask = Number
      }
      
      if (obj.mask === 'range') {
        resolved.mask = IMask.MaskedRange
      }
      
      if (obj.mask === 'enum') {
        resolved.mask = IMask.MaskedEnum
      }
      
      if (obj.mask === 'date') {
        resolved.mask = Date
      }

      if (obj.placeholder !== undefined) {
        resolved.lazy = !resolved.placeholder
      }

      if (obj.caseInsensitive !== undefined && !obj.matchValue) {
        resolved.matchValue = caseInsensitive
      }

      if (obj.dispatch) {
        resolved.dispatch = (appended, dynamicMasked) => {
          return obj.dispatch(appended, dynamicMasked, el$.value, form$.value)
        }
      }

      if (Array.isArray(obj.mask)) {
        resolved.mask = obj.mask.map(resolveMask)

        if (!resolved.dispatch) {
          if (obj.mask.some(m => m.startsWith)) {
            resolved.dispatch = (appended, dynamicMasked) => {
              const number = (dynamicMasked.value + appended).replace(/\D/g,'')

              return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0)
            }
          }

          if (obj.element) {
            resolved.dispatch = (appended, dynamicMasked) => {
              let elementValue = form$.value.el$(obj.element)?.value

              return dynamicMasked.compiledMasks.find(m => m.when == elementValue || !m.when)
            }
          }
        }
      }

      if (obj.blocks) {
        resolved.blocks = Object.keys(obj.blocks).reduce((prev, curr) => {
          return {
            ...prev,
            [curr]: resolveMask(obj.blocks[curr]),
          }
        }, {})
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
      preventClear.value = true

      value.value = nullValue.value

      let loadValue = format && formatLoad.value ? formatLoad.value(val, form$.value) : val 

      value.value = loadValue

      if (Mask.value) {
        Mask.value[unmask.value ? 'unmaskedValue' : 'value'] = loadValue
      }
    }

    const update = (val) => {
      preventClear.value = true

      value.value = nullValue.value

      value.value = val

      if (Mask.value) {
        Mask.value[unmask.value ? 'unmaskedValue' : 'value'] = val
      }
    }

    const clear = () => {
      input.value.value = ''
      model.value = nullValue.value
      value.value = nullValue.value
    }
    
    const reset = () => {
      resetting.value = true
      input.value.value = defaultValue.value
      model.value = defaultValue.value
      value.value = defaultValue.value
      resetValidators()
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

      // Unwatch all
      watchers.value.map(w => w())

      if (resolvedMask.value?.element) {
        watchers.value.push(watch(computed(() => form$.value.el$(resolvedMask.value.element).value), () => {
          if (!preventClear.value) {
            model.value = nullValue.value
          } else {
            preventClear.value = false
          }

          refreshMask()
        }))
      }
    }

    const refreshMask = () => {
      nextTick(() => {
        initMask()
      })
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
      refreshMask,
      handleInput,
      model,
      load,
      update,
      clear,
      reset,
      empty,
    }
  }
})