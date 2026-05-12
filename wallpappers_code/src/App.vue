<script setup>
import { ref, watch, onMounted } from "vue";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

// ── dark mode ─────────────────────────────────────────────────
const isDark = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("color-mode");
  isDark.value = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyDark(isDark.value);
});

function applyDark(val) {
  document.documentElement.classList.toggle("dark", val);
}

watch(isDark, (val) => {
  applyDark(val);
  localStorage.setItem("color-mode", val ? "dark" : "light");
});

// ── state ─────────────────────────────────────────────────────
const category = ref("nature");
const page = ref(1);
const perPage = 30;

const loading = ref(false);
const errorMsg = ref("");
const images = ref([]);
const totalPages = ref(0);
const loaded = ref([]);

// ── fetch ─────────────────────────────────────────────────────
async function fetchImages() {
  loading.value = true;
  errorMsg.value = "";
  images.value = [];
  loaded.value = [];

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(category.value)}&page=${page.value}&per_page=${perPage}&client_id=${UNSPLASH_KEY}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();

    images.value = data.results ?? [];
    totalPages.value = Math.min(data.total_pages ?? 0, Math.floor(1000 / perPage));
    loaded.value = Array(images.value.length).fill(false);
  } catch {
    errorMsg.value = "API request limit exceeded. Requests will reset in one hour.";
  } finally {
    loading.value = false;
  }
}

// ── URL params sync ───────────────────────────────────────────
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("category")) category.value = params.get("category");
  if (params.get("page")) page.value = parseInt(params.get("page"));
  fetchImages();
});

watch(category, () => {
  page.value = 1;
});

watch([category, page], ([cat, p]) => {
  const params = new URLSearchParams({ category: cat, page: p });
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  fetchImages();
});

// ── helpers ───────────────────────────────────────────────────
const onImageLoad = (i) => {
  loaded.value[i] = true;
};

function getOrientation(img) {
  if (img.width > img.height) return "landscape";
  if (img.width < img.height) return "portrait";
  return "square";
}

function getImageItems(img) {
  return [[
    { label: 'Small',   href: img.urls.small,   target: '_blank' },
    { label: 'Regular', href: img.urls.regular,  target: '_blank' },
    { label: 'Full',    href: img.urls.full,     target: '_blank' },
    { label: 'Raw',     href: img.urls.raw,      target: '_blank' },
  ]]
}


const searchMode = ref('category')
const searchInput = ref('')

const categoryOptions = [
  { label: 'Animals',      value: 'animals'      },
  { label: 'Nature',       value: 'nature'       },
  { label: 'Travel',       value: 'travel'       },
  { label: 'Food',         value: 'food'         },
  { label: 'Technology',   value: 'technology'   },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Fashion',      value: 'fashion'      },
  { label: 'Sports',       value: 'sports'       },
]

function onSearch() {
  const val = searchInput.value.trim()
  if (val) category.value = val
}
</script>

<template>
  <UApp>
    <div class="page">
      <!-- header: dark mode toggle -->
      <div class="header">
        <USwitch v-model="isDark" size="lg" />
      </div>

      <!-- search / category tabs -->
      <div class="controls">
        <UTabs
          v-model="searchMode"
          :items="[{ label: 'Category', value: 'category' }, { label: 'Search', value: 'search' }]"
          class="mb-3"
        />
        <USelect
          v-if="searchMode === 'category'"
          v-model="category"
          :items="categoryOptions"
          value-key="value"
          placeholder="Category"
          class="w-52"
        />
        <UInput
          v-else
          v-model="searchInput"
          placeholder="Search wallpapers..."
          class="w-72"
          :ui="{ trailing: 'absolute inset-y-0 end-0 flex items-center pe-1' }"
          @keyup.enter="onSearch"
        >
          <template #trailing>
            <UButton color="primary" size="xs" icon="i-lucide-search" @click="onSearch" />
          </template>
        </UInput>
      </div>

      <!-- loading / error -->
      <div class="status">
        <UIcon v-if="loading" name="i-lucide-loader-2" class="spinner" />
        <UAlert v-if="errorMsg" color="error" icon="i-lucide-x-circle" title="Error" :description="errorMsg" class="error-alert" />
      </div>

      <!-- masonry grid -->
      <div v-if="images.length" class="columns">
        <div v-for="(img, i) in images" :key="img.id">
          <div class="image-card" :class="getOrientation(img)">
            <USkeleton v-if="!loaded[i]" class="skeleton" />
            <img :src="img.urls.regular" :alt="img.alt_description" :class="{ loaded: loaded[i] }" @load="onImageLoad(i)" />
            <div v-show="loaded[i]" class="open-btn">
              <UDropdownMenu :items="getImageItems(img)">
                <UButton color="primary" size="sm" icon="i-lucide-external-link" />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <div v-if="images.length" class="pagination-wrap">
        <UPagination v-model:page="page" :total="totalPages * perPage" :items-per-page="perPage" />
      </div>
    </div>
  </UApp>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.status {
  display: flex;
  justify-content: center;
  min-height: 40px;
  margin-bottom: 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-alert {
  max-width: 500px;
}

/* masonry */
.columns {
  columns: 3;
  column-gap: 20px;
  margin-bottom: 30px;
}
@media (max-width: 992px) {
  .columns {
    columns: 2;
  }
}
@media (max-width: 768px) {
  .columns {
    columns: 1;
  }
}

.open-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.image-card {
  position: relative;
  margin-bottom: 20px;
  break-inside: avoid;
}
.image-card.landscape {
  padding-bottom: 70%;
}
.image-card.square {
  padding-bottom: 100%;
}
.image-card.portrait {
  padding-bottom: 150%;
}

.skeleton {
  position: absolute;
  inset: 0;
  border-radius: 8px;
}

img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}
img.loaded {
  opacity: 1;
}


.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
</style>
