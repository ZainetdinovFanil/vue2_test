<template>
  <div class="auth_page">
    <AuthModal></AuthModal>
  </div>
</template> 

<script lang="ts">
import Vue from "vue";
import AuthModal from "@/components/Modals/AuthModal.vue";

export default Vue.extend({
  name: "AuthPage",
  components: {
    AuthModal,
  },
});
</script>

<style scoped lang="sass">
</style>ы