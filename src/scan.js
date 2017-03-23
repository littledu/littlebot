exports = module.exports = function onScan(url, code) {
  // if(code === 0){
  //   console.log(`[登录中] 等待扫描`);
  // }else if(code === 201){
  //   console.log(`[登录中] 已扫描，等待确认`);
  // }
  let loginUrl = url.replace('qrcode', 'l');
    require('qrcode-terminal').generate(loginUrl);
    console.log(url);
}