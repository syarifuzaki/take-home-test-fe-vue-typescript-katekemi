<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        {{ isEditMode ? t('products.form.title.edit') : t('products.form.title.add') }}
      </h1>
      <router-link
        :to="{ name: 'products' }"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:arrow-left" size="20" class="mr-1" />
        {{ t('products.form.back') }}
      </router-link>
    </div>

    <div class="bg-white rounded-md shadow p-6">
      <SkeletonLoader v-if="loading" type="form" :fields="7" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('products.form.labels.title') }}
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            :placeholder="t('products.form.placeholders.title')"
          />
        </div>

        <!-- Price -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">{{
            t('products.form.labels.price')
          }}</label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            step="0.01"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            :placeholder="t('products.form.placeholders.price')"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">{{
            t('products.form.labels.description')
          }}</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            :placeholder="t('products.form.placeholders.description')"
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">{{
            t('products.form.labels.category')
          }}</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option value="" disabled>
              Select {{ t('products.form.labels.category') }}
            </option>
            <option value="electronics">
              {{ t('products.form.categoryOptions.electronics') }}
            </option>
            <option value="jewelery">
              {{ t('products.form.categoryOptions.jewelery') }}
            </option>
            <option value="men's clothing">
              {{ t('products.form.categoryOptions.mens') }}
            </option>
            <option value="women's clothing">
              {{ t('products.form.categoryOptions.womens') }}
            </option>
          </select>
        </div>

        <!-- Image URL -->
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1">{{
            t('products.form.labels.image')
          }}</label>
          <input
            id="image"
            v-model="form.image"
            type="url"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            :placeholder="t('products.form.placeholders.image')"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="form.image" class="border rounded-md p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            t('products.form.imagePreview')
          }}</label>
          <img
            :src="form.image"
            alt="Product preview"
            class="max-h-60 mx-auto object-contain"
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <BaseIcon
              v-if="submitting"
              name="mdi:loading"
              size="20"
              class="mr-2 animate-spin"
            />
            {{
              isEditMode ? t('products.form.submit.edit') : t('products.form.submit.add')
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '../components/BaseIcon.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../stores/productStore'
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const { addProduct, updateProduct, fetchProductDetail } = productStore
const { loading, selectedProduct } = storeToRefs(productStore)

const submitting = ref(false)
const form = reactive<Product>({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
})

// Check if we're in edit mode
const isEditMode = computed(() => route.name === 'product-edit')
const productId = computed(() =>
  route.params.id ? parseInt(route.params.id as string) : null
)

// Load product data if in edit mode
onMounted(async () => {
  if (isEditMode.value && productId.value) {
    try {
      await fetchProductDetail(productId.value)

      if (selectedProduct.value) {
        // Populate form with product data
        form.title = selectedProduct.value.title
        form.price = selectedProduct.value.price
        form.description = selectedProduct.value.description
        form.category = selectedProduct.value.category
        form.image = selectedProduct.value.image
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      toast(t('products.form.toast.error'), {
        theme: 'dark',
        type: 'error',
        dangerouslyHTMLString: true,
      })
    }
  }
})

// Handle form submission
async function handleSubmit() {
  submitting.value = true

  try {
    if (isEditMode.value && productId.value) {
      // Update existing product
      await updateProduct(productId.value, form)
      toast(t('products.form.toast.successUpdate'), {
        theme: 'dark',
        type: 'success',
        dangerouslyHTMLString: true,
      })
    } else {
      // Add new product
      await addProduct(form)
      toast(t('products.form.toast.successAdd'), {
        theme: 'dark',
        type: 'success',
        dangerouslyHTMLString: true,
      })
    }

    // Navigate back to the product list
    router.push({ name: 'products' })
  } catch (error) {
    console.error('Failed to save product:', error)
    toast(t('products.form.toast.error'), {
      theme: 'dark',
      type: 'error',
      dangerouslyHTMLString: true,
    })
  } finally {
    submitting.value = false
  }
}
</script>
