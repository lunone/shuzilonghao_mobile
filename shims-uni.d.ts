/// <reference types='@dcloudio/types' />
import 'vue'

declare const API_BASE_URL: string;

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {

  }
}
