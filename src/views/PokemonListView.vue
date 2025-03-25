<template>
  <div class="p-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-primary-navy">Pokémon Database</h1>
        <p class="text-gray-600 mt-1">Explore the world of Pokémon</p>
      </div>

      <div class="flex gap-2">
        <button
          @click="getRandomPokemon"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          <BaseIcon name="mdi:shuffle-variant" size="20" />
          Random Pokémon
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <!-- Search -->
        <div class="w-full md:w-1/3">
          <div class="relative">
            <BaseIcon
              name="mdi:magnify"
              size="20"
              class="absolute left-3 top-3 text-gray-500"
            />
            <input
              v-model="localSearchQuery"
              type="text"
              placeholder="Search Pokémon by name..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              @input="handleSearchInput"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <!-- Sort Order -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Sort:</label>
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="handleSortChange('asc')"
                :class="[
                  'px-3 py-1.5 text-sm border border-gray-300 first:rounded-l-md last:rounded-r-md',
                  localSortOrder === 'asc'
                    ? 'bg-primary-orange text-white border-primary-orange'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                A-Z
              </button>
              <button
                @click="handleSortChange('desc')"
                :class="[
                  'px-3 py-1.5 text-sm border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px',
                  localSortOrder === 'desc'
                    ? 'bg-primary-orange text-white border-primary-orange'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                Z-A
              </button>
            </div>
          </div>

          <!-- Items Per Page -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Show:</label>
            <select
              v-model="localItemsPerPage"
              class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent pr-8"
              @change="handleItemsPerPageChange"
            >
              <option :value="10">10</option>
              <option :value="30">30</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Pokémon Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="localItemsPerPage" />

      <div v-else-if="filteredPokemon.length === 0" class="py-12 text-center">
        <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
          <BaseIcon name="mdi:pokeball" size="96" />
        </div>
        <h3 class="text-lg font-medium text-gray-700">No Pokémon Found</h3>
        <p class="text-gray-500 mt-2">Try adjusting your search criteria</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(pokemon, index) in filteredPokemon"
              :key="pokemon.name"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-500">
                  {{ (currentPage - 1) * localItemsPerPage + index + 1 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm font-medium text-gray-900 hover:text-primary-orange cursor-pointer"
                  @click="showDetails(pokemon.url)"
                >
                  {{ formatPokemonName(pokemon.name) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button
                    @click="showDetails(pokemon.url)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Details"
                  >
                    <BaseIcon name="mdi:eye" size="20" />
                  </button>
                  <button
                    @click="toggleFavorite(pokemon.name)"
                    :class="[
                      'transition-colors',
                      favorites[pokemon.name]
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-yellow-500',
                    ]"
                    :title="
                      favorites[pokemon.name]
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'
                    "
                  >
                    <BaseIcon
                      :name="favorites[pokemon.name] ? 'mdi:star' : 'mdi:star-outline'"
                      size="20"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
      <div class="text-sm text-gray-700 order-2 md:order-1">
        Showing
        {{ filteredPokemon.length ? (currentPage - 1) * localItemsPerPage + 1 : 0 }}-{{
          Math.min(currentPage * localItemsPerPage, totalCount)
        }}
        of {{ totalCount }} items
      </div>

      <div class="flex space-x-1 order-1 md:order-2">
        <button
          @click="currentPage > 1 && handlePageChange(currentPage - 1)"
          :disabled="currentPage <= 1"
          :class="[
            'px-3 py-1 rounded-md transition-colors',
            currentPage <= 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
          ]"
        >
          <BaseIcon name="mdi:chevron-left" size="20" />
        </button>

        <template v-if="pageCount <= 7">
          <button
            v-for="page in pageCount"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === page
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
            ]"
          >
            {{ page }}
          </button>
        </template>

        <template v-else>
          <!-- First page -->
          <button
            @click="handlePageChange(1)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === 1
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
            ]"
          >
            1
          </button>

          <!-- Ellipsis if needed -->
          <span v-if="currentPage > 3" class="px-3 py-1">...</span>

          <!-- Pages around current page -->
          <template v-for="page in pageCount" :key="page">
            <button
              v-if="page !== 1 && page !== pageCount && Math.abs(page - currentPage) <= 1"
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                currentPage === page
                  ? 'bg-primary-orange text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Ellipsis if needed -->
          <span v-if="currentPage < pageCount - 2" class="px-3 py-1">...</span>

          <!-- Last page -->
          <button
            @click="handlePageChange(pageCount)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === pageCount
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
            ]"
          >
            {{ pageCount }}
          </button>
        </template>

        <button
          @click="currentPage < pageCount && handlePageChange(currentPage + 1)"
          :disabled="currentPage >= pageCount"
          :class="[
            'px-3 py-1 rounded-md transition-colors',
            currentPage >= pageCount
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
          ]"
        >
          <BaseIcon name="mdi:chevron-right" size="20" />
        </button>
      </div>
    </div>

    <!-- Pokémon Detail Modal -->
    <BaseModal
      v-model="modalOpen"
      :title="
        selectedPokemon?.name
          ? formatPokemonName(selectedPokemon.name) + ' #' + selectedPokemon.id
          : 'Pokémon Details'
      "
      size="large"
    >
      <div v-if="detailLoading" class="py-4">
        <SkeletonLoader type="detail" />
      </div>

      <div v-else-if="selectedPokemon">
        <!-- Tabs navigation -->
        <div class="border-b border-gray-200 mb-4">
          <nav class="flex space-x-8 overflow-x-auto">
            <button
              @click="setActiveTab('about')"
              :class="[
                'px-1 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === 'about'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              About
            </button>
            <button
              @click="setActiveTab('stats')"
              :class="[
                'px-1 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === 'stats'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Stats
            </button>
            <button
              @click="setActiveTab('evolution')"
              :class="[
                'px-1 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === 'evolution'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Evolution
            </button>
            <button
              @click="setActiveTab('moves')"
              :class="[
                'px-1 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === 'moves'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Moves
            </button>
          </nav>
        </div>

        <!-- About Tab -->
        <div v-if="activeTab === 'about'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Pokemon Image -->
          <div class="text-center md:col-span-1">
            <div class="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
              <img
                :src="
                  selectedPokemon.sprites.other['official-artwork'].front_default ||
                  selectedPokemon.sprites.front_default
                "
                :alt="selectedPokemon.name"
                class="w-48 h-48 object-contain mx-auto"
                loading="lazy"
              />
            </div>

            <div class="flex flex-wrap justify-center gap-2 mt-4">
              <span
                v-for="type in selectedPokemon.types"
                :key="type.type.name"
                :class="[
                  'px-4 py-1 rounded-full text-white text-sm font-medium',
                  getPokemonTypeColor(type.type.name),
                ]"
              >
                {{ formatPokemonName(type.type.name) }}
              </span>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="md:col-span-2">
            <!-- Pokémon Description -->
            <div v-if="englishFlavorText" class="mb-6">
              <p class="text-gray-700">{{ englishFlavorText }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <!-- Category and physical traits -->
              <div class="bg-gray-50 p-4 rounded-md">
                <h3 class="font-medium text-gray-900 mb-3">Pokémon Data</h3>
                <div class="space-y-2">
                  <div v-if="pokemonGenus" class="flex justify-between">
                    <span class="text-gray-600">Category:</span>
                    <span class="font-medium">{{ pokemonGenus }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Height:</span>
                    <span class="font-medium"
                      >{{ (selectedPokemon.height / 10).toFixed(1) }} m</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Weight:</span>
                    <span class="font-medium"
                      >{{ (selectedPokemon.weight / 10).toFixed(1) }} kg</span
                    >
                  </div>
                </div>
              </div>

              <!-- Abilities -->
              <div class="bg-gray-50 p-4 rounded-md">
                <h3 class="font-medium text-gray-900 mb-3">Abilities</h3>
                <ul class="space-y-2">
                  <li
                    v-for="ability in selectedPokemon.abilities"
                    :key="ability.ability.name"
                    class="flex items-start"
                  >
                    <span class="text-primary-orange mr-2">•</span>
                    <div>
                      <span class="font-medium">{{
                        formatPokemonName(ability.ability.name)
                      }}</span>
                      <span v-if="ability.is_hidden" class="text-xs ml-2 text-gray-500"
                        >(Hidden)</span
                      >
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Tab -->
        <div v-else-if="activeTab === 'stats'" class="py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left column - Stat bars -->
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Base Stats</h3>
              <div class="space-y-4">
                <div
                  v-for="stat in selectedPokemon.stats"
                  :key="stat.stat.name"
                  class="flex flex-col"
                >
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">{{
                      formatStatName(stat.stat.name)
                    }}</span>
                    <span class="text-sm font-medium">{{ stat.base_stat }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                      :class="[
                        'rounded-full h-3',
                        getStatColor(stat.stat.name, stat.base_stat),
                      ]"
                      :style="{
                        width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Total Stats -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-900">Total:</span>
                  <span class="font-medium text-gray-900">
                    {{
                      selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right column - Stat analysis -->
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Stat Analysis</h3>

              <!-- Type effectiveness -->
              <div class="bg-gray-50 rounded-md p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Type Effectiveness</h4>
                <div class="text-sm">
                  <p class="mb-2">
                    {{ formatPokemonName(selectedPokemon.name) }} is a
                    <span
                      v-for="(type, index) in selectedPokemon.types"
                      :key="type.type.name"
                      class="font-medium"
                    >
                      {{ formatPokemonName(type.type.name)
                      }}{{ index < selectedPokemon.types.length - 1 ? '/' : '' }}
                    </span>
                    type Pokémon.
                  </p>

                  <!-- Some basic type effectiveness analysis would go here -->
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p class="font-medium text-red-600">Weaknesses:</p>
                      <p>Based on typing</p>
                    </div>
                    <div>
                      <p class="font-medium text-green-600">Resistances:</p>
                      <p>Based on typing</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stat Comparison -->
              <div class="bg-gray-50 rounded-md p-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Stat Comparison</h4>
                <div class="text-sm">
                  <p>
                    Compared to other Pokémon,
                    {{ formatPokemonName(selectedPokemon.name) }} has:
                  </p>

                  <ul class="mt-2 space-y-1">
                    <li class="flex gap-2">
                      <span>•</span>
                      <span>
                        {{ getStatComparison('hp') }} HP ({{ getStatValue('hp') }})
                      </span>
                    </li>
                    <li class="flex gap-2">
                      <span>•</span>
                      <span>
                        {{ getStatComparison('attack') }} Attack ({{
                          getStatValue('attack')
                        }})
                      </span>
                    </li>
                    <li class="flex gap-2">
                      <span>•</span>
                      <span>
                        {{ getStatComparison('defense') }} Defense ({{
                          getStatValue('defense')
                        }})
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evolution Tab -->
        <div v-else-if="activeTab === 'evolution'" class="py-4">
          <h3 class="font-medium text-gray-900 mb-4">Evolution Chain</h3>

          <div v-if="evolutionChain" class="flex flex-col items-center">
            <!-- Evolution chain visualization would go here -->
            <p class="text-gray-700">
              {{ formatPokemonName(selectedPokemon.name) }} is part of the
              {{ formatPokemonName(evolutionChain.chain.species.name) }} evolution line.
            </p>

            <!-- Simple evolution chain display -->
            <div class="mt-6 w-full max-w-2xl">
              <div class="flex flex-col md:flex-row justify-around items-center">
                <!-- First evolution -->
                <div class="text-center mb-4 md:mb-0">
                  <div
                    class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2"
                  >
                    <!-- Image would go here -->
                    <BaseIcon name="mdi:pokeball" size="48" class="text-gray-400" />
                  </div>
                  <div class="font-medium">
                    {{ formatPokemonName(evolutionChain.chain.species.name) }}
                  </div>
                </div>

                <!-- Evolution arrow -->
                <div class="hidden md:block text-gray-400">
                  <BaseIcon name="mdi:arrow-right" size="32" />
                </div>
                <div class="block md:hidden text-gray-400 my-2">
                  <BaseIcon name="mdi:arrow-down" size="32" />
                </div>

                <!-- Show only if there are evolutions -->
                <template v-if="evolutionChain.chain.evolves_to.length > 0">
                  <!-- Second evolution -->
                  <div class="text-center mb-4 md:mb-0">
                    <div
                      class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2"
                    >
                      <!-- Image would go here -->
                      <BaseIcon name="mdi:pokeball" size="48" class="text-gray-400" />
                    </div>
                    <div class="font-medium">
                      {{
                        formatPokemonName(evolutionChain.chain.evolves_to[0].species.name)
                      }}
                    </div>
                  </div>

                  <!-- Third evolution if exists -->
                  <template
                    v-if="evolutionChain.chain.evolves_to[0].evolves_to.length > 0"
                  >
                    <!-- Evolution arrow -->
                    <div class="hidden md:block text-gray-400">
                      <BaseIcon name="mdi:arrow-right" size="32" />
                    </div>
                    <div class="block md:hidden text-gray-400 my-2">
                      <BaseIcon name="mdi:arrow-down" size="32" />
                    </div>

                    <div class="text-center">
                      <div
                        class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2"
                      >
                        <!-- Image would go here -->
                        <BaseIcon name="mdi:pokeball" size="48" class="text-gray-400" />
                      </div>
                      <div class="font-medium">
                        {{
                          formatPokemonName(
                            evolutionChain.chain.evolves_to[0].evolves_to[0].species.name
                          )
                        }}
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>

            <!-- Evolution details -->
            <div class="mt-8 w-full">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Evolution Details</h4>

              <div v-if="evolutionChain.chain.evolves_to.length > 0" class="space-y-4">
                <div class="bg-gray-50 p-3 rounded-md">
                  <p class="text-sm">
                    <span class="font-medium">{{
                      formatPokemonName(evolutionChain.chain.species.name)
                    }}</span>
                    evolves into
                    <span class="font-medium">{{
                      formatPokemonName(evolutionChain.chain.evolves_to[0].species.name)
                    }}</span>

                    <template
                      v-if="
                        evolutionChain.chain.evolves_to[0].evolution_details[0]?.min_level
                      "
                    >
                      at level
                      {{
                        evolutionChain.chain.evolves_to[0].evolution_details[0].min_level
                      }}
                    </template>

                    <template
                      v-else-if="
                        evolutionChain.chain.evolves_to[0].evolution_details[0]?.item
                      "
                    >
                      when exposed to a
                      {{
                        formatPokemonName(
                          evolutionChain.chain.evolves_to[0].evolution_details[0].item
                            .name
                        )
                      }}
                    </template>

                    <template v-else> under special conditions </template>
                  </p>
                </div>

                <div
                  v-if="evolutionChain.chain.evolves_to[0].evolves_to.length > 0"
                  class="bg-gray-50 p-3 rounded-md"
                >
                  <p class="text-sm">
                    <span class="font-medium">{{
                      formatPokemonName(evolutionChain.chain.evolves_to[0].species.name)
                    }}</span>
                    evolves into
                    <span class="font-medium">{{
                      formatPokemonName(
                        evolutionChain.chain.evolves_to[0].evolves_to[0].species.name
                      )
                    }}</span>

                    <template
                      v-if="
                        evolutionChain.chain.evolves_to[0].evolves_to[0]
                          .evolution_details[0]?.min_level
                      "
                    >
                      at level
                      {{
                        evolutionChain.chain.evolves_to[0].evolves_to[0]
                          .evolution_details[0].min_level
                      }}
                    </template>

                    <template
                      v-else-if="
                        evolutionChain.chain.evolves_to[0].evolves_to[0]
                          .evolution_details[0]?.item
                      "
                    >
                      when exposed to a
                      {{
                        formatPokemonName(
                          evolutionChain.chain.evolves_to[0].evolves_to[0]
                            .evolution_details[0].item.name
                        )
                      }}
                    </template>

                    <template v-else> under special conditions </template>
                  </p>
                </div>
              </div>

              <div v-else class="bg-gray-50 p-3 rounded-md">
                <p class="text-sm">
                  <span class="font-medium">{{
                    formatPokemonName(evolutionChain.chain.species.name)
                  }}</span>
                  does not evolve.
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6 text-gray-500">
            <p>Evolution data not available</p>
          </div>
        </div>

        <!-- Moves Tab -->
        <div v-else-if="activeTab === 'moves'" class="py-4">
          <h3 class="font-medium text-gray-900 mb-4">Moves</h3>

          <div v-if="selectedPokemon.moves.length > 0">
            <!-- Search bar for moves -->
            <div class="mb-4 relative">
              <BaseIcon
                name="mdi:magnify"
                size="20"
                class="absolute left-3 top-3 text-gray-500"
              />
              <input
                v-model="moveSearchQuery"
                type="text"
                placeholder="Search moves..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              />
            </div>

            <!-- Moves list -->
            <div class="bg-gray-50 rounded-md overflow-hidden">
              <div class="max-h-96 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Move Name
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="move in filteredMoves"
                      :key="move.move.name"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-4 py-3 whitespace-nowrap text-sm">
                        {{ formatPokemonName(move.move.name) }}
                      </td>
                    </tr>

                    <tr v-if="filteredMoves.length === 0">
                      <td class="px-4 py-3 text-center text-sm text-gray-500">
                        No moves found matching your search.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6 text-gray-500">
            <p>No moves data available</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500">No Pokémon selected</div>

      <template #footer>
        <div class="flex gap-3">
          <button
            v-if="selectedPokemon"
            @click="toggleFavorite(selectedPokemon.name)"
            :class="[
              'px-4 py-2 border rounded-md flex items-center gap-2 transition-colors',
              favorites[selectedPokemon.name]
                ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
          >
            <BaseIcon
              :name="favorites[selectedPokemon.name] ? 'mdi:star' : 'mdi:star-outline'"
              size="20"
            />
            {{ favorites[selectedPokemon.name] ? 'Remove Favorite' : 'Add to Favorites' }}
          </button>

          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors border"
          >
            Close
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import BaseModal from '@/components/BaseModal.vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const pokemonStore = usePokemonStore()
const {
  fetchPokemon,
  fetchPokemonDetail,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  closeModal,
  initFromStorage,
  toggleFavorite,
  getRandomPokemon,
  setSortOrder,
  setActiveTab,
} = pokemonStore

const {
  pokemon,
  filteredPokemon,
  totalCount,
  currentPage,
  itemsPerPage,
  loading,
  detailLoading,
  pageCount,
  selectedPokemon,
  selectedSpecies,
  evolutionChain,
  modalOpen,
  activeTab,
  favorites,
  sortOrder,
  englishFlavorText,
  pokemonGenus,
} = storeToRefs(pokemonStore)

// Local state to ensure proper reactivity
const localSearchQuery = ref('')
const localSortOrder = ref('asc')
const localItemsPerPage = ref(10)
const moveSearchQuery = ref('')

// Initialize from store and set up local state
const initializeComponent = async () => {
  await initFromStorage()

  // Set up local state from store
  localSearchQuery.value = pokemonStore.searchQuery
  localSortOrder.value = pokemonStore.sortOrder
  localItemsPerPage.value = pokemonStore.itemsPerPage

  // Fetch initial data
  await fetchPokemon()
}

// Process URL query parameters if they exist
const processQueryParams = () => {
  if (route.query.type) {
    pokemonStore.setFilterType(route.query.type as string)
  }
}

// Initialize component
onMounted(async () => {
  await initializeComponent()
  processQueryParams()
})

// Handle search input changes with debounce
let searchTimeout: number | null = null
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = (setTimeout(() => {
    setSearchQuery(localSearchQuery.value)
    searchTimeout = null
  }, 300) as unknown) as number
}

// Handle sort changes
const handleSortChange = (order: 'asc' | 'desc') => {
  localSortOrder.value = order
  setSortOrder(order)
}

// Handle items per page change
const handleItemsPerPageChange = () => {
  setItemsPerPage(localItemsPerPage.value)
}

// Handle page changes
const handlePageChange = (page: number) => {
  setCurrentPage(page)
}

// Computed properties for moves filtering
const filteredMoves = computed(() => {
  if (!selectedPokemon.value) return []

  if (!moveSearchQuery.value) return selectedPokemon.value.moves

  return selectedPokemon.value.moves.filter((move) =>
    move.move.name.toLowerCase().includes(moveSearchQuery.value.toLowerCase())
  )
})

// Helper function to format Pokémon name (capitalize first letter)
function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format stat name
function formatStatName(name: string): string {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  }

  return statNames[name] || name
}

// Get color for Pokémon type
function getPokemonTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-green-600',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  }

  return colors[type] || 'bg-gray-400'
}

// Get color for stat bars
function getStatColor(statName: string, value: number): string {
  // Different colors based on stat type and value
  const baseColors: Record<string, string> = {
    hp: 'bg-red-500',
    attack: 'bg-orange-500',
    defense: 'bg-yellow-500',
    'special-attack': 'bg-blue-500',
    'special-defense': 'bg-green-500',
    speed: 'bg-purple-500',
  }

  return baseColors[statName] || 'bg-gray-500'
}

// Get stat comparison text
function getStatComparison(statName: string): string {
  if (!selectedPokemon.value) return ''

  const value = getStatValue(statName)

  if (value > 100) return 'Very high'
  if (value > 80) return 'High'
  if (value > 60) return 'Above average'
  if (value > 40) return 'Average'
  if (value > 20) return 'Below average'
  return 'Low'
}

// Get stat value
function getStatValue(statName: string): number {
  if (!selectedPokemon.value) return 0

  const stat = selectedPokemon.value.stats.find((s) => s.stat.name === statName)
  return stat ? stat.base_stat : 0
}

function showDetails(url: string): void {
  pokemonStore.showPokemonDetail(url)
}

// Keep local and store values in sync
watch(
  () => pokemonStore.searchQuery,
  (newValue) => {
    localSearchQuery.value = newValue
  }
)

watch(
  () => pokemonStore.sortOrder,
  (newValue) => {
    localSortOrder.value = newValue
  }
)

watch(
  () => pokemonStore.itemsPerPage,
  (newValue) => {
    localItemsPerPage.value = newValue
  }
)
</script>
