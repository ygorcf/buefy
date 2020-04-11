import Loading from './Loading'

import { VueInstance } from '../../utils/config'
import { merge } from '../../utils/helpers'
import { use, registerComponent, registerComponentProgrammatic } from '../../utils/plugins'

let localVueInstance

const LoadingProgrammatic = {
    open(params) {
        const defaultParam = {
            programmatic: true
        }
        const propsData = merge(defaultParam, params)
        const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : localVueInstance || VueInstance
        const LoadingComponent = vm.extend(Loading)
        const component = new LoadingComponent({
            el: document.createElement('div'),
            propsData
        })
        let promise
        if (Promise && typeof Promise !== 'undefined') {
            promise = new Promise((resolve) => {
                component.$on('cancel', (event) => resolve(event))
            })
        }
        return {
            component,
            result: promise
        }
    }
}

const Plugin = {
    install(Vue) {
        localVueInstance = Vue
        registerComponent(Vue, Loading)
        registerComponentProgrammatic(Vue, 'loading', LoadingProgrammatic)
    }
}

use(Plugin)

export default Plugin

export {
    LoadingProgrammatic,
    Loading as BLoading
}
