'use strict'

const path = require('path')

const ENV  = require('./env.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * process.env.npm_lifecycle_event：获取命令入参
 */
let npmEvents = process.env.npm_lifecycle_event.split(':');
let envKey = npmEvents[1] ? npmEvents[1] : npmEvents[0];

console.log(process.env.NODE_ENV)
// console.log(process.env)
if (envKey && ENV[envKey]) {
  for (let key in ENV[envKey]) {
    process.env[key] = ENV[envKey][key]
  }
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 8888 npm run dev OR npm run dev --port = 8888
const port = process.env.port || process.env.npm_config_port || 8888 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: process.env.VUE_APP_BASE_PUBLIC_PATH,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,// process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    https: true, // 如果是https接口，需要配置这个参数
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_HOST,
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  css: {
    extract: true
  }
}
