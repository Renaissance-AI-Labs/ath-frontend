<template>
    <div class="popup-overlay" @click.self="$emit('close')">
        <div class="popup-container">
            <div class="popup-header">
                <h3>{{ $t('popup.title') }}</h3>
                <button class="close-button" @click="$emit('close')">&times;</button>
            </div>
            <div class="popup-body">
                <input type="number" :placeholder="$t('popup.placeholder')" class="popup-input">
                <div class="info-row">
                    <span>{{ $t('popup.maxAmount') }}: 1000</span>
                    <div class="days-dropdown" @click="toggleDropdown">
                        <span>{{ selectedDayOption ? selectedDayOption.text : $t('popup.selectDays') }}</span>
                        <ul v-if="isDropdownOpen" class="dropdown-menu">
                            <li v-for="option in dayOptions" :key="option.value" @click="selectOption(option)">
                                {{ option.text }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="popup-footer">
                <button class="popup-button cancel" @click="$emit('close')">{{ $t('popup.cancel') }}</button>
                <button class="popup-button confirm">{{ $t('popup.confirm') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineEmits(['close']);

const isDropdownOpen = ref(false);
const selectedDayOption = ref(null);

const dayOptions = ref([
    { value: 1, text: t('popup.daysOptions.day_1') },
    { value: 15, text: t('popup.daysOptions.day_15') },
    { value: 30, text: t('popup.daysOptions.day_30') },
]);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (option) => {
    selectedDayOption.value = option;
    isDropdownOpen.value = false;
};

</script>
