const download = (blob: Blob, name: string, ext: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const random = randomNumbers(4).join('')
  a.download = `${name}-${random}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

const randomNumbers = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10))
}

export default download
