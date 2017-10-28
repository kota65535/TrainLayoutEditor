import Vue from 'vue'
import Router, {RouterOptions} from 'vue-router'
import EditorView from 'src/components/EditorView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: EditorView
    }
  ]
} as RouterOptions)
