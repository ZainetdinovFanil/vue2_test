<template>
  <div class="string-input" @click="focusInput">
    <label class="string-input-label" :class="text.length ? 'active' : ''">{{
      computedLabel
    }}</label>
    <input
      ref="inputField"
      type="text"
      :readonly="readonly"
      v-model="text"
      @keyup.enter="$emit('enterClick')"
      :placeholder="placeholder"
      class="string-input-field"
      @input="handleInput"
    />
    <div v-if="error" class="string-input-error">{{ error }}</div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: "Введите текст",
    },
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    error: {
      //достилизовать нужно
      type: String,
      default: "",
    },
  },
  data() {
    return {
      text: "" as string,
    };
  },
  computed: {
    computedLabel(): string {
      return this.label || this.placeholder;
    },
  },
  watch: {
    value(newVal: string) {
      this.text = newVal;
    },
  },
  created() {
    this.text = this.value;
  },
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit("input", target.value);
    },
    focusInput() {
      (this.$refs.inputField as HTMLInputElement).focus();
    },
  },
});
</script>

<style scoped lang="sass">
.string-input
  display: flex
  align-items: center
  width: 100%
  position: relative

  &-field
    border: none
    outline: none
    border-radius: 0px
    padding: 0
    width: 100%
    height: 40px
    cursor: pointer
    font-family: Roboto
    font-size: 14px
    font-weight: 400
    line-height: 20px
    &::placeholder
      font-size: 12px
      line-height: 18px

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
      top: -3px
      opacity: 1

  &-error
    font-family: Roboto
    font-size: 12px
    font-weight: 400
    line-height: 18px
    color: red
    position: absolute
    top: 28px
    left: 0
    height: 18px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    width: 100%
</style>
