<template>
  <a-layout>
    <a-layout-header class="header" style="box-shadow: inset">
      <!-- <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"> -->
      <a-flex gap="middle" justify="space-between">
        <div style="margin-top: -10px">
          <RouterLink :to="{ name: 'home' }" class="cursor-pointer">
            <a-flex gap="middle" align="center" horizontal>
              <i class="fa-solid fa-sun text-2xl"></i>
              <p class="text-2xl">The Local Weather</p>
            </a-flex>
          </RouterLink>
        </div>
        <div style="margin-top: 30px">
          <a-flex gap="middle" align="center" horizontal>
            <QuestionCircleOutlined
              style="color: aliceblue"
              @click="toggleModal"
              class="text-xl hover:text-weather-secondary duration-150 cursor-pointer"
            />
            <PlusCircleOutlined @click="addCity" v-if="route.query" style="color: aliceblue" />
          </a-flex>
        </div>
      </a-flex>
    </a-layout-header>
    <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
      <div class="text-black">
        <h1 class="text-2xl mb-1">About:</h1>
        <p class="mb-4">
          The Local Weather allows you to track the current and future weather of cities of your
          choosing.
        </p>
        <h2 class="text-2xl">How it works:</h2>
        <ol class="list-decimal list-inside mb-4">
          <li>Search for your city by entering the name into the search bar.</li>
          <li>
            Select a city within the results, this will take you to the current weather for your
            selection.
          </li>
          <li>
            Track the city by clicking on the "+" icon in the top right. This will save the city to
            view at a later time on the home page.
          </li>
        </ol>

        <h2 class="text-2xl">Removing a city</h2>
        <p>
          If you no longer wish to track a city, simply select the city within the home page. At the
          bottom of the page, there will be am option to delete the city.
        </p>
      </div>
    </BaseModal>
  </a-layout>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { uid } from 'uid'
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
const savedCities = ref([])
const route = useRoute()
const router = useRouter()
const addCity = () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
  }

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng
    }
  }

  savedCities.value.push(locationObj)
  localStorage.setItem('savedCities', JSON.stringify(savedCities.value))

  let query = Object.assign({}, route.query)
  delete query.preview
  query.id = locationObj.id
  router.replace({ query })
}

const modalActive = ref(null)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}
</script>
