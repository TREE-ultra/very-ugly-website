/* ============================================================================
   中国废弃物循环利用股份有限公司 · 全站共享外壳脚本（第 1025 版）
   ----------------------------------------------------------------------------
   本文件负责把每一页都缺不了的丑东西注入进去：
   顶部双跑马灯、页头、导航、左右栏、页脚、弹窗、浮动广告、返回顶部。
   同时负责：时钟、访客计数、投票、伪造二维码、假音乐、假搜索、鼠标拖尾、
   极端丑陋模式开关等全站交互。页面本身只需要写 <main> 里的内容。
   ============================================================================ */
(function () {
  'use strict';

  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  var LS = window.localStorage;

  /* ---------------------------------------------------------------- 小工具 */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rand(n) { return Math.floor(Math.random() * n); }
  function pad(n, len) { var s = String(n); while (s.length < len) { s = '0' + s; } return s; }
  function store(key, val) {
    try { if (val === undefined) { return LS.getItem(key); } LS.setItem(key, val); } catch (e) {}
    return null;
  }

  function toast(msg, ms) {
    var el = $('#ugly-toast');
    if (!el) { return; }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('show'); }, ms || 2800);
  }
  window.Ugly = {
    toast: toast,
    /** 页面可以用来生成一个更丑的随机数 */
    rand: rand,
    store: store
  };

  /* ------------------------------------------------------------ 导航配置 */
  var NAV = [
    ['index', '首 页', 'index.html', false],
    ['about', '公司简介', 'about.html', false],
    ['honors', '资质荣誉', 'honors.html', true],
    ['products', '产品中心', 'products.html', false],
    ['news', '新闻中心', 'news.html', false],
    ['jobs', '人才招聘', 'jobs.html', true],
    ['feedback', '在线反馈', 'feedback.html', false],
    ['contact', '联系我们', 'contact.html', false]
  ];

  /* 子页面归属哪个导航项 */
  var NAV_PARENT = {
    'index': 'index',
    'about': 'about',
    'honors': 'honors',
    'products': 'products',
    'product-detail': 'products',
    'news': 'news',
    'news-detail': 'news',
    'jobs': 'jobs',
    'feedback': 'feedback',
    'guestbook': 'feedback',
    'faq': '',
    'contact': 'contact',
    'vip': '',
    'sitemap': '',
    '404': ''
  };

  /* ------------------------------------------------------------ 页面归属 */
  function pageName() {
    if (page) { return page; }
    var f = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/i, '');
    return f || 'index';
  }
  var PAGE = pageName();
  var ACTIVE = NAV_PARENT[PAGE] !== undefined ? NAV_PARENT[PAGE] : '';

  /* ---------------------------------------------------------------- 顶部 */
  function shellTop() {
    var links = NAV.map(function (n) {
      var cls = 'data-nav="' + n[0] + '"';
      var active = (ACTIVE === n[0]) ? ' class="active"' : '';
      var label = n[1];
      if (n[2] === 'honors.html') { label += '<i class="nav-new">新</i>'; }
      return '<a href="' + n[2] + '" ' + cls + active + '>' + label + '</a>';
    }).join('');

    return '' +
      '<div class="loadbar" aria-hidden="true"><i></i></div>' +
      '<div class="ticker">' +
        '<marquee scrollamount="12" behavior="scroll">' +
          '★ <b>最新公告</b>：本站已完成第 1025 次改版，新增 14 个页面，评审团一致认为“更丑了，也更全了” ★ ' +
          '本站正在施工，请勿靠近 ★ 建议使用 800×600 分辨率浏览 ★ 欢迎投诉，投诉入口已坏 ★ ' +
          '全站圆角数量：<b>0</b> 个 ★ 页面由上万个长方形焊接而成 ★' +
        '</marquee>' +
      '</div>' +
      '<div class="ticker alt">' +
        '<marquee direction="right" scrollamount="6" behavior="scroll">' +
          '◆ 本站已通过 ISO 0 质量管理体系认证 ◆ 所有内容纯属虚构，如有雷同，说明您的网站也该重做了 ◆ ' +
          '本站不支持手机浏览，但您已经在看了 ◆ 鼠标会掉星星，别慌 ◆' +
        '</marquee>' +
      '</div>' +
      '<header class="masthead">' +
        '<div class="brandmark">' +
          '<svg viewBox="0 0 100 100" role="img" aria-label="更加丑陋的企业标志">' +
            '<rect x="0" y="0" width="100" height="100" fill="#000"/>' +
            '<polygon points="0,0 62,0 62,26 26,26 26,100 0,100" fill="#00ff00"/>' +
            '<polygon points="38,0 100,0 100,100 74,100 74,38 38,38" fill="#ff00ff"/>' +
            '<rect x="30" y="30" width="40" height="40" fill="#ffff00" stroke="#000" stroke-width="4"/>' +
            '<rect x="38" y="38" width="24" height="24" fill="#00ffff" stroke="#000" stroke-width="3"/>' +
            '<rect x="45" y="45" width="10" height="10" fill="#ff0000" stroke="#000" stroke-width="2"/>' +
            '<polygon points="0,0 100,0 100,8 8,8 8,100 0,100" fill="#00bfff"/>' +
            '<polygon points="0,100 100,100 100,92 8,92 8,0 0,0" fill="#ff8c00"/>' +
            '<rect x="0" y="0" width="100" height="100" fill="none" stroke="#000" stroke-width="6"/>' +
          '</svg>' +
        '</div>' +
        '<div class="headline">' +
          '<div class="kicker">中华人民共和国 · 极端丑陋示范企业 · 第 1025 版 · 共 15 个页面</div>' +
          '<h1>中国废弃物<br>循环利用股份有限公司</h1>' +
          '<div class="sub">官方唯一指定网站 · 已连续 9999 天没有圆角 · <span class="blinker">丑到服务器都认识您</span></div>' +
        '</div>' +
        '<div class="stamp">' +
          '<div class="stamp-big">S 级</div>' +
          '<div>官方认证丑陋</div>' +
          '<div class="stamp-line">编号 000-1 · 有效期 1 天</div>' +
        '</div>' +
      '</header>' +
      '<nav class="nav" aria-label="主导航">' + links + '</nav>';
  }

  /* ---------------------------------------------------------------- 左栏 */
  function shellLeft() {
    return '' +
      '<aside class="rail left" aria-label="左侧栏">' +
        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 站内导航</span><span>15 页</span></div>' +
          '<div class="wbody" style="padding:0;">' +
            '<ul class="menu">' +
              '<li><a href="index.html">首页（您可能在这）</a></li>' +
              '<li><a href="about.html">公司简介</a></li>' +
              '<li><a href="honors.html">资质荣誉</a></li>' +
              '<li><a href="products.html">产品中心</a></li>' +
              '<li><a href="news.html">新闻中心</a></li>' +
              '<li><a href="jobs.html">人才招聘</a></li>' +
              '<li><a href="feedback.html">在线反馈</a></li>' +
              '<li><a href="guestbook.html">留言板</a></li>' +
              '<li><a href="faq.html">常见问题</a></li>' +
              '<li><a href="vip.html">会员充值</a></li>' +
              '<li><a href="contact.html">联系我们</a></li>' +
              '<li><a href="sitemap.html">网站地图</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>▲ 全站搜索</span><span>?</span></div>' +
          '<div class="wbody">' +
            '<form class="searchbar" id="ugly-search" role="search">' +
              '<input type="text" name="q" placeholder="搜索任何东西（都会失败）" aria-label="搜索关键词">' +
              '<button type="submit">搜</button>' +
            '</form>' +
            '<p class="mini">搜索服务器正在维修，预计 2099 年 12 月修好。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>▲ 施工状态</span><span>!</span></div>' +
          '<div class="wbody" style="padding:0;">' +
            '<div class="hazard"><span>施工中 · 请勿靠近</span></div>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 本站数据</span><span>?</span></div>' +
          '<div class="wbody">' +
            '<div class="counter" id="ugly-visits">000000</div>' +
            '<p class="online" style="margin-top:6px;"><i class="status-dot"></i> 当前在线：<b id="ugly-online">88</b> 人（含 87 个机器人）</p>' +
            '<p class="mini">以上数据每分钟随机变化，纯属虚构，如有雷同，纯属胡编。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 本站够丑吗</span><span>投票</span></div>' +
          '<div class="wbody" style="padding:6px;">' +
            '<button class="poll-opt" type="button" data-poll="0">够丑，眼睛已受伤（1288 票）</button>' +
            '<button class="poll-opt" type="button" data-poll="1">不够丑，请继续努力（777 票）</button>' +
            '<button class="poll-opt" type="button" data-poll="2">我已经看不出区别了（9999 票）</button>' +
            '<p class="mini" style="margin-top:6px;" id="ugly-poll-msg">投票结果不公开，因为统计系统也坏了。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 极端模式</span><span>!</span></div>' +
          '<div class="wbody">' +
            '<button class="btn danger wide" type="button" id="ugly-max">还能更丑 →</button>' +
            '<p class="mini" style="margin-top:6px;">开启后全站变本加厉，并记在您的浏览器里，走到哪丑到哪。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 广告位招租</span><span>$</span></div>' +
          '<div class="wbody" style="padding:6px;">' +
            '<a href="vip.html" style="text-decoration:none;">' +
              '<div class="rent">此处为 6cm × 6cm 广告位<br>月租 0.01 元<br>（已经空了 40 年）</div>' +
            '</a>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 官方认证</span><span>√</span></div>' +
          '<div class="wbody">' +
            '<p class="mini" style="background:#000;color:#00ff00;">本站已通过：<br>ISO 0 质量管理体系认证<br>W3C 丑网页标准认证（假的）<br>360 安全检测（未通过）</p>' +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  /* ---------------------------------------------------------------- 右栏 */
  function shellRight() {
    return '' +
      '<aside class="rail right" aria-label="右侧栏">' +
        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 快捷服务</span><span>☆</span></div>' +
          '<div class="wbody" style="padding:0;">' +
            '<ul class="menu">' +
              '<li><a href="feedback.html">我要投诉（投诉无效）</a></li>' +
              '<li><a href="guestbook.html">留言板（不回复）</a></li>' +
              '<li><a href="faq.html">常见问题（没有答案）</a></li>' +
              '<li><a href="sitemap.html">网站地图（可能会迷路）</a></li>' +
              '<li><a href="vip.html">充值中心（充了也白充）</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 在线客服</span><span>●</span></div>' +
          '<div class="wbody">' +
            '<div class="online" style="background:#ffffe0;color:#000;border-color:#000;">' +
              '<i class="status-dot" style="background:#00cc00;"></i> 客服小美 · 在线' +
            '</div>' +
            '<button class="btn primary wide" type="button" id="ugly-service" style="margin-top:6px;">点击咨询</button>' +
            '<p class="mini" style="margin-top:6px;">客服在线时间：每天 03:00–03:01，节假日更短。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 北京时间</span><span>◎</span></div>' +
          '<div class="wbody">' +
            '<div class="clock js-clock">正在对时……</div>' +
            '<p class="mini" style="margin-top:6px;">时间可能不准，但态度很准。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 扫码访问</span><span>▪</span></div>' +
          '<div class="wbody">' +
            '<div class="qr" id="ugly-qr" aria-label="一个无法扫描的二维码"></div>' +
            '<p class="mini" style="margin-top:6px;background:#00ffff;">扫了也扫不出来，这是设计的一部分。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 站内音乐</span><span>♫</span></div>' +
          '<div class="wbody">' +
            '<div class="track" id="ugly-track">正在播放：《卡农（接线故障版）》</div>' +
            '<div class="fakebar" style="margin-top:6px;"><i id="ugly-playbar" style="width:66%;"></i></div>' +
            '<div class="row" style="margin-top:6px;">' +
              '<button class="btn" type="button" id="ugly-play" style="border-width:3px;padding:4px 6px;font-size:13px;">暂停</button>' +
              '<button class="btn" type="button" id="ugly-next" style="border-width:3px;padding:4px 6px;font-size:13px;">下一首</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 热门文章</span><span>热</span></div>' +
          '<div class="wbody" style="padding:0;">' +
            '<ul class="menu">' +
              '<li><a href="news-detail.html">本站第 1025 次改版说明</a></li>' +
              '<li><a href="news-detail.html">关于圆角，我们绝不妥协</a></li>' +
              '<li><a href="faq.html">为什么网站会这么丑？</a></li>' +
              '<li><a href="product-detail.html">高性能直角发生器测评</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 免责声明</span><span>!</span></div>' +
          '<div class="wbody">' +
            '<p class="mini" style="background:#ff0000;color:#ffff00;">本站所有内容（含错别字）均为虚构，仅用于演示“丑陋设计”，不构成任何建议，如造成视觉损伤请自行就医。</p>' +
          '</div>' +
        '</div>' +

        '<div class="widget">' +
          '<div class="wtitle"><span>◆ 广告位招租</span><span>$</span></div>' +
          '<div class="wbody" style="padding:6px;">' +
            '<div class="rent" style="height:96px;">此处为 3cm × 9cm 广告位<br>月租 0.02 元<br>（比左边贵）</div>' +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  /* ---------------------------------------------------------------- 页脚 */
  function shellFooter() {
    return '' +
      '<footer class="footer">' +
        '<div class="footgrid">' +
          '<div class="fcol">' +
            '<h4>联系我们</h4>' +
            '<p>地址：某省某市某区某路 1 号（不确定）</p>' +
            '<p>电话：400-000-0000（空号）</p>' +
            '<p>传真：没有，我们讨厌纸</p>' +
            '<p>邮箱：<a href="contact.html">ugly@example.invalid</a></p>' +
            '<p>邮编：000000</p>' +
          '</div>' +
          '<div class="fcol">' +
            '<h4>快速入口</h4>' +
            '<p><a href="about.html">公司简介</a> · <a href="honors.html">资质荣誉</a></p>' +
            '<p><a href="products.html">产品中心</a> · <a href="news.html">新闻中心</a></p>' +
            '<p><a href="jobs.html">人才招聘</a> · <a href="feedback.html">在线反馈</a></p>' +
            '<p><a href="guestbook.html">留言板</a> · <a href="faq.html">常见问题</a></p>' +
            '<p><a href="vip.html">会员充值</a> · <a href="sitemap.html">网站地图</a></p>' +
          '</div>' +
          '<div class="fcol">' +
            '<h4>友情提示</h4>' +
            '<p>本站所有内容均为演示，如有雷同，说明您的网站也该重做了。</p>' +
            '<p>本站不使用 Cookie，因为饼干有圆角。</p>' +
            '<p>本站已通过 ISO 0 质量管理体系认证。</p>' +
            '<p>本页浏览：<b id="ugly-pageviews">1</b> 次（假的）。</p>' +
          '</div>' +
          '<div class="fcol">' +
            '<h4>技术支持</h4>' +
            '<p>由 1024 个长方形手工焊接而成。</p>' +
            '<p>圆角数量：<b style="color:#ffff00;">0</b> · 直角数量：<b style="color:#00ff00;">100%</b></p>' +
            '<p>Powered by 直角引擎 v1.0（已停止维护）</p>' +
            '<p><button class="btn" type="button" id="ugly-top2" style="width:100%;border-width:4px;padding:4px;">回到顶部 ↑</button></p>' +
          '</div>' +
        '</div>' +
        '<div class="copyright">' +
          '© 1984–2026 <b>中国废弃物循环利用股份有限公司</b> · 保留所有不圆角的权利 · ' +
          '本页面丑得合法合规 · 备案号：丑 ICP 备 0000000 号 · ' +
          '<a href="404.html">隐私政策</a> · <a href="404.html">用户协议</a>' +
        '</div>' +
        '<div class="ticker" style="border-bottom:0;">' +
          '<marquee scrollamount="14" behavior="alternate">' +
            '★ 感谢您的耐心浏览 ★ 如果眼睛不舒服，请立即关闭此页面 ★ 本站会一直丑下去 ★ 共 15 个页面，总有一页能伤到您 ★' +
          '</marquee>' +
        '</div>' +
      '</footer>';
  }

  /* ------------------------------------------------------- 浮层 / 全局部件 */
  function shellFloats() {
    return '' +
      '<div class="popup" id="ugly-popup" role="dialog" aria-label="广告弹窗">' +
        '<div class="ptitle"><span>☆ 系统通知 ☆</span>' +
          '<button type="button" id="ugly-popup-x" aria-label="关闭">×</button></div>' +
        '<div class="pbody">' +
          '<p>恭喜您！您已成为本站第 <b id="ugly-popup-num">1025</b> 位访客。</p>' +
          '<p style="margin-top:6px;">为感谢您的忍耐，特赠您一张巨额优惠券：</p>' +
          '<div class="money">¥1024.00</div>' +
          '<p style="margin-top:6px;">（不可叠加、不可兑现、不可使用）</p>' +
        '</div>' +
        '<div class="pfoot">' +
          '<a class="btn danger" href="vip.html">立即领取</a>' +
          '<button class="btn" type="button" id="ugly-popup-no">残忍拒绝</button>' +
        '</div>' +
      '</div>' +
      '<a class="float-ad" href="vip.html" aria-label="浮动广告">' +
        '<span>领 1024</span><span style="font-size:11px;">元优惠券</span><small>点击即同意一切</small>' +
      '</a>' +
      '<button class="totop" type="button" id="ugly-top" aria-label="返回顶部">回到<br>顶部 ↑</button>' +
      '<div class="toast" id="ugly-toast" role="status" aria-live="polite"></div>';
  }

  /* ---------------------------------------------------------------- 注入 */
  function mount() {
    var top = $('#shell-top');
    var left = $('#shell-left');
    var right = $('#shell-right');
    var foot = $('#shell-footer');
    if (top) { top.innerHTML = shellTop(); }
    if (left) { left.innerHTML = shellLeft(); }
    if (right) { right.innerHTML = shellRight(); }
    if (foot) { foot.innerHTML = shellFooter() + shellFloats(); }
    else {
      // 万一页面忘了放 #shell-footer，也不能没有弹窗
      var wrap = document.createElement('div');
      wrap.innerHTML = shellFloats();
      body.appendChild(wrap);
    }
  }

  /* ------------------------------------------------------------ 初始化 */
  function initCommon() {
    /* 时钟 */
    function tick() {
      var d = new Date();
      var wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
      var txt = d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2) +
        ' 星期' + wd + ' ' + pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2) + ':' +
        pad(d.getSeconds(), 2) + '.' + d.getMilliseconds();
      $$('.js-clock').forEach(function (el) { el.textContent = txt; });
    }
    tick();
    setInterval(tick, 233);

    /* 访客计数（本地存，越刷越多） */
    var visits = parseInt(store('ugly_visits') || '0', 10) + 1;
    store('ugly_visits', String(visits));
    var visitsText = pad(visits, 7);
    var vEl = $('#ugly-visits');
    if (vEl) { vEl.textContent = visitsText; }
    var pn = $('#ugly-popup-num');
    if (pn) { pn.textContent = String(1000 + visits); }
    var pv = $('#ugly-pageviews');
    if (pv) { pv.textContent = String(77 + ((visits * 37) % 9000)); }

    /* 在线人数 */
    var online = 66 + rand(60);
    function onlineTick() {
      online += rand(9) - 4;
      if (online < 12) { online = 12; }
      var el = $('#ugly-online');
      if (el) { el.textContent = String(online); }
    }
    onlineTick();
    setInterval(onlineTick, 4300);

    /* 伪造二维码 */
    var qr = $('#ugly-qr');
    if (qr) {
      for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
          var cell = document.createElement('i');
          var finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
          cell.className = (finder || ((x * 7 + y * 13) % 5 !== 0)) ? 'on' : 'off';
          qr.appendChild(cell);
        }
      }
    }

    /* 投票 */
    var voted = store('ugly_voted');
    if (voted !== null) {
      var pm = $('#ugly-poll-msg');
      if (pm) { pm.textContent = '您已经投过票了（选项 ' + (parseInt(voted, 10) + 1) + '），结果已作废。'; }
    }
    $$('.poll-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.getAttribute('data-poll');
        store('ugly_voted', idx);
        var pm = $('#ugly-poll-msg');
        if (pm) { pm.textContent = '投票成功！系统认为您投的选项不够丑，已作废。'; }
        toast('投票成功，但不算数。');
      });
    });

    /* 极端模式 */
    var maxBtn = $('#ugly-max');
    function applyMax() {
      var on = body.classList.contains('max-ugly');
      if (maxBtn) { maxBtn.textContent = on ? '已经丑到极限（点我恢复）' : '还能更丑 →'; }
    }
    if (store('ugly_max') === '1') { body.classList.add('max-ugly'); }
    applyMax();
    if (maxBtn) {
      maxBtn.addEventListener('click', function () {
        body.classList.toggle('max-ugly');
        var on = body.classList.contains('max-ugly');
        store('ugly_max', on ? '1' : '0');
        applyMax();
        toast(on ? '已开启极端丑陋模式，后果自负。' : '已恢复为普通丑陋模式。');
      });
    }

    /* 搜索（永远失败） */
    var search = $('#ugly-search');
    if (search) {
      search.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = (search.querySelector('input') || {}).value || '';
        toast('搜索“' + (q || '空') + '”失败：服务器说这个词太丑，拒绝收录。');
      });
    }

    /* 客服 */
    var svc = $('#ugly-service');
    if (svc) {
      svc.addEventListener('click', function () {
        toast('转接中……客服小美已下班，请明天 03:00 再来。');
      });
    }

    /* 假音乐 */
    var playBtn = $('#ugly-play');
    var bar = $('#ugly-playbar');
    var trk = $('#ugly-track');
    var playing = false;
    var width = 66;
    var playTimer = null;
    var songs = ['《卡农（接线故障版）》', '《致爱丽丝（电流声版）》', '《新闻联播片头（卡带版）》', '《生日快乐（版权未到期版）》'];
    var si = 0;
    if (playBtn && bar) {
      playBtn.addEventListener('click', function () {
        playing = !playing;
        playBtn.textContent = playing ? '暂停' : '播放';
        if (playing) {
          playTimer = setInterval(function () {
            width = (width + 1) % 101;
            bar.style.width = width + '%';
          }, 180);
        } else if (playTimer) {
          clearInterval(playTimer);
          playTimer = null;
        }
      });
    }
    var nextBtn = $('#ugly-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        si = (si + 1) % songs.length;
        if (trk) { trk.textContent = '正在播放：' + songs[si]; }
        toast('已切换到下一首（播放器坏了，没有声音）。');
      });
    }

    /* 弹窗广告 */
    var popup = $('#ugly-popup');
    var popTimer = null;
    function showPopup() {
      if (popup) { popup.classList.add('show'); }
    }
    if (popup) {
      setTimeout(showPopup, 1600);
      var closeX = $('#ugly-popup-x');
      if (closeX) {
        closeX.addEventListener('click', function () {
          popup.classList.remove('show');
          toast('关闭无效，广告将在 45 秒后回来。');
          clearTimeout(popTimer);
          popTimer = setTimeout(showPopup, 45000);
        });
      }
      var noBtn = $('#ugly-popup-no');
      if (noBtn) {
        noBtn.addEventListener('click', function () {
          popup.classList.remove('show');
          toast('拒绝成功！但优惠券已自动发放到您不存在的账户。');
          clearTimeout(popTimer);
          popTimer = setTimeout(showPopup, 45000);
        });
      }
    }

    /* 回到顶部 */
    function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    var topBtn = $('#ugly-top');
    var top2 = $('#ugly-top2');
    if (topBtn) { topBtn.addEventListener('click', scrollTop); }
    if (top2) { top2.addEventListener('click', scrollTop); }

    /* 鼠标拖尾星星 */
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      var chars = ['★', '☆', '◆', '■', '▲', '●', '✿'];
      var colors = ['#ff00ff', '#00ff00', '#ffff00', '#00ffff', '#ff0000'];
      var last = 0;
      document.addEventListener('mousemove', function (e) {
        var now = Date.now();
        if (now - last < 45) { return; }
        last = now;
        var s = document.createElement('span');
        s.className = 'trail-star';
        s.textContent = chars[rand(chars.length)];
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        s.style.color = colors[rand(colors.length)];
        s.style.fontSize = (12 + rand(12)) + 'px';
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 720);
      }, { passive: true });
    }

    /* 键盘彩蛋：按 U 切换极端模式 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'u' || e.key === 'U') {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) { return; }
        body.classList.toggle('max-ugly');
        store('ugly_max', body.classList.contains('max-ugly') ? '1' : '0');
        applyMax();
        toast('快捷键 U：极端模式已切换。');
      }
    });
  }

  /* ---------------------------------------------------------------- 启动 */
  mount();
  try {
    initCommon();
  } catch (e) {
    // 再丑的网站也不能白屏
    if (window.console) { console.error('[丑站外壳] 出错了：', e); }
  }
})();
