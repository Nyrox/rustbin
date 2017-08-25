"use strict";

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function _possibleConstructorReturn(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || "object" != typeof t && "function" != typeof t ? e : t;
}

function _inherits(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
    e.prototype = Object.create(t && t.prototype, {
        constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
}

function send_ajax_request(e, t, n, a, r) {
    var o = new XMLHttpRequest();
    o.onreadystatechange = function() {
        o.readyState === XMLHttpRequest.DONE && r(200 === o.status ? o.responseText : null);
    }, o.open(t, e, a), o.setRequestHeader("Content-Type", "application/json"), o.send(n);
}

var _createClass = function() {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var a = t[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(e, a.key, a);
        }
    }
    return function(t, n, a) {
        return n && e(t.prototype, n), a && e(t, a), t;
    };
}(), Header = function(e) {
    function t() {
        return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
    }
    return _inherits(t, e), _createClass(t, [ {
        key: "render",
        value: function() {
            return React.createElement("div", {
                className: "header"
            }, React.createElement("div", {
                className: "clear-btn icon",
                onClick: function(e) {
                    window.dispatchEvent(new Event("app.editor.clear"));
                }
            }, React.createElement("img", {
                src: "public/images/clear.svg",
                alt: "clear"
            })), React.createElement("div", {
                className: "save-btn icon",
                onClick: function(e) {
                    window.dispatchEvent(new Event("app.editor.save"));
                }
            }, React.createElement("img", {
                src: "public/images/save.svg",
                alt: "save"
            })));
        }
    } ]), t;
}(React.Component), Editor = function(e) {
    function t() {
        _classCallCheck(this, t);
        var e = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
        console.log(location.pathname);
        var n = e;
        return n.code = "", location.pathname && "/" != location.pathname && send_ajax_request("./api/get/" + location.pathname, "GET", null, !1, function(e) {
            n.code = e, setTimeout(function() {
                document.querySelector(".editor textarea").value = e;
            }, 100);
        }), window.addEventListener("app.editor.clear", function() {
            document.querySelector(".editor textarea").value = "";
        }), window.addEventListener("app.editor.save", function() {
            var e = document.querySelector(".editor textarea").value;
            send_ajax_request("./api/save", "POST", JSON.stringify({
                payload: e
            }), !0, function(e) {
                if (null !== e) {
                    var t = JSON.parse(e);
                    location.pathname = String(t.id);
                } else console.error("API Request to './api/save' has failed");
            });
        }), window.addEventListener("keydown", function(e) {
            if (e.ctrlKey || e.metaKey) switch (String.fromCharCode(event.which).toLowerCase()) {
              case "s":
                e.preventDefault(), window.dispatchEvent(new Event("app.editor.save"));
            }
        }), e;
    }
    return _inherits(t, e), _createClass(t, [ {
        key: "render",
        value: function() {
            return React.createElement("div", {
                className: "editor"
            }, React.createElement("textarea", {
                spellCheck: "false"
            }));
        }
    } ]), t;
}(React.Component), Application = function(e) {
    function t() {
        return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
    }
    return _inherits(t, e), _createClass(t, [ {
        key: "render",
        value: function() {
            return React.createElement("div", null, React.createElement(Header, null), React.createElement(Editor, null));
        }
    } ]), t;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));

for (var textareas = document.getElementsByTagName("textarea"), count = textareas.length, i = 0; i < count; i++) textareas[i].onkeydown = function(e) {
    if (9 == e.keyCode || 9 == e.which) {
        e.preventDefault();
        var t = this.selectionStart;
        this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd), 
        this.selectionEnd = t + 1;
    }
};