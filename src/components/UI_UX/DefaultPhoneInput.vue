<template>
  <div class="phone-input">
    <input
      type="text"
      v-model="phoneNumber"
      @input="formatPhoneNumber"
      placeholder="Введите номер телефона"
      class="phone-input-field"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//недопилина
export default Vue.extend({
  data() {
    return {
      phoneNumber: "+7" as string,
    };
  },
  methods: {
    formatPhoneNumber(e: Event): void {
      // Удаляем все символы, кроме цифр и плюса
      let cleaned = ("" + this.phoneNumber).replace(/[^\d+]/g, "");

      // Проверяем, начинается ли номер с "+7" или "8"
      if (cleaned.startsWith("+7")) {
        cleaned = cleaned.slice(2); // Удаляем "+7"
      } else if (cleaned.startsWith("8")) {
        cleaned = cleaned.slice(1); // Удаляем "8"
      }

      // Ограничиваем длину до 10 символов 
      let match = cleaned.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
let formatted = !match?.[2]
  ? match?.[1]
  : match?.[1] + "-" + match?.[2] + (match?.[3] ? "-" + match?.[3] : "");

      // Восстанавливаем префикс
      if (this.phoneNumber.startsWith("+7")) {
        this.phoneNumber = "+7 " + formatted;
      } else if (this.phoneNumber.startsWith("8")) {
        this.phoneNumber = "8 " + formatted;
      } else {
        this.phoneNumber = "+7 " + formatted;
      }
    },
  },
});
</script>


<style scoped>
.phone-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.phone-prefix {
  margin-right: 5px;
}

.phone-input-field {
  padding: 5px;
  border: none;
  outline: none;
  border-radius: 4px;
  width: 100%;
}
</style>
