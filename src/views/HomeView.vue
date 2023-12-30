<template>
  <a-layout style="min-height: 100vh; padding-right: 10%; padding-left: 10%;background-color: #00668A;">
    <a-content>
      <a-input
        v-model:value="searchQuery"
        @input="getSearchResults"
        placeholder="Basic usage"
        style="margin-top: 3%"
      />
      <a-list
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
        bordered
      >
        <a-list-item v-if="searchError">
          Sorry, something went wrong, please try again.
        </a-list-item>
        <a-list-item v-if="!searchError && mapboxSearchResults.length === 0">
          No results match your query, try a different term.
        </a-list-item>
        <a-list-item
          v-for="searchResult in mapboxSearchResults"
          :key="searchResult.id"
          class="py-2 cursor-pointer"
          @click="previewCity(searchResult)"
          v-else
        >
          {{ searchResult.place_name }}
        </a-list-item>
      </a-list>

      <div class="flex flex-col gap-4">
        <Suspense>
          <CityList />
          <template #fallback>
            <CityCardSkeleton />
          </template>
        </Suspense>
      </div>
    </a-content>
  </a-layout>
</template>
<script setup lang="ts">
import CityCardSkeleton from '../components/CityCardSkeleton.vue'
import CityList from '../components/CityList.vue'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter() as any
const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(',')
  console.log(state.replaceAll(' ', ''))
  router.push({
    name: 'cityView',
    params: { state: state.replaceAll(' ', ''), city: city },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0]
    }
  })
}
const mapboxAPIKey =
  'pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q'
const searchQuery = ref('')
const queryTimeout = ref(null) as any
const mapboxSearchResults = ref(null) as any
const searchError = ref(null) as any

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        )
        mapboxSearchResults.value = result.data.features
      } catch {
        searchError.value = true
      }

      return
    }
    mapboxSearchResults.value = null
  }, 300)
}
</script>
