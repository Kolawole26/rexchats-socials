<template>
  <div class="w-full">
    <label for="phone" class="label text-neutral-text_primary"> Phone Number </label>

    <div class="flex phone-input mt-1">
      <!-- Country Code Dropdown -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center px-3 h-[40px] border-r-0 rounded-l-md bg-transparent border border-neutral-line transition-colors"
          type="button"
        >
          <span :class="`fi fi-${selectedCountry.flag} mr-2`"></span>
          <span class="text-sm font-medium text-gray-700">{{ selectedCountry.code }}</span>
          <svg
            class="w-4 h-4 ml-2 text-gray-400 transition-transform"
            :class="{ 'rotate-180': isDropdownOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-show="isDropdownOpen"
          class="absolute top-full left-0 z-50 w-80 mt-1 bg-neutral-surface border border-neutral-line rounded-lg shadow-lg overflow-y-auto"
        >
          <div class="p-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search countries..."
              class="w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="py-1">
            <button
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <span :class="`fi fi-${country.flag} mr-3`"></span>
              <span class="flex-1 text-left">{{ country.name }}</span>
              <span class="text-gray-500 font-medium">{{ country.code }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Phone Number Input -->
      <InputText
        id="phone"
        v-model="phoneNumber"
        type="tel"
        placeholder="Enter your phone number"
        class="w-full"
        @input="formatPhoneNumber"
      />
      <!-- <FormText
        id="phone"
        type="tel"
        required
        v-model="phoneNumber"
        class="w-full"
        placeholder="Enter your phone number"
        @input="formatPhoneNumber"
      /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FormText from '~/components/common/input/FormText.vue'
// Props and emits
const emit = defineEmits(['update:modelValue', 'input'])

// Reactive data
const selectedCountry = ref({
  name: 'Nigeria',
  code: '+234',
  flag: 'ng'
})
const phoneNumber = ref('')
const isDropdownOpen = ref(false)
const searchQuery = ref('')

// Countries data
const countries = ref([
  { name: 'Nigeria', code: '+234', flag: 'ng' }
  //   { name: 'United States', code: '+1', flag: 'us' },
  //   { name: 'United Kingdom', code: '+44', flag: 'gb' },
  //   { name: 'Germany', code: '+49', flag: 'de' },
  //   { name: 'France', code: '+33', flag: 'fr' },
  //   { name: 'Canada', code: '+1', flag: 'ca' },
  //   { name: 'Australia', code: '+61', flag: 'au' },
  //   { name: 'India', code: '+91', flag: 'in' },
  //   { name: 'China', code: '+86', flag: 'cn' },
  //   { name: 'Japan', code: '+81', flag: 'jp' },
  //   { name: 'South Korea', code: '+82', flag: 'kr' },
  //   { name: 'Brazil', code: '+55', flag: 'br' },
  //   { name: 'Mexico', code: '+52', flag: 'mx' },
  //   { name: 'Spain', code: '+34', flag: 'es' },
  //   { name: 'Italy', code: '+39', flag: 'it' },
  //   { name: 'Netherlands', code: '+31', flag: 'nl' },
  //   { name: 'Sweden', code: '+46', flag: 'se' },
  //   { name: 'Norway', code: '+47', flag: 'no' },
  //   { name: 'Denmark', code: '+45', flag: 'dk' },
  //   { name: 'South Africa', code: '+27', flag: 'za' }
])

// Computed properties
const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value

  return countries.value.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      country.code.includes(searchQuery.value)
  )
})

const completePhoneNumber = computed(() => {
  return selectedCountry.value.code + phoneNumber.value
})

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    searchQuery.value = ''
  }
}

const selectCountry = (country) => {
  selectedCountry.value = country
  isDropdownOpen.value = false
  searchQuery.value = ''
  emitValue()
}

const formatPhoneNumber = () => {
  // Remove all non-digits
  let cleaned = phoneNumber.value.replace(/\D/g, '')

  // Apply basic formatting based on country
  if (selectedCountry.value.code === '+1') {
    // US/Canada format: (123) 456-7890
    if (cleaned.length >= 6) {
      cleaned = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length >= 3) {
      cleaned = cleaned.replace(/(\d{3})(\d{0,3})/, '($1) $2')
    }
  } else if (selectedCountry.value.code === '+234') {
    // Nigeria format: Remove leading 0 and format as 080 1234 5678
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }

    if (cleaned.length >= 7) {
      cleaned = cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
    } else if (cleaned.length >= 3) {
      cleaned = cleaned.replace(/(\d{3})(\d{0,4})/, '$1 $2')
    }
  }

  phoneNumber.value = cleaned
  emitValue()
}

const emitValue = () => {
  // If phone number is empty, emit empty string instead of just country code
  const completeNumber = phoneNumber.value.trim() === '' ? '' : completePhoneNumber.value
  emit('update:modelValue', completeNumber)
  emit('input', completeNumber)
}

const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Watch for changes
watch([selectedCountry, phoneNumber], () => {
  emitValue()
})
</script>

<style scoped>
/* Flag Icons - You can use flag-icons library or implement custom flags */
.fi {
  width: 20px;
  height: 15px;
  background-size: cover;
  border-radius: 2px;
  display: inline-block;
}

/* Nigerian flag */
.fi-ng {
  background: linear-gradient(to right, #008751 33%, white 33%, white 66%, #008751 66%);
}

/* US flag simplified */
.fi-us {
  background: linear-gradient(
    to bottom,
    #b22234 14%,
    white 14%,
    white 21%,
    #b22234 21%,
    #b22234 28%,
    white 28%,
    white 35%,
    #b22234 35%,
    #b22234 42%,
    white 42%,
    white 50%,
    #b22234 50%
  );
}

/* UK flag simplified */
.fi-gb {
  background: linear-gradient(
    45deg,
    #012169 25%,
    white 25%,
    white 50%,
    #c8102e 50%,
    #c8102e 75%,
    white 75%
  );
}

/* Germany flag */
.fi-de {
  background: linear-gradient(to bottom, #000000 33%, #dd0000 33%, #dd0000 66%, #ffce00 66%);
}

/* France flag */
.fi-fr {
  background: linear-gradient(to right, #0055a4 33%, white 33%, white 66%, #ef4135 66%);
}

/* Canada flag simplified */
.fi-ca {
  background: linear-gradient(to right, #ff0000 25%, white 25%, white 75%, #ff0000 75%);
}

/* Australia flag simplified */
.fi-au {
  background: linear-gradient(45deg, #012169 50%, #ffffff 50%);
}

/* India flag */
.fi-in {
  background: linear-gradient(to bottom, #ff9933 33%, white 33%, white 66%, #138808 66%);
}

/* China flag */
.fi-cn {
  background: #de2910;
}

/* Japan flag */
.fi-jp {
  background: radial-gradient(circle at center, #bc002d 30%, white 30%);
}

/* Add more flag styles as needed */
.fi-kr {
  background: linear-gradient(
    to bottom,
    #cd2e3a 25%,
    white 25%,
    white 50%,
    #0047a0 50%,
    #0047a0 75%,
    white 75%
  );
}
.fi-br {
  background: linear-gradient(45deg, #009739 25%, #fedd00 25%, #fedd00 75%, #009739 75%);
}
.fi-mx {
  background: linear-gradient(to right, #006341 33%, white 33%, white 66%, #ce1126 66%);
}
.fi-es {
  background: linear-gradient(to bottom, #c60b1e 25%, #ffc400 25%, #ffc400 75%, #c60b1e 75%);
}
.fi-it {
  background: linear-gradient(to right, #009246 33%, white 33%, white 66%, #ce2b37 66%);
}
.fi-nl {
  background: linear-gradient(to bottom, #21468b 33%, white 33%, white 66%, #ae1c28 66%);
}
.fi-se {
  background: linear-gradient(to right, #006aa7 40%, #fecc00 40%, #fecc00 60%, #006aa7 60%);
}
.fi-no {
  background: linear-gradient(
    to right,
    #ef2b2d 30%,
    white 30%,
    white 40%,
    #002868 40%,
    #002868 60%,
    white 60%,
    white 70%,
    #ef2b2d 70%
  );
}
.fi-dk {
  background: linear-gradient(to right, #c60c30 30%, white 30%, white 40%, #c60c30 40%);
}
.fi-za {
  background: linear-gradient(
    45deg,
    #007a4d 16%,
    #ffb612 16%,
    #ffb612 33%,
    #e03c31 33%,
    #e03c31 50%,
    #002395 50%,
    #002395 66%,
    white 66%,
    white 83%,
    #000000 83%
  );
}
</style>
