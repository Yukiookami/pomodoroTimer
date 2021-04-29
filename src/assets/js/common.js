/**
 * @param {Number} num 输入数字
 * @param {Number} n 需要补齐的位数
 * 自动补位
*/
export let PrefixInteger = (num, n) => {
  return (Array(n).join(0) + num).slice(-n)
}

/**
 * @param {Number} num 输入数字
 * @param {Number} decimal 保留位数
 * 保留小数不四舍五入
*/
export let formatDecimal = (num, decimal) => {
  num = num.toString()
  let index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

