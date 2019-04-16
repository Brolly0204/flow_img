window._utils = (() => {
  /**
   * 作用：将类数组转化为数组
   * @param likeAry(类数组)
   * @return 转换后数组
   */
  function likeAryTo(likeAry) {
    try {
      return [].slice.call(likeAry) // Array.from(likeAry)
    } catch (e) {
      let arr = []
      for (let i = 0; i < likeAry.length; i++) {
        arr[arr.length] = likeAry[i]
      }
      return arr
    }
  }

  /**
   * 作用：将json字符串转换为json对象
   * @param data
   * @return JSON对象
   */
  function toJSON(data) {
    return 'JSON' in window ? JSON.parse(data) : eval(`(${data})`)
  }

  /**
   * 作用：获取、设置浏览器窗口的盒模型属性
   * @param attr
   * @param val
   */
  function win(attr, val) {
    if (typeof val === 'undefined') {
      return document.documentElement[attr] || document.body[attr]
    }
    document.documentElement[attr] = document.body[attr] = val
  }

  /**
   * 作用：获取当前元素距离body 左偏移和上偏移
   * @param ele
   * @return {left, top}
   */
  const offset = ele => {
    let left = ele.offsetLeft
    let top = ele.offsetTop
    let parent = ele.offsetParent
    while (parent && parent.nodeName.toLowerCase() !== 'body') {
      left += parent.offsetLeft + parent.clientLeft
      top += parent.offsetTop + parent.clientTop
      parent = parent.offsetParent
    }
    return {
      left,
      top
    }
  }

  // 节流函数
  var throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
  return {
    likeAryTo, // likeAryTo: likeAryTo
    toJSON,
    win,
    offset,
    throttle
  }
})()
