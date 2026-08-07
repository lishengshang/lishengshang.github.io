// 防抖（标准实现：返回函数 + 闭包）
function debounce(func, wait = 300, immediate = false) {
  let timeout = null;
  return function (...args) {
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    }, wait);
    if (callNow) func.apply(this, args);
  };
}

export default debounce;
