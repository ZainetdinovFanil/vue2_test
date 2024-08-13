import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import axios from './axios';
import router from '@/router';

Vue.use(Vuex);
interface MainApplication {
  number: number;
  created_at: string;
  premise_id: string;
  apartment_id: number;
  applicant: {
    last_name: string;
    first_name: string;
    patronymic_name: string;
    username: string;
  };
  description: string;
  due_date: string;
  status: string;
}
interface MainapplicationsPageInfo{
  page: number;
  pageNext: number | null;
  pagePrevious: number | null;
  pages: number;
}
interface State {
  canAuth: boolean;
  authError: string;
  premiseSearch: any[];
  mainapplicationsPageInfo: MainapplicationsPageInfo;
  mainapplications: any[];
  mainapplicationsLoader: boolean,
  errorMainapplicationsCreate: string;
  canMainapplicationsCreate: boolean;
  errorMainapplicationsUpdate: string;
  canMainapplicationsUpdate: boolean;
  premiseMainapplications: any; 
  apartmentMainapplications: any;
}

const store: StoreOptions<State> = {
  state: {
    canAuth: true,
    authError: '',
    premiseSearch: [],
    mainapplicationsPageInfo:{
      page: 1,
      pageNext: null,
      pagePrevious: null,
      pages: 1
    },
    mainapplications: [],
    mainapplicationsLoader: true,
    errorMainapplicationsCreate: '',
    canMainapplicationsCreate: true,
    errorMainapplicationsUpdate: '',
    canMainapplicationsUpdate: true,
    premiseMainapplications: [],
    apartmentMainapplications: [],
  },
  getters: {
    getCanAuth(state: State): boolean {
      return state.canAuth;
    },
    getAuthError(state: State): string {
      return state.authError;
    },
    getPremiseSearch(state: State): any[] {
      return state.premiseSearch;
    },
    getMainapplications(state: State): MainApplication[] {
      return state.mainapplications;
    },
    getMainapplicationsLoader(state: State): boolean {
      return state.mainapplicationsLoader;
    },
    getMainapplicationsPageInfo(state: State): MainapplicationsPageInfo {
      return state.mainapplicationsPageInfo;
    },
    getErrorMainapplicationsCreate(state: State): string {
      return state.errorMainapplicationsCreate;
    },
    getCanMainapplicationsCreate(state: State): boolean {
      return state.canMainapplicationsCreate;
    },
    getErrorMainapplicationsUpdate(state: State): string {
      return state.errorMainapplicationsUpdate;
    },
    getCanMainapplicationsUpdate(state: State): boolean {
      return state.canMainapplicationsUpdate;
    },
    getPremiseMainapplications(state: State): any {
      return state.premiseMainapplications;
    },
    getApartmentMainapplications(state: State): any {
      return state.apartmentMainapplications;
    }
  },
  mutations: {
    setCanAuth(state: State, value: boolean): void {
      state.canAuth = value;
    },
    setAuthError(state: State, value: string): void {
      state.authError = value;
    },
    setPremiseSearch(state: State, value: any[]): void {
      state.premiseSearch = value;
    },
    setMainapplications(state: State, value: any[]): void {
      state.mainapplications = value;
    },
    setMainapplicationsLoader(state: State, value: boolean): void {
      state.mainapplicationsLoader = value;
    },
    setMainapplicationsPageInfo(state: State, value: MainapplicationsPageInfo): void {      
      state.mainapplicationsPageInfo = value;
    },
    setErrorMainapplicationsCreate(state: State, value: string): void {
      state.errorMainapplicationsCreate = value;
    },
    setCanMainapplicationsCreate(state: State, value: boolean): void {  
      state.canMainapplicationsCreate = value;
    },
    setErrorMainapplicationsUpdate(state: State, value: string): void {
      state.errorMainapplicationsUpdate = value;
    },
    setCanMainapplicationsUpdate(state: State, value: boolean): void {
      state.canMainapplicationsCreate = value;
    },
    setPremiseMainapplications(state: State, value: any): void {
      state.premiseMainapplications = value;
    },
    setApartmentMainapplications(state: State, value: any): void {
      state.apartmentMainapplications = value;
    }
  },
  actions: {
    userAction({ commit, state }: { commit: any, state: State }, data: any): void {
      commit('setCanAuth', false);
      commit('setAuthError', '');
      axios.post('auth/login/', {
        "username": data.login,
        "password": data.password
      })
      .then(response => {
        commit('setCanAuth', true);
        localStorage.setItem('token', response.data.key);
        localStorage.setItem('user_id', response.data.employee_id);
        router.push('/'); // Редирект на главную страницу
      })
      .catch((error) => {
        commit('setCanAuth', true);
        
        let err='Неверный логин или пароль'
        if (error.response?.data?.data?.non_field_errors) {
          err=error.response.data.data.non_field_errors[0]
        } else if(error.response?.data?.data?.password) {
          err=error.response?.data?.data?.password[0]
        }
        commit('setAuthError', err);
      });
    },
    premiseSearchAction({ commit, state }: { commit: any, state: State }): void {
      axios({
        method: 'get',
        url: 'geo/v2.0/user-premises/'
      })
      .then(response => {
        commit('setPremiseSearch', response.data.results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    mainapplicationsAction({ commit, state }: { commit: any, state: State }, data: any): void {
      commit('setMainapplicationsLoader', true);
      axios({
        method: 'get',
        url: 'appeals/v1.0/appeals/',
        params: {
          page_size: data.page_size,
          page: data.page,
          search: data.search,
          premise_id: data.premise_id
        }
      })
      .then(response => {
        commit('setMainapplicationsPageInfo', {
          page: response.data.page,
          pageNext: response.data.page_next,
          pagePrevious: response.data.page_previous,
          pages: response.data.pages,
        });
        commit('setMainapplications', response.data.results);
        commit('setMainapplicationsLoader', false);
      })
      .catch(err => {
        commit('setMainapplicationsLoader', false);
      });
    },
    mainapplicationsCreateAction({ commit, state }: { commit: any, state: State }, data: any): void {
      commit('setCanMainapplicationsCreate', false);
      axios({
        method: 'post',
        url: 'appeals/v1.0/appeals/',
        params: {
          premise_id: data.premise_id,
          apartment_id: data.apartment_id,
          applicant: {
            last_name: data.last_name,
            first_name: data.first_name,
            patronymic_name: data.patronymic_name,
            username: data.username,
          },
          description: data.description,
          due_date: data.due_date,
          /* status: "Новая", */
          status_id: 1,
          status: {full_details
            : 
            "Просрочена на 2 дн",
            id
            : 
            1,
            is_red_details
            : 
            true,
            name
            : 
            "Новая",
            short_details
            : 
            "просрочена на 2 дн"}
        }
      })
      .then(response => {
        commit('setCanMainapplicationsCreate', true);
      })
      .catch(err => {
        commit('setErrorMainapplicationsCreate', "Не все поля заполнены");
        commit('setCanMainapplicationsCreate', true);
      });
    },
    premiseMainapplicationsAction({ commit, state }: { commit: any, state: State }, data: any): void {
      axios({
        method: 'get',
        url: 'geo/v2.0/user-premises',
        params: {
          search: data.search
        }
      })
      .then(response => {
        commit('setPremiseMainapplications', response.data.results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    apartmentMainapplicationsAction({ commit, state }: { commit: any, state: State }, data: any): void {
      axios({
        method: 'get',
        url: 'geo/v1.0/apartments',
        params: {
          premise_id: data.premiseId,
          search: ''
        }
      })
      .then(response => {
        commit('setApartmentMainapplications', response.data.results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    mainapplicationsUpdateAction({ commit, state }: { commit: any, state: State }, data: any): void {
      commit('setCanMainapplicationsUpdate', false);
      axios({
        method: 'patch',
        url: 'appeals/v1.0/appeals/' + data.appeal_id + '/',
        params: {
          number: data.number,
          created_at: data.created_at,
          premise_id: data.premise_id,
          apartment_id: data.apartment_id,
          applicant: {
            last_name: data.last_name,
            first_name: data.first_name,
            patronymic_name: data.patronymic_name,
            username: data.username,
          },
          description: data.description,
          due_date: data.due_date,
          status: data.status
        }
      })
      .then(response => {
        commit('setCanMainapplicationsUpdate', false);
      })
      .catch(err => {
        commit('setErrorMainapplicationsUpdate', "Не все поля заполнены");
        commit('setCanMainapplicationsUpdate', false);
      });
    }
  },
  modules: {}
};

export default new Vuex.Store(store);
