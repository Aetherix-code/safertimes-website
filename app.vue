<script setup>
import { cities } from './data/cities';
const route = useRoute();

const entries = ref([]);
const firstDate = ref('');
const hasResults = ref(true);
const selectedCities = ref(route.query.cities?.split('_') || []);
let query = {};
if (selectedCities.value.length) {
  query.cities = selectedCities.value;
}

const { data } = await useFetch('/api/cities', { query });
entries.value = data.value.entries;
firstDate.value = data.value.firstDate;

const description = 'מערכת שמנתחת את התפלגות האזעקות לפי אזורים נבחרים ומציגה את התוצאות על גבי תצוגה נוחה לקריאה';
const siteTitle = computed(() => {
  let title = 'Safer Times - אזעקות לפי זמנים';
  if (selectedCities.value.length) {
    title += ` - ${selectedCities.value.join(' | ')}`;
  }
  return title;
});

useSeoMeta({
  title: siteTitle,
  ogTitle: siteTitle,
  description: description,
  ogDescription: description,
  ogImage: '/favicon.png',
})

useHead({
  title: siteTitle,
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' }
  ],
  bodyAttrs: {
    dir: 'rtl'
  }
})


const loading = ref(false);
// const chartData = ref();
const chartOptions = ref({
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          weight: 500
        }
      },
      grid: {
        display: false,
        drawBorder: false
      }
    },
    y: {
      grid: {
        display: false,
        drawBorder: false
      }
    }
  }
});

const chartData = computed(() => {
  return {
    labels: ['00:00-06:00', '06:00-08:00', '08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-00:00'],
    datasets: [
      {
        label: 'התפלגות אזעקות (%)',
        backgroundColor: '#346793',
        borderColor: '#346793',
        data: [
          getPercentageInRange(0, 6),
          getPercentageInRange(6, 8),
          getPercentageInRange(8, 10),
          getPercentageInRange(10, 12),
          getPercentageInRange(12, 14),
          getPercentageInRange(14, 16),
          getPercentageInRange(16, 18),
          getPercentageInRange(18, 20),
          getPercentageInRange(20, 22),
          getPercentageInRange(22, 24),
        ],
        borderRadius: 60
      }
    ]
  };
});


const getTotalEntriesInRange = (startHour, endHour) => {
  return entries.value.filter(entry => {
    const hour = parseInt(entry.split(':')[0]);
    return hour >= startHour && hour < endHour;
  }).length;
}

const getPercentageInRange = (startHour, endHour) => {
  const total = entries.value.length;
  if (total == 0) {
    return 0;
  }

  return Math.round((getTotalEntriesInRange(startHour, endHour) / total) * 100);
}

const selectCities = async () => {
  const router = useRouter();
  hasResults.value = false;
  entries.value = [];
  loading.value = true;
  const url = new URL('/api/cities', location.href);
  selectedCities.value.forEach(city => url.searchParams.append('cities', city));
  try {
    const response = await fetch(url);
    const data = await response.json();
    entries.value = data.entries;
    firstDate.value = data.firstDate;
    hasResults.value = true;
    if (selectedCities.value.length) {
      router.push({
        path: route.path,
        query: { cities: selectedCities.value.join('_') }
      });
    } else {
      router.push({
        path: route.path,
      });
    }
  } catch (e) {
    console.error(e);
    alert("התרחשה שגיאה")
    hasResults.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mb-4">
    <div class="flex justify-content-center w-full">
      <div class="logo-container">
        <img src="/images/logo.png" />
      </div>
      <div>
        <div class="flex flex-column justify-content-center mr-2" style="height: 67px">
          <div style="text-align: center;">
            <strong>
              <span style="color: #346793">
                Safer Times
              </span>
              -
              התפלגות אזעקות
              <br />
              לפי אזורי התראה וזמן
            </strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="loading-results" v-if="loading">
    טוען מידע...
  </section>

  <section class="prompt" v-if="!loading && !hasResults">
    <strong>
      Safer-Times
      הינו כלי המאפשר לכם לצפות בהתפלגות האזעקות בערים שתבחרו בשעות שונות
    </strong>
  </section>

  <section class="results" v-if="!loading && hasResults">
    <div class="stats-info" v-if="entries.length">
      מבוסס על נתונים של
      {{ entries.length }}
      אזעקות
      <span v-if="firstDate">
        מתאריך
        {{ firstDate }}
        ועד היום
      </span>
    </div>
    <!-- pod = part of day, e.g. morning, noon, night-->
    <div class="pod-breakdown-container">
      <div class="grid">
        <PodCube title="בוקר" hoursRange="06:00-12:00" image="/images/morning.png"
          :percentage="getPercentageInRange(6, 12)" />
        <PodCube title="צהריים" hoursRange="12:00-16:00" image="/images/noon.png"
          :percentage="getPercentageInRange(12, 16)" />
        <PodCube title="ערב" hoursRange="16:00-21:00" image="/images/evening.png"
          :percentage="getPercentageInRange(16, 21)" />
        <PodCube title="לילה" hoursRange="21:00-06:00" image="/images/night.png"
          :percentage="getPercentageInRange(21, 24) + getPercentageInRange(0, 6)" />
      </div>

      <Card v-if="entries.length">
        <template #content>
          <Chart type="bar" :data="chartData" :options="chartOptions" style="height:300px;" />
        </template>
      </Card>
    </div>
  </section>

  <div class="sticky-footer">
    <Card class="w-full md:w-10 mx-auto cities-card">
      <template #content class="pb-5">
        <MultiSelect v-model="selectedCities" :options="cities" @change="selectCities" display="chip"
          :showToggleAll="false" filter placeholder="כל האזורים" :virtualScrollerOptions="{ itemSize: 24 }"
          :maxSelectedLabels="3" class="w-full" />

        <div class="credits">

          פותח על ידי
          <a href="https://www.10buy.co.il/?_from=safer-times" target="_blank">10Buy.co.il</a>
          /
          <a href="https://www.drsite.co.il/?_from=safer-times" target="_blank">DrSite.co.il</a>
          בניית אתרים
          |
          <a href="mailto:team@djint.net?subject=Contact request from Safer-Times">
            יצירת קשר :)
          </a>
          |
          <a href="https://buymeacoffee.com/jerryvdp" target="_blank">Buy me a coffee ☕️</a>

        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="css">
:root {
  --background-color-light: #f8fafc;
  --background-color-dark: #202122;
}

body {
  background-color: var(--background-color-light);
}

/* Dark mode background override */
@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--background-color-dark);
  }
}

body {
  font-family: sans-serif;
  padding-bottom: 90px;
}

.logo-container {
  text-align: center;
  height: 67px;
}

.logo-container img {
  max-height: 100%;
}

.sticky-footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
}

.sticky-footer .cities-card {
  margin-bottom: -10px;
  box-shadow: 0px 0px 55px -13px rgba(52, 103, 147, 1) !important;
}

section.prompt,
section.loading-results {
  text-align: center;
  margin-top: 40px;
  color: rgb(101, 101, 101)
}

.credits {
  text-align: center;
  margin-bottom: 2px;
  margin-top: 5px;
  color: rgb(101, 101, 101);
  font-size: 0.7em;
}

.stats-info {
  color: #949494;
  font-size: 0.8em;
  text-align: center;
  margin-bottom: 5px;
}

.credits>a {
  color: #346793;
  text-decoration: none;
}
</style>
