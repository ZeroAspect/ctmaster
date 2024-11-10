async function GetIPFunction(){
  const url = "http://ip-api.com/json/"
  try{
    const require = await fetch(url)
    const data = await require.json()
    return data
  } catch(error){
    console.error(error)
    return null
  }
}

async function GetGeolocationFunction(ip){
  const url = `https://ipapi.co/${ip}/json/`
  try{
    const require = await fetch(url)
    const data = await require.json()
    return data
  } catch(error){
    console.error(error)
    return null
  }
}

module.exports = {
  GetIPFunction,
  GetGeolocationFunction
}