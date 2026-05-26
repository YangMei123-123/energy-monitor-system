import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),

    // ================================================================
    // gzip 压缩：构建后额外生成 .gz 文件
    // 如 main.js (300KB) → main.js.gz (80KB)，Nginx 可直接分发
    // threshold: 大于 1KB 才压缩，跳过小文件
    // ================================================================
    viteCompression({
      algorithm: 'gzip',           // gzip 通用性好；也可改为 'brotli'
      threshold: 1024,             // 仅压缩 > 1KB 的文件
      deleteOriginFile: false      // 保留原始文件，.gz 作为补充
    })
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  server: {
    port: 3000,
    open: true
  },

  // ==================================================================
  // build 生产构建优化
  // ==================================================================
  build: {
    // ---- 目标浏览器 ----
    // es2015 = 原生支持 async/await/箭头函数，打包更小
    target: 'es2015',

    // ---- 静态资源输出 ----
    outDir: 'dist',
    assetsDir: 'assets',

    // ---- chunk 警告阈值 ----
    // 默认 500KB，echarts 按需后仍有 ~250KB，提高避免警告刷屏
    chunkSizeWarningLimit: 500,

    // ---- 生产环境关闭 sourcemap（减体积 + 代码不可逆） ----
    sourcemap: false,

    // ---- CSS 拆分到独立文件（避免 JS 运行时注入样式） ----
    cssCodeSplit: true,

    // ---- 压缩：terser 而非默认 esbuild ----
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // 去掉所有 console.log
        drop_debugger: true   // 去掉 debugger 语句
      }
    },

    // ---- Rollup 配置 ----
    rollupOptions: {
      output: {
        // ----------------------------------------------------------
        // manualChunks：将 node_modules 拆为独立 vendor chunk
        //
        // 核心原则：不变的大依赖独立打包 → 用户浏览器长期缓存
        //          业务代码单独打包 → 更新时只重载业务 chunk
        // ----------------------------------------------------------
        manualChunks: {
          // ① vue 生态   (~150KB gzip) — vue 极少升级，命中率最高
          'vendor-vue': ['vue', 'vue-echarts'],

          // ② vue-router (~30KB gzip)  — 独立拆分，并行下载
          'vendor-router': ['vue-router'],

          // ③ echarts    (~250KB gzip) — 体积最大，与业务逻辑解耦
          'vendor-echarts': ['echarts']
        },

        // ---- 文件命名：带内容哈希 → 内容不变则文件名不变 → 缓存 ----
        chunkFileNames:  'js/[name]-[hash:8].js',
        entryFileNames:  'js/[name]-[hash:8].js',
        assetFileNames:  'assets/[name]-[hash:8][extname]'
      }
    }
  }
})
