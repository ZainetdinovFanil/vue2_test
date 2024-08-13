<template>
  <div class="textarea-input" @click="focusTextarea">
    <label class="textarea-input-label" :class="text.length ? 'active' : ''">{{
      label
    }}</label>
    <textarea
      ref="textareaField"
      v-model="text"
      :placeholder="placeholder"
      class="textarea-input-field"
      @input="handleInput"
      :style="'resize:' + resize + ';height:' + height"
    ></textarea>
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
    resize: {
      type: String,
      default: "both",
    },
    height: {
      type: String,
      default: "auto",
    },
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: function (): string {
        return this.placeholder;
      },
    },
  },
  data() {
    return {
      text: this.value as string,
    };
  },
  watch: {
    value(newVal: string) {
      this.text = newVal;
    },
  },
  methods: {
    handleInput(event: Event): void {
      const target = event.target as HTMLTextAreaElement;
      this.$emit("input", target.value);
    },
    focusTextarea(): void {
      (this.$refs.textareaField as HTMLTextAreaElement).focus();
    },
  },
});
</script>
  
  <style scoped lang="sass">
.textarea-input
  display: flex
  position: relative
  align-items: center
  width: 100%

  &-field
    border: none
    outline: none
    border-radius: 0px
    padding: 0
    width: 100%
    min-height: 20px
    max-height: 100%

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
    top: 2px
    opacity: 0
    left: 0
    transition: all 0.6s
    &.active
      top: -16px
      opacity: 1
</style>
  