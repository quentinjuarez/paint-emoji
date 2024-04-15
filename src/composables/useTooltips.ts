import tippy from 'tippy.js'

const useTooltips = () => {
  let tooltips = [] as any[]

  const initializeTooltips = () => {
    // Destroy existing tooltips
    tooltips.forEach((tooltip) => tooltip.destroy())
    tooltips = []

    const tooltipEls = document.querySelectorAll('[data-tooltip]') as NodeListOf<HTMLElement>

    tooltipEls.forEach((tooltipEl) => {
      // @ts-ignore
      const tooltip = tippy(tooltipEl, {
        content(reference) {
          return reference.getAttribute('data-tooltip')
        },
        theme: 'light' // Specify the theme as 'light'
      })

      tooltips.push(tooltip)
    })
  }

  onMounted(() => {
    setTimeout(() => {
      initializeTooltips()
    }, 500)
  })

  onUnmounted(() => {
    tooltips.forEach((tooltip) => tooltip.destroy())
  })

  return {}
}

export default useTooltips
