<template>
  <div class="dropdown">
    <div
      class="dropdown-input"
      @click="() => (readonly ? (showItems = !showItems) : null)"
    >
      <DefaultStringInput
        v-model="text[valueIndex]"
        :label="label"
        :readonly="readonly"
        :placeholder="placeholder"
      ></DefaultStringInput>
      <div class="dropdown-arrow" @click.stop="showItems = !showItems">
        <DefaultIcons
          class="dropdown-arrow-icon"
          :class="showItems ? 'active' : ''"
          :image-name="'arrow'"
        ></DefaultIcons>
      </div>
    </div>
    <div class="dropdown-items" :class="showItems ? 'active' : ''">
      <div
        class="dropdown-item"
        v-for="item in items"
        :key="item.id"
        @click="updateValue(item)"
      >
        {{ item[valueIndex] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultStringInput from "@/components/UI_UX/DefaultStringInput.vue";
import DefaultIcons from "@/components/UI_UX/DefaultIcons.vue";

interface Item {
  id: number;
  [key: string]: any;
}

export default Vue.extend({
  data() {
    return {
      text: { id: -1, value: "" } as Item,
      showItems: false,
      items: [] as Item[],
    };
  },
  created() {
    this.items = this.values;
    this.text = this.value;
  },
  watch: {
    text: {
      handler(newVal: Item) {
        this.$emit("input", newVal);
      },
      deep: true,
    },
    values: {
      handler(newVal: Item[]) {
        this.items = newVal;
      },
      deep: true,
    },
    value: {
      handler(newVal: Item) {
        this.text = newVal;
      },
      deep: true,
    },
  },
  props: {
    placeholder: {
      type: String,
      default: "Введите текст",
    },
    label: {
      type: String,
      default: function () {
        return this.placeholder;
      },
    },
    valueIndex: {
      type: String,
      default: "text",
    },
    value: {
      type: Object as () => Item,
      default: () => ({ id: -1, value: "" }),
    },
    values: {
      type: Array as () => Item[],
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DefaultStringInput,
    DefaultIcons,
  },
  methods: {
    updateValue(val: Item) {
      this.text = JSON.parse(JSON.stringify(val));
      this.$emit("input", this.text);
      this.showItems = false;
    },
  },
});
</script>


<style scoped lang="sass">
.dropdown-input
  display: flex
  align-items: center
  justify-content: space-between

.dropdown-arrow
  height: 40px
  width: 24px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer

  &-icon
    transition: all 0.5s
    transform: rotate(0deg)

  &-icon.active
    transform: rotate(180deg)

.dropdown-items
  padding: 0
  width: 100%
  height: 0
  border-radius: 2px
  background: white
  overflow: hidden
  position: absolute
  border: 1px solid rgba(204, 204, 204, 0)
  transition: all 0.5s
  top: 40px
  right: 0
  font-family: Roboto
  font-size: 14px
  font-weight: 400
  line-height: 20px

  &.active
    padding: 5px 0
    height: 60px
    overflow-y: scroll
    border: 1px solid rgba(204, 204, 204, 1)

  &
    z-index: 2
    cursor: pointer

.dropdown
  position: relative

  &-item
    border-bottom: 1px solid #ccc
</style>
