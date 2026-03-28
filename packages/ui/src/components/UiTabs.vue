<template>
  <nav :class="cn('flex items-stretch', $attrs.class as string)">
    <slot />
  </nav>
</template>

<script setup lang="ts">
import { cn } from '../utils'
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>
