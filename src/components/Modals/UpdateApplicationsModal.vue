<template>
  <DefaultModal
    :radius="8"
    :show-modal="showModal"
    @closeModal="$emit('closeModal')"
    class="create_modal"
  >
    <div class="create_modal-inner">
      <DefaultApplicationsModal
        :title="
          'Заявка № ' +
          data.number +
          ' (' +
          convertISODateToDMY(data.created_at) +
          ')'
        "
        :status="data.status.name"
        :data-info="getApplications"
        @updateData="updateData"
      ></DefaultApplicationsModal>
      <div class="create_modal-footer">
        <span class="create_modal-error">{{
          getErrorMainapplicationsUpdate
        }}</span>
        <div class="create_modal-btn" @click="updateAppeal">
          <DefaultButton
            :loader="getCanMainapplicationsUpdate"
            :padding="'8px 16px'"
            :border-radius="'2px'"
            :style="'width:100%'"
          >
            Сохранить
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
import DefaultApplicationsModal from "@/components/UI_UX/DefaultApplicationsModalContent.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import MyMixin from "@/myMixin";
interface Premise {
  id: number;
  address: string;
}

interface Apartment {
  id: number;
  label: string;
}

interface ApplicationData {
  premise: Premise;
  apartment: Apartment;
  firstName: string;
  lastName: string;
  patronymicName: string;
  phone: string;
  description: string;
  date: string;
}

export default Vue.extend({
  mixins: [MyMixin],
  data() {
    return {
      formData: {
        premise: { id: 0, address: "дом" } as Premise,
        apartment: { id: 0, label: "квартира" } as Apartment,
        firstName: "",
        lastName: "",
        patronymicName: "",
        phone: "",
        description: "",
        date: "",
      },
    };
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    data(newValue, oldValue) {
      this.formData = {
        premise: newValue.premise as Premise,
        apartment: newValue.apartment as Apartment,
        firstName: newValue.applicant.first_name,
        lastName: newValue.applicant.last_name,
        patronymicName: newValue.applicant.patronymic_name,
        phone: newValue.username,
        description: newValue.description,
        date: this.convertISODateToDMYHM(newValue.due_date),
      };
    },
  },
  computed: {
    ...mapGetters([
      "getPremiseMainapplications",
      "getApartmentMainapplications",
      "getCanMainapplicationsUpdate",
      "getErrorMainapplicationsUpdate"
    ]),
    getApplications: {
      get(): ApplicationData {
        return this.formData;
      },
      set(newVal: ApplicationData) {
        this.formData = newVal;
      },
    },
  },
  components: {
    DefaultModal,
    DefaultButton,
    DefaultApplicationsModal,
  },
  methods: {
    ...mapMutations(["setErrorMainapplicationsUpdate"]),
    ...mapActions(["mainapplicationsUpdateAction"]),
    updateAppeal() {
      this.mainapplicationsUpdateAction({
          number: this.data.number,
          created_at: this.data.created_at,
          premise_id: this.formData.premise.id,
          apartment_id: this.formData.apartment.id,
            last_name: this.formData.lastName,
            first_name: this.formData.firstName,
            patronymic_name: this.formData.patronymicName,
            username: this.formData.phone,
          description: this.formData.description,
          due_date: this.formData.date?this.convertDateFormat(this.formData.date):null,
          status: this.data.status
        })
      /* this.$emit("closeModal"); */
    },
    updateData(data: ApplicationData) {
      this.formData = data;
      this.setErrorMainapplicationsUpdate('')
    },
    convertISODateToDMY(isoDate: string): string {
      const date = new Date(isoDate);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    convertISODateToDMYHM(isoDate: string): string {
      const date = new Date(isoDate);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    },

    convertDateFormat(dateString: string) {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split(".").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);

      const date = new Date(year, month - 1, day, hours, minutes);

      const isoString = date.toISOString();

      const formattedDate = isoString.replace(".000Z", ".657847Z");

      return formattedDate;
    },
  },
});
</script>

<style scoped lang="sass">
.create_modal-header
  display: flex
  align-items: center
  justify-content: space-between
  height: 40px
  margin-bottom: 24px
.create_modal-title
  font-family: Roboto
  font-size: 16px
  font-weight: 500
  line-height: 24px

.create_modal-status
  font-family: Inter
  font-size: 14px
  font-weight: 400
  line-height: 20px

.create_modal-inner
  padding: 24px 32px
  width: 738px
  position: relative
.create_modal-content
  display: flex
  flex-direction: column
  gap: 32px
  margin-bottom: 24px
.create_modal-block
  display: flex
  justify-content: space-between
  align-items: center
  gap: 15px

.create_modal-subblock
  height: 56px
  padding: 8px 0
  border-bottom: 1px solid #ccc
  display: flex
  align-items: center
.create_modal-textarea
  width: 100%
  height: 132px
  padding: 8px 0
  border-bottom: 1px solid #ccc
.create_modal-footer
  display: flex
  justify-content: space-between
  align-items: center
.create_modal-error
  color: red
.create_modal-btn
  width: 87px
</style>
<style lang="sass">
.create_modal
  .mx-icon-calendar
    display: none

  .mx-input
    border: none
    outline: none
    font-family: Roboto
    font-size: 14px
    font-weight: 400
    line-height: 20px
    color: black
</style>