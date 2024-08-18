/**
 * 生成指定长度的随机字符串
 *
 * @param length 字符串的长度，默认为16
 * @returns 生成的随机字符串
 */
export const generateRandomString = (length: number = 16): string => {
  // 定义包含所有可能字符的字符串
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // 初始化结果字符串为空
  let result: string = '';
  // 循环生成指定长度的字符串
  for (let i: number = 0; i < length; i++) {
    // 随机选择一个字符并添加到结果字符串中
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // 返回生成的随机字符串
  return result;
}


/**
 * 检测设备类型
 * 根据用户代理（userAgent）判断当前设备是PC、移动设备还是其他
 *
 * @returns 返回设备类型字符串，可能值为'desktop'、'mobile'或'pad'
 */
export const detectDeviceType = (): string => {
  // 获取用户代理字符串
  const userAgent: string = navigator.userAgent;

  // 测试用户代理字符串是否包含移动设备的关键字
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    // 如果是移动设备
    if (userAgent.match(/iPad/i) || userAgent.match(/tablet/i)) {
      // 如果是iPad或其他平板设备
      return 'pad'
    } else {
      // 如果是手机设备
      return 'mobile'
    }
  } else {
    // 如果不是移动设备，则认为是PC
    return 'desktop'
  }
}



/**
 * 创建一个等待指定毫秒数的Promise对象
 *
 * @param ms - 延迟的毫秒数，用于控制异步操作的等待时间
 * @returns 返回一个Promise对象，该对象在指定的毫秒数后自动解析
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 异步等待直到条件满足或超过最大等待时间。
 *
 * @param waitCondition - 等待条件函数，返回布尔值，用于判断是否继续等待。
 * @param ms - 每次等待的间隔时间（毫秒），默认为10毫秒。
 * @param maxMs - 最大等待时间（毫秒），默认为0表示无限等待。
 */
export const waitFor = async (waitCondition: () => boolean, ms: number = 10, maxMs: number = 0) => {
  let idx = 0;
  while (waitCondition() && (maxMs === 0 || idx * ms < maxMs)) {
    maxMs && idx++;
    await wait(ms);
  }
};