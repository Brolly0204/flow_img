~(function() {
  const { win, offset, throttle } = window._utils
  const photoImg = document.getElementById('photoImg')
  const imgCols = photoImg.getElementsByTagName('li')
  const imgAll = photoImg.getElementsByTagName('img')

  // 获取数据
  function getImgData() {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', './data.json', true)

    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
        const result = _utils.toJSON(this.responseText)
        render(result)
        lazyLoad()
      }
    }
    xhr.send()
  }

  // 数据渲染
  function render(data) {
    data.forEach(item => {
      const html = htmlStr(item)
      const col = compareCols()
      col.innerHTML += html
    })
  }

  // 得到当前列中高度小的那个
  function compareCols() {
    const cols = Array.from(imgCols)
    cols.sort((a, b) => {
      return a.clientHeight - b.clientHeight
    })
    return cols[0]
  }

  // 生成html模板
  function htmlStr(item) {
    const {
      id,
      link,
      src,
      title,
      height
    } = item

    return `
      <a href="${link}" img-id="${id}">
        <img
          img-src="${src}"
          src="./images/load.gif"
          alt="${title}"
          height="${height}"
        />
        <p class="title">${title}</p>
      </a>
    `
  }

  function loadMore() {
    const scrollHeight = win('scrollHeight')
    const scrollTop = win('scrollTop')
    const clientHeight = win('clientHeight')
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // console.log('到达底部了')
      getImgData()
    }
  }

  function lazyLoad() {
    for (let i = 0; i < imgAll.length; i++) {
      const img = imgAll[i]
      
      if (img.loaded) continue;

      const imgSrc = img.getAttribute('img-src')
      const clientHeight = win('clientHeight')
      const offsetHeight = img.offsetHeight
      const scrollTop = win('scrollTop')
      const { top } = offset(img)

      if (clientHeight + scrollTop >= top + offsetHeight/3) {
        let tempImg = new Image()
        tempImg.src = imgSrc
        tempImg.onload = function() {
          // console.log('load')
          img.src = imgSrc
          img.loaded = true
          tempImg = null
        }
      }
    }
  }

  getImgData() // 获取初始数据 
  lazyLoad() // 首次懒加载


  // window.onscroll = function () {
  //   console.log('sroll')

  //   loadMore()
  //   lazyLoad()
  // }

  // 函数节流
  window.onscroll = throttle(function () {
    loadMore()
    lazyLoad()
  }, 300)
})()
