<template>
  <div class="about py-8">
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ t('about.title') }}</h1>
      <p class="text-gray-600 mb-6">{{ t('about.description') }}</p>
      
      <div class="mt-4 bg-gray-100 p-4 rounded-md">
        <h3 class="font-semibold mb-2">Technologies Used:</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li>Vue.js 3</li>
          <li>TypeScript</li>
          <li>Tailwind CSS 3.4.17</li>
          <li>Pinia (State Management)</li>
          <li>Vue I18n (Multi-language Support)</li>
          <li>Vue Router</li>
        </ul>
      </div>

      <div class="icons-demo py-8">
        <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ t('icons.title') }}</h1>
          <p class="text-gray-600 mb-6">{{ t('icons.description') }}</p>

          <!-- Demo Iconify Icons -->
          <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Icon Sets</h2>
            <div class="prose max-w-none mb-6">
              <p>
                Dengan menggunakan Iconify, Anda memiliki akses ke lebih dari 100,000 icon dari berbagai set
                icon populer seperti Material Design, FontAwesome, Feather Icons, dan lainnya.
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <!-- Material Design Icons -->
              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:home" size="32" color="primary" />
                <span class="mt-2 text-sm text-gray-600">mdi:home</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:account" size="32" color="primary" />
                <span class="mt-2 text-sm text-gray-600">mdi:account</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:cog" size="32" color="primary" />
                <span class="mt-2 text-sm text-gray-600">mdi:cog</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:magnify" size="32" color="primary" />
                <span class="mt-2 text-sm text-gray-600">mdi:magnify</span>
              </div>

              <!-- Feather Icons -->
              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="feather:home" size="32" color="success" />
                <span class="mt-2 text-sm text-gray-600">feather:home</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="feather:user" size="32" color="success" />
                <span class="mt-2 text-sm text-gray-600">feather:user</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="feather:settings" size="32" color="success" />
                <span class="mt-2 text-sm text-gray-600">feather:settings</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="feather:search" size="32" color="success" />
                <span class="mt-2 text-sm text-gray-600">feather:search</span>
              </div>

              <!-- Font Awesome Icons -->
              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="fa-solid:home" size="32" color="warning" />
                <span class="mt-2 text-sm text-gray-600">fa-solid:home</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="fa-solid:user" size="32" color="warning" />
                <span class="mt-2 text-sm text-gray-600">fa-solid:user</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="fa-solid:cog" size="32" color="warning" />
                <span class="mt-2 text-sm text-gray-600">fa-solid:cog</span>
              </div>

              <div class="p-4 border rounded-lg flex flex-col items-center">
                <BaseIcon name="fa-solid:search" size="32" color="warning" />
                <span class="mt-2 text-sm text-gray-600">fa-solid:search</span>
              </div>
            </div>
          </section>

          <!-- Demo Icon dengan ukuran dan warna berbeda -->
          <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Ukuran dan Warna</h2>
            <div class="grid grid-cols-5 gap-4">
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:heart" size="16" color="danger" />
                <span class="mt-2 text-xs text-gray-600">16px</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:heart" size="24" color="danger" />
                <span class="mt-2 text-xs text-gray-600">24px</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:heart" size="32" color="danger" />
                <span class="mt-2 text-xs text-gray-600">32px</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:heart" size="40" color="danger" />
                <span class="mt-2 text-xs text-gray-600">40px</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:heart" size="48" color="danger" />
                <span class="mt-2 text-xs text-gray-600">48px</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-5 gap-4">
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:star" size="32" color="primary" />
                <span class="mt-2 text-xs text-gray-600">Primary</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:star" size="32" color="success" />
                <span class="mt-2 text-xs text-gray-600">Success</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:star" size="32" color="warning" />
                <span class="mt-2 text-xs text-gray-600">Warning</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:star" size="32" color="danger" />
                <span class="mt-2 text-xs text-gray-600">Danger</span>
              </div>
              <div class="p-3 border rounded-lg flex flex-col items-center">
                <BaseIcon name="mdi:star" size="32" color="secondary" />
                <span class="mt-2 text-xs text-gray-600">Secondary</span>
              </div>
            </div>
          </section>

          <!-- Cara Penggunaan -->
          <section>
            <h2 class="text-xl font-semibold mb-4">Cara Penggunaan</h2>
            <div class="prose max-w-none">
              <pre class="language-html"><code>&lt;BaseIcon name="mdi:heart" size="24" color="primary" /&gt;</code></pre>
              <p>Props yang tersedia:</p>
              <ul>
                <li><code>name</code>: Nama icon dari Iconify (wajib)</li>
                <li><code>size</code>: Ukuran icon dalam piksel (default: 24)</li>
                <li><code>color</code>: Warna icon (primary, success, warning, danger, secondary)</li>
                <li><code>className</code>: Kelas CSS tambahan</li>
              </ul>
              <p>
                Untuk melihat semua icon yang tersedia, kunjungi
                <a href="https://icon-sets.iconify.design" target="_blank" rel="noopener noreferrer" class="text-blue-600">
                  Iconify Icon Sets
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseIcon from '../components/BaseIcon.vue'

const { t } = useI18n()
</script>