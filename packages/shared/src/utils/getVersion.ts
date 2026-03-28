const getVersion = (version: string) => {
  const [major, minor, patch] = version.split('.').map((el) => parseInt(el))

  return [major, minor, patch]
}

export default getVersion
