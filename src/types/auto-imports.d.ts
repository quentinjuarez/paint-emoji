/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
export {}
declare global {
  const EffectScope: typeof import('vue')['EffectScope']
  const computed: typeof import('vue')['computed']
  const createApp: typeof import('vue')['createApp']
  const customRef: typeof import('vue')['customRef']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const download: typeof import('../utils/download')['default']
  const effectScope: typeof import('vue')['effectScope']
  const extractFrames: (typeof import('../utils/extractGifFrames'))['default']
  const extractGifFrames: typeof import('../utils/gif')['extractGifFrames']
  const generateGif: typeof import('../utils/gif')['generateGif']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getVersion: typeof import('../utils/getVersion')['default']
  const h: typeof import('vue')['h']
  const initEmojis: typeof import('../utils/initEmojis')['default']
  const inject: typeof import('vue')['inject']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const plugin: typeof import('../stores/plugin')['default']
  const provide: typeof import('vue')['provide']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const removeDiacritics: typeof import('../utils/removeDiacritics')['default']
  const renderFrame: typeof import('../utils/gif')['renderFrame']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const sleep: typeof import('../utils/sleep')['default']
  const storeToRefs: typeof import('pinia')['storeToRefs']
  const stringColor: typeof import('../utils/stringColor')['default']
  const stringFromCodePoint: typeof import('../utils/stringFromCodePoint')['default']
  const textToBounce: typeof import('../utils/textToBounce')['default']
  const textToPatterns: typeof import('../utils/textToPatterns')['default']
  const toRaw: typeof import('vue')['toRaw']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const toValue: typeof import('vue')['toValue']
  const triggerRef: typeof import('vue')['triggerRef']
  const unref: typeof import('vue')['unref']
  const useAttrs: typeof import('vue')['useAttrs']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useDevice: typeof import('../composables/useDevice')['default']
  const useI18n: typeof import('vue-i18n')['useI18n']
  const useOnlineStore: typeof import('../stores/online')['useOnlineStore']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useScreen: typeof import('../composables/useScreen')['default']
  const useSlots: typeof import('vue')['useSlots']
  const useStore: typeof import('../stores/index')['useStore']
  const useTooltip: (typeof import('../composables/useTooltips'))['default']
  const useTooltips: typeof import('../composables/useTooltips')['default']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Component, ComponentPublicInstance, ComputedRef, ExtractDefaultPropTypes, ExtractPropTypes, ExtractPublicPropTypes, InjectionKey, PropType, Ref, VNode, WritableComputedRef } from 'vue'
  import('vue')
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly download: UnwrapRef<typeof import('../utils/download')['default']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly extractGifFrames: UnwrapRef<typeof import('../utils/gif')['extractGifFrames']>
    readonly generateGif: UnwrapRef<typeof import('../utils/gif')['generateGif']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getVersion: UnwrapRef<typeof import('../utils/getVersion')['default']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly initEmojis: UnwrapRef<typeof import('../utils/initEmojis')['default']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly plugin: UnwrapRef<typeof import('../stores/plugin')['default']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly removeDiacritics: UnwrapRef<typeof import('../utils/removeDiacritics')['default']>
    readonly renderFrame: UnwrapRef<typeof import('../utils/gif')['renderFrame']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly sleep: UnwrapRef<typeof import('../utils/sleep')['default']>
    readonly storeToRefs: UnwrapRef<typeof import('pinia')['storeToRefs']>
    readonly stringColor: UnwrapRef<typeof import('../utils/stringColor')['default']>
    readonly stringFromCodePoint: UnwrapRef<typeof import('../utils/stringFromCodePoint')['default']>
    readonly textToBounce: UnwrapRef<typeof import('../utils/textToBounce')['default']>
    readonly textToPatterns: UnwrapRef<typeof import('../utils/textToPatterns')['default']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useDevice: UnwrapRef<typeof import('../composables/useDevice')['default']>
    readonly useI18n: UnwrapRef<typeof import('vue-i18n')['useI18n']>
    readonly useOnlineStore: UnwrapRef<typeof import('../stores/online')['useOnlineStore']>
    readonly useRoute: UnwrapRef<typeof import('vue-router')['useRoute']>
    readonly useRouter: UnwrapRef<typeof import('vue-router')['useRouter']>
    readonly useScreen: UnwrapRef<typeof import('../composables/useScreen')['default']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useStore: UnwrapRef<typeof import('../stores/index')['useStore']>
    readonly useTooltips: UnwrapRef<typeof import('../composables/useTooltips')['default']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly download: UnwrapRef<typeof import('../utils/download')['default']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly extractGifFrames: UnwrapRef<typeof import('../utils/gif')['extractGifFrames']>
    readonly generateGif: UnwrapRef<typeof import('../utils/gif')['generateGif']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getVersion: UnwrapRef<typeof import('../utils/getVersion')['default']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly initEmojis: UnwrapRef<typeof import('../utils/initEmojis')['default']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly plugin: UnwrapRef<typeof import('../stores/plugin')['default']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly removeDiacritics: UnwrapRef<typeof import('../utils/removeDiacritics')['default']>
    readonly renderFrame: UnwrapRef<typeof import('../utils/gif')['renderFrame']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly sleep: UnwrapRef<typeof import('../utils/sleep')['default']>
    readonly storeToRefs: UnwrapRef<typeof import('pinia')['storeToRefs']>
    readonly stringColor: UnwrapRef<typeof import('../utils/stringColor')['default']>
    readonly stringFromCodePoint: UnwrapRef<typeof import('../utils/stringFromCodePoint')['default']>
    readonly textToBounce: UnwrapRef<typeof import('../utils/textToBounce')['default']>
    readonly textToPatterns: UnwrapRef<typeof import('../utils/textToPatterns')['default']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useDevice: UnwrapRef<typeof import('../composables/useDevice')['default']>
    readonly useI18n: UnwrapRef<typeof import('vue-i18n')['useI18n']>
    readonly useOnlineStore: UnwrapRef<typeof import('../stores/online')['useOnlineStore']>
    readonly useRoute: UnwrapRef<typeof import('vue-router')['useRoute']>
    readonly useRouter: UnwrapRef<typeof import('vue-router')['useRouter']>
    readonly useScreen: UnwrapRef<typeof import('../composables/useScreen')['default']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useStore: UnwrapRef<typeof import('../stores/index')['useStore']>
    readonly useTooltips: UnwrapRef<typeof import('../composables/useTooltips')['default']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
