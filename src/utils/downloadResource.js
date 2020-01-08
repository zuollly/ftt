export default {
  downloadResource(url) {
    const gotolink = document.createElement('a')
    gotolink.setAttribute('target', '_self')
    gotolink.href = url
    document.body.appendChild(gotolink)
    gotolink.click()
    document.body.removeChild(gotolink)
  }
}
