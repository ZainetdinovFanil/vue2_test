import Vue from 'vue';

export default Vue.extend({
  methods: {
    convertISODateToDMY(isoDate: string): string {
      const date = new Date(isoDate);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    convertISODateToDMYHM(isoDate: string): string {
      const date = new Date(isoDate);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    },
    convertDateFormat(dateString: string) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('.').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);

      const date = new Date(year, month - 1, day, hours, minutes);

      const isoString = date.toISOString();

      const formattedDate = isoString.replace('.000Z', '.657847Z');

      return formattedDate;
    },
  }
});
