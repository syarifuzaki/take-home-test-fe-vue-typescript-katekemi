<template>
  <Icon
    :icon="name"
    :width="size"
    :height="size"
    :class="[
      className,
      {
        'text-blue-600': color === 'primary',
        'text-green-600': color === 'success',
        'text-yellow-500': color === 'warning',
        'text-red-600': color === 'danger',
        'text-gray-600': color === 'secondary',
        'text-white': color === 'white',
      },
    ]"
  />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  name: string
  size?: number | string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | null
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: null,
  className: '',
})
</script>
