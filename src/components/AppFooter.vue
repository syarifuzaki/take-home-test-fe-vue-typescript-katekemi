<template>
  <div
    class="w-full flex justify-center p-2 border-t border-gray-100 text-sm gap-2 text-gray-400"
  >
    {{ t('footer.createdBy') }}
    <a
      href="https://syarifuzaki.netlify.app"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary-orange font-semibold hover:underline"
      >Syarifuzaki</a
    >
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
