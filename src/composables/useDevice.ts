const useDevice = () => {
  const userAgent = navigator.userAgent

  const isWindows = computed(() => {
    return /win/i.test(userAgent)
  })

  const isApple = computed(() => {
    return /mac/i.test(userAgent)
  })

  const isLinux = computed(() => {
    return /linux/i.test(userAgent)
  })

  const isMobile = computed(() => {
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)
  })

  const isDesktop = computed(() => {
    return !isMobile.value
  })

  return {
    isWindows,
    isApple,
    isLinux,
    isMobile,
    isDesktop
  }
}

export default useDevice
