<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal-backdrop"
      @click="closeOnOutsideClick && $emit('update:modelValue', false)"
    >
      <div
        :class="[
          'modal-content',
          size === 'large' ? 'max-w-4xl' : size === 'small' ? 'max-w-md' : 'max-w-2xl',
        ]"
        @click.stop
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="$emit('update:modelValue', false)" class="modal-close">
            <BaseIcon name="mdi:close" size="24" />
          </button>
        </div>
        <div class="modal-body" :class="{ 'p-0': noPadding }">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// Handle body scroll lock
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #172b4d;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #ff8f00;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 10;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0.75rem;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
