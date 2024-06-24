export const generateRandomString = (length: number = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const detectDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    // 移动设备
    if (userAgent.match(/iPad/i) || userAgent.match(/tablet/i)) {
      // iPad 或其他平板设备
      return 'pad'
    } else {
      // 手机设备
      return 'mobile'
    }
  } else {
    // 非移动设备，视为PC
    return 'desktop'
  }
}