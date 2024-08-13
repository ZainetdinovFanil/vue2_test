<template>
  <div>
    <div class="create_modal-header">
      <h3 class="create_modal-title">{{ title }}</h3>
      <div class="create_modal-status">{{ status }}</div>
    </div>
    <div class="create_modal-content">
      <div class="create_modal-block">
        <div class="create_modal-subblock">
          <DefaultDropdown
            v-model="formData.premise"
            :label="'Дом'"
            :placeholder="'Дом'"
            :value-index="'address'"
            :values="getPremiseMainapplications"
          ></DefaultDropdown>
        </div>
        <div class="create_modal-subblock">
          <DefaultDropdown
            v-model="formData.apartment"
            :placeholder="'Квартира'"
            :value-index="'label'"
            :values="getApartmentMainapplications"
            :readonly="true"
          ></DefaultDropdown>
        </div>
        <div class="create_modal-subblock">
          <DatePicker
            v-model="formData.date"
            type="datetime"
            :format="'DD.MM.YYYY HH:mm'"
            :value-type="'format'"
            :editable="false"
            placeholder="Срок"
          />
        </div>
      </div>
      <div class="create_modal-block">
        <div class="create_modal-subblock">
          <DefaultStringInput
            v-model="formData.lastName"
            :placeholder="'Фамилия'"
          ></DefaultStringInput>
        </div>
        <div class="create_modal-subblock">
          <DefaultStringInput
            v-model="formData.firstName"
            :placeholder="'Имя'"
          ></DefaultStringInput>
        </div>
        <div class="create_modal-subblock">
          <DefaultStringInput
            v-model="formData.patronymicName"
            :placeholder="'Отчество'"
          ></DefaultStringInput>
        </div>
        <div class="create_modal-subblock">
          <DefaultStringInput
            v-model="formData.phone"
            :placeholder="'Телефон'"
          ></DefaultStringInput>
        </div>
      </div>
      <div class="create_modal-block">
        <div class="create_modal-textarea">
          <DefaultTextarea
            v-model="formData.description"
            :placeholder="'Описание заявки'"
            :resize="'none'"
            :height="'116px'"
          >
          </DefaultTextarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultDropdown from "@/components/UI_UX/DefaultDropdown.vue";
import DefaultStringInput from "@/components/UI_UX/DefaultStringInput.vue";
import DefaultTextarea from "@/components/UI_UX/DefaultTextarea.vue";
import { mapActions, mapGetters } from "vuex";

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
  date: string | null;
}

export default Vue.extend({
  data() {
    return {
      formData: {
        premise: { id: -1, address: "" } as Premise,
        apartment: { id: -1, label: "" } as Apartment,
        firstName: "",
        lastName: "",
        patronymicName: "",
        phone: "",
        description: "",
        date: "",
      } as ApplicationData,
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    dataInfo: {
      type: Object as () => ApplicationData,
      default: () =>
        ({
          premise: { id: -1, address: "" } as Premise,
          apartment: { id: -1, label: "" } as Apartment,
          firstName: "",
          lastName: "",
          patronymicName: "",
          phone: "",
          description: "",
          date: "",
        } as ApplicationData),
    },
  },
  computed: {
    ...mapGetters([
      "getPremiseMainapplications",
      "getApartmentMainapplications",
      "getCanMainapplicationsCreate",
    ]),
  },
  mounted() {
    if (this.dataInfo) {
      this.formData = this.dataInfo;
      console.log(this.formData);
    }
  },
  watch: {
    formData: {
      handler(newVal: ApplicationData) {
        this.updateData();
      },
      deep: true,
    },
    "formData.premise": {
      handler(
        newVal: { id: number; address: string },
        oldVal: { id: number; address: string }
      ) {
        this.formData.apartment = { id: -1, label: "" }; //сброс списка квартир
        if (newVal.id === oldVal.id) {
          // если печатаем, то получаем список домов
          this.premiseMainapplicationsAction({ search: newVal.address });
        } else {
          // иначе выбрали другой адрес в dropdown, то получаем список квартир
          this.apartmentMainapplicationsAction({ premiseId: newVal.id });
        }
      },
      deep: true,
    },
  },
  components: {
    DefaultDropdown,
    DefaultStringInput,
    DefaultTextarea,
  },
  created() {
    this.premiseMainapplicationsAction({ search: "" });
  },
  methods: {
    ...mapActions([
      "mainapplicationsCreateAction",
      "premiseMainapplicationsAction",
      "apartmentMainapplicationsAction",
    ]),
    updateData() {
      this.$emit("updateData", {
        premise: this.formData.premise,
        apartment: this.formData.apartment,
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        patronymicName: this.formData.patronymicName,
        phone: this.formData.phone,
        description: this.formData.description,
        date: this.formData.date,
      });
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
  justify-content: end
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