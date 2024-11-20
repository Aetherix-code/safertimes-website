<script setup lang="ts">
const props = defineProps({
    image: String,
    title: String,
    hoursRange: String,
    percentage: Number
})

const colorClass = computed(() => {
    const percentage = props.percentage || 0;
    if (percentage <= 10) {
        return 'safe';
    } else if (percentage <= 20) {
        return 'probably-safe';
    } else if (percentage <= 40) {
        return 'warning';
    } else {
        return 'danger';
    }
});

const statusText = computed(() => {
    const percentage = props.percentage || 0;
    if (percentage <= 10) {
        return 'בטוח';
    } else if (percentage <= 20) {
        return 'סיכון נמוך';
    } else if (percentage <= 40) {
        return 'סיכון בינוני';
    } else {
        return 'סיכון גבוה';
    }
});

</script>

<template>
    <div class="col-12 lg:col-6">
        <Card class="pod-time" :data-safety="colorClass">
            <template #title>{{ props.title }}</template>
            <template #subtitle>{{ props.hoursRange }}</template>
            <template #content>
                <NuxtImg width="67" height="67" format="webp" class="pod-row-image" :src="props.image" />
                <div class="flex">
                    <div class="circle-container">
                        <div class="circle circle-1"></div>
                        <div class="circle circle-2"></div>
                        <div class="circle circle-3"></div>
                    </div>
                    <div class="pod-description mr-3">
                        <div class="flex flex-column justify-content-center" style="height: 70px; text-align: right;">
                            <div>
                                <strong>{{ statusText }}</strong>
                                <div>
                                    {{ props.percentage }}%
                                    מהאזעקות היו בטווח שעות זה
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>


<style>
/* Container to center the circles */
.circle-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
    width: 70px;
    position: relative;
}

/* Main circle and outer circles */
.circle {
    position: absolute;
    border: 0.2vw solid red;
    border-radius: 50%;
    background-color: transparent;
}

/* Individual circle sizes (using vw for responsiveness) */
.circle-1 {
    width: 25px;
    height: 25px;
    background-color: red
}

.circle-2 {
    width: 50px;
    height: 50px;
}

.circle-3 {
    width: 75px;
    height: 75px;
}
</style>

<style lang="scss">
.pod-time  .p-card-caption{
    gap: unset;
}

.pod-time {
    .p-card-caption {
        gap: unset;
    }

    .p-card-subtitle {
        margin-bottom: 5px;
        font-size: .8em;
    }

    &[data-safety=safe] {
        .circle {
            border: 0.2vw solid #8CBC6B;
        }

        .circle-1 {
            background-color: #8CBC6B
        }
    }

    &[data-safety=probably-safe] {
        .circle {
            border: 0.2vw solid #DDB94A;
        }

        .circle-1 {
            background-color: #DDB94A
        }
    }

    &[data-safety=warning] {
        .circle {
            border: 0.2vw solid #DB943F;
        }

        .circle-1 {
            background-color: #DB943F
        }
    }

    &[data-safety=danger] {
        .circle {
            border: 0.2vw solid #D04741;
        }

        .circle-1 {
            background-color: #D04741;
        }
    }

    position: relative;

    .p-card-content {
        text-align: left;
    }

    .pod-row-image {
        position: absolute;
        top: 5px;
        left: 5px;
        height: 67px;
    }
}
</style>