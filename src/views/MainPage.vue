<template>
  <div class="mainapplications">
    <div class="mainapplications-content">
      <div>
        <div class="mainapplications-title">Список заявок</div>
        <div class="mainapplications-create">
          <div class="mainapplications-create-btn" @click="toggleCreateModal">
            <DefaultButton :padding="'8px 35px'" :border-radius="'4px'">
              CОЗДАТЬ
            </DefaultButton>
          </div>
          <CreateApplicationsModal
            :show-modal="showCreateModal"
            @closeModal="toggleCreateModal"
          ></CreateApplicationsModal>
        </div>
        <div class="mainapplications-search-block">
          <div class="mainapplications-search-input">
            <DefaultStringInput
              v-model="search"
              :placeholder="'Поиск (№ заявки, название)'"
              @enterClick="
                mainapplicationsAction({
                  page_size: pageSize.value,
                  page: 1,
                  search: search,
                  premise_id: premise.id,
                })
              "
            ></DefaultStringInput>
            <div
              class="mainapplications-seacth-image"
              @click="
                mainapplicationsAction({
                  page_size: pageSize.value,
                  page: 1,
                  search: search,
                  premise_id: premise.id,
                })
              "
            >
              <DefaultIcons :image-name="'search'"></DefaultIcons>
            </div>
          </div>
          <div class="mainapplications-dropdown-block">
            <DefaultDropdown
              class="mainapplications-dropdown-input"
              v-model="premise"
              :placeholder="'Дом'"
              :value-index="'address'"
              :readonly="true"
              :values="getPremiseSearch"
            ></DefaultDropdown>
          </div>
        </div>
      </div>
      <div class="mainapplications-inner" v-if="!getMainapplicationsLoader">
        <div class="mainapplications-header">
          <div class="mainapplications-item-block">
            № <DefaultIcons :image-name="'gray-little-arrow'"></DefaultIcons>
          </div>
          <div class="mainapplications-item-block">
            Создана
            <DefaultIcons :image-name="'black-little-arrow'"></DefaultIcons>
          </div>
          <div class="mainapplications-item-block">Адрес</div>
          <div class="mainapplications-item-block">Заявитель</div>
          <div class="mainapplications-item-block">Описание</div>
          <div class="mainapplications-item-block">Срок</div>
          <div class="mainapplications-item-block">
            Статус
            <DefaultIcons :image-name="'gray-little-arrow'"></DefaultIcons>
          </div>
        </div>
        <div class="mainapplications-items">
          <div
            class="mainapplications-item"
            v-for="mainapplication in getMainapplications"
            :key="mainapplication.id"
          >
            <div class="mainapplications-item-block">
              <div
                class="mainapplications-item-block-number"
                @click="openUpdateModal(mainapplication)"
              >
                {{ mainapplication.number }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{ convertISODateToDMY(mainapplication.created_at) }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{ mainapplication.premise?.address }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{
                  mainapplication.applicant.last_name +
                  mainapplication.applicant.first_name[0] +
                  "." +
                  mainapplication.applicant.patronymic_name[0] +
                  "."
                }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{ mainapplication.description }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{ convertISODateToDMYHM(mainapplication.due_date) }}
              </div>
            </div>
            <div class="mainapplications-item-block">
              <div class="mainapplications-item-block-text">
                {{ mainapplication.status.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mainapplications-loader" v-else>
        <span class="loader"></span>
      </div>
    </div>
    <div class="mainapplications-footer">
      <div class="mainapplications-footer-appeals">
        <div class="mainapplications-footer-text">
          <span class="mainapplications-footer-span">1 - 10</span>
          из
          <span class="mainapplications-footer-span">1500</span>
          записей
        </div>
        <div class="mainapplications-footer-paginate">
          <DefaultDropdown
            class="mainapplications-dropdown-input"
            v-model="pageSize"
            :placeholder="''"
            :value-index="'value'"
            :readonly="true"
            :values="steps"
          ></DefaultDropdown>
        </div>
      </div>
      <div class="mainapplications-footer-pages">
        <div class="mainapplications-footer-start" @click="setPage(1)">
          <DefaultIcons :image-name="'start-arrow'"></DefaultIcons>
        </div>
        <div class="mainapplications-footer-left" @click="setPageToLeft">
          <DefaultIcons :image-name="'left-arrow'"></DefaultIcons>
        </div>
        <div class="mainapplications-footer-items">
          <div
            class="mainapplications-footer-item"
            :class="value == getMainapplicationsPageInfo.page ? 'active' : null"
            v-for="(value, key, index) in pageInfoCalculate"
            :key="index"
            @click="setPage(value)"
          >
            {{ value }}
          </div>
        </div>
        <div class="mainapplications-footer-right" @click="setPageToRight">
          <DefaultIcons :image-name="'right-arrow'"></DefaultIcons>
        </div>
        <div
          class="mainapplications-footer-end"
          @click="setPage(getMainapplicationsPageInfo.pages)"
        >
          <DefaultIcons :image-name="'end-arrow'"></DefaultIcons>
        </div>
      </div>
    </div>
    <UpdateeApplicationsModal
      :show-modal="showUpdateModal"
      @closeModal="toggleUpdateModal"
      :data="updateDataModal"
    ></UpdateeApplicationsModal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateApplicationsModal from "@/components/Modals/CreateApplicationsModal.vue";
import UpdateeApplicationsModal from "@/components/Modals/UpdateApplicationsModal.vue";
import DefaultButton from "@/components/UI_UX/DefaultButton.vue";
import DefaultStringInput from "@/components/UI_UX/DefaultStringInput.vue";
import DefaultDropdown from "@/components/UI_UX/DefaultDropdown.vue";
import DefaultIcons from "@/components/UI_UX/DefaultIcons.vue";
import { mapActions, mapGetters } from "vuex";
import MyMixin from "@/myMixin";

export default Vue.extend({
  mixins: [MyMixin],
  data() {
    return {
      updateDataModal: {} as object,
      activePage: 1 as number,
      pages: [] as number[],
      showCreateModal: false as boolean,
      showUpdateModal: false as boolean,
      login: "" as string,
      search: "" as string,
      premise: { id: null as number | null, address: "" as string },
      pageSize: {
        id: 0 as number,
        value: "10" as string,
      },
      steps: [
        {
          id: 0 as number,
          value: "10" as string,
        },
        {
          id: 1 as number,
          value: "20" as string,
        },
        {
          id: 3 as number,
          value: "30" as string,
        },
        {
          id: 4 as number,
          value: "50" as string,
        },
        {
          id: 5 as number,
          value: "100" as string,
        },
      ],
    };
  },
  components: {
    CreateApplicationsModal,
    UpdateeApplicationsModal,
    DefaultButton,
    DefaultStringInput,
    DefaultDropdown,
    DefaultIcons,
  },
  created() {
    this.premiseSearchAction();
    this.mainapplicationsAction({
      page_size: this.pageSize.value,
      page: this.getMainapplicationsPageInfo.page,
      search: this.search,
      premise_id: this.premise.id,
    });
  },
  watch: {
    pageSize: function (
      newVal: { id: number; value: string },
      oldVal: { id: number; value: string }
    ) {
      this.mainapplicationsAction({
        page_size: newVal.value,
        page: 1,
        search: this.search,
        premise_id: this.premise.id,
      });
    },
    premise: function (
      newVal: { id: number | null; address: string },
      oldVal: { id: number | null; address: string }
    ) {
      this.mainapplicationsAction({
        page_size: this.pageSize.value,
        page: 1,
        search: this.search,
        premise_id: newVal.id,
      });
    },
  },
  computed: {
    ...mapGetters([
      "getMainapplicationsLoader",
      "getMainapplications",
      "getPremiseSearch",
      "getMainapplicationsPageInfo",
    ]),
    pageInfoCalculate() {
      let page: number = this.getMainapplicationsPageInfo.page;
      let pages: number = this.getMainapplicationsPageInfo.pages;
      if (pages <= 1) {
        return [1];
      }

      if (pages === 2) {
        return [1, 2];
      }

      const delta = 2; // Количество страниц по обе стороны от текущей страницы
      const range: (number | string)[] = [];

      for (
        let i = Math.max(2, page - delta);
        i <= Math.min(pages - 1, page + delta);
        i++
      ) {
        range.push(i);
      }

      if (page - delta > 2) {
        range.unshift("...");
      }
      if (page + delta < pages - 1) {
        range.push("...");
      }

      return [1, ...range, pages];
    },
  },
  methods: {
    ...mapActions(["mainapplicationsAction", "premiseSearchAction"]),
    setPageToRight() {
      let page: number = this.getMainapplicationsPageInfo.page;
      let pages: number = this.getMainapplicationsPageInfo.pages;
      if (page < pages) {
        this.mainapplicationsAction({
          page_size: this.pageSize.value,
          page: page + 1,
          search: this.search,
          premise_id: this.premise.id,
        });
      }
    },
    setPageToLeft() {
      let page: number = this.getMainapplicationsPageInfo.page;
      if (page > 1) {
        this.mainapplicationsAction({
          page_size: this.pageSize.value,
          page: page - 1,
          search: this.search,
          premise_id: this.premise.id,
        });
      }
    },
    setPage(page: number) {
      this.mainapplicationsAction({
        page_size: this.pageSize.value,
        page: page,
        search: this.search,
        premise_id: this.premise.id,
      });
    },
    toggleCreateModal() {
      this.showCreateModal = !this.showCreateModal;
    },
    toggleUpdateModal() {
      this.showUpdateModal = !this.showUpdateModal;
    },
    openUpdateModal(data: object) {
      this.updateDataModal = data;
      this.toggleUpdateModal();
    },
  },
});
</script>

<style lang="sass" scoped>
.mainapplications
  padding-bottom: 80px
  height: 100%
  display: flex
  flex-direction: column
  justify-content: space-between
.mainapplications-title
  height: 72px
  text-align: left
  font-family: Roboto
  font-size: 20px
  font-weight: 400
  line-height: 24px
  margin-bottom: 57px
  display: flex
  justify-content: start
  align-items: center

.mainapplications-create
  display: flex
  justify-content: end

.mainapplications-search-block
  display: flex
  align-items: center
  justify-content: space-between
  gap: 15px

.mainapplications-search-input
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%

.mainapplications-dropdown-block
  display: flex
  align-items: center
  justify-content: end
  width: 100%

.mainapplications-dropdown-input
  width: 100%

.mainapplications-header
  display: flex
  .mainapplications-item-block
    color: #50b053

.mainapplications-item-block
  padding: 12px 8px
  display: flex
  align-items: center
  justify-content: start
  gap: 4px
  &:nth-child(1)
    width: 8%

  &:nth-child(2),
  &:nth-child(6),
  &:nth-child(7)
    width: 12%

  &:nth-child(3),
  &:nth-child(4)
    width: 16%

  &:nth-child(5)
    width: 24%

.mainapplications-item
  display: flex
  &-block
    display: flex
    align-items: center
    justify-content: start
  &-block-text
    text-overflow: ellipsis
    white-space: nowrap
    overflow: hidden
    display: inline-block
    text-align: left

  &-block-number
    width: 56px
    height: 28px
    background: #50b053
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: center
    color: white
    cursor: pointer

.mainapplications-footer
  display: flex
  align-items: center
  justify-content: space-between
  .mainapplications-footer-appeals
    display: flex
    align-items: center
    justify-content: space-between
    gap: 16px
    font-family: Roboto
    font-size: 14px
    font-weight: 400
    line-height: 20px
    text-align: left

    .mainapplications-footer-span
      font-weight: 700
    .mainapplications-footer-paginate
      width: 90px
      .mainapplications-dropdown-input
  .mainapplications-footer-pages
    display: flex
    align-items: center
    justify-content: space-between
    gap: 4px
    .mainapplications-footer-start,.mainapplications-footer-left,.mainapplications-footer-right,.mainapplications-footer-end,.mainapplications-footer-item
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer

    .mainapplications-footer-items
      display: flex
      align-items: center
      justify-content: space-between
      gap: 4px
      .mainapplications-footer-item
        font-family: Roboto
        font-size: 10px
        font-weight: 400
        line-height: 12px
        text-align: center
        width: 38px

      .mainapplications-footer-item.active
        background: #50B053
        height: 32px
        width: 32px
        border-radius: 50%
        color: white
.mainapplications-seacth-image
  cursor: pointer
.loader
  width: 48px
  height: 48px
  border: 5px solid #50B053
  border-bottom-color: transparent
  border-radius: 50%
  display: inline-block
  box-sizing: border-box
  animation: rotation 1s linear infinite

  @keyframes rotation
    0%
      transform: rotate(0deg)

    100%
      transform: rotate(360deg)
.mainapplications-loader
  flex: 1
  display: flex
  justify-content: center
  align-items: center
.mainapplications-content
  height: 100%
  display: flex
  flex-direction: column
</style>
