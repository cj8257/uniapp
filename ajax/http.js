export default ({ name, data = {} }) => {
  /* 导出promise对象 */
  const loading = data.isLoading
  data.isLoading && delete data.isLoading;
  return new Promise((resolve, reject) => {
    !loading && uni.showLoading({
      title: "加载中"
    })
    uniCloud.callFunction({
      name,
      data,
      success ({ result }) {
        if (result.code === 0) {
          resolve(result)
        } else {
           uni.showToast({ icon: "none", title: result.msg })
        }
      },
      fail (err) {
        reject(err)
      },
      complete (res) {
       !loading &&  uni.hideLoading()
      }
    })
  })
}
