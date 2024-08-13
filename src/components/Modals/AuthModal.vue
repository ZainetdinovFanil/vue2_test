<template>
  <DefaultModal :radius="5" :show-modal="showModal" class="auth_modal">
    <div class="auth_modal-inner">
      <h2 class="auth_modal-header">Авторизация</h2>
      <div class="auth_modal-content">
        <div class="auth_modal-inpute">
          <div class="auth_modal-inpute-inner">
            <DefaultIcons
              :image-name="'phone'"
              class="auth_modal-inpute-image"
            ></DefaultIcons>
            <DefaultStringInput
              v-model="login"
              :label="'Логин или Телефон'"
              :placeholder="'Введите телефон или логин'"
            ></DefaultStringInput>
          </div>
        </div>
        <div class="auth_modal-inpute">
          <div class="auth_modal-inpute-inner">
            <DefaultIcons
              :image-name="'lock'"
              class="auth_modal-inpute-image"
            ></DefaultIcons>
            <DefaultPasswordInput
              v-model="password"
              :placeholder="'Пароль'"
            ></DefaultPasswordInput>
          </div>
        </div>
        <div class="auth_modal-error">
          <template v-if="getAuthError">
            {{ getAuthError }}
          </template>
        </div>
      </div>
      <div class="auth_modal-footer">
        <div @click="toLogin" class="auth_modal-btn">
          <DefaultButton
            :loader="getCanAuth"
            :padding="'8px 35px'"
            :border-radius="'4px'"
            style="width: 100%"
          >
            Войти
          </DefaultButton>
        </div>
      </div>
    </div>
  </DefaultModal>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultModal from "@/components/UI_UX/DefaultModal.vue";
import DefaultButton from "@/components/UI_UX/DefaultButton.vue";
import DefaultStringInput from "@/components/UI_UX/DefaultStringInput.vue";
import DefaultPasswordInput from "@/components/UI_UX/DefaultPasswordInput.vue";
import DefaultIcons from "@/components/UI_UX/DefaultIcons.vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  name: "HomeView",
  data() {
    return {
      password: "" as string,
      showModal: true as boolean,
      login: "+7" as string,
    };
  },
  components: {
    DefaultModal,
    DefaultButton,
    DefaultStringInput,
    DefaultPasswordInput,
    DefaultIcons,
  },
  computed: {
    ...mapGetters(["getCanAuth", "getAuthError"]),
  },
  methods: {
    ...mapActions(["userAction"]),
    isPhoneNumber(input: string): boolean {
      // Проверяем, содержит ли строка только цифры, пробелы и скобки после символа '+'
      return /^\+\d[\d\s()-]*$/.test(input);
    },
    cleanPhoneNumber(input: string): string {
      // Удаляем символ '+', скобки и пробелы
      return input.replace(/\+|\(|\)|\s/g, "");
    },
    toLogin(): void {
      const isPhoneNumber = this.isPhoneNumber(this.login);
      const cleanPhoneNumber = this.cleanPhoneNumber(this.login);
      this.userAction({
        login:
          isPhoneNumber && cleanPhoneNumber.length === 11
            ? cleanPhoneNumber
            : this.login,
        password: this.password,
      });
    },
  },
});
</script>

<style scoped lang="sass">
.auth_modal-inner
  padding: 86px 20px 20px
  width: 340px
  position: relative
  .auth_modal-header
    position: absolute
    width: 308px
    padding: 18px
    background-color: #50B053
    border-radius: 5px
    font-family: Inter
    font-size: 16px
    font-weight: 500
    line-height: 20px
    color: white
    top: -19px
  .auth_modal-error
    min-height: 16px
    margin-bottom: 4px
    font-family: Roboto
    font-size: 12px
    line-height: 18px
    color: red
    text-align: center
  .auth_modal-inpute
    margin-bottom: 8px
    border-bottom: 1px solid #ccc
    height: 56px
    display: flex
    flex-direction: column
    justify-content: end
    padding-bottom: 7px
    &-inner
      display: flex
      gap: 8px
      justify-content: start
    &-image
      display: flex
      justify-content: center
      align-items: center
  .auth_modal-footer
    display: flex
    justify-content: center
    align-items: center
  .auth_modal-btn
    width: 110px
    height: 36px
</style>
