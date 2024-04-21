import type { DirectiveBinding } from 'vue'

type ClickOutsideElement = HTMLElement & {
  clickOutsideEvent: (event: MouseEvent) => void
}

const vClickOutside = {
  mounted: function (el: ClickOutsideElement, binding: DirectiveBinding) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target as Node))) {
        // and if it did, call method provided in attribute value
        binding.value(event)
      }
    }

    setTimeout(() => {
      document.body.addEventListener('click', el.clickOutsideEvent)
    })
  },
  unmounted: function (el: ClickOutsideElement) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default vClickOutside
