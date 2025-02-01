const download = (blob: Blob, name: string, ext: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const random = Math.random().toString(36).substring(7)
  a.download = `${name}-${random}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

export default download
