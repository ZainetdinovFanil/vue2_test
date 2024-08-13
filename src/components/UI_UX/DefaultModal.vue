<template>
  <div
    v-if="showModal || isAnimating"
    :class="['modal-shadow', { 'fade-out': !showModal }]"
    @click.self="closeModal"
  >
    <div
      class="modal"
      :class="{ 'fade-in': showModal }"
      :style="'border-radius:' + radius + 'px'"
      @animationend="handleAnimationEnd"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ModalWindow",
  data() {
    return {
      isAnimating: false as boolean,
    };
  },
  props: {
    radius: {
      type: Number,
      default: 8,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showModal(newVal: boolean) {
      if (!newVal) {
        this.isAnimating = true;
      }
    },
  },
  methods: {
    closeModal(): void {
      this.$emit("closeModal");
    },
    handleAnimationEnd(): void {
      if (!this.showModal) {
        this.isAnimating = false;
      }
    },
  },
});
</script>

<style scoped lang="sass">
.modal-shadow
  z-index: 10
  position: absolute
  top: 0
  left: 0
  min-height: 100%
  width: 100%
  background: rgba(0, 0, 0, 0.20)
  opacity: 0
  animation: fadeInBackground 0.3s forwards

.modal-shadow.fade-out
  animation: fadeOutBackground 0.3s forwards

.modal
  background: #fff
  max-width: 100%
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  opacity: 0

.modal.fade-in
  animation: fadeIn 0.3s forwards

@keyframes fadeIn
  0%
    opacity: 0
    transform: translate(-50%, -50%) scale(0.5)
  100%
    opacity: 1
    transform: translate(-50%, -50%) scale(1)

@keyframes fadeOut
  0%
    opacity: 1
    transform: translate(-50%, -50%) scale(1)
  100%
    opacity: 0
    transform: translate(-50%, -50%) scale(0.5)

@keyframes fadeInBackground
  0%
    opacity: 0
  100%
    opacity: 1

@keyframes fadeOutBackground
  0%
    opacity: 1
  100%
    opacity: 0

.modal-shadow.fade-out .modal
  animation: fadeOut 0.3s forwards
</style>
