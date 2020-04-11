import Dialog from './Dialog'

import { VueInstance } from '../../utils/config'
import { merge } from '../../utils/helpers'
import { use, registerComponent, registerComponentProgrammatic } from '../../utils/plugins'

let localVueInstance

function open(propsData) {
    const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : localVueInstance || VueInstance
    const DialogComponent = vm.extend(Dialog)
    const component = new DialogComponent({
        el: document.createElement('div'),
        propsData
    })
    let promise
    if (Promise && typeof Promise !== 'undefined') {
        promise = new Promise((resolve) => {
            component.$on('confirm', (event) => resolve(event || true))
            component.$on('cancel', () => resolve(false))
        })
    }
    return {
        component,
        result: promise
    }
}

const DialogProgrammatic = {
    alert(params) {
        if (typeof params === 'string') {
            params = {
                message: params
            }
        }
        const defaultParam = {
            canCancel: false
        }
        const propsData = merge(defaultParam, params)
        return open(propsData)
    },
    confirm(params) {
        const defaultParam = {}
        const propsData = merge(defaultParam, params)
        return open(propsData)
    },
    prompt(params) {
        const defaultParam = {
            hasInput: true,
            confirmText: 'Done'
        }
        const propsData = merge(defaultParam, params)
        return open(propsData)
    }
}

const Plugin = {
    install(Vue) {
        localVueInstance = Vue
        registerComponent(Vue, Dialog)
        registerComponentProgrammatic(Vue, 'dialog', DialogProgrammatic)
    }
}

use(Plugin)

export default Plugin

export {
    DialogProgrammatic,
    Dialog as BDialog
}
