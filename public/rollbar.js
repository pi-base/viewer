var _rollbarConfig = {
  accessToken: "1d48576f7fa242babd4f366dda8e57b5",
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: "production"
  }
};
// Rollbar Snippet
! function(r) {
  function e(n) {
    if (o[n]) return o[n].exports;
    var t = o[n] = {
      exports: {},
      id: n,
      loaded: !1
    };
    return r[n].call(t.exports, t, t.exports, e), t.loaded = !0, t.exports
  }
  var o = {};
  return e.m = r, e.c = o, e.p = "", e(0)
}([function(r, e, o) {
  "use strict";
  var n = o(1).Rollbar,
    t = o(2);
  _rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || "https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/1.9.3/rollbar.min.js";
  var a = n.init(window, _rollbarConfig),
    i = t(a, _rollbarConfig);
  a.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, i)
}, function(r, e) {
  "use strict";

  function o(r) {
    return function() {
      try {
        return r.apply(this, arguments)
      } catch (r) {
        try {
          console.error("[Rollbar]: Internal error", r)
        } catch (r) {}
      }
    }
  }

  function n(r, e, o) {
    window._rollbarWrappedError && (o[4] || (o[4] = window._rollbarWrappedError), o[5] || (o[5] = window._rollbarWrappedError._rollbarContext), window._rollbarWrappedError = null), r.uncaughtError.apply(r, o), e && e.apply(window, o)
  }

  function t(r) {
    var e = function() {
      var e = Array.prototype.slice.call(arguments, 0);
      n(r, r._rollbarOldOnError, e)
    };
    return e.belongsToShim = !0, e
  }

  function a(r) {
    this.shimId = ++c, this.notifier = null, this.parentShim = r, this._rollbarOldOnError = null
  }

  function i(r) {
    var e = a;
    return o(function() {
      if (this.notifier) return this.notifier[r].apply(this.notifier, arguments);
      var o = this,
        n = "scope" === r;
      n && (o = new e(this));
      var t = Array.prototype.slice.call(arguments, 0),
        a = {
          shim: o,
          method: r,
          args: t,
          ts: new Date
        };
      return window._rollbarShimQueue.push(a), n ? o : void 0
    })
  }

  function l(r, e) {
    if (e.hasOwnProperty && e.hasOwnProperty("addEventListener")) {
      var o = e.addEventListener;
      e.addEventListener = function(e, n, t) {
        o.call(this, e, r.wrap(n), t)
      };
      var n = e.removeEventListener;
      e.removeEventListener = function(r, e, o) {
        n.call(this, r, e && e._wrapped ? e._wrapped : e, o)
      }
    }
  }
  var c = 0;
  a.init = function(r, e) {
    var n = e.globalAlias || "Rollbar";
    if ("object" == typeof r[n]) return r[n];
    r._rollbarShimQueue = [], r._rollbarWrappedError = null, e = e || {};
    var i = new a;
    return o(function() {
      if (i.configure(e), e.captureUncaught) {
        i._rollbarOldOnError = r.onerror, r.onerror = t(i);
        var o, a, c = "EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");
        for (o = 0; o < c.length; ++o) a = c[o], r[a] && r[a].prototype && l(i, r[a].prototype)
      }
      return e.captureUnhandledRejections && (i._unhandledRejectionHandler = function(r) {
        var e = r.reason,
          o = r.promise,
          n = r.detail;
        !e && n && (e = n.reason, o = n.promise), i.unhandledRejection(e, o)
      }, r.addEventListener("unhandledrejection", i._unhandledRejectionHandler)), r[n] = i, i
    })()
  }, a.prototype.loadFull = function(r, e, n, t, a) {
    var i = function() {
        var e;
        if (void 0 === r._rollbarPayloadQueue) {
          var o, n, t, i;
          for (e = new Error("rollbar.js did not load"); o = r._rollbarShimQueue.shift();)
            for (t = o.args, i = 0; i < t.length; ++i)
              if (n = t[i], "function" == typeof n) {
                n(e);
                break
              }
        }
        "function" == typeof a && a(e)
      },
      l = !1,
      c = e.createElement("script"),
      p = e.getElementsByTagName("script")[0],
      s = p.parentNode;
    c.crossOrigin = "", c.src = t.rollbarJsUrl, c.async = !n, c.onload = c.onreadystatechange = o(function() {
      if (!(l || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState)) {
        c.onload = c.onreadystatechange = null;
        try {
          s.removeChild(c)
        } catch (r) {}
        l = !0, i()
      }
    }), s.insertBefore(c, p)
  }, a.prototype.wrap = function(r, e) {
    try {
      var o;
      if (o = "function" == typeof e ? e : function() {
          return e || {}
        }, "function" != typeof r) return r;
      if (r._isWrap) return r;
      if (!r._wrapped) {
        r._wrapped = function() {
          try {
            return r.apply(this, arguments)
          } catch (e) {
            throw "string" == typeof e && (e = new String(e)), e._rollbarContext = o() || {}, e._rollbarContext._wrappedSource = r.toString(), window._rollbarWrappedError = e, e
          }
        }, r._wrapped._isWrap = !0;
        for (var n in r) r.hasOwnProperty(n) && (r._wrapped[n] = r[n])
      }
      return r._wrapped
    } catch (e) {
      return r
    }
  };
  for (var p = "log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection".split(","), s = 0; s < p.length; ++s) a.prototype[p[s]] = i(p[s]);
  r.exports = {
    Rollbar: a,
    _rollbarWindowOnError: n
  }
}, function(r, e) {
  "use strict";
  r.exports = function(r, e) {
    return function(o) {
      if (!o && !window._rollbarInitialized) {
        var n = window.RollbarNotifier,
          t = e || {},
          a = t.globalAlias || "Rollbar",
          i = window.Rollbar.init(t, r);
        i._processShimQueue(window._rollbarShimQueue || []), window[a] = i, window._rollbarInitialized = !0, n.processPayloads()
      }
    }
  }
}]);
