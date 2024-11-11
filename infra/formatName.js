function formatName(nome){
  const formatNome = nome.replace(' ', '')
  const removeUpperValues = formatNome.toLowerCase()

  return removeUpperValues
}

module.exports = formatName