<template>
  <div class="password-input" @click="focusInput">
    <label
      class="password-input-label"
      :class="password.length ? 'active' : ''"
    >
      {{ computedLabel }}</label
    >
    <input
      ref="passwordField"
      :type="passwordVisible ? 'text' : 'password'"
      v-model="password"
      :placeholder="placeholder"
      @input="handleInput"
      class="password-input-field"
    />
    <span class="password-toggle" @click.stop="togglePasswordVisibility">
      <DefaultIcons
        :image-name="passwordVisible ? 'openEye' : 'closeEye'"
      ></DefaultIcons>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultIcons from "@/components/UI_UX/DefaultIcons.vue";

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: "Введите пароль",
    },
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      password: "" as string,
      passwordVisible: false as boolean,
    };
  },
  computed: {
    getPassword(): string {
      return this.password;
    },
    computedLabel(): string {
      return this.label || this.placeholder;
    },
  },
  created() {
    this.password = this.value;
  },
  components: {
    DefaultIcons,
  },
  methods: {
    handleInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      this.$emit("input", target.value);
    },
    focusInput(): void {
      (this.$refs.passwordField as HTMLInputElement).focus();
    },
    togglePasswordVisibility(): void {
      this.passwordVisible = !this.passwordVisible;
    },
  },
});
</script>

<style scoped lang="sass">
.password-input
  display: flex
  align-items: center
  position: relative
  width: 100%
  &-label
    font-family: Roboto
    font-size: 12px
    font-weight: 400
    line-height: 18px
    color: #50b053
    position: absolute
    top: 12px
    opacity: 0
    left: 0
    transition: all 0.6s
    &.active
      top: -5px
      opacity: 1

  &-field
    padding: 0px
    border: none
    border-radius: 0
    height: 40px
    outline: none
    width: 100%
    padding-right: 30px

.password-toggle
  position: absolute
  right: 10px
  cursor: pointer

  & i
    font-size: 16px
</style>
