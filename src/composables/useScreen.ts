const useScreen = () => {
  const store = useStore()
  const { screenWidth, screenHeight } = storeToRefs(store)

  function handleResize() {
    // FULL SCREEN
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)

    screenWidth.value = document.documentElement.clientWidth
    screenHeight.value = document.documentElement.clientHeight
  }

  const isMobile = computed(() => {
    return screenWidth.value < 768
  })

  const isTablet = computed(() => {
    return screenWidth.value >= 768 && screenWidth.value < 1024
  })

  const isLaptop = computed(() => {
    return screenWidth.value >= 1024 && screenWidth.value < 1280
  })

  const isDesktop = computed(() => {
    return screenWidth.value >= 1280
  })

  const isMedium = computed(() => {
    return isTablet.value || isLaptop.value || isDesktop.value
  })

  const isLarge = computed(() => {
    return isLaptop.value || isDesktop.value
  })

  const isExtraLarge = computed(() => {
    return isDesktop.value
  })

  return {
    screenHeight,
    screenWidth,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isMedium,
    isLarge,
    isExtraLarge,
    handleResize
  }
}

export default useScreen
