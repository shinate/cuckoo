_.Module.define({
    path: "tbmall/component/captcha_payment", sub: {
        initial: function (a) {
            this.reCommitUrl = a.url, this.data = a.data
        }, showCaptcha: function (a, t) {
            var e = this, c = PageData.tbs || PageData.user.tbs, o = 2150040 == e.data.no ? "\u6B63\u786E\u8F93\u5165\u9A8C\u8BC1\u7801\u540E\uFF0C\u53EF\u7EE7\u7EED\u8D2D\u4E70" : "\u9A8C\u8BC1\u7801\u8F93\u5165\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165";
            this.requireInstanceAsync("common/component/CaptchaDialog", {
                message: e.data.data.captcha_str_reason,
                vCode: e.data.data.captcha_vcode_str,
                vCodeType: e.data.data.captcha_code_type,
                exceptionalAccount: 0,
                title: "T\u8C46\u652F\u4ED8\u9A8C\u8BC1\u7801",
                message: o,
                forumName: "",
                modal: !0,
                forumId: 0,
                checkUrl: "/tbmall/vcode/safecheckvcode?tbs=" + c,
                vCodeUrl: "/tbmall/vcode/safegetvcode",
                paramsCallback: function () {
                    return {tbs: c}
                }
            }, function (e) {
                e.bind("onclose", function () {
                    e.hide(), $.tb.location.reload()
                }), e.bind("onaccept", function () {
                    var c = {};
                    c.captcha_input_str = e.getInputValue(), c.captcha_vcode_str = e.getVCode(), "function" == typeof a && (t ? a.call(t, c) : a(c))
                }), e.show()
            })
        }
    }
});
_.Module.define({
    path: "tbmall/widget/paykey_rsa", requires: [], sub: {
        RSA: {}, publicKey: "", setKey: function () {
            this.publicKey = pkey
        }, getKey: function () {
            var t = this;
            $.ajax({
                url: "/tbmall/pass/getpubkey", type: "get", dataType: "json", success: function (e) {
                    PageData.publicKey = e.data.pubkey, t.publicKey = PageData.publicKey
                }
            })
        }, vcode: function (t) {
            var e = new this.RSA;
            return e.setKey(this.publicKey), encodeURIComponent(e.encrypt(t))
        }, initial: function (t) {
            var e = this, i = $.extend({}, t);
            PageData.publicKey || i.publicKey ? this.publicKey = PageData.publicKey : this.getKey(), function (t) {
                function e(t, e, i) {
                    null != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
                }

                function i() {
                    return new e(null)
                }

                function r(t, e, i, r, s, n) {
                    for (; --n >= 0;) {
                        var o = e * this[t++] + i[r] + s;
                        s = Math.floor(o / 67108864), i[r++] = 67108863 & o
                    }
                    return s
                }

                function s(t, e, i, r, s, n) {
                    for (var o = 32767 & e, h = e >> 15; --n >= 0;) {
                        var a = 32767 & this[t], u = this[t++] >> 15, c = h * a + u * o;
                        a = o * a + ((32767 & c) << 15) + i[r] + (1073741823 & s), s = (a >>> 30) + (c >>> 15) + h * u + (s >>> 30), i[r++] = 1073741823 & a
                    }
                    return s
                }

                function n(t, e, i, r, s, n) {
                    for (var o = 16383 & e, h = e >> 14; --n >= 0;) {
                        var a = 16383 & this[t], u = this[t++] >> 14, c = h * a + u * o;
                        a = o * a + ((16383 & c) << 14) + i[r] + s, s = (a >> 28) + (c >> 14) + h * u, i[r++] = 268435455 & a
                    }
                    return s
                }

                function o(t) {
                    return Ui.charAt(t)
                }

                function h(t, e) {
                    var i = Oi[t.charCodeAt(e)];
                    return null == i ? -1 : i
                }

                function a(t) {
                    for (var e = this.t - 1; e >= 0; --e)t[e] = this[e];
                    t.t = this.t, t.s = this.s
                }

                function u(t) {
                    this.t = 1, this.s = 0 > t ? -1 : 0, t > 0 ? this[0] = t : -1 > t ? this[0] = t + DV : this.t = 0
                }

                function c(t) {
                    var e = i();
                    return e.fromInt(t), e
                }

                function f(t, i) {
                    var r;
                    if (16 == i)r = 4; else if (8 == i)r = 3; else if (256 == i)r = 8; else if (2 == i)r = 1; else if (32 == i)r = 5; else {
                        if (4 != i)return this.fromRadix(t, i), void 0;
                        r = 2
                    }
                    this.t = 0, this.s = 0;
                    for (var s = t.length, n = !1, o = 0; --s >= 0;) {
                        var a = 8 == r ? 255 & t[s] : h(t, s);
                        0 > a ? "-" == t.charAt(s) && (n = !0) : (n = !1, 0 == o ? this[this.t++] = a : o + r > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - o) - 1) << o, this[this.t++] = a >> this.DB - o) : this[this.t - 1] |= a << o, o += r, o >= this.DB && (o -= this.DB))
                    }
                    8 == r && 0 != (128 & t[0]) && (this.s = -1, o > 0 && (this[this.t - 1] |= (1 << this.DB - o) - 1 << o)), this.clamp(), n && e.ZERO.subTo(this, this)
                }

                function p() {
                    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;)--this.t
                }

                function l(t) {
                    if (this.s < 0)return "-" + this.negate().toString(t);
                    var e;
                    if (16 == t)e = 4; else if (8 == t)e = 3; else if (2 == t)e = 1; else if (32 == t)e = 5; else {
                        if (4 != t)return this.toRadix(t);
                        e = 2
                    }
                    var i, r = (1 << e) - 1, s = !1, n = "", h = this.t, a = this.DB - h * this.DB % e;
                    if (h-- > 0)for (a < this.DB && (i = this[h] >> a) > 0 && (s = !0, n = o(i)); h >= 0;)e > a ? (i = (this[h] & (1 << a) - 1) << e - a, i |= this[--h] >> (a += this.DB - e)) : (i = this[h] >> (a -= e) & r, 0 >= a && (a += this.DB, --h)), i > 0 && (s = !0), s && (n += o(i));
                    return s ? n : "0"
                }

                function d() {
                    var t = i();
                    return e.ZERO.subTo(this, t), t
                }

                function g() {
                    return this.s < 0 ? this.negate() : this
                }

                function y(t) {
                    var e = this.s - t.s;
                    if (0 != e)return e;
                    var i = this.t;
                    if (e = i - t.t, 0 != e)return this.s < 0 ? -e : e;
                    for (; --i >= 0;)if (0 != (e = this[i] - t[i]))return e;
                    return 0
                }

                function m(t) {
                    var e, i = 1;
                    return 0 != (e = t >>> 16) && (t = e, i += 16), 0 != (e = t >> 8) && (t = e, i += 8), 0 != (e = t >> 4) && (t = e, i += 4), 0 != (e = t >> 2) && (t = e, i += 2), 0 != (e = t >> 1) && (t = e, i += 1), i
                }

                function b() {
                    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + m(this[this.t - 1] ^ this.s & this.DM)
                }

                function T(t, e) {
                    var i;
                    for (i = this.t - 1; i >= 0; --i)e[i + t] = this[i];
                    for (i = t - 1; i >= 0; --i)e[i] = 0;
                    e.t = this.t + t, e.s = this.s
                }

                function S(t, e) {
                    for (var i = t; i < this.t; ++i)e[i - t] = this[i];
                    e.t = Math.max(this.t - t, 0), e.s = this.s
                }

                function R(t, e) {
                    var i, r = t % this.DB, s = this.DB - r, n = (1 << s) - 1, o = Math.floor(t / this.DB), h = this.s << r & this.DM;
                    for (i = this.t - 1; i >= 0; --i)e[i + o + 1] = this[i] >> s | h, h = (this[i] & n) << r;
                    for (i = o - 1; i >= 0; --i)e[i] = 0;
                    e[o] = h, e.t = this.t + o + 1, e.s = this.s, e.clamp()
                }

                function D(t, e) {
                    e.s = this.s;
                    var i = Math.floor(t / this.DB);
                    if (i >= this.t)return e.t = 0, void 0;
                    var r = t % this.DB, s = this.DB - r, n = (1 << r) - 1;
                    e[0] = this[i] >> r;
                    for (var o = i + 1; o < this.t; ++o)e[o - i - 1] |= (this[o] & n) << s, e[o - i] = this[o] >> r;
                    r > 0 && (e[this.t - i - 1] |= (this.s & n) << s), e.t = this.t - i, e.clamp()
                }

                function E(t, e) {
                    for (var i = 0, r = 0, s = Math.min(t.t, this.t); s > i;)r += this[i] - t[i], e[i++] = r & this.DM, r >>= this.DB;
                    if (t.t < this.t) {
                        for (r -= t.s; i < this.t;)r += this[i], e[i++] = r & this.DM, r >>= this.DB;
                        r += this.s
                    } else {
                        for (r += this.s; i < t.t;)r -= t[i], e[i++] = r & this.DM, r >>= this.DB;
                        r -= t.s
                    }
                    e.s = 0 > r ? -1 : 0, -1 > r ? e[i++] = this.DV + r : r > 0 && (e[i++] = r), e.t = i, e.clamp()
                }

                function x(t, i) {
                    var r = this.abs(), s = t.abs(), n = r.t;
                    for (i.t = n + s.t; --n >= 0;)i[n] = 0;
                    for (n = 0; n < s.t; ++n)i[n + r.t] = r.am(0, s[n], i, n, 0, r.t);
                    i.s = 0, i.clamp(), this.s != t.s && e.ZERO.subTo(i, i)
                }

                function w(t) {
                    for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0;)t[i] = 0;
                    for (i = 0; i < e.t - 1; ++i) {
                        var r = e.am(i, e[i], t, 2 * i, 0, 1);
                        (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, r, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV, t[i + e.t + 1] = 1)
                    }
                    t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)), t.s = 0, t.clamp()
                }

                function K(t, r, s) {
                    var n = t.abs();
                    if (!(n.t <= 0)) {
                        var o = this.abs();
                        if (o.t < n.t)return null != r && r.fromInt(0), null != s && this.copyTo(s), void 0;
                        null == s && (s = i());
                        var h = i(), a = this.s, u = t.s, c = this.DB - m(n[n.t - 1]);
                        c > 0 ? (n.lShiftTo(c, h), o.lShiftTo(c, s)) : (n.copyTo(h), o.copyTo(s));
                        var f = h.t, p = h[f - 1];
                        if (0 != p) {
                            var l = p * (1 << this.F1) + (f > 1 ? h[f - 2] >> this.F2 : 0), d = this.FV / l, g = (1 << this.F1) / l, y = 1 << this.F2, v = s.t, b = v - f, T = null == r ? i() : r;
                            for (h.dlShiftTo(b, T), s.compareTo(T) >= 0 && (s[s.t++] = 1, s.subTo(T, s)), e.ONE.dlShiftTo(f, T), T.subTo(h, h); h.t < f;)h[h.t++] = 0;
                            for (; --b >= 0;) {
                                var S = s[--v] == p ? this.DM : Math.floor(s[v] * d + (s[v - 1] + y) * g);
                                if ((s[v] += h.am(0, S, s, b, 0, f)) < S)for (h.dlShiftTo(b, T), s.subTo(T, s); s[v] < --S;)s.subTo(T, s)
                            }
                            null != r && (s.drShiftTo(f, r), a != u && e.ZERO.subTo(r, r)), s.t = f, s.clamp(), c > 0 && s.rShiftTo(c, s), 0 > a && e.ZERO.subTo(s, s)
                        }
                    }
                }

                function A(t) {
                    var r = i();
                    return this.abs().divRemTo(t, null, r), this.s < 0 && r.compareTo(e.ZERO) > 0 && t.subTo(r, r), r
                }

                function B(t) {
                    this.m = t
                }

                function U(t) {
                    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
                }

                function O(t) {
                    return t
                }

                function V(t) {
                    t.divRemTo(this.m, null, t)
                }

                function N(t, e, i) {
                    t.multiplyTo(e, i), this.reduce(i)
                }

                function J(t, e) {
                    t.squareTo(e), this.reduce(e)
                }

                function I() {
                    if (this.t < 1)return 0;
                    var t = this[0];
                    if (0 == (1 & t))return 0;
                    var e = 3 & t;
                    return e = e * (2 - (15 & t) * e) & 15, e = e * (2 - (255 & t) * e) & 255, e = e * (2 - ((65535 & t) * e & 65535)) & 65535, e = e * (2 - t * e % this.DV) % this.DV, e > 0 ? this.DV - e : -e
                }

                function P(t) {
                    this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
                }

                function M(t) {
                    var r = i();
                    return t.abs().dlShiftTo(this.m.t, r), r.divRemTo(this.m, null, r), t.s < 0 && r.compareTo(e.ZERO) > 0 && this.m.subTo(r, r), r
                }

                function L(t) {
                    var e = i();
                    return t.copyTo(e), this.reduce(e), e
                }

                function q(t) {
                    for (; t.t <= this.mt2;)t[t.t++] = 0;
                    for (var e = 0; e < this.m.t; ++e) {
                        var i = 32767 & t[e], r = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                        for (i = e + this.m.t, t[i] += this.m.am(0, r, t, e, 0, this.m.t); t[i] >= t.DV;)t[i] -= t.DV, t[++i]++
                    }
                    t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
                }

                function C(t, e) {
                    t.squareTo(e), this.reduce(e)
                }

                function H(t, e, i) {
                    t.multiplyTo(e, i), this.reduce(i)
                }

                function j() {
                    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
                }

                function k(t, r) {
                    if (t > 4294967295 || 1 > t)return e.ONE;
                    var s = i(), n = i(), o = r.convert(this), h = m(t) - 1;
                    for (o.copyTo(s); --h >= 0;)if (r.sqrTo(s, n), (t & 1 << h) > 0)r.mulTo(n, o, s); else {
                        var a = s;
                        s = n, n = a
                    }
                    return r.revert(s)
                }

                function F(t, e) {
                    var i;
                    return i = 256 > t || e.isEven() ? new B(e) : new P(e), this.exp(t, i)
                }

                function _() {
                    var t = i();
                    return this.copyTo(t), t
                }

                function z() {
                    if (this.s < 0) {
                        if (1 == this.t)return this[0] - this.DV;
                        if (0 == this.t)return -1
                    } else {
                        if (1 == this.t)return this[0];
                        if (0 == this.t)return 0
                    }
                    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
                }

                function Z() {
                    return 0 == this.t ? this.s : this[0] << 24 >> 24
                }

                function G() {
                    return 0 == this.t ? this.s : this[0] << 16 >> 16
                }

                function Y(t) {
                    return Math.floor(Math.LN2 * this.DB / Math.log(t))
                }

                function W() {
                    return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
                }

                function Q(t) {
                    if (null == t && (t = 10), 0 == this.signum() || 2 > t || t > 36)return "0";
                    var e = this.chunkSize(t), r = Math.pow(t, e), s = c(r), n = i(), o = i(), h = "";
                    for (this.divRemTo(s, n, o); n.signum() > 0;)h = (r + o.intValue()).toString(t).substr(1) + h, n.divRemTo(s, n, o);
                    return o.intValue().toString(t) + h
                }

                function X(t, i) {
                    this.fromInt(0), null == i && (i = 10);
                    for (var r = this.chunkSize(i), s = Math.pow(i, r), n = !1, o = 0, a = 0, u = 0; u < t.length; ++u) {
                        var c = h(t, u);
                        0 > c ? "-" == t.charAt(u) && 0 == this.signum() && (n = !0) : (a = i * a + c, ++o >= r && (this.dMultiply(s), this.dAddOffset(a, 0), o = 0, a = 0))
                    }
                    o > 0 && (this.dMultiply(Math.pow(i, o)), this.dAddOffset(a, 0)), n && e.ZERO.subTo(this, this)
                }

                function te(t, i, r) {
                    if ("number" == typeof i)if (2 > t)this.fromInt(1); else for (this.fromNumber(t, r), this.testBit(t - 1) || this.bitwiseTo(e.ONE.shiftLeft(t - 1), ae, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(i);)this.dAddOffset(2, 0), this.bitLength() > t && this.subTo(e.ONE.shiftLeft(t - 1), this); else {
                        var s = new Array, n = 7 & t;
                        s.length = (t >> 3) + 1, i.nextBytes(s), n > 0 ? s[0] &= (1 << n) - 1 : s[0] = 0, this.fromString(s, 256)
                    }
                }

                function ee() {
                    var t = this.t, e = new Array;
                    e[0] = this.s;
                    var i, r = this.DB - t * this.DB % 8, s = 0;
                    if (t-- > 0)for (r < this.DB && (i = this[t] >> r) != (this.s & this.DM) >> r && (e[s++] = i | this.s << this.DB - r); t >= 0;)8 > r ? (i = (this[t] & (1 << r) - 1) << 8 - r, i |= this[--t] >> (r += this.DB - 8)) : (i = this[t] >> (r -= 8) & 255, 0 >= r && (r += this.DB, --t)), 0 != (128 & i) && (i |= -256), 0 == s && (128 & this.s) != (128 & i) && ++s, (s > 0 || i != this.s) && (e[s++] = i);
                    return e
                }

                function ie(t) {
                    return 0 == this.compareTo(t)
                }

                function re(t) {
                    return this.compareTo(t) < 0 ? this : t
                }

                function se(t) {
                    return this.compareTo(t) > 0 ? this : t
                }

                function ne(t, e, i) {
                    var r, s, n = Math.min(t.t, this.t);
                    for (r = 0; n > r; ++r)i[r] = e(this[r], t[r]);
                    if (t.t < this.t) {
                        for (s = t.s & this.DM, r = n; r < this.t; ++r)i[r] = e(this[r], s);
                        i.t = this.t
                    } else {
                        for (s = this.s & this.DM, r = n; r < t.t; ++r)i[r] = e(s, t[r]);
                        i.t = t.t
                    }
                    i.s = e(this.s, t.s), i.clamp()
                }

                function oe(t, e) {
                    return t & e
                }

                function he(t) {
                    var e = i();
                    return this.bitwiseTo(t, oe, e), e
                }

                function ae(t, e) {
                    return t | e
                }

                function ue(t) {
                    var e = i();
                    return this.bitwiseTo(t, ae, e), e
                }

                function ce(t, e) {
                    return t ^ e
                }

                function fe(t) {
                    var e = i();
                    return this.bitwiseTo(t, ce, e), e
                }

                function pe(t, e) {
                    return t & ~e
                }

                function le(t) {
                    var e = i();
                    return this.bitwiseTo(t, pe, e), e
                }

                function de() {
                    for (var t = i(), e = 0; e < this.t; ++e)t[e] = this.DM & ~this[e];
                    return t.t = this.t, t.s = ~this.s, t
                }

                function ge(t) {
                    var e = i();
                    return 0 > t ? this.rShiftTo(-t, e) : this.lShiftTo(t, e), e
                }

                function ye(t) {
                    var e = i();
                    return 0 > t ? this.lShiftTo(-t, e) : this.rShiftTo(t, e), e
                }

                function me(t) {
                    if (0 == t)return -1;
                    var e = 0;
                    return 0 == (65535 & t) && (t >>= 16, e += 16), 0 == (255 & t) && (t >>= 8, e += 8), 0 == (15 & t) && (t >>= 4, e += 4), 0 == (3 & t) && (t >>= 2, e += 2), 0 == (1 & t) && ++e, e
                }

                function ve() {
                    for (var t = 0; t < this.t; ++t)if (0 != this[t])return t * this.DB + me(this[t]);
                    return this.s < 0 ? this.t * this.DB : -1
                }

                function be(t) {
                    for (var e = 0; 0 != t;)t &= t - 1, ++e;
                    return e
                }

                function Te() {
                    for (var t = 0, e = this.s & this.DM, i = 0; i < this.t; ++i)t += be(this[i] ^ e);
                    return t
                }

                function Se(t) {
                    var e = Math.floor(t / this.DB);
                    return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
                }

                function Re(t, i) {
                    var r = e.ONE.shiftLeft(t);
                    return this.bitwiseTo(r, i, r), r
                }

                function De(t) {
                    return this.changeBit(t, ae)
                }

                function Ee(t) {
                    return this.changeBit(t, pe)
                }

                function xe(t) {
                    return this.changeBit(t, ce)
                }

                function we(t, e) {
                    for (var i = 0, r = 0, s = Math.min(t.t, this.t); s > i;)r += this[i] + t[i], e[i++] = r & this.DM, r >>= this.DB;
                    if (t.t < this.t) {
                        for (r += t.s; i < this.t;)r += this[i], e[i++] = r & this.DM, r >>= this.DB;
                        r += this.s
                    } else {
                        for (r += this.s; i < t.t;)r += t[i], e[i++] = r & this.DM, r >>= this.DB;
                        r += t.s
                    }
                    e.s = 0 > r ? -1 : 0, r > 0 ? e[i++] = r : -1 > r && (e[i++] = this.DV + r), e.t = i, e.clamp()
                }

                function Ke(t) {
                    var e = i();
                    return this.addTo(t, e), e
                }

                function Ae(t) {
                    var e = i();
                    return this.subTo(t, e), e
                }

                function Be(t) {
                    var e = i();
                    return this.multiplyTo(t, e), e
                }

                function Ue() {
                    var t = i();
                    return this.squareTo(t), t
                }

                function Oe(t) {
                    var e = i();
                    return this.divRemTo(t, e, null), e
                }

                function Ve(t) {
                    var e = i();
                    return this.divRemTo(t, null, e), e
                }

                function Ne(t) {
                    var e = i(), r = i();
                    return this.divRemTo(t, e, r), new Array(e, r)
                }

                function Je(t) {
                    this[this.t] = this.am(0, t - 1, this, 0, 0, this.t), ++this.t, this.clamp()
                }

                function Ie(t, e) {
                    if (0 != t) {
                        for (; this.t <= e;)this[this.t++] = 0;
                        for (this[e] += t; this[e] >= this.DV;)this[e] -= this.DV, ++e >= this.t && (this[this.t++] = 0), ++this[e]
                    }
                }

                function Pe() {
                }

                function Me(t) {
                    return t
                }

                function Le(t, e, i) {
                    t.multiplyTo(e, i)
                }

                function qe(t, e) {
                    t.squareTo(e)
                }

                function Ce(t) {
                    return this.exp(t, new Pe)
                }

                function He(t, e, i) {
                    var r = Math.min(this.t + t.t, e);
                    for (i.s = 0, i.t = r; r > 0;)i[--r] = 0;
                    var s;
                    for (s = i.t - this.t; s > r; ++r)i[r + this.t] = this.am(0, t[r], i, r, 0, this.t);
                    for (s = Math.min(t.t, e); s > r; ++r)this.am(0, t[r], i, r, 0, e - r);
                    i.clamp()
                }

                function je(t, e, i) {
                    --e;
                    var r = i.t = this.t + t.t - e;
                    for (i.s = 0; --r >= 0;)i[r] = 0;
                    for (r = Math.max(e - this.t, 0); r < t.t; ++r)i[this.t + r - e] = this.am(e - r, t[r], i, 0, 0, this.t + r - e);
                    i.clamp(), i.drShiftTo(1, i)
                }

                function ke(t) {
                    this.r2 = i(), this.q3 = i(), e.ONE.dlShiftTo(2 * t.t, this.r2), this.mu = this.r2.divide(t), this.m = t
                }

                function Fe(t) {
                    if (t.s < 0 || t.t > 2 * this.m.t)return t.mod(this.m);
                    if (t.compareTo(this.m) < 0)return t;
                    var e = i();
                    return t.copyTo(e), this.reduce(e), e
                }

                function _e(t) {
                    return t
                }

                function ze(t) {
                    for (t.drShiftTo(this.m.t - 1, this.r2), t.t > this.m.t + 1 && (t.t = this.m.t + 1, t.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0;)t.dAddOffset(1, this.m.t + 1);
                    for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0;)t.subTo(this.m, t)
                }

                function Ze(t, e) {
                    t.squareTo(e), this.reduce(e)
                }

                function Ge(t, e, i) {
                    t.multiplyTo(e, i), this.reduce(i)
                }

                function $e(t, e) {
                    var r, s, n = t.bitLength(), o = c(1);
                    if (0 >= n)return o;
                    r = 18 > n ? 1 : 48 > n ? 3 : 144 > n ? 4 : 768 > n ? 5 : 6, s = 8 > n ? new B(e) : e.isEven() ? new ke(e) : new P(e);
                    var h = new Array, a = 3, u = r - 1, f = (1 << r) - 1;
                    if (h[1] = s.convert(this), r > 1) {
                        var p = i();
                        for (s.sqrTo(h[1], p); f >= a;)h[a] = i(), s.mulTo(p, h[a - 2], h[a]), a += 2
                    }
                    var l, d, g = t.t - 1, y = !0, v = i();
                    for (n = m(t[g]) - 1; g >= 0;) {
                        for (n >= u ? l = t[g] >> n - u & f : (l = (t[g] & (1 << n + 1) - 1) << u - n, g > 0 && (l |= t[g - 1] >> this.DB + n - u)), a = r; 0 == (1 & l);)l >>= 1, --a;
                        if ((n -= a) < 0 && (n += this.DB, --g), y)h[l].copyTo(o), y = !1; else {
                            for (; a > 1;)s.sqrTo(o, v), s.sqrTo(v, o), a -= 2;
                            a > 0 ? s.sqrTo(o, v) : (d = o, o = v, v = d), s.mulTo(v, h[l], o)
                        }
                        for (; g >= 0 && 0 == (t[g] & 1 << n);)s.sqrTo(o, v), d = o, o = v, v = d, --n < 0 && (n = this.DB - 1, --g)
                    }
                    return s.revert(o)
                }

                function Ye(t) {
                    var e = this.s < 0 ? this.negate() : this.clone(), i = t.s < 0 ? t.negate() : t.clone();
                    if (e.compareTo(i) < 0) {
                        var r = e;
                        e = i, i = r
                    }
                    var s = e.getLowestSetBit(), n = i.getLowestSetBit();
                    if (0 > n)return e;
                    for (n > s && (n = s), n > 0 && (e.rShiftTo(n, e), i.rShiftTo(n, i)); e.signum() > 0;)(s = e.getLowestSetBit()) > 0 && e.rShiftTo(s, e), (s = i.getLowestSetBit()) > 0 && i.rShiftTo(s, i), e.compareTo(i) >= 0 ? (e.subTo(i, e), e.rShiftTo(1, e)) : (i.subTo(e, i), i.rShiftTo(1, i));
                    return n > 0 && i.lShiftTo(n, i), i
                }

                function We(t) {
                    if (0 >= t)return 0;
                    var e = this.DV % t, i = this.s < 0 ? t - 1 : 0;
                    if (this.t > 0)if (0 == e)i = this[0] % t; else for (var r = this.t - 1; r >= 0; --r)i = (e * i + this[r]) % t;
                    return i
                }

                function Qe(t) {
                    var i = t.isEven();
                    if (this.isEven() && i || 0 == t.signum())return e.ZERO;
                    for (var r = t.clone(), s = this.clone(), n = c(1), o = c(0), h = c(0), a = c(1); 0 != r.signum();) {
                        for (; r.isEven();)r.rShiftTo(1, r), i ? (n.isEven() && o.isEven() || (n.addTo(this, n), o.subTo(t, o)), n.rShiftTo(1, n)) : o.isEven() || o.subTo(t, o), o.rShiftTo(1, o);
                        for (; s.isEven();)s.rShiftTo(1, s), i ? (h.isEven() && a.isEven() || (h.addTo(this, h), a.subTo(t, a)), h.rShiftTo(1, h)) : a.isEven() || a.subTo(t, a), a.rShiftTo(1, a);
                        r.compareTo(s) >= 0 ? (r.subTo(s, r), i && n.subTo(h, n), o.subTo(a, o)) : (s.subTo(r, s), i && h.subTo(n, h), a.subTo(o, a))
                    }
                    return 0 != s.compareTo(e.ONE) ? e.ZERO : a.compareTo(t) >= 0 ? a.subtract(t) : a.signum() < 0 ? (a.addTo(t, a), a.signum() < 0 ? a.add(t) : a) : a
                }

                function Xe(t) {
                    var e, i = this.abs();
                    if (1 == i.t && i[0] <= Vi[Vi.length - 1]) {
                        for (e = 0; e < Vi.length; ++e)if (i[0] == Vi[e])return !0;
                        return !1
                    }
                    if (i.isEven())return !1;
                    for (e = 1; e < Vi.length;) {
                        for (var r = Vi[e], s = e + 1; s < Vi.length && Ni > r;)r *= Vi[s++];
                        for (r = i.modInt(r); s > e;)if (r % Vi[e++] == 0)return !1
                    }
                    return i.millerRabin(t)
                }

                function ti(t) {
                    var r = this.subtract(e.ONE), s = r.getLowestSetBit();
                    if (0 >= s)return !1;
                    var n = r.shiftRight(s);
                    t = t + 1 >> 1, t > Vi.length && (t = Vi.length);
                    for (var o = i(), h = 0; t > h; ++h) {
                        o.fromInt(Vi[Math.floor(Math.random() * Vi.length)]);
                        var a = o.modPow(n, this);
                        if (0 != a.compareTo(e.ONE) && 0 != a.compareTo(r)) {
                            for (var u = 1; u++ < s && 0 != a.compareTo(r);)if (a = a.modPowInt(2, this), 0 == a.compareTo(e.ONE))return !1;
                            if (0 != a.compareTo(r))return !1
                        }
                    }
                    return !0
                }

                function ei() {
                    this.i = 0, this.j = 0, this.S = new Array
                }

                function ii(t) {
                    var e, i, r;
                    for (e = 0; 256 > e; ++e)this.S[e] = e;
                    for (i = 0, e = 0; 256 > e; ++e)i = i + this.S[e] + t[e % t.length] & 255, r = this.S[e], this.S[e] = this.S[i], this.S[i] = r;
                    this.i = 0, this.j = 0
                }

                function ri() {
                    var t;
                    return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, t = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = t, this.S[t + this.S[this.i] & 255]
                }

                function si() {
                    return new ei
                }

                function ni(t) {
                    Ii[Pi++] ^= 255 & t, Ii[Pi++] ^= t >> 8 & 255, Ii[Pi++] ^= t >> 16 & 255, Ii[Pi++] ^= t >> 24 & 255, Pi >= Mi && (Pi -= Mi)
                }

                function oi() {
                    ni((new Date).getTime())
                }

                function hi() {
                    if (null == Ji) {
                        for (oi(), Ji = si(), Ji.init(Ii), Pi = 0; Pi < Ii.length; ++Pi)Ii[Pi] = 0;
                        Pi = 0
                    }
                    return Ji.next()
                }

                function ai(t) {
                    var e;
                    for (e = 0; e < t.length; ++e)t[e] = hi()
                }

                function ui() {
                }

                function ci(t, i) {
                    return new e(t, i)
                }

                function fi(t, i) {
                    if (i < t.length + 11)return console.error("Message too long for RSA"), null;
                    for (var r = new Array, s = t.length - 1; s >= 0 && i > 0;) {
                        var n = t.charCodeAt(s--);
                        128 > n ? r[--i] = n : n > 127 && 2048 > n ? (r[--i] = 63 & n | 128, r[--i] = n >> 6 | 192) : (r[--i] = 63 & n | 128, r[--i] = n >> 6 & 63 | 128, r[--i] = n >> 12 | 224)
                    }
                    r[--i] = 0;
                    for (var o = new ui, h = new Array; i > 2;) {
                        for (h[0] = 0; 0 == h[0];)o.nextBytes(h);
                        r[--i] = h[0]
                    }
                    return r[--i] = 2, r[--i] = 0, new e(r)
                }

                function pi() {
                    this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
                }

                function li(t, e) {
                    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ci(t, 16), this.e = parseInt(e, 16)) : console.error("Invalid RSA public key")
                }

                function di(t) {
                    return t.modPowInt(this.e, this.n)
                }

                function gi(t) {
                    var e = fi(t, this.n.bitLength() + 7 >> 3);
                    if (null == e)return null;
                    var i = this.doPublic(e);
                    if (null == i)return null;
                    var r = i.toString(16);
                    return 0 == (1 & r.length) ? r : "0" + r
                }

                function yi(t, e) {
                    for (var i = t.toByteArray(), r = 0; r < i.length && 0 == i[r];)++r;
                    if (i.length - r != e - 1 || 2 != i[r])return null;
                    for (++r; 0 != i[r];)if (++r >= i.length)return null;
                    for (var s = ""; ++r < i.length;) {
                        var n = 255 & i[r];
                        128 > n ? s += String.fromCharCode(n) : n > 191 && 224 > n ? (s += String.fromCharCode((31 & n) << 6 | 63 & i[r + 1]), ++r) : (s += String.fromCharCode((15 & n) << 12 | (63 & i[r + 1]) << 6 | 63 & i[r + 2]), r += 2)
                    }
                    return s
                }

                function mi(t, e, i) {
                    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ci(t, 16), this.e = parseInt(e, 16), this.d = ci(i, 16)) : console.error("Invalid RSA private key")
                }

                function vi(t, e, i, r, s, n, o, h) {
                    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ci(t, 16), this.e = parseInt(e, 16), this.d = ci(i, 16), this.p = ci(r, 16), this.q = ci(s, 16), this.dmp1 = ci(n, 16), this.dmq1 = ci(o, 16), this.coeff = ci(h, 16)) : console.error("Invalid RSA private key")
                }

                function bi(t, i) {
                    var r = new ui, s = t >> 1;
                    this.e = parseInt(i, 16);
                    for (var n = new e(i, 16); ;) {
                        for (; this.p = new e(t - s, 1, r), 0 != this.p.subtract(e.ONE).gcd(n).compareTo(e.ONE) || !this.p.isProbablePrime(10););
                        for (; this.q = new e(s, 1, r), 0 != this.q.subtract(e.ONE).gcd(n).compareTo(e.ONE) || !this.q.isProbablePrime(10););
                        if (this.p.compareTo(this.q) <= 0) {
                            var o = this.p;
                            this.p = this.q, this.q = o
                        }
                        var h = this.p.subtract(e.ONE), a = this.q.subtract(e.ONE), u = h.multiply(a);
                        if (0 == u.gcd(n).compareTo(e.ONE)) {
                            this.n = this.p.multiply(this.q), this.d = n.modInverse(u), this.dmp1 = this.d.mod(h), this.dmq1 = this.d.mod(a), this.coeff = this.q.modInverse(this.p);
                            break
                        }
                    }
                }

                function Ti(t) {
                    if (null == this.p || null == this.q)return t.modPow(this.d, this.n);
                    for (var e = t.mod(this.p).modPow(this.dmp1, this.p), i = t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(i) < 0;)e = e.add(this.p);
                    return e.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i)
                }

                function Si(t) {
                    var e = ci(t, 16), i = this.doPrivate(e);
                    return null == i ? null : yi(i, this.n.bitLength() + 7 >> 3)
                }

                function Ri(t) {
                    var e, i, r = "";
                    for (e = 0; e + 3 <= t.length; e += 3)i = parseInt(t.substring(e, e + 3), 16), r += Ci.charAt(i >> 6) + Ci.charAt(63 & i);
                    for (e + 1 == t.length ? (i = parseInt(t.substring(e, e + 1), 16), r += Ci.charAt(i << 2)) : e + 2 == t.length && (i = parseInt(t.substring(e, e + 2), 16), r += Ci.charAt(i >> 2) + Ci.charAt((3 & i) << 4)); (3 & r.length) > 0;)r += Hi;
                    return r
                }

                function Di(t) {
                    var e, i, r = "", s = 0;
                    for (e = 0; e < t.length && t.charAt(e) != Hi; ++e)v = Ci.indexOf(t.charAt(e)), 0 > v || (0 == s ? (r += o(v >> 2), i = 3 & v, s = 1) : 1 == s ? (r += o(i << 2 | v >> 4), i = 15 & v, s = 2) : 2 == s ? (r += o(i), r += o(v >> 2), i = 3 & v, s = 3) : (r += o(i << 2 | v >> 4), r += o(15 & v), s = 0));
                    return 1 == s && (r += o(i << 2)), r
                }

                var Ei, xi = 0xdeadbeefcafe, wi = 15715070 == (16777215 & xi);
                wi && "Microsoft Internet Explorer" == navigator.appName ? (e.prototype.am = s, Ei = 30) : wi && "Netscape" != navigator.appName ? (e.prototype.am = r, Ei = 26) : (e.prototype.am = n, Ei = 28), e.prototype.DB = Ei, e.prototype.DM = (1 << Ei) - 1, e.prototype.DV = 1 << Ei;
                var Ki = 52;
                e.prototype.FV = Math.pow(2, Ki), e.prototype.F1 = Ki - Ei, e.prototype.F2 = 2 * Ei - Ki;
                var Ai, Bi, Ui = "0123456789abcdefghijklmnopqrstuvwxyz", Oi = new Array;
                for (Ai = "0".charCodeAt(0), Bi = 0; 9 >= Bi; ++Bi)Oi[Ai++] = Bi;
                for (Ai = "a".charCodeAt(0), Bi = 10; 36 > Bi; ++Bi)Oi[Ai++] = Bi;
                for (Ai = "A".charCodeAt(0), Bi = 10; 36 > Bi; ++Bi)Oi[Ai++] = Bi;
                B.prototype.convert = U, B.prototype.revert = O, B.prototype.reduce = V, B.prototype.mulTo = N, B.prototype.sqrTo = J, P.prototype.convert = M, P.prototype.revert = L, P.prototype.reduce = q, P.prototype.mulTo = H, P.prototype.sqrTo = C, e.prototype.copyTo = a, e.prototype.fromInt = u, e.prototype.fromString = f, e.prototype.clamp = p, e.prototype.dlShiftTo = T, e.prototype.drShiftTo = S, e.prototype.lShiftTo = R, e.prototype.rShiftTo = D, e.prototype.subTo = E, e.prototype.multiplyTo = x, e.prototype.squareTo = w, e.prototype.divRemTo = K, e.prototype.invDigit = I, e.prototype.isEven = j, e.prototype.exp = k, e.prototype.toString = l, e.prototype.negate = d, e.prototype.abs = g, e.prototype.compareTo = y, e.prototype.bitLength = b, e.prototype.mod = A, e.prototype.modPowInt = F, e.ZERO = c(0), e.ONE = c(1), Pe.prototype.convert = Me, Pe.prototype.revert = Me, Pe.prototype.mulTo = Le, Pe.prototype.sqrTo = qe, ke.prototype.convert = Fe, ke.prototype.revert = _e, ke.prototype.reduce = ze, ke.prototype.mulTo = Ge, ke.prototype.sqrTo = Ze;
                var Vi = [
                    2,
                    3,
                    5,
                    7,
                    11,
                    13,
                    17,
                    19,
                    23,
                    29,
                    31,
                    37,
                    41,
                    43,
                    47,
                    53,
                    59,
                    61,
                    67,
                    71,
                    73,
                    79,
                    83,
                    89,
                    97,
                    101,
                    103,
                    107,
                    109,
                    113,
                    127,
                    131,
                    137,
                    139,
                    149,
                    151,
                    157,
                    163,
                    167,
                    173,
                    179,
                    181,
                    191,
                    193,
                    197,
                    199,
                    211,
                    223,
                    227,
                    229,
                    233,
                    239,
                    241,
                    251,
                    257,
                    263,
                    269,
                    271,
                    277,
                    281,
                    283,
                    293,
                    307,
                    311,
                    313,
                    317,
                    331,
                    337,
                    347,
                    349,
                    353,
                    359,
                    367,
                    373,
                    379,
                    383,
                    389,
                    397,
                    401,
                    409,
                    419,
                    421,
                    431,
                    433,
                    439,
                    443,
                    449,
                    457,
                    461,
                    463,
                    467,
                    479,
                    487,
                    491,
                    499,
                    503,
                    509,
                    521,
                    523,
                    541,
                    547,
                    557,
                    563,
                    569,
                    571,
                    577,
                    587,
                    593,
                    599,
                    601,
                    607,
                    613,
                    617,
                    619,
                    631,
                    641,
                    643,
                    647,
                    653,
                    659,
                    661,
                    673,
                    677,
                    683,
                    691,
                    701,
                    709,
                    719,
                    727,
                    733,
                    739,
                    743,
                    751,
                    757,
                    761,
                    769,
                    773,
                    787,
                    797,
                    809,
                    811,
                    821,
                    823,
                    827,
                    829,
                    839,
                    853,
                    857,
                    859,
                    863,
                    877,
                    881,
                    883,
                    887,
                    907,
                    911,
                    919,
                    929,
                    937,
                    941,
                    947,
                    953,
                    967,
                    971,
                    977,
                    983,
                    991,
                    997
                ], Ni = (1 << 26) / Vi[Vi.length - 1];
                e.prototype.chunkSize = Y, e.prototype.toRadix = Q, e.prototype.fromRadix = X, e.prototype.fromNumber = te, e.prototype.bitwiseTo = ne, e.prototype.changeBit = Re, e.prototype.addTo = we, e.prototype.dMultiply = Je, e.prototype.dAddOffset = Ie, e.prototype.multiplyLowerTo = He, e.prototype.multiplyUpperTo = je, e.prototype.modInt = We, e.prototype.millerRabin = ti, e.prototype.clone = _, e.prototype.intValue = z, e.prototype.byteValue = Z, e.prototype.shortValue = G, e.prototype.signum = W, e.prototype.toByteArray = ee, e.prototype.equals = ie, e.prototype.min = re, e.prototype.max = se, e.prototype.and = he, e.prototype.or = ue, e.prototype.xor = fe, e.prototype.andNot = le, e.prototype.not = de, e.prototype.shiftLeft = ge, e.prototype.shiftRight = ye, e.prototype.getLowestSetBit = ve, e.prototype.bitCount = Te, e.prototype.testBit = Se, e.prototype.setBit = De, e.prototype.clearBit = Ee, e.prototype.flipBit = xe, e.prototype.add = Ke, e.prototype.subtract = Ae, e.prototype.multiply = Be, e.prototype.divide = Oe, e.prototype.remainder = Ve, e.prototype.divideAndRemainder = Ne, e.prototype.modPow = $e, e.prototype.modInverse = Qe, e.prototype.pow = Ce, e.prototype.gcd = Ye, e.prototype.isProbablePrime = Xe, e.prototype.square = Ue, ei.prototype.init = ii, ei.prototype.next = ri;
                var Ji, Ii, Pi, Mi = 256;
                if (null == Ii) {
                    Ii = new Array, Pi = 0;
                    var Li;
                    if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto) {
                        var qi = window.crypto.random(32);
                        for (Li = 0; Li < qi.length; ++Li)Ii[Pi++] = 255 & qi.charCodeAt(Li)
                    }
                    for (; Mi > Pi;)Li = Math.floor(65536 * Math.random()), Ii[Pi++] = Li >>> 8, Ii[Pi++] = 255 & Li;
                    Pi = 0, oi()
                }
                ui.prototype.nextBytes = ai, pi.prototype.doPublic = di, pi.prototype.setPublic = li, pi.prototype.encrypt = gi, pi.prototype.doPrivate = Ti, pi.prototype.setPrivate = mi, pi.prototype.setPrivateEx = vi, pi.prototype.generate = bi, pi.prototype.decrypt = Si, function () {
                    var t = function (t, r, s) {
                        var n = new ui, o = t >> 1;
                        this.e = parseInt(r, 16);
                        var h = new e(r, 16), a = this, u = function () {
                            var r = function () {
                                if (a.p.compareTo(a.q) <= 0) {
                                    var t = a.p;
                                    a.p = a.q, a.q = t
                                }
                                var i = a.p.subtract(e.ONE), r = a.q.subtract(e.ONE), n = i.multiply(r);
                                0 == n.gcd(h).compareTo(e.ONE) ? (a.n = a.p.multiply(a.q), a.d = h.modInverse(n), a.dmp1 = a.d.mod(i), a.dmq1 = a.d.mod(r), a.coeff = a.q.modInverse(a.p), setTimeout(function () {
                                    s()
                                }, 0)) : setTimeout(u, 0)
                            }, c = function () {
                                a.q = i(), a.q.fromNumberAsync(o, 1, n, function () {
                                    a.q.subtract(e.ONE).gcda(h, function (t) {
                                        0 == t.compareTo(e.ONE) && a.q.isProbablePrime(10) ? setTimeout(r, 0) : setTimeout(c, 0)
                                    })
                                })
                            }, f = function () {
                                a.p = i(), a.p.fromNumberAsync(t - o, 1, n, function () {
                                    a.p.subtract(e.ONE).gcda(h, function (t) {
                                        0 == t.compareTo(e.ONE) && a.p.isProbablePrime(10) ? setTimeout(c, 0) : setTimeout(f, 0)
                                    })
                                })
                            };
                            setTimeout(f, 0)
                        };
                        setTimeout(u, 0)
                    };
                    pi.prototype.generateAsync = t;
                    var r = function (t, e) {
                        var i = this.s < 0 ? this.negate() : this.clone(), r = t.s < 0 ? t.negate() : t.clone();
                        if (i.compareTo(r) < 0) {
                            var s = i;
                            i = r, r = s
                        }
                        var n = i.getLowestSetBit(), o = r.getLowestSetBit();
                        if (0 > o)return e(i), void 0;
                        o > n && (o = n), o > 0 && (i.rShiftTo(o, i), r.rShiftTo(o, r));
                        var h = function () {
                            (n = i.getLowestSetBit()) > 0 && i.rShiftTo(n, i), (n = r.getLowestSetBit()) > 0 && r.rShiftTo(n, r), i.compareTo(r) >= 0 ? (i.subTo(r, i), i.rShiftTo(1, i)) : (r.subTo(i, r), r.rShiftTo(1, r)), i.signum() > 0 ? setTimeout(h, 0) : (o > 0 && r.lShiftTo(o, r), setTimeout(function () {
                                e(r)
                            }, 0))
                        };
                        setTimeout(h, 10)
                    };
                    e.prototype.gcda = r;
                    var s = function (t, i, r, s) {
                        if ("number" == typeof i)if (2 > t)this.fromInt(1); else {
                            this.fromNumber(t, r), this.testBit(t - 1) || this.bitwiseTo(e.ONE.shiftLeft(t - 1), ae, this), this.isEven() && this.dAddOffset(1, 0);
                            var n = this, o = function () {
                                n.dAddOffset(2, 0), n.bitLength() > t && n.subTo(e.ONE.shiftLeft(t - 1), n), n.isProbablePrime(i) ? setTimeout(function () {
                                    s()
                                }, 0) : setTimeout(o, 0)
                            };
                            setTimeout(o, 0)
                        } else {
                            var h = new Array, a = 7 & t;
                            h.length = (t >> 3) + 1, i.nextBytes(h), a > 0 ? h[0] &= (1 << a) - 1 : h[0] = 0, this.fromString(h, 256)
                        }
                    };
                    e.prototype.fromNumberAsync = s
                }();
                var Ci = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Hi = "=", ji = ji || {};
                ji.env = ji.env || {};
                var ki = ji, Fi = Object.prototype, _i = "[object Function]", zi = ["toString", "valueOf"];
                ji.env.parseUA = function (t) {
                    var e, i = function (t) {
                        var e = 0;
                        return parseFloat(t.replace(/\./g, function () {
                            return 1 == e++ ? "" : "."
                        }))
                    }, r = navigator, s = {
                        ie: 0,
                        opera: 0,
                        gecko: 0,
                        webkit: 0,
                        chrome: 0,
                        mobile: null,
                        air: 0,
                        ipad: 0,
                        iphone: 0,
                        ipod: 0,
                        ios: null,
                        android: 0,
                        webos: 0,
                        caja: r && r.cajaVersion,
                        secure: !1,
                        os: null
                    }, n = t || navigator && navigator.userAgent, o = $.tb.location, h = o && o.getHref();
                    return s.secure = h && 0 === h.toLowerCase().indexOf("https"), n && (/windows|win32/i.test(n) ? s.os = "windows" : /macintosh/i.test(n) ? s.os = "macintosh" : /rhino/i.test(n) && (s.os = "rhino"), /KHTML/.test(n) && (s.webkit = 1), e = n.match(/AppleWebKit\/([^\s]*)/), e && e[1] && (s.webkit = i(e[1]), / Mobile\//.test(n) ? (s.mobile = "Apple", e = n.match(/OS ([^\s]*)/), e && e[1] && (e = i(e[1].replace("_", "."))), s.ios = e, s.ipad = s.ipod = s.iphone = 0, e = n.match(/iPad|iPod|iPhone/), e && e[0] && (s[e[0].toLowerCase()] = s.ios)) : (e = n.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/), e && (s.mobile = e[0]), /webOS/.test(n) && (s.mobile = "WebOS", e = n.match(/webOS\/([^\s]*);/), e && e[1] && (s.webos = i(e[1]))), / Android/.test(n) && (s.mobile = "Android", e = n.match(/Android ([^\s]*);/), e && e[1] && (s.android = i(e[1])))), e = n.match(/Chrome\/([^\s]*)/), e && e[1] ? s.chrome = i(e[1]) : (e = n.match(/AdobeAIR\/([^\s]*)/), e && (s.air = e[0]))), s.webkit || (e = n.match(/Opera[\s\/]([^\s]*)/), e && e[1] ? (s.opera = i(e[1]), e = n.match(/Version\/([^\s]*)/), e && e[1] && (s.opera = i(e[1])), e = n.match(/Opera Mini[^;]*/), e && (s.mobile = e[0])) : (e = n.match(/MSIE\s([^;]*)/), e && e[1] ? s.ie = i(e[1]) : (e = n.match(/Gecko\/([^\s]*)/), e && (s.gecko = 1, e = n.match(/rv:([^\s\)]*)/), e && e[1] && (s.gecko = i(e[1]))))))), s
                }, ji.env.ua = ji.env.parseUA(), ji.isFunction = function (t) {
                    return "function" == typeof t || Fi.toString.apply(t) === _i
                }, ji._IEEnumFix = ji.env.ua.ie ? function (t, e) {
                    var i, r, s;
                    for (i = 0; i < zi.length; i += 1)r = zi[i], s = e[r], ki.isFunction(s) && s != Fi[r] && (t[r] = s)
                } : function () {
                }, ji.extend = function (t, e, i) {
                    if (!e || !t)throw new Error("extend failed, please check that all dependencies are included.");
                    var r, s = function () {
                    };
                    if (s.prototype = e.prototype, t.prototype = new s, t.prototype.constructor = t, t.superclass = e.prototype, e.prototype.constructor == Fi.constructor && (e.prototype.constructor = e), i) {
                        for (r in i)ki.hasOwnProperty(i, r) && (t.prototype[r] = i[r]);
                        ki._IEEnumFix(t.prototype, i)
                    }
                }, "undefined" != typeof KJUR && KJUR || (KJUR = {}), "undefined" != typeof KJUR.asn1 && KJUR.asn1 || (KJUR.asn1 = {}), KJUR.asn1.ASN1Util = new function () {
                    this.integerToByteHex = function (t) {
                        var e = t.toString(16);
                        return e.length % 2 == 1 && (e = "0" + e), e
                    }, this.bigIntToMinTwosComplementsHex = function (t) {
                        var i = t.toString(16);
                        if ("-" != i.substr(0, 1))i.length % 2 == 1 ? i = "0" + i : i.match(/^[0-7]/) || (i = "00" + i); else {
                            var r = i.substr(1), s = r.length;
                            s % 2 == 1 ? s += 1 : i.match(/^[0-7]/) || (s += 2);
                            for (var n = "", o = 0; s > o; o++)n += "f";
                            var h = new e(n, 16), a = h.xor(t).add(e.ONE);
                            i = a.toString(16).replace(/^-/, "")
                        }
                        return i
                    }, this.getPEMStringFromHex = function (t, e) {
                        var i = CryptoJS.enc.Hex.parse(t), r = CryptoJS.enc.Base64.stringify(i), s = r.replace(/(.{64})/g, "$1\r\n");
                        return s = s.replace(/\r\n$/, ""), "-----BEGIN " + e + "-----\r\n" + s + "\r\n-----END " + e + "-----\r\n"
                    }
                }, KJUR.asn1.ASN1Object = function () {
                    var t = "";
                    this.getLengthHexFromValue = function () {
                        if ("undefined" == typeof this.hV || null == this.hV)throw"this.hV is null or undefined.";
                        if (this.hV.length % 2 == 1)throw"value hex must be even length: n=" + t.length + ",v=" + this.hV;
                        var e = this.hV.length / 2, i = e.toString(16);
                        if (i.length % 2 == 1 && (i = "0" + i), 128 > e)return i;
                        var r = i.length / 2;
                        if (r > 15)throw"ASN.1 length too long to represent by 8x: n = " + e.toString(16);
                        var s = 128 + r;
                        return s.toString(16) + i
                    }, this.getEncodedHex = function () {
                        return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(), this.hL = this.getLengthHexFromValue(), this.hTLV = this.hT + this.hL + this.hV, this.isModified = !1), this.hTLV
                    }, this.getValueHex = function () {
                        return this.getEncodedHex(), this.hV
                    }, this.getFreshValueHex = function () {
                        return ""
                    }
                }, KJUR.asn1.DERAbstractString = function (t) {
                    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
                    this.getString = function () {
                        return this.s
                    }, this.setString = function (t) {
                        this.hTLV = null, this.isModified = !0, this.s = t, this.hV = stohex(this.s)
                    }, this.setStringHex = function (t) {
                        this.hTLV = null, this.isModified = !0, this.s = null, this.hV = t
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }, "undefined" != typeof t && ("undefined" != typeof t.str ? this.setString(t.str) : "undefined" != typeof t.hex && this.setStringHex(t.hex))
                }, ji.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractTime = function () {
                    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
                    this.localDateToUTC = function (t) {
                        utc = t.getTime() + 6e4 * t.getTimezoneOffset();
                        var e = new Date(utc);
                        return e
                    }, this.formatDate = function (t, e) {
                        var i = this.zeroPadding, r = this.localDateToUTC(t), s = String(r.getFullYear());
                        "utc" == e && (s = s.substr(2, 2));
                        var n = i(String(r.getMonth() + 1), 2), o = i(String(r.getDate()), 2), h = i(String(r.getHours()), 2), a = i(String(r.getMinutes()), 2), u = i(String(r.getSeconds()), 2);
                        return s + n + o + h + a + u + "Z"
                    }, this.zeroPadding = function (t, e) {
                        return t.length >= e ? t : new Array(e - t.length + 1).join("0") + t
                    }, this.getString = function () {
                        return this.s
                    }, this.setString = function (t) {
                        this.hTLV = null, this.isModified = !0, this.s = t, this.hV = stohex(this.s)
                    }, this.setByDateValue = function (t, e, i, r, s, n) {
                        var o = new Date(Date.UTC(t, e - 1, i, r, s, n, 0));
                        this.setByDate(o)
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }
                }, ji.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractStructured = function (t) {
                    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
                    this.setByASN1ObjectArray = function (t) {
                        this.hTLV = null, this.isModified = !0, this.asn1Array = t
                    }, this.appendASN1Object = function (t) {
                        this.hTLV = null, this.isModified = !0, this.asn1Array.push(t)
                    }, this.asn1Array = new Array, "undefined" != typeof t && "undefined" != typeof t.array && (this.asn1Array = t.array)
                }, ji.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object), KJUR.asn1.DERBoolean = function () {
                    KJUR.asn1.DERBoolean.superclass.constructor.call(this), this.hT = "01", this.hTLV = "0101ff"
                }, ji.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object), KJUR.asn1.DERInteger = function (t) {
                    KJUR.asn1.DERInteger.superclass.constructor.call(this), this.hT = "02", this.setByBigInteger = function (t) {
                        this.hTLV = null, this.isModified = !0, this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)
                    }, this.setByInteger = function (t) {
                        var i = new e(String(t), 10);
                        this.setByBigInteger(i)
                    }, this.setValueHex = function (t) {
                        this.hV = t
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }, "undefined" != typeof t && ("undefined" != typeof t.bigint ? this.setByBigInteger(t.bigint) : "undefined" != typeof t["int"] ? this.setByInteger(t["int"]) : "undefined" != typeof t.hex && this.setValueHex(t.hex))
                }, ji.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object), KJUR.asn1.DERBitString = function (t) {
                    KJUR.asn1.DERBitString.superclass.constructor.call(this), this.hT = "03", this.setHexValueIncludingUnusedBits = function (t) {
                        this.hTLV = null, this.isModified = !0, this.hV = t
                    }, this.setUnusedBitsAndHexValue = function (t, e) {
                        if (0 > t || t > 7)throw"unused bits shall be from 0 to 7: u = " + t;
                        var i = "0" + t;
                        this.hTLV = null, this.isModified = !0, this.hV = i + e
                    }, this.setByBinaryString = function (t) {
                        t = t.replace(/0+$/, "");
                        var e = 8 - t.length % 8;
                        8 == e && (e = 0);
                        for (var i = 0; e >= i; i++)t += "0";
                        for (var r = "", i = 0; i < t.length - 1; i += 8) {
                            var s = t.substr(i, 8), n = parseInt(s, 2).toString(16);
                            1 == n.length && (n = "0" + n), r += n
                        }
                        this.hTLV = null, this.isModified = !0, this.hV = "0" + e + r
                    }, this.setByBooleanArray = function (t) {
                        for (var e = "", i = 0; i < t.length; i++)e += 1 == t[i] ? "1" : "0";
                        this.setByBinaryString(e)
                    }, this.newFalseArray = function (t) {
                        for (var e = new Array(t), i = 0; t > i; i++)e[i] = !1;
                        return e
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }, "undefined" != typeof t && ("undefined" != typeof t.hex ? this.setHexValueIncludingUnusedBits(t.hex) : "undefined" != typeof t.bin ? this.setByBinaryString(t.bin) : "undefined" != typeof t.array && this.setByBooleanArray(t.array))
                }, ji.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object), KJUR.asn1.DEROctetString = function (t) {
                    KJUR.asn1.DEROctetString.superclass.constructor.call(this, t), this.hT = "04"
                }, ji.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNull = function () {
                    KJUR.asn1.DERNull.superclass.constructor.call(this), this.hT = "05", this.hTLV = "0500"
                }, ji.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object), KJUR.asn1.DERObjectIdentifier = function (t) {
                    var i = function (t) {
                        var e = t.toString(16);
                        return 1 == e.length && (e = "0" + e), e
                    }, r = function (t) {
                        var r = "", s = new e(t, 10), n = s.toString(2), o = 7 - n.length % 7;
                        7 == o && (o = 0);
                        for (var h = "", a = 0; o > a; a++)h += "0";
                        n = h + n;
                        for (var a = 0; a < n.length - 1; a += 7) {
                            var u = n.substr(a, 7);
                            a != n.length - 7 && (u = "1" + u), r += i(parseInt(u, 2))
                        }
                        return r
                    };
                    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this), this.hT = "06", this.setValueHex = function (t) {
                        this.hTLV = null, this.isModified = !0, this.s = null, this.hV = t
                    }, this.setValueOidString = function (t) {
                        if (!t.match(/^[0-9.]+$/))throw"malformed oid string: " + t;
                        var e = "", s = t.split("."), n = 40 * parseInt(s[0]) + parseInt(s[1]);
                        e += i(n), s.splice(0, 2);
                        for (var o = 0; o < s.length; o++)e += r(s[o]);
                        this.hTLV = null, this.isModified = !0, this.s = null, this.hV = e
                    }, this.setValueName = function (t) {
                        if ("undefined" == typeof KJUR.asn1.x509.OID.name2oidList[t])throw"DERObjectIdentifier oidName undefined: " + t;
                        var e = KJUR.asn1.x509.OID.name2oidList[t];
                        this.setValueOidString(e)
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }, "undefined" != typeof t && ("undefined" != typeof t.oid ? this.setValueOidString(t.oid) : "undefined" != typeof t.hex ? this.setValueHex(t.hex) : "undefined" != typeof t.name && this.setValueName(t.name))
                }, ji.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object), KJUR.asn1.DERUTF8String = function (t) {
                    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, t), this.hT = "0c"
                }, ji.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNumericString = function (t) {
                    KJUR.asn1.DERNumericString.superclass.constructor.call(this, t), this.hT = "12"
                }, ji.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERPrintableString = function (t) {
                    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, t), this.hT = "13"
                }, ji.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERTeletexString = function (t) {
                    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, t), this.hT = "14"
                }, ji.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERIA5String = function (t) {
                    KJUR.asn1.DERIA5String.superclass.constructor.call(this, t), this.hT = "16"
                }, ji.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERUTCTime = function (t) {
                    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, t), this.hT = "17", this.setByDate = function (t) {
                        this.hTLV = null, this.isModified = !0, this.date = t, this.s = this.formatDate(this.date, "utc"), this.hV = stohex(this.s)
                    }, "undefined" != typeof t && ("undefined" != typeof t.str ? this.setString(t.str) : "undefined" != typeof t.hex ? this.setStringHex(t.hex) : "undefined" != typeof t.date && this.setByDate(t.date))
                }, ji.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERGeneralizedTime = function (t) {
                    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, t), this.hT = "18", this.setByDate = function (t) {
                        this.hTLV = null, this.isModified = !0, this.date = t, this.s = this.formatDate(this.date, "gen"), this.hV = stohex(this.s)
                    }, "undefined" != typeof t && ("undefined" != typeof t.str ? this.setString(t.str) : "undefined" != typeof t.hex ? this.setStringHex(t.hex) : "undefined" != typeof t.date && this.setByDate(t.date))
                }, ji.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERSequence = function (t) {
                    KJUR.asn1.DERSequence.superclass.constructor.call(this, t), this.hT = "30", this.getFreshValueHex = function () {
                        for (var t = "", e = 0; e < this.asn1Array.length; e++) {
                            var i = this.asn1Array[e];
                            t += i.getEncodedHex()
                        }
                        return this.hV = t, this.hV
                    }
                }, ji.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERSet = function (t) {
                    KJUR.asn1.DERSet.superclass.constructor.call(this, t), this.hT = "31", this.getFreshValueHex = function () {
                        for (var t = new Array, e = 0; e < this.asn1Array.length; e++) {
                            var i = this.asn1Array[e];
                            t.push(i.getEncodedHex())
                        }
                        return t.sort(), this.hV = t.join(""), this.hV
                    }
                }, ji.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERTaggedObject = function (t) {
                    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this), this.hT = "a0", this.hV = "", this.isExplicit = !0, this.asn1Object = null, this.setASN1Object = function (t, e, i) {
                        this.hT = e, this.isExplicit = t, this.asn1Object = i, this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(), this.hTLV = null, this.isModified = !0) : (this.hV = null, this.hTLV = i.getEncodedHex(), this.hTLV = this.hTLV.replace(/^../, e), this.isModified = !1)
                    }, this.getFreshValueHex = function () {
                        return this.hV
                    }, "undefined" != typeof t && ("undefined" != typeof t.tag && (this.hT = t.tag), "undefined" != typeof t.explicit && (this.isExplicit = t.explicit), "undefined" != typeof t.obj && (this.asn1Object = t.obj, this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)))
                }, ji.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object), function (t) {
                    "use strict";
                    var e, i = {};
                    i.decode = function (i) {
                        var r;
                        if (e === t) {
                            var s = "0123456789ABCDEF", n = " \f\n\r	Â \u2028\u2029";
                            for (e = [], r = 0; 16 > r; ++r)e[s.charAt(r)] = r;
                            for (s = s.toLowerCase(), r = 10; 16 > r; ++r)e[s.charAt(r)] = r;
                            for (r = 0; r < n.length; ++r)e[n.charAt(r)] = -1
                        }
                        var o = [], h = 0, a = 0;
                        for (r = 0; r < i.length; ++r) {
                            var u = i.charAt(r);
                            if ("=" == u)break;
                            if (u = e[u], -1 != u) {
                                if (u === t)throw"Illegal character at offset " + r;
                                h |= u, ++a >= 2 ? (o[o.length] = h, h = 0, a = 0) : h <<= 4
                            }
                        }
                        if (a)throw"Hex encoding incomplete: 4 bits missing";
                        return o
                    }, window.Hex = i
                }(), function (t) {
                    "use strict";
                    var e, i = {};
                    i.decode = function (i) {
                        var r;
                        if (e === t) {
                            var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = "= \f\n\r	Â \u2028\u2029";
                            for (e = [], r = 0; 64 > r; ++r)e[s.charAt(r)] = r;
                            for (r = 0; r < n.length; ++r)e[n.charAt(r)] = -1
                        }
                        var o = [], h = 0, a = 0;
                        for (r = 0; r < i.length; ++r) {
                            var u = i.charAt(r);
                            if ("=" == u)break;
                            if (u = e[u], -1 != u) {
                                if (u === t)throw"Illegal character at offset " + r;
                                h |= u, ++a >= 4 ? (o[o.length] = h >> 16, o[o.length] = h >> 8 & 255, o[o.length] = 255 & h, h = 0, a = 0) : h <<= 6
                            }
                        }
                        switch (a) {
                            case 1:
                                throw"Base64 encoding incomplete: at least 2 bits missing";
                            case 2:
                                o[o.length] = h >> 10;
                                break;
                            case 3:
                                o[o.length] = h >> 16, o[o.length] = h >> 8 & 255
                        }
                        return o
                    }, i.re = /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/, i.unarmor = function (t) {
                        var e = i.re.exec(t);
                        if (e)if (e[1])t = e[1]; else {
                            if (!e[2])throw"RegExp out of sync";
                            t = e[2]
                        }
                        return i.decode(t)
                    }, window.Base64 = i
                }(), function (t) {
                    "use strict";
                    function e(t, i) {
                        t instanceof e ? (this.enc = t.enc, this.pos = t.pos) : (this.enc = t, this.pos = i)
                    }

                    function i(t, e, i, r, s) {
                        this.stream = t, this.header = e, this.length = i, this.tag = r, this.sub = s
                    }

                    var r = 100, s = "\u2026", n = {
                        tag: function (t, e) {
                            var i = document.createElement(t);
                            return i.className = e, i
                        }, text: function (t) {
                            return document.createTextNode(t)
                        }
                    };
                    e.prototype.get = function (e) {
                        if (e === t && (e = this.pos++), e >= this.enc.length)throw"Requesting byte offset " + e + " on a stream of length " + this.enc.length;
                        return this.enc[e]
                    }, e.prototype.hexDigits = "0123456789ABCDEF", e.prototype.hexByte = function (t) {
                        return this.hexDigits.charAt(t >> 4 & 15) + this.hexDigits.charAt(15 & t)
                    }, e.prototype.hexDump = function (t, e, i) {
                        for (var r = "", s = t; e > s; ++s)if (r += this.hexByte(this.get(s)), i !== !0)switch (15 & s) {
                            case 7:
                                r += "  ";
                                break;
                            case 15:
                                r += "\n";
                                break;
                            default:
                                r += " "
                        }
                        return r
                    }, e.prototype.parseStringISO = function (t, e) {
                        for (var i = "", r = t; e > r; ++r)i += String.fromCharCode(this.get(r));
                        return i
                    }, e.prototype.parseStringUTF = function (t, e) {
                        for (var i = "", r = t; e > r;) {
                            var s = this.get(r++);
                            i += 128 > s ? String.fromCharCode(s) : s > 191 && 224 > s ? String.fromCharCode((31 & s) << 6 | 63 & this.get(r++)) : String.fromCharCode((15 & s) << 12 | (63 & this.get(r++)) << 6 | 63 & this.get(r++))
                        }
                        return i
                    }, e.prototype.parseStringBMP = function (t, e) {
                        for (var i = "", r = t; e > r; r += 2) {
                            var s = this.get(r), n = this.get(r + 1);
                            i += String.fromCharCode((s << 8) + n)
                        }
                        return i
                    }, e.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, e.prototype.parseTime = function (t, e) {
                        var i = this.parseStringISO(t, e), r = this.reTime.exec(i);
                        return r ? (i = r[1] + "-" + r[2] + "-" + r[3] + " " + r[4], r[5] && (i += ":" + r[5], r[6] && (i += ":" + r[6], r[7] && (i += "." + r[7]))), r[8] && (i += " UTC", "Z" != r[8] && (i += r[8], r[9] && (i += ":" + r[9]))), i) : "Unrecognized time: " + i
                    }, e.prototype.parseInteger = function (t, e) {
                        var i = e - t;
                        if (i > 4) {
                            i <<= 3;
                            var r = this.get(t);
                            if (0 === r)i -= 8; else for (; 128 > r;)r <<= 1, --i;
                            return "(" + i + " bit)"
                        }
                        for (var s = 0, n = t; e > n; ++n)s = s << 8 | this.get(n);
                        return s
                    }, e.prototype.parseBitString = function (t, e) {
                        var i = this.get(t), r = (e - t - 1 << 3) - i, s = "(" + r + " bit)";
                        if (20 >= r) {
                            var n = i;
                            s += " ";
                            for (var o = e - 1; o > t; --o) {
                                for (var h = this.get(o), a = n; 8 > a; ++a)s += h >> a & 1 ? "1" : "0";
                                n = 0
                            }
                        }
                        return s
                    }, e.prototype.parseOctetString = function (t, e) {
                        var i = e - t, n = "(" + i + " byte) ";
                        i > r && (e = t + r);
                        for (var o = t; e > o; ++o)n += this.hexByte(this.get(o));
                        return i > r && (n += s), n
                    }, e.prototype.parseOID = function (t, e) {
                        for (var i = "", r = 0, s = 0, n = t; e > n; ++n) {
                            var o = this.get(n);
                            if (r = r << 7 | 127 & o, s += 7, !(128 & o)) {
                                if ("" === i) {
                                    var h = 80 > r ? 40 > r ? 0 : 1 : 2;
                                    i = h + "." + (r - 40 * h)
                                } else i += "." + (s >= 31 ? "bigint" : r);
                                r = s = 0
                            }
                        }
                        return i
                    }, i.prototype.typeName = function () {
                        if (this.tag === t)return "unknown";
                        var e = this.tag >> 6, i = (this.tag >> 5 & 1, 31 & this.tag);
                        switch (e) {
                            case 0:
                                switch (i) {
                                    case 0:
                                        return "EOC";
                                    case 1:
                                        return "BOOLEAN";
                                    case 2:
                                        return "INTEGER";
                                    case 3:
                                        return "BIT_STRING";
                                    case 4:
                                        return "OCTET_STRING";
                                    case 5:
                                        return "NULL";
                                    case 6:
                                        return "OBJECT_IDENTIFIER";
                                    case 7:
                                        return "ObjectDescriptor";
                                    case 8:
                                        return "EXTERNAL";
                                    case 9:
                                        return "REAL";
                                    case 10:
                                        return "ENUMERATED";
                                    case 11:
                                        return "EMBEDDED_PDV";
                                    case 12:
                                        return "UTF8String";
                                    case 16:
                                        return "SEQUENCE";
                                    case 17:
                                        return "SET";
                                    case 18:
                                        return "NumericString";
                                    case 19:
                                        return "PrintableString";
                                    case 20:
                                        return "TeletexString";
                                    case 21:
                                        return "VideotexString";
                                    case 22:
                                        return "IA5String";
                                    case 23:
                                        return "UTCTime";
                                    case 24:
                                        return "GeneralizedTime";
                                    case 25:
                                        return "GraphicString";
                                    case 26:
                                        return "VisibleString";
                                    case 27:
                                        return "GeneralString";
                                    case 28:
                                        return "UniversalString";
                                    case 30:
                                        return "BMPString";
                                    default:
                                        return "Universal_" + i.toString(16)
                                }
                            case 1:
                                return "Application_" + i.toString(16);
                            case 2:
                                return "[" + i + "]";
                            case 3:
                                return "Private_" + i.toString(16)
                        }
                    }, i.prototype.reSeemsASCII = /^[ -~]+$/, i.prototype.content = function () {
                        if (this.tag === t)return null;
                        var e = this.tag >> 6, i = 31 & this.tag, n = this.posContent(), o = Math.abs(this.length);
                        if (0 !== e) {
                            if (null !== this.sub)return "(" + this.sub.length + " elem)";
                            var h = this.stream.parseStringISO(n, n + Math.min(o, r));
                            return this.reSeemsASCII.test(h) ? h.substring(0, 2 * r) + (h.length > 2 * r ? s : "") : this.stream.parseOctetString(n, n + o)
                        }
                        switch (i) {
                            case 1:
                                return 0 === this.stream.get(n) ? "false" : "true";
                            case 2:
                                return this.stream.parseInteger(n, n + o);
                            case 3:
                                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(n, n + o);
                            case 4:
                                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(n, n + o);
                            case 6:
                                return this.stream.parseOID(n, n + o);
                            case 16:
                            case 17:
                                return "(" + this.sub.length + " elem)";
                            case 12:
                                return this.stream.parseStringUTF(n, n + o);
                            case 18:
                            case 19:
                            case 20:
                            case 21:
                            case 22:
                            case 26:
                                return this.stream.parseStringISO(n, n + o);
                            case 30:
                                return this.stream.parseStringBMP(n, n + o);
                            case 23:
                            case 24:
                                return this.stream.parseTime(n, n + o)
                        }
                        return null
                    }, i.prototype.toString = function () {
                        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]"
                    }, i.prototype.print = function (e) {
                        if (e === t && (e = ""), document.writeln(e + this), null !== this.sub) {
                            e += "  ";
                            for (var i = 0, r = this.sub.length; r > i; ++i)this.sub[i].print(e)
                        }
                    }, i.prototype.toPrettyString = function (e) {
                        e === t && (e = "");
                        var i = e + this.typeName() + " @" + this.stream.pos;
                        if (this.length >= 0 && (i += "+"), i += this.length, 32 & this.tag ? i += " (constructed)" : 3 != this.tag && 4 != this.tag || null === this.sub || (i += " (encapsulates)"), i += "\n", null !== this.sub) {
                            e += "  ";
                            for (var r = 0, s = this.sub.length; s > r; ++r)i += this.sub[r].toPrettyString(e)
                        }
                        return i
                    }, i.prototype.toDOM = function () {
                        var t = n.tag("div", "node");
                        t.asn1 = this;
                        var e = n.tag("div", "head"), i = this.typeName().replace(/_/g, " ");
                        e.innerHTML = i;
                        var r = this.content();
                        if (null !== r) {
                            r = String(r).replace(/</g, "&lt;");
                            var s = n.tag("span", "preview");
                            s.appendChild(n.text(r)), e.appendChild(s)
                        }
                        t.appendChild(e), this.node = t, this.head = e;
                        var o = n.tag("div", "value");
                        if (i = "Offset: " + this.stream.pos + "<br/>", i += "Length: " + this.header + "+", i += this.length >= 0 ? this.length : -this.length + " (undefined)", 32 & this.tag ? i += "<br/>(constructed)" : 3 != this.tag && 4 != this.tag || null === this.sub || (i += "<br/>(encapsulates)"), null !== r && (i += "<br/>Value:<br/><b>" + r + "</b>", "object" == typeof oids && 6 == this.tag)) {
                            var h = oids[r];
                            h && (h.d && (i += "<br/>" + h.d), h.c && (i += "<br/>" + h.c), h.w && (i += "<br/>(warning!)"))
                        }
                        o.innerHTML = i, t.appendChild(o);
                        var a = n.tag("div", "sub");
                        if (null !== this.sub)for (var u = 0, c = this.sub.length; c > u; ++u)a.appendChild(this.sub[u].toDOM());
                        return t.appendChild(a), e.onclick = function () {
                            t.className = "node collapsed" == t.className ? "node" : "node collapsed"
                        }, t
                    }, i.prototype.posStart = function () {
                        return this.stream.pos
                    }, i.prototype.posContent = function () {
                        return this.stream.pos + this.header
                    }, i.prototype.posEnd = function () {
                        return this.stream.pos + this.header + Math.abs(this.length)
                    }, i.prototype.fakeHover = function (t) {
                        this.node.className += " hover", t && (this.head.className += " hover")
                    }, i.prototype.fakeOut = function (t) {
                        var e = / ?hover/;
                        this.node.className = this.node.className.replace(e, ""), t && (this.head.className = this.head.className.replace(e, ""))
                    }, i.prototype.toHexDOM_sub = function (t, e, i, r, s) {
                        if (!(r >= s)) {
                            var o = n.tag("span", e);
                            o.appendChild(n.text(i.hexDump(r, s))), t.appendChild(o)
                        }
                    }, i.prototype.toHexDOM = function (e) {
                        var i = n.tag("span", "hex");
                        if (e === t && (e = i), this.head.hexNode = i, this.head.onmouseover = function () {
                                this.hexNode.className = "hexCurrent"
                            }, this.head.onmouseout = function () {
                                this.hexNode.className = "hex"
                            }, i.asn1 = this, i.onmouseover = function () {
                                var t = !e.selected;
                                t && (e.selected = this.asn1, this.className = "hexCurrent"), this.asn1.fakeHover(t)
                            }, i.onmouseout = function () {
                                var t = e.selected == this.asn1;
                                this.asn1.fakeOut(t), t && (e.selected = null, this.className = "hex")
                            }, this.toHexDOM_sub(i, "tag", this.stream, this.posStart(), this.posStart() + 1), this.toHexDOM_sub(i, this.length >= 0 ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent()), null === this.sub)i.appendChild(n.text(this.stream.hexDump(this.posContent(), this.posEnd()))); else if (this.sub.length > 0) {
                            var r = this.sub[0], s = this.sub[this.sub.length - 1];
                            this.toHexDOM_sub(i, "intro", this.stream, this.posContent(), r.posStart());
                            for (var o = 0, h = this.sub.length; h > o; ++o)i.appendChild(this.sub[o].toHexDOM(e));
                            this.toHexDOM_sub(i, "outro", this.stream, s.posEnd(), this.posEnd())
                        }
                        return i
                    }, i.prototype.toHexString = function () {
                        return this.stream.hexDump(this.posStart(), this.posEnd(), !0)
                    }, i.decodeLength = function (t) {
                        var e = t.get(), i = 127 & e;
                        if (i == e)return i;
                        if (i > 3)throw"Length over 24 bits not supported at position " + (t.pos - 1);
                        if (0 === i)return -1;
                        e = 0;
                        for (var r = 0; i > r; ++r)e = e << 8 | t.get();
                        return e
                    }, i.hasContent = function (t, r, s) {
                        if (32 & t)return !0;
                        if (3 > t || t > 4)return !1;
                        var n = new e(s);
                        3 == t && n.get();
                        var o = n.get();
                        if (o >> 6 & 1)return !1;
                        try {
                            var h = i.decodeLength(n);
                            return n.pos - s.pos + h == r
                        } catch (a) {
                            return !1
                        }
                    }, i.decode = function (t) {
                        t instanceof e || (t = new e(t, 0));
                        var r = new e(t), s = t.get(), n = i.decodeLength(t), o = t.pos - r.pos, h = null;
                        if (i.hasContent(s, n, t)) {
                            var a = t.pos;
                            if (3 == s && t.get(), h = [], n >= 0) {
                                for (var u = a + n; t.pos < u;)h[h.length] = i.decode(t);
                                if (t.pos != u)throw"Content size is not correct for container starting at offset " + a
                            } else try {
                                for (; ;) {
                                    var c = i.decode(t);
                                    if (0 === c.tag)break;
                                    h[h.length] = c
                                }
                                n = a - t.pos
                            } catch (f) {
                                throw"Exception while decoding undefined length content: " + f
                            }
                        } else t.pos += n;
                        return new i(r, o, n, s, h)
                    }, i.test = function () {
                        for (var t = [
                            {
                                value: [39],
                                expected: 39
                            },
                            {
                                value: [129, 201],
                                expected: 201
                            },
                            {
                                value: [131, 254, 220, 186],
                                expected: 16702650
                            }
                        ], r = 0, s = t.length; s > r; ++r) {
                            var n = new e(t[r].value, 0), o = i.decodeLength(n);
                            o != t[r].expected && document.write("In test[" + r + "] expected " + t[r].expected + " got " + o + "\n")
                        }
                    }, window.ASN1 = i
                }(), ASN1.prototype.getHexStringValue = function () {
                    var t = this.toHexString(), e = 2 * this.header, i = 2 * this.length;
                    return t.substr(e, i)
                }, pi.prototype.parseKey = function (t) {
                    try {
                        var e = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/, i = e.test(t) ? Hex.decode(t) : Base64.unarmor(t), r = ASN1.decode(i);
                        if (9 === r.sub.length) {
                            var s = r.sub[1].getHexStringValue();
                            this.n = ci(s, 16);
                            var n = r.sub[2].getHexStringValue();
                            this.e = parseInt(n, 16);
                            var o = r.sub[3].getHexStringValue();
                            this.d = ci(o, 16);
                            var h = r.sub[4].getHexStringValue();
                            this.p = ci(h, 16);
                            var a = r.sub[5].getHexStringValue();
                            this.q = ci(a, 16);
                            var u = r.sub[6].getHexStringValue();
                            this.dmp1 = ci(u, 16);
                            var c = r.sub[7].getHexStringValue();
                            this.dmq1 = ci(c, 16);
                            var f = r.sub[8].getHexStringValue();
                            this.coeff = ci(f, 16)
                        } else {
                            if (2 !== r.sub.length)return !1;
                            var p = r.sub[1], l = p.sub[0], s = l.sub[0].getHexStringValue();
                            this.n = ci(s, 16);
                            var n = l.sub[1].getHexStringValue();
                            this.e = parseInt(n, 16)
                        }
                        return !0
                    } catch (d) {
                        return !1
                    }
                }, pi.prototype.getPrivateBaseKey = function () {
                    var t = {
                        array: [
                            new KJUR.asn1.DERInteger({"int": 0}),
                            new KJUR.asn1.DERInteger({bigint: this.n}),
                            new KJUR.asn1.DERInteger({"int": this.e}),
                            new KJUR.asn1.DERInteger({bigint: this.d}),
                            new KJUR.asn1.DERInteger({bigint: this.p}),
                            new KJUR.asn1.DERInteger({bigint: this.q}),
                            new KJUR.asn1.DERInteger({bigint: this.dmp1}),
                            new KJUR.asn1.DERInteger({bigint: this.dmq1}),
                            new KJUR.asn1.DERInteger({bigint: this.coeff})
                        ]
                    }, e = new KJUR.asn1.DERSequence(t);
                    return e.getEncodedHex()
                }, pi.prototype.getPrivateBaseKeyB64 = function () {
                    return Ri(this.getPrivateBaseKey())
                }, pi.prototype.getPublicBaseKey = function () {
                    var t = {
                        array: [
                            new KJUR.asn1.DERObjectIdentifier({oid: "1.2.840.113549.1.1.1"}),
                            new KJUR.asn1.DERNull
                        ]
                    }, e = new KJUR.asn1.DERSequence(t);
                    t = {
                        array: [
                            new KJUR.asn1.DERInteger({bigint: this.n}),
                            new KJUR.asn1.DERInteger({"int": this.e})
                        ]
                    };
                    var i = new KJUR.asn1.DERSequence(t);
                    t = {hex: "00" + i.getEncodedHex()};
                    var r = new KJUR.asn1.DERBitString(t);
                    t = {array: [e, r]};
                    var s = new KJUR.asn1.DERSequence(t);
                    return s.getEncodedHex()
                }, pi.prototype.getPublicBaseKeyB64 = function () {
                    return Ri(this.getPublicBaseKey())
                }, pi.prototype.wordwrap = function (t, e) {
                    if (e = e || 64, !t)return t;
                    var i = "(.{1," + e + "})( +|$\n?)|(.{1," + e + "})";
                    return t.match(RegExp(i, "g")).join("\n")
                }, pi.prototype.getPrivateKey = function () {
                    var t = "-----BEGIN RSA PRIVATE KEY-----\n";
                    return t += this.wordwrap(this.getPrivateBaseKeyB64()) + "\n", t += "-----END RSA PRIVATE KEY-----"
                }, pi.prototype.getPublicKey = function () {
                    var t = "-----BEGIN PUBLIC KEY-----\n";
                    return t += this.wordwrap(this.getPublicBaseKeyB64()) + "\n", t += "-----END PUBLIC KEY-----"
                }, pi.prototype.hasPublicKeyProperty = function (t) {
                    return t = t || {}, t.hasOwnProperty("n") && t.hasOwnProperty("e")
                }, pi.prototype.hasPrivateKeyProperty = function (t) {
                    return t = t || {}, t.hasOwnProperty("n") && t.hasOwnProperty("e") && t.hasOwnProperty("d") && t.hasOwnProperty("p") && t.hasOwnProperty("q") && t.hasOwnProperty("dmp1") && t.hasOwnProperty("dmq1") && t.hasOwnProperty("coeff")
                }, pi.prototype.parsePropertiesFrom = function (t) {
                    this.n = t.n, this.e = t.e, t.hasOwnProperty("d") && (this.d = t.d, this.p = t.p, this.q = t.q, this.dmp1 = t.dmp1, this.dmq1 = t.dmq1, this.coeff = t.coeff)
                };
                var Zi = function (t) {
                    pi.call(this), t && ("string" == typeof t ? this.parseKey(t) : (this.hasPrivateKeyProperty(t) || this.hasPublicKeyProperty(t)) && this.parsePropertiesFrom(t))
                };
                Zi.prototype = new pi, Zi.prototype.constructor = Zi;
                var Gi = function (t) {
                    t = t || {}, this.default_key_size = parseInt(t.default_key_size) || 1024, this.default_public_exponent = t.default_public_exponent || "010001", this.log = t.log || !1, this.key = null
                };
                Gi.prototype.setKey = function (t) {
                    this.log && this.key && console.warn("A key was already set, overriding existing."), this.key = new Zi(t)
                }, Gi.prototype.setPrivateKey = function (t) {
                    this.setKey(t)
                }, Gi.prototype.setPublicKey = function (t) {
                    this.setKey(t)
                }, Gi.prototype.decrypt = function (t) {
                    try {
                        return this.getKey().decrypt(Di(t))
                    } catch (e) {
                        return !1
                    }
                }, Gi.prototype.encrypt = function (t) {
                    try {
                        return Ri(this.getKey().encrypt(t))
                    } catch (e) {
                        return console.log(arguments), !1
                    }
                }, Gi.prototype.getKey = function (t) {
                    if (!this.key) {
                        if (this.key = new Zi, t && "[object Function]" === {}.toString.call(t))return this.key.generateAsync(this.default_key_size, this.default_public_exponent, t), void 0;
                        this.key.generate(this.default_key_size, this.default_public_exponent)
                    }
                    return this.key
                }, Gi.prototype.getPrivateKey = function () {
                    return this.getKey().getPrivateKey()
                }, Gi.prototype.getPrivateKeyB64 = function () {
                    return this.getKey().getPrivateBaseKeyB64()
                }, Gi.prototype.getPublicKey = function () {
                    return this.getKey().getPublicKey()
                }, Gi.prototype.getPublicKeyB64 = function () {
                    return this.getKey().getPublicBaseKeyB64()
                }, t.JSEncrypt = Gi
            }(e.RSA), e.RSA = e.RSA.JSEncrypt
        }
    }
});
_.Module.define({
    path: "tbmall/widget/paykey_dialog",
    requires: ["tbmall/widget/paykey_rsa"],
    sub: {
        ERROR: {
            2270018: "",
            1990005: "\u652F\u4ED8\u5BC6\u7801\u9A8C\u8BC1\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF0C\u60A8\u8FD8\u6709{#NUM#}\u6B21\u8F93\u5165\u673A\u4F1A",
            2190005: '\u4F60\u5DF2\u8F93\u5165\u5BC6\u7801\u9519\u8BEF5\u6B21\uFF0C\u652F\u4ED8\u5BC6\u7801\u88AB\u9501\u5B9A\uFF0C\u8BF7<a target="_blank" href="/tbmall/pass/set">\u627E\u56DE\u5BC6\u7801</a>'
        },
        MAX_ERR_TIME: 5,
        _setTpl: [
            '<div id="paykey_set_dialog" class="paykey_set_dialog clearfix">',
            "<p>\u8BF7\u8BBE\u7F6E\u652F\u4ED8\u5BC6\u7801\u540E\u5B8C\u6210\u6D88\u8D39</br>\uFF08\u53EF\u964D\u4F4ET\u8C46\u88AB\u76D7\u98CE\u9669\uFF0C\u4FDD\u969C\u8D22\u4EA7\u5B89\u5168\uFF09</p>",
            '<div class="paykey_btn_area clearfix">',
            '<a href="/tbmall/pass/set" target="_blank" class="paykey_set_accept_btn paykey_set_btn" id="paykey_set_accept_btn">\u7ACB\u5373\u8BBE\u7F6E</a>',
            '<a href="#" class="paykey_set_cancel_btn paykey_set_btn" id="paykey_set_cancel_btn">\u4E0B\u6B21\u518D\u8BF4</a>',
            "</div>",
            "</div>"
        ].join(""),
        _inputTpl: [
            '<div id="paykey_set_dialog" class="paykey_set_dialog clearfix">',
            '<form id="paykey_set_form">',
            '<div class="paykey_input_area">',
            "<span>\u8BF7\u8F93\u5165\u652F\u4ED8\u5BC6\u7801</span>",
            '<input type="password" class="j_paykey_input paykey_input" id="paykey_input"/>',
            '<p id="paykey_input_msg" class="paykey_input_msg">{#ERROR#}</p>',
            "</div>",
            '<div class="paykey_btn_area clearfix">',
            '<a class="j_paykey_submit_btn paykey_submit_btn paykey_set_btn" id="paykey_submit_btn">\u63D0\u4EA4</a>',
            '<a href="/tbmall/pass/set" target="_blank" class="j_paykey_cancel_btn  paykey_set_btn" id="paykey_cancel_btn">\u5FD8\u8BB0\u5BC6\u7801</a>',
            "</div>",
            "</form>",
            "</div>"
        ].join(""),
        _dialog: null,
        conf: {},
        initial: function (a) {
            this.conf = $.extend(this.conf, a), this.RSA = this.use("tbmall/widget/paykey_rsa")
        },
        showDialog: function (a, e, t) {
            var i = e;
            2 == arguments.length && (t = e, i = null), 2 === this.conf.showType ? this.inputPasskeyDialog(a, i, t) : 1 === this.conf.showType ? this.setPasskeyDialog(a, i, t) : "function" == typeof a && (t ? a.call(t) : a())
        },
        inputPasskeyDialog: function (a, e, t) {
            var i = this;
            2 == arguments.length && (t = e);
            var s = this._inputTpl;
            if (this.conf.errType && (s = s.replace("{#ERROR#}", this.ERROR[this.conf.errType])), this.conf.errTime) {
                var n = this.MAX_ERR_TIME - this.conf.errTime;
                s = s.replace("{#NUM#}", n)
            }
            this._dialog = new $.dialog({html: s, title: "\u652F\u4ED8\u5BC6\u7801", draggable: !1, width: 420});
            var l = function () {
                var e = $("#paykey_input").val();
                if (!e)return $("#paykey_input_msg").text("\u8BF7\u8F93\u5165\u652F\u4ED8\u5BC6\u7801"), void 0;
                var s = i.RSA.vcode(e);
                "function" == typeof a && (t ? a.call(t, {password: s}) : a({password: s})), i._dialog.close()
            };
            $("#paykey_submit_btn").click(function (a) {
                a.preventDefault(), l()
            }), $("#paykey_set_form").submit(function (a) {
                a.preventDefault(), l()
            }), this._dialog.onclose(function () {
                "function" == typeof e && (t ? e.call(t) : e())
            })
        },
        setPasskeyDialog: function (a, e, t) {
            var i = this;
            2 == arguments.length && (t = e), this._dialog = new $.dialog({
                html: this._setTpl,
                title: "\u63D0\u793A",
                draggable: !1,
                width: 420
            }), $("#paykey_set_accept_btn").click(function () {
                i._dialog.close()
            }), $("#paykey_set_cancel_btn").click(function () {
                i._dialog.close()
            }), this._dialog.element.find(".dialogJclose").on("click", function () {
                "function" == typeof e && (t ? e.call(t, {ignore_set_paypass: 1}) : e({ignore_set_paypass: 1}))
            })
        }
    }
});
_.Module.define({
    path: "tbmall/widget/paykey_mobile",
    requires: [],
    sub: {
        _conf: {token: "", type: "bind"},
        initial: function (e) {
            this._conf = $.extend(this._conf, e)
        },
        show: function (e, i, s, t) {
            "check" === this._conf.type ? this.showMobileCheck(e, i, s, t) : this.showMobileBind(e, i, s, t)
        },
        showMobileCheck: function (e, i, s, t) {
            var o = this, n = "undefined" != typeof Env && Env.server_time ? Env.server_time : (new Date).getTime();
            PageData.user.setpass;
            var c = t || "\u4E3A\u4E86\u4FDD\u969C\u60A8\u7684\u8D22\u4EA7\u5B89\u5168\uFF0C\u8BF7\u9A8C\u8BC1\u5BC6\u4FDD\u624B\u673A\u540E\u8FDB\u884C\u652F\u4ED8\u3002";
            $.JsLoadManager.use([
                "http://passport.baidu.com/passApi/js/uni_forceverify_wrapper.js?cdnversion=" + Math.floor(n / 6e4),
                "http://passport.bdimg.com/passApi/js/wrapper.js?cdnversion=" + Math.floor(n / 6e4)
            ], function () {
                var t = passport.pop.initForceverify({
                    token: o._conf.token,
                    curType: "mobile",
                    title: "\u6D88\u8D39\u9A8C\u8BC1\u5BC6\u4FDD\u624B\u673A",
                    msg: c,
                    onRender: function () {
                        var e = $(this.getById("mask")), i = $(this.getById("wrapper"));
                        e.css("zIndex", 5e4 + parseInt(e.css("zIndex"))), i.css("zIndex", 5e4 + parseInt(i.css("zIndex")))
                    },
                    onHide: function () {
                        s = s || o, "function" == typeof i && i.call(s, {})
                    },
                    onSendvcodeSuccess: function () {
                    },
                    onSubmitSuccess: function () {
                        s = s || o, "function" == typeof e && e.call(s, {mobile_check: 1})
                    }
                });
                t.show()
            }, !0, "utf-8")
        },
        showMobileBind: function (e, i, s, t) {
            var o = this;
            if (o.bindMobileDialog)return o.bindMobileDialog.show(), void 0;
            var n = "undefined" != typeof Env && Env.server_time ? Env.server_time : (new Date).getTime();
            $.JsLoadManager.use([
                "http://passport.baidu.com/passApi/js/uni_armorwidget_wrapper.js?cdnversion=" + Math.floor(n / 6e4),
                "http://passport.bdimg.com/passApi/js/wrapper.js?cdnversion=" + Math.floor(n / 6e4)
            ], function () {
                var n = t || "\u7ED1\u5B9A\u624B\u673A\u662F\u76EE\u524D\u6700\u7B80\u5355\u6709\u6548\u964D\u4F4E\u8D26\u53F7\u88AB\u76D7\u98CE\u9669\u7684\u65B9\u6CD5~\u8BF7\u7ED1\u5B9A\u540E\u8FDB\u884C\u652F\u4ED8";
                o._conf.firstFlag && (n = "\u4E3A\u4FDD\u969C\u8D22\u4EA7\u5B89\u5168\uFF0C\u5EFA\u8BAE\u60A8\u7ED1\u5B9A\u624B\u673A\u540E\u8FDB\u884C\u6D88\u8D39\uFF0C\u82E5\u60F3\u6B8B\u5FCD\u7684\u62D2\u7EDD\u8BF7\u5173\u95ED\u6D6E\u5C42\u540E\u7EE7\u7EED\u6D88\u8D39\u3002"), o.bindMobileDialog = passport.pop.ArmorWidget("bindmobile", {
                    token: o._conf.token,
                    title: "\u5B89\u5168\u53CB\u60C5\u63D0\u793A",
                    msg: n,
                    auth_title: "\u6D88\u8D39\u9A8C\u8BC1\u5BC6\u4FDD\u624B\u673A",
                    auth_msg: "\u60A8\u6B63\u5728\u8FDB\u884C\u652F\u4ED8\u5BC6\u7801\u8BBE\u7F6E\uFF0C\u4E3A\u4E86\u60A8\u7684\u8D26\u53F7\u5B89\u5168\uFF0C\u8BF7\u5148\u9A8C\u8BC1\u5BC6\u4FDD\u4FE1\u606F\u3002",
                    onRender: function () {
                        var e = $(this.getById("mask")), i = $(this.getById("wrapper"));
                        e.css("zIndex", 5e4 + parseInt(e.css("zIndex"))), i.css("zIndex", 5e4 + parseInt(i.css("zIndex")))
                    },
                    onHide: function () {
                        o.bindid || (s = s || o, "function" == typeof i && i.call(s))
                    },
                    onSendvcodeSuccess: function () {
                    },
                    onSubmitSuccess: function (i) {
                        o.bindid = i.bindid, s = s || o;
                        var t = {bindid: o.bindid};
                        o.showSetMobileCheck(t, e, s)
                    }
                }), o.bindMobileDialog.show()
            }, !0, "utf-8"), $.ajax({
                url: "/tbmall/pass/setAuthPhone",
                type: "post",
                data: {type: 1, tbs: PageData.tbs}
            })
        },
        _setTpl: [
            '<a class="dialogJclose j_set_mobile_check_dialogJclose" title="\u5173\u95ED\u672C\u7A97\u53E3">&nbsp;</a>',
            '<div class="set_mobile_check_wrap" id="set_mobile_check_wrap">',
            '<div class="set_mobile_check_msg">',
            '<span class="set_mobile_check_icon"></span>',
            '<span class="set_mobile_check_title">\u64CD\u4F5C\u6210\u529F</span>',
            "</div>",
            "<p>\u4E3A\u4FDD\u969C\u8D26\u53F7T\u8C46\u5B89\u5168\uFF0C\u5EFA\u8BAE\u60A8\u9009\u62E9\u5F00\u542F\u624B\u673A\u9A8C\u8BC1\u529F\u80FD</p>",
            '<div class="set_mobile_check_operator">',
            '<a href="#" class="set_mobile_check_select">',
            '<input type="radio" class="j_set_mobile_check_ok set_mobile_check_radio" name="set_mobile_check_radio" checked/>\u5355\u7B14T\u8C46\u6D88\u8D39\u8D85\u8FC7100000\u5F00\u542F\u624B\u673A\u9A8C\u8BC1\u529F\u80FD',
            "</a>",
            '<a href="#" class="set_mobile_check_select">',
            '<input type="radio" class="j_set_mobile_check_cancel set_mobile_check_radio" name="set_mobile_check_radio"/>\u4E0D\u5F00\u542F\u624B\u673A\u9A8C\u8BC1\u529F\u80FD',
            "</a>",
            '<a href="#" class="j_set_mobile_check_submit set_mobile_check_submit ui_btn ui_btn_m"><span><em>\u786E\u5B9A</em></span></a>',
            "</div>",
            "</div>"
        ].join(""),
        showSetMobileCheck: function (e, i, s) {
            var t = this, o = new $.dialog({
                html: this._setTpl,
                showTitle: !1,
                height: 260,
                width: 420
            }), n = $(o.element);
            t.openCheck = 1;
            var c = function () {
                $.ajax({
                    url: "/tbmall/pass/setAuthPhone",
                    type: "post",
                    dataType: "json",
                    data: {type: t.openCheck, tbs: PageData.tbs},
                    success: function (e) {
                        0 === e.no ? setTimeout(function () {
                            o.close()
                        }, 1e3) : $.dialog.alert("\u6D88\u8D39\u624B\u673A\u9A8C\u8BC1\u529F\u80FD\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")
                    },
                    error: function () {
                        $.dialog.alert("\u6D88\u8D39\u624B\u673A\u9A8C\u8BC1\u529F\u80FD\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")
                    }
                })
            };
            n.find(".j_set_mobile_check_submit").click(function () {
                c()
            }), n.find(".j_set_mobile_check_ok").click(function () {
                t.openCheck = 1
            }), n.find(".j_set_mobile_check_cancel").click(function () {
                t.openCheck = 0
            }), n.find(".j_set_mobile_check_dialogJclose").click(function () {
                t.openCheck = 1, c()
            }), o.onclose(function () {
                "function" == typeof i && i.call(s, e)
            })
        }
    }
});
_.Module.define({
    path: "tbmall/widget/TbeanSafe",
    requires: ["tbmall/component/captcha_payment", "tbmall/widget/paykey_dialog", "tbmall/widget/paykey_mobile"],
    sub: {
        ERROR: {},
        initial: function (t) {
            this._initParam(t), this._handleErr()
        },
        needCheck: function () {
            return !!this.type
        },
        getType: function () {
            return this.type
        },
        _initParam: function (t) {
            t = $.extend({
                json: {}, sucCallback: function () {
                }, errCallback: function () {
                }
            }, t), this.type = 0, this._json = t.json || {}, this._no = this._json.no || this._json.errno, this._msg = this._json.msg, this._data = this._json.data || {}, this._content = t.content, this._sucCall = $.isFunction(t.sucCallback) ? t.sucCallback : function () {
            }, this._errCall = $.isFunction(t.errCallback) ? t.errCallback : function () {
            }, this._mobileMsg = "undefined" != typeof t.tbeanOptions ? t.tbeanOptions.mobileMsg : ""
        },
        _handleErr: function () {
            switch (this._no) {
                case 360007:
                case 2150040:
                    this._initCaptcha(), this.type = 1;
                    break;
                case 2270018:
                case 1990005:
                case 2190005:
                    this._initPaykey(2), this.type = 2;
                    break;
                case 2270066:
                    this._initPaykey(1), this.type = 2;
                    break;
                case 2270040:
                    this._initFirstMobile("bind"), this.type = 3;
                    break;
                case 2270041:
                    this._initMobile("bind"), this.type = 3;
                    break;
                case 2270042:
                    this._initMobile("check"), this.type = 3;
                    break;
                case 2270072:
                    this._initFrozen(), this.type = 4
            }
        },
        _initCaptcha: function () {
            var t = this.use("tbmall/component/captcha_payment", {data: this._json});
            t.showCaptcha(this._sucCall, this._content, this._errCall)
        },
        _initPaykey: function (t) {
            var i = this.use("tbmall/widget/paykey_dialog", {
                showType: t,
                errType: this._no,
                errTime: this._data.wrongtime
            });
            i.showDialog(this._sucCall, this._errCall, this._content)
        },
        _initMobile: function (t) {
            var i = this, e = this.use("tbmall/widget/paykey_mobile", {token: i._data.token, type: t});
            e.show(this._sucCall, this._errCall, this._content, this._mobileMsg)
        },
        _initFirstMobile: function (t) {
            var i = this, e = this.use("tbmall/widget/paykey_mobile", {token: i._data.token, type: t, firstFlag: !0});
            e.show(this._sucCall, this._sucCall, this._content)
        },
        _FROZEN_TPL: [
            '<div id="tdou_frozen_dialog" class="tdou_frozen_dialog clearfix">',
            "<p>\u60A8\u7684\u8D26\u53F7\u5904\u4E8E\u5F02\u5E38\u72B6\u6001\uFF0C\u6682\u65F6\u4E0D\u80FD\u6D88\u8D39T\u8C46\uFF0C\u7ED9\u60A8\u9020\u6210\u7684\u4E0D\u4FBF\u656C\u8BF7\u8C05\u89E3\u3002</p>",
            '<div class="tdou_frozen_btn_area clearfix">',
            '<a href="#" target="_blank" class="tdou_frozen_accept_btn tdou_frozen_btn" id="tdou_frozen_accept_btn">\u786E\u5B9A</a>',
            '<a href="#" class="tdou_frozen_cancel_btn tdou_frozen_btn" id="tdou_frozen_cancel_btn">\u53D6\u6D88</a>',
            "</div>",
            "</div>"
        ].join(""),
        _initFrozen: function () {
            var t = this, i = new $.dialog({html: t._FROZEN_TPL, title: "T\u8C46\u51BB\u7ED3\u63D0\u793A"});
            $(i.element).find(".tdou_frozen_btn").click(function (t) {
                t.preventDefault(), i.close()
            }), i.onclose(function () {
                "function" == typeof t._errCall && t._errCall()
            })
        }
    }
});
_.Module.define({
    path: "pcommon/widget/ParamsXssHandler",
    requires: [],
    sub: {
        _escapeKeyArray: ["title", "prefix", "kw", "word"], initial: function (e) {
            e && e.escapeKeyArray && e.escapeKeyArray.length > 0 && (this._escapeKeyArray = e.escapeKeyArray)
        }, xssFilter: function (e) {
            var r = $.extend({}, e), a = $.tb.escapeHTML, s = this._escapeKeyArray;
            return $.each(s, function (i) {
                var t = s[i], n = e[t];
                void 0 !== n && (r[t] = a(n))
            }), r
        }
    }
});
_.Module.define({
    path: "common/widget/PostService/PostResultHandlerManager", requires: [], sub: {
        initial: function () {
            this.isBlock = PageData && PageData.user && PageData.user.is_block, this.isBlockBySys = this.isBlock && PageData.user.balv && PageData.user.balv.is_by_pm, this._initHandlerMap()
        },
        _initHandlerMap: function () {
            function t(t, e) {
                var r = this;
                _.Module.use("common/component/CaptchaDialog", {
                    message: t.data.vcode.str_reason,
                    vCode: t.data.vcode.captcha_vcode_str,
                    vCodeType: t.data.vcode.captcha_code_type,
                    exceptionalAccount: 1 == t.data.vcode.userstatevcode,
                    forumName: e.kw,
                    forumId: e.fid,
                    postType: e.__type__,
                    paramsCallback: function () {
                        return {content: e.content, title: e.title, tid: e.tid}
                    }
                }, function (t) {
                    t.bind("onclose", function () {
                        return t.hide(), r.trigger("complete"), !1
                    }), t.bind("onaccept", function () {
                        e.vcode = t.getInputValue(), e.vcode_md5 = t.getVCode(), r.trigger("retry", e)
                    }), t.show()
                })
            }

            function e() {
                var t = this, e = l.messageMap[224010];
                null == e && (e = "\u672A\u77E5\u9519\u8BEF");
                $.tb.alert({
                    title: "\u53D1\u8D34\u5931\u8D25",
                    message: e,
                    buttons: [
                        {
                            text: "\u7ED1\u5B9A\u624B\u673A", callback: function () {
                            var e = $.tb.location, r = e.getHost() + e.getPathname() + e.getSearch(), a = "http://passport.baidu.com/v2/?accountbindphone&tpl=tb&u=" + encodeURIComponent(r + "#sub");
                            t.trigger("complete"), $.tb.location.setHref(a)
                        }
                        }
                    ]
                });
                this.trigger("error")
            }

            function r(t) {
                var e = this, r = l.auditMessageMap[t.bdauditreason];
                null == r && (r = l.auditMessageMap["default"]);
                $.tb.alert({
                    iconSrc: "http://static.tieba.baidu.com/tb/img/messageFace.gif",
                    title: "\u7B49\u5F85\u5BA1\u6838",
                    heading: "\u7B49\u5F85\u5BA1\u6838...",
                    message: r,
                    buttons: {
                        text: "\u786E\u5B9A", callback: function () {
                            e.trigger("complete"), $.tb.location.reload()
                        }
                    }
                });
                this.trigger("error")
            }

            function a() {
                {
                    var t = this;
                    $.tb.alert({
                        iconSrc: "http://static.tieba.baidu.com/tb/img/errorFace.gif",
                        title: "\u53D1\u8D34\u5931\u8D25",
                        heading: "\u53D1\u8D34\u5931\u8D25",
                        message: c,
                        buttons: {
                            text: "\u786E\u5B9A", callback: function () {
                                t.trigger("complete")
                            }
                        }
                    })
                }
                this.trigger("error")
            }

            function i(t, e) {
                {
                    var r = this, a = function () {
                        $.tb.alert({
                            title: "T\u8C46\u5145\u503C",
                            message: "\u6211\u5DF2\u6210\u529F\u5145\u503CT\u8C46",
                            holderClassName: "tdou_notenough_dialog",
                            buttons: {
                                text: "\u91CD\u65B0\u53D1\u8868", callback: function () {
                                    r.trigger("retry", e)
                                }
                            }
                        })
                    };
                    $.tb.alert({
                        title: "T\u8C46\u4F59\u989D\u4E0D\u8DB3",
                        message: "\u60A8\u7684T\u8C46\u4F59\u989D\u4E0D\u8DB3\uFF0C\u53D1\u8868\u8D34\u5B50\u5931\u8D25\uFF0C\u8BF7\u5145\u503C\u540E\u91CD\u8BD5",
                        holderClassName: "tdou_notenough_dialog",
                        onclose: function () {
                            r.trigger("complete")
                        },
                        buttons: {
                            text: "\u5145\u503CT\u8C46", callback: function () {
                                _.Module.use("common/widget/tcharge_dialog"), r.trigger("complete"), a()
                            }
                        }
                    })
                }
            }

            function s() {
                {
                    var t = this;
                    $.tb.alert({
                        title: "\u63D0\u793A\u4FE1\u606F",
                        message: "<p>\u4EB2\uFF0C\u60A8\u53CD\u9988\u7684\u95EE\u9898\u53EF\u80FD\u4E0E\u5220\u5E16\u6216\u5C01\u7981\u6709\u5173\u3002</p>\u8BF7\u786E\u8BA4\u53CD\u9988\u5185\u5BB9\u4E2D\u5305\u542B<strong>\u88AB\u5C01\u8D26\u53F7</strong>\u3001<strong>\u88AB\u5220\u5E16\u94FE\u63A5</strong>\u3001<strong>\u9875\u9762\u622A\u56FE</strong>\uFF0C\u4EE5\u4FBF\u4E8E\u6211\u4EEC\u66F4\u5FEB\u5E2E\u60A8\u89E3\u51B3\u95EE\u9898\u54E6~",
                        holderClassName: "ueg_confirm_note_dialog",
                        onclose: function () {
                            t.trigger("complete")
                        },
                        buttons: [
                            {
                                text: "\u786E\u8BA4\u53D1\u8868", callback: function () {
                                t.trigger("complete"), t.trigger("retryPost")
                            }
                            }, {
                                text: "\u6211\u518D\u6539\u6539", callback: function () {
                                    t.trigger("complete")
                                }
                            }
                        ]
                    })
                }
                t.trigger("uegPostParameter")
            }

            function n() {
                {
                    var t = this;
                    $.tb.alert({
                        title: "\u63D0\u793A\u4FE1\u606F",
                        message: "<p>\u7EBF\u8DEF\u5347\u7EA7\u6539\u9020\uFF0C\u6682\u65F6\u65E0\u6CD5\u53D1\u8D34\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF0C\u7ED9\u60A8\u5E26\u6765\u4E0D\u4FBF\u8868\u793A\u62B1\u6B49~</p>",
                        holderClassName: "ueg_confirm_note_dialog",
                        onclose: function () {
                            t.trigger("complete")
                        },
                        buttons: [
                            {
                                text: "\u5173\u95ED", callback: function () {
                                t.trigger("complete")
                            }
                            }
                        ]
                    })
                }
            }

            function o(t, e) {
                {
                    var r = this;
                    r.use("tbmall/widget/TbeanSafe", {
                        json: t, sucCallback: function (t) {
                            var a = $.extend(e, t);
                            r.trigger("retry", a)
                        }, errCallback: function () {
                            r.trigger("complete")
                        }, content: r
                    })
                }
            }

            var c, l = this;
            _.Module.use("ueglibs/widget/Ban", [], function (t) {
                c = t.render("richPoster")
            }), this.registerHandler(0, function (t, e) {
                var r = this;
                "thread" == e.__type__ && t.data.balv && t.data.balv.member_status ? ($.stats.sendRequest("fr=tb0_forum&st_page=frs&st_mod=like&st_type=thread"), r.use("ucenter/widget/LikeTip", "\u53D1\u8D34\u6210\u529F", !1, {index: t.data.balv.member_index})) : e.file_id ? $.tb.alert({
                    iconSrc: "http://tb1.bdstatic.com/tb/img/messageFace.gif",
                    title: "\u53D1\u8868\u8D34\u5B50",
                    heading: "\u89C6\u9891\u8F6C\u7801\u4E2D",
                    message: "\u7A0D\u540E\u8F6C\u7801\u5B8C\u6210\u540E\u8D34\u5B50\u5C06\u81EA\u52A8\u53D1\u8868\u3002\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF0C\u8C22\u8C22",
                    buttons: [
                        {
                            text: "\u786E\u5B9A", callback: function () {
                            r.trigger("complete"), r.trigger("success")
                        }
                        }
                    ]
                }) : r.trigger("success", t)
            }), this.registerHandler(224011, t), this.registerHandler(40, t), this.registerHandler(224010, e), this.registerHandler(4010, e), this.registerHandler(220009, r), this.registerHandler(9, r), this.registerHandler(12, a), this.registerHandler(220012, a), this.registerHandler(2270005, i), this.registerHandler(220902, s), this.registerHandler(220903, n), this.registerHandler(360007, o), this.registerHandler(2150040, o), this.registerHandler(2270018, o), this.registerHandler(1990005, o), this.registerHandler(2190005, o), this.registerHandler(2270043, o), this.registerHandler(2270040, o), this.registerHandler(2270041, o), this.registerHandler(2270042, o)
        },
        registerHandler: function (t, e) {
            this.handlerMap[t] = e
        },
        getHandler: function (t) {
            var e = this, r = e.handlerMap[t];
            if (null == r) {
                var a = e.messageMap[t];
                null == a && (a = "\u672A\u77E5\u9519\u8BEF\uFF0C\u9519\u8BEF\u53F7\uFF1A" + t), r = function () {
                    {
                        var t = this;
                        $.tb.alert({
                            iconSrc: "http://static.tieba.baidu.com/tb/img/errorFace.gif",
                            title: "\u53D1\u8D34\u5931\u8D25",
                            heading: "\u53D1\u8D34\u5931\u8D25",
                            message: a,
                            onclose: function () {
                                t.trigger("complete")
                            },
                            buttons: {text: "\u786E\u5B9A"}
                        })
                    }
                    this.trigger("error")
                }
            }
            return r
        },
        messageMap: {
            220001: "\u53C2\u6570\u9519\u8BEF",
            220008: "\u5148\u53D1\u540E\u5BA1",
            220009: "",
            220011: "\u8D34\u5B50\u6807\u9898\u548C\u5185\u5BB9\u592A\u957F",
            220013: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u60A8\u7684\u7F51\u7EDC\u5730\u5740\u7531\u4E8E\u975E\u6CD5\u64CD\u4F5C\u88AB\u5C01<br/><a href='/upc/userinfo?fid=fid' target=\"_blank\">\u67E5\u770B\u5C01\u7981\u4FE1\u606F</a>",
            220015: "\u8BF7\u4E0D\u8981\u53D1\u8868\u542B\u6709\u4E0D\u9002\u5F53\u5185\u5BB9\u7684\u7559\u8A00<br>\u8BF7\u4E0D\u8981\u53D1\u8868\u5E7F\u544A\u8D34",
            220034: "\u60A8\u8BF4\u8BDD\u592A\u5FEB\u4E86:) \u8BF7\u5148\u505C\u4E0B\u6765\u559D\u676F\u8336\u5427\uFF0C\u6216\u8005\u53EF\u4EE5\u53BB\u522B\u7684\u5427\u770B\u770B\u54E6\uFF0C\u4E00\u5B9A\u4F1A\u53D1\u73B0\u8FD8\u6709\u60A8\u611F\u5174\u8DA3\u7684\u8BDD\u9898",
            220035: "\u4EB2\uFF0C\u5DF2@\u4E0D\u5C11\u4EBA\u4E86\uFF0C\u4EE5\u514D\u6253\u6405\u66F4\u591A\u4EBA\uFF0C\u6B47\u4E00\u4F1A\u5427~",
            220037: "\u60A8\u5DF2\u5C1D\u8BD5\u63D0\u4EA4\u591A\u6B21\u4E86\uFF0C\u8BF7\u8FD4\u56DE\u540E\u5237\u65B0\u9875\u9762\uFF0C\u65B9\u53EF\u91CD\u65B0\u53D1\u8D34",
            220038: "\u9A8C\u8BC1\u7801\u8D85\u65F6\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165",
            220040: "\u9A8C\u8BC1\u7801\u8F93\u5165\u9519\u8BEF\uFF0C\u8BF7\u60A8\u8FD4\u56DE\u540E\u91CD\u65B0\u8F93\u5165",
            220119: "\u5BF9\u4E0D\u8D77\uFF0C\u672C\u4E3B\u9898\u7684\u56DE\u590D\u6570\u5DF2\u7ECF\u8FBE\u5230\u4E0A\u9650\uFF0C\u611F\u8C22\u60A8\u7684\u53C2\u4E0E\uFF0C\u6B22\u8FCE\u60A8\u6D4F\u89C8\u672C\u5427\u7684\u5176\u5B83\u4E3B\u9898",
            220901: "",
            224009: "\u8D34\u5B50\u5DF2\u88AB\u9501\u5B9A\uFF0C\u65E0\u6CD5\u8FDB\u884C\u8BE5\u64CD\u4F5C",
            224010: "\u60A8\u7684\u8D26\u53F7\u5B58\u5728\u5B89\u5168\u98CE\u9669\u6682\u4E0D\u80FD\u53D1\u8D34\uFF0C\u8BF7\u5148\u8FDB\u884C\u624B\u673A\u7ED1\u5B9A\u540E\u518D\u53D1\u8D34\u5427\u3002",
            230004: "\u60A8\u672A\u767B\u5F55\u6216\u5DF2\u9000\u51FA\u767B\u5F55\u72B6\u6001\uFF0C\u8BF7\u5148\u767B\u5F55\u518D\u8FDB\u884C\u64CD\u4F5C\u3002",
            230008: "\u60A8\u7684\u5185\u5BB9\u5DF2\u63D0\u4EA4\u6210\u529F\uFF0C\u6B63\u5728\u8FDB\u884C\u5BA1\u6838\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\u3002",
            230013: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u60A8\u7684\u5E10\u53F7\u56E0\u8FDD\u89C4\u64CD\u4F5C\u800C\u88AB\u5C01\u7981",
            230020: "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u7684\u6807\u9898\u6216\u6B63\u6587\u5305\u542B\u592A\u5C11\u7684\u6587\u5B57\uFF0C\u8BF7\u4FEE\u6539\u540E\u518D\u53D1\u8868",
            230044: "\u5EFA\u5427\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u5C1D\u8BD5",
            230045: "\u62B1\u6B49\uFF0C\u60A8\u63D0\u4EA4\u7684\u8D34\u5427\u540D\u79F0\u542B\u7279\u6B8A\u5B57\u7B26\uFF0C\u76EE\u524D\u65E0\u6CD5\u521B\u5EFA\uFF0C\u63A8\u8350\u60A8\u4F7F\u7528\u6C49\u5B57\u3001\u5B57\u6BCD\u6216\u6570\u5B57\u4F5C\u4E3A\u8D34\u5427\u540D\u79F0",
            230046: "\u62B1\u6B49\uFF0C\u60A8\u7684\u8D34\u5B50\u8FC7\u957F\uFF0C\u65E0\u6CD5\u6B63\u5E38\u63D0\u4EA4\u3002\u5EFA\u8BAE\u60A8\u7CBE\u7B80\u6216\u5206\u6BB5\u540E\u91CD\u65B0\u63D0\u4EA4\uFF0C\u8C22\u8C22!",
            230265: "\u60A8\u672A\u767B\u5F55\u6216\u5DF2\u9000\u51FA\u767B\u5F55\u72B6\u6001\uFF0C\u8BF7\u5148\u767B\u5F55\u518D\u8FDB\u884C\u64CD\u4F5C\u3002",
            230273: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BE5\u5E16\u5B50\u5DF2\u4E0D\u5B58\u5728",
            230277: "\u60A8\u5DF2\u88AB\u697C\u4E3B\u7981\u8A00\u4E00\u5929\u3002\u5728\u6B64\u671F\u95F4\u5185\uFF0C\u4E0D\u53EF\u56DE\u590D\u6216@\u697C\u4E3B\u3002",
            230278: "\u60A8\u5DF2\u88AB\u697C\u4E3B\u7981\u8A00\u4E00\u5929\u3002\u5728\u6B64\u671F\u95F4\u5185\uFF0C\u4E0D\u53EF\u56DE\u590D\u6216@\u697C\u4E3B\u3002",
            230308: "\u62B1\u6B49\uFF0C\u60A8\u6CA1\u6709\u6743\u9650\u8FDB\u884C\u8BE5\u9879\u64CD\u4F5C\u3002",
            230705: "\u672C\u5427\u5F53\u524D\u53EA\u80FD\u6D4F\u89C8\uFF0C\u4E0D\u80FD\u53D1\u8D34\uFF01",
            230808: "\u62B1\u6B49\uFF0C\u6BCF\u5C42\u697C\u63D2\u5165\u7684\u89C6\u9891\u4E0D\u80FD\u8D85\u8FC71\u4E2A\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4",
            230809: "\u62B1\u6B49\uFF0C\u6BCF\u5C42\u697C\u63D2\u5165\u7684\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC710\u5F20\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4",
            230814: "\u62B1\u6B49\uFF0C\u6BCF\u5C42\u697C\u63D2\u5165\u7684\u8868\u60C5\u4E0D\u80FD\u8D85\u8FC710\u5F20\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4",
            230815: "\u62B1\u6B49\uFF0C\u6BCF\u5C42\u697C\u63D2\u5165\u7684\u97F3\u4E50\u4E0D\u80FD\u8D85\u8FC710\u4E2A\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4",
            230850: "\u5427\u540D\u5DF2\u5B58\u5728\uFF0C\u8BF7\u52FF\u91CD\u590D\u521B\u5EFA",
            230870: "\u672C\u5E16\u5B50\u56DE\u590D\u8F83\u591A\uFF0C\u4E0D\u652F\u6301\u5220\u9664",
            230871: "\u53D1\u8D34\u592A\u9891\u7E41\uFF0C\u505C\u4E0B\u6765\u559D\u676F\u8336\u4F11\u606F\u4E0B\u5427",
            230887: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u5C1D\u8BD5",
            230889: "\u60A8\u5DF2\u88AB\u52A0\u5165\u5C0F\u9ED1\u5C4B\uFF0C\u65E0\u6CD5\u8FDB\u884C\u8BE5\u64CD\u4F5C\u3002",
            230900: "\u4E3A\u62B5\u5FA1\u6316\u575F\u5371\u5BB3\uFF0C\u672C\u5427\u5427\u4E3B\u5DF2\u653E\u51FA\u8D34\u5427\u795E\u517D--\u8D85\u7EA7\u9759\u6B62\u86D9\uFF0C\u672C\u8D34\u6682\u65F6\u65E0\u6CD5\u56DE\u590D\u3002",
            230901: "\u8BE5\u697C\u56DE\u590D\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5230\u522B\u7684\u697C\u5C42\u53C2\u4E0E\u4E92\u52A8\u5427",
            230902: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u8FC7\u957F\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            230903: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            230961: "\u53D1\u8D34\u5931\u8D25\uFF0C\u60A8\u8F93\u5165\u7684\u56FE\u7247\u5730\u5740\u6709\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u66F4\u6B63\u540E\u518D\u6B21\u53D1\u5E03\uFF1A\uFF09",
            230962: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            230963: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            231120: "\u62B1\u6B49\uFF0C\u60A8\u8F93\u5165\u7684\u56FE\u7247\u3001\u89C6\u9891\u94FE\u63A5\u5730\u5740\u9519\u8BEF\uFF0C\u60A8\u53EF\u4EE5\u70B9\u51FB<a href='http://www.baidu.com/search/post_img.html' target='_blank'>\u67E5\u770B\u76F8\u5173\u5E2E\u52A9</a>\u6216\u8FD4\u56DE\u4FEE\u6539",
            232e3: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            232001: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            232007: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            232101: "\u60A8\u8F93\u5165\u7684\u5185\u5BB9\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u65B0\u63D0\u4EA4\u3002",
            233001: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233003: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233004: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233005: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233006: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233007: "\u53D1\u8868\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u518D\u8BD5\u3002",
            233010: "\u672C\u5427\u4EC5\u5141\u8BB8\u5B98\u65B9\u7C89\u4E1D\u56E2\u6210\u5458\u56DE\u590D\u54E6\uFF0C\u8D76\u5FEB\u52A0\u5165\u5427\uFF01",
            220903: "\u7EBF\u8DEF\u5347\u7EA7\u6539\u9020\uFF0C\u6682\u65F6\u65E0\u6CD5\u53D1\u8D34\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF0C\u7ED9\u60A8\u5E26\u6765\u4E0D\u4FBF\u8868\u793A\u62B1\u6B49~",
            234031: "\u4E0A\u4F20\u6587\u4EF6\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u3002",
            235004: "\u4F7F\u7528\u9053\u5177\u9519\u8BEF\uFF0C\u8BE5\u9053\u5177\u8981\u8D2D\u4E70\u540E\u624D\u80FD\u4F7F\u7528\u3002",
            235005: "\u65E0\u6743\u9650\u4F7F\u7528\u8BE5\u9053\u5177\uFF0C\u8BF7\u53BB\u8D2D\u4E70\u3002",
            236001: "\u8BE5\u8D34\u4E3A\u8D34\u5427\u624B\u673AApp\u76F4\u64AD\u8D34\uFF0C\u76EE\u524D\u6682\u65F6\u4E0D\u652F\u6301\u975E\u697C\u4E3B\u4E4B\u5916\u7684\u7528\u6237\u5360\u697C\uFF0C\u4F46\u4F60\u53EF\u4EE5\u5728\u697C\u4E2D\u697C\u56DE\u590D\u54E6\uFF01",
            239e3: "\u60A8\u8FD8\u6CA1\u6709\u7528\u6237\u540D\uFF0C\u4E0D\u80FD\u5728\u672C\u5427\u53D1\u8D34\u3002\u8BF7\u5148\u586B\u5199\u7528\u6237\u540D\u3002",
            239001: "\u7531\u4E8E\u533F\u540D\u72B6\u6001\u6216\u672C\u5427\u8BBE\u7F6E\uFF0C\u65E0\u6CD5\u53D1\u8868\u5E26\u6709\u56FE\u7247\u7684\u4E3B\u9898\u3002",
            2270028: "\u9644\u52A0\u5956\u54C1\u7684\u989D\u5EA6\u4E0D\u80FD\u5C11\u4E8E10000T\u8C46",
            2270029: "\u4E3B\u9898\u53D1\u9001\u6210\u529F\uFF0C\u5956\u52B1\u6DFB\u52A0\u5931\u8D25",
            2270018: "\u62B1\u6B49\uFF0C\u60A8\u6CA1\u6709\u6743\u9650\u53D1\u5956\u52B1\u8D34",
            2270027: "\u611F\u8A00\u8BF7\u63A7\u5236\u5728140\u4E2A\u5B57\u4E4B\u5185",
            10: "\u8D34\u5B50\u5185\u5BB9\u5305\u542B\u592A\u5C11\u7684\u6587\u5B57",
            11: "\u8D34\u5B50\u6807\u9898\u548C\u5185\u5BB9\u592A\u957F",
            13: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u60A8\u7684\u7F51\u7EDC\u5730\u5740\u7531\u4E8E\u975E\u6CD5\u64CD\u4F5C\u88AB\u5C01<br/><a href='/upc/userinfo?fid=fid' target=\"_blank\">\u67E5\u770B\u5C01\u7981\u4FE1\u606F</a>",
            14: "\u60A8\u53D1\u5E03\u7684\u8D34\u5B50\u5DF2\u7ECF\u5B58\u5728",
            15: "\u8BF7\u4E0D\u8981\u53D1\u8868\u542B\u6709\u4E0D\u9002\u5F53\u5185\u5BB9\u7684\u7559\u8A00<br>\u8BF7\u4E0D\u8981\u53D1\u8868\u5E7F\u544A\u8D34",
            501: "\u8BF7\u4E0D\u8981\u53D1\u8868\u542B\u6709\u4E0D\u9002\u5F53\u5185\u5BB9\u7684\u7559\u8A00<br>\u8BF7\u4E0D\u8981\u53D1\u8868\u5E7F\u544A\u8D34",
            16: "\u5BF9\u4E0D\u8D77\uFF0C\u60A8\u6240\u8F93\u5165\u7684\u8D34\u5427\u4E0D\u5B58\u5728\u3002\u7531\u4E8E\u7CFB\u7EDF\u5347\u7EA7\u7EF4\u62A4\uFF0C\u65B0\u5EFA\u8D34\u5427\u529F\u80FD\u6682\u505C\uFF0C\u5E0C\u671B\u5F97\u5230\u60A8\u7684\u8C05\u89E3\uFF01",
            17: "\u672C\u5427\u5F53\u524D\u53EA\u80FD\u6D4F\u89C8\uFF0C\u4E0D\u80FD\u53D1\u8D34\uFF01",
            19: "\u60A8\u7684\u7528\u6237\u540D\u6216\u8005\u5BC6\u7801\u586B\u5199\u6709\u8BEF\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u53D1\u8868",
            200: "\u60A8\u7684\u7528\u6237\u540D\u6216\u8005\u5BC6\u7801\u586B\u5199\u6709\u8BEF\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u53D1\u8868",
            201: "\u60A8\u7684\u7528\u6237\u540D\u6216\u8005\u5BC6\u7801\u586B\u5199\u6709\u8BEF\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u53D1\u8868",
            202: "\u60A8\u7684\u7528\u6237\u540D\u6216\u8005\u5BC6\u7801\u586B\u5199\u6709\u8BEF\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u53D1\u8868",
            20: "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u7684\u6807\u9898\u6216\u6B63\u6587\u5305\u542B\u592A\u5C11\u7684\u6587\u5B57\uFF0C\u8BF7\u4FEE\u6539\u540E\u518D\u53D1\u8868",
            22: "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u7531\u4E8E\u7279\u6B8A\u539F\u56E0\u6211\u4EEC\u9700\u8981\u6838\u5B9E\u8BE5\u8D34\u5185\u5BB9\u662F\u5426\u542B\u6709\u4E0D\u826F\u4FE1\u606F\uFF0C\u6211\u4EEC\u4F1A\u572810\u5206\u949F\u5185\u786E\u8BA4\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85\uFF01",
            23: "\u60A8\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u9700\u8981\u7CFB\u7EDF\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u5EFA\u7ACB\u8D34\u5427",
            33: "\u60A8\u53D1\u8D34\u592A\u5FEB\u4E86:) \u8BF7\u7A0D\u540E\u518D\u53D1",
            34: "\u60A8\u8BF4\u8BDD\u592A\u5FEB\u4E86:) \u8BF7\u5148\u505C\u4E0B\u6765\u559D\u676F\u8336\u5427\uFF0C\u6216\u8005\u53EF\u4EE5\u53BB\u522B\u7684\u5427\u770B\u770B\u54E6\uFF0C\u4E00\u5B9A\u4F1A\u53D1\u73B0\u8FD8\u6709\u60A8\u611F\u5174\u8DA3\u7684\u8BDD\u9898",
            35: "\u4EB2\uFF0C\u5DF2@\u4E0D\u5C11\u4EBA\u4E86\uFF0C\u4EE5\u514D\u6253\u6405\u66F4\u591A\u4EBA\uFF0C\u6B47\u4E00\u4F1A\u5427~",
            36: "\u8BF7\u4E0D\u8981\u53D1\u5E7F\u544A\u8D34\uFF01",
            37: "\u60A8\u5DF2\u5C1D\u8BD5\u63D0\u4EA4\u591A\u6B21\u4E86\uFF0C\u8BF7\u8FD4\u56DE\u540E\u5237\u65B0\u9875\u9762\uFF0C\u65B9\u53EF\u91CD\u65B0\u53D1\u8D34",
            38: "\u9A8C\u8BC1\u7801\u8D85\u65F6\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165",
            39: "\u7531\u4E8E\u60A8\u591A\u6B21\u8F93\u9519\u9A8C\u8BC1\u7801\uFF0C\u8BF7\u60A8\u8FD4\u56DE\u540E\u5237\u65B0\u9875\u9762\uFF0C\u65B9\u53EF\u91CD\u65B0\u53D1\u8D34",
            40: "\u9A8C\u8BC1\u7801\u8F93\u5165\u9519\u8BEF\uFF0C\u8BF7\u60A8\u8FD4\u56DE\u540E\u91CD\u65B0\u8F93\u5165",
            41: "\u60A8\u7684\u8D34\u5B50\u53EF\u80FD\u5305\u542B\u4E0D\u5408\u9002\u7684\u5185\u5BB9\uFF0C\u8BF7\u60A8\u786E\u5B9A\u540E\u518D\u63D0\u4EA4",
            42: "\u60A8\u7684\u53D1\u8D34\u884C\u4E3A\u88AB\u7CFB\u7EDF\u8BA4\u4E3A\u6709\u53D1\u5E7F\u544A\u5ACC\u7591\uFF0C\u8BF7\u60A8\u7A0D\u540E\u518D\u53D1",
            43: "\u60A8\u7684\u53D1\u8D34\u884C\u4E3A\u6216\u8D34\u5B50\u5185\u5BB9\u6709\u5E7F\u544A\u6216\u4E0D\u5408\u9002\u7684\u7279\u5F81\uFF0C\u8BF7\u60A8\u786E\u5B9A\u540E\u518D\u53D1\u9001",
            44: "\u5BF9\u4E0D\u8D77\uFF0C\u672C\u5427\u6682\u65F6\u9650\u5236\u90E8\u5206\u7528\u6237\u53D1\u8868\u4E3B\u9898\u8D34\u5B50\uFF0C\u60A8\u53EF\u4EE5\u6D4F\u89C8\u6216\u56DE\u590D\u672C\u5427\u5176\u5B83\u5185\u5BB9\uFF0C\u7ED9\u60A8\u5E26\u6765\u4E0D\u4FBF\u5E0C\u671B\u5F97\u5230\u60A8\u7684\u8C05\u89E3\u3002",
            119: "\u5BF9\u4E0D\u8D77\uFF0C\u672C\u4E3B\u9898\u7684\u56DE\u590D\u6570\u5DF2\u7ECF\u8FBE\u5230\u4E0A\u9650\uFF0C\u611F\u8C22\u60A8\u7684\u53C2\u4E0E\uFF0C\u6B22\u8FCE\u60A8\u6D4F\u89C8\u672C\u5427\u7684\u5176\u5B83\u4E3B\u9898",
            1120: "\u62B1\u6B49\uFF0C\u60A8\u8F93\u5165\u7684\u56FE\u7247\u3001\u89C6\u9891\u94FE\u63A5\u5730\u5740\u9519\u8BEF\uFF0C\u60A8\u53EF\u4EE5\u70B9\u51FB<a href='http://www.baidu.com/search/post_img.html' target='_blank'>\u67E5\u770B\u76F8\u5173\u5E2E\u52A9</a>\u6216\u8FD4\u56DE\u4FEE\u6539",
            1121: "\u62B1\u6B49\uFF0C\u89C6\u9891\u670D\u52A1\u5347\u7EA7\u4E2D\uFF0C\u60A8\u6682\u65F6\u65E0\u6CD5\u53D1\u8868\u5E26\u6709\u89C6\u9891\u7684\u8D34\u5B50\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u8BF7\u539F\u8C05",
            100: "\u5BF9\u4E0D\u8D77\uFF0C\u672C\u5427\u6682\u65F6\u9650\u5236\u90E8\u5206\u7528\u6237\u4F7F\u7528\u5B8C\u6574\u7684\u8D34\u5427\u529F\u80FD\uFF0C\u60A8\u53EF\u4EE5\u6D4F\u89C8\u672C\u5427\u5176\u5B83\u5185\u5BB9\uFF0C\u7ED9\u60A8\u5E26\u6765\u4E0D\u4FBF\u5E0C\u671B\u5F97\u5230\u60A8\u7684\u8C05\u89E3\u3002",
            701: "\u4E3A\u4E86\u51CF\u5C11\u6076\u610F\u704C\u6C34\u548C\u5E7F\u544A\u5E16\uFF0C\u672C\u5427\u4E0D\u5141\u8BB8\u672A\u767B\u5F55\u7528\u6237\u53D1\u8D34\uFF0C\u767B\u5F55\u7528\u6237\u4E0D\u53D7\u5F71\u54CD\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u6DF1\u8868\u6B49\u610F",
            702: "\u4E3A\u4E86\u51CF\u5C11\u6076\u610F\u704C\u6C34\u548C\u5E7F\u544A\u5E16\uFF0C\u672C\u5427\u9650\u5236\u90E8\u5206\u7528\u6237\u53D1\u8D34\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u6DF1\u8868\u6B49\u610F",
            703: "\u4E3A\u4E86\u51CF\u5C11\u6076\u610F\u704C\u6C34\u548C\u5E7F\u544A\u5E16\uFF0C\u672C\u5427\u88AB\u8BBE\u7F6E\u4E3A\u4EC5\u672C\u5427\u4F1A\u5458\u624D\u80FD\u53D1\u8D34\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u6DF1\u8868\u6B49\u610F\u3002<a href='/f?kw=this.bdQueryWordEnc#1' target=_blank>\u70B9\u6B64\u7533\u8BF7\u52A0\u5165</a>\u672C\u5427\u4F1A\u5458",
            704: "\u4E3A\u4E86\u51CF\u5C11\u6076\u610F\u704C\u6C34\u548C\u5E7F\u544A\u5E16\uFF0C\u672C\u5427\u88AB\u8BBE\u7F6E\u4E3A\u4EC5\u672C\u5427\u7BA1\u7406\u56E2\u961F\u624D\u80FD\u53D1\u8D34\uFF0C\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\u6DF1\u8868\u6B49\u610F",
            705: "\u672C\u5427\u5F53\u524D\u53EA\u80FD\u6D4F\u89C8\uFF0C\u4E0D\u80FD\u53D1\u8D34\uFF01",
            706: "\u62B1\u6B49\uFF0C\u672C\u8D34\u6682\u65F6\u65E0\u6CD5\u56DE\u590D\u3002",
            45: "\u62B1\u6B49\uFF0C\u60A8\u63D0\u4EA4\u7684\u8D34\u5427\u540D\u79F0\u542B\u7279\u6B8A\u5B57\u7B26\uFF0C\u76EE\u524D\u65E0\u6CD5\u521B\u5EFA\uFF0C\u63A8\u8350\u60A8\u4F7F\u7528\u6C49\u5B57\u3001\u5B57\u6BCD\u6216\u6570\u5B57\u4F5C\u4E3A\u8D34\u5427\u540D\u79F0",
            46: "\u62B1\u6B49\uFF0C\u60A8\u7684\u8D34\u5B50\u8FC7\u957F\uFF0C\u65E0\u6CD5\u6B63\u5E38\u63D0\u4EA4\u3002\u5EFA\u8BAE\u60A8\u7CBE\u7B80\u6216\u5206\u6BB5\u540E\u91CD\u65B0\u63D0\u4EA4\uFF0C\u8C22\u8C22!",
            815: "\u62B1\u6B49\uFF0C\u60A8\u5DF2\u9000\u51FA\u767B\u5F55\u6216\u672A\u8D2D\u4E70\u97F3\u4E50\u9053\u5177\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5",
            900: "\u4E3A\u62B5\u5FA1\u6316\u575F\u5371\u5BB3\uFF0C\u672C\u5427\u5427\u4E3B\u5DF2\u653E\u51FA\u8D34\u5427\u795E\u517D--\u8D85\u7EA7\u9759\u6B62\u86D9\uFF0C\u672C\u8D34\u6682\u65F6\u65E0\u6CD5\u56DE\u590D\u3002",
            961: "\u53D1\u8D34\u5931\u8D25\uFF0C\u60A8\u8F93\u5165\u7684\u56FE\u7247\u5730\u5740\u6709\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u66F4\u6B63\u540E\u518D\u6B21\u53D1\u5E03\uFF1A\uFF09",
            9001: "\u7531\u4E8E\u533F\u540D\u72B6\u6001\u6216\u672C\u5427\u8BBE\u7F6E\uFF0C\u65E0\u6CD5\u53D1\u8868\u5E26\u6709\u56FE\u7247\u7684\u4E3B\u9898\u3002",
            2100: "\u5185\u5BB9\u542B\u6709\u9AD8\u7EA7\u5B57\u4F53\u6548\u679C\uFF0C\u4FDD\u6301\u8FDE\u7EED\u7B7E\u5230\u5C31\u80FD\u4F7F\u7528\u54E6~~",
            4010: "\u60A8\u7684\u8D26\u53F7\u5B58\u5728\u5B89\u5168\u98CE\u9669\u6682\u4E0D\u80FD\u53D1\u8D34\uFF0C\u8BF7\u5148\u8FDB\u884C\u624B\u673A\u7ED1\u5B9A\u540E\u518D\u53D1\u8D34\u5427\u3002",
            9e3: "\u60A8\u8FD8\u6CA1\u6709\u7528\u6237\u540D\uFF0C\u4E0D\u80FD\u5728\u672C\u5427\u53D1\u8D34\u3002\u8BF7\u5148\u586B\u5199\u7528\u6237\u540D\u3002",
            402011: "\u56FE\u7247\u5BBD\u5EA6\u8D85\u51FA\u9650\u5236",
            402012: "\u56FE\u7247\u9AD8\u5EA6\u8D85\u51FA\u9650\u5236",
            402013: "\u56FE\u7247\u6807\u7B7E\u65E0\u6548",
            220900: "\u7981\u6B62\u6316\u575F"
        },
        auditMessageMap: {
            "-61": "\u60A8\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u4E3A\u4E86\u4FDD\u8BC1\u8D34\u5B50\u8D28\u91CF\uFF0C\u672C\u5427\u6240\u53D1\u7684\u8D34\u5B50\u5F85\u7CFB\u7EDF\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85",
            "-62": "\u60A8\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u4E3A\u4E86\u4FDD\u8BC1\u8D34\u5B50\u8D28\u91CF\uFF0C\u672C\u5427\u8D34\u56FE\u7684\u8D34\u5B50\u9700\u8981\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85",
            "-74": "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u7CFB\u7EDF\u9700\u8981\u6838\u5B9E\u8BE5\u8D34\u5B50\u5185\u5BB9\u662F\u5426\u542B\u6709\u4E0D\u826F\u4FE1\u606F\uFF0C\u8D34\u5B50\u5728\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85",
            "-75": "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u7CFB\u7EDF\u9700\u8981\u6838\u5B9E\u8BE5\u8D34\u5B50\u5185\u5BB9\u662F\u5426\u542B\u6709\u4E0D\u826F\u4FE1\u606F\uFF0C\u8D34\u5B50\u5728\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85",
            "-60": "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u7CFB\u7EDF\u9700\u8981\u6838\u5B9E\u8BE5\u8D34\u5B50\u5185\u5BB9\u662F\u5426\u542B\u6709\u4E0D\u826F\u4FE1\u606F\uFF0C\u8D34\u5B50\u5728\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85",
            "-70": "\u60A8\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u4E3A\u4E86\u63A7\u5236\u5E7F\u544A\u8D34\uFF0C\u9700\u8981\u901A\u8FC7\u5BA1\u6838\u540E\u624D\u80FD\u53D1\u5E03\u3002\u767B\u9646\u7F72\u540D\u53D1\u8D34\u4E0D\u53D7\u6B64\u9650\u5236\u3002",
            "-71": "\u60A8\u53D1\u8868\u7684\u5E16\u5B50\u592A\u957F\u4E86\u3002\u4E3A\u4E86\u9632\u6B62\u704C\u6C34\uFF0C\u9700\u7CFB\u7EDF\u5BA1\u6838\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u7A0D\u540E\u67E5\u770B",
            "default": "\u60A8\u53D1\u8868\u7684\u8D34\u5B50\u5DF2\u7ECF\u6210\u529F\u63D0\u4EA4\uFF0C\u4F46\u7CFB\u7EDF\u9700\u8981\u6838\u5B9E\u8BE5\u8D34\u5B50\u5185\u5BB9\u662F\u5426\u542B\u6709\u4E0D\u826F\u4FE1\u606F\uFF0C\u8D34\u5B50\u5728\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u663E\u793A\uFF0C\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85"
        },
        handlerMap: {}
    }
});
;
_.Module.define({
    path: "common/widget/PostService",
    requires: [
        "PostResultHandlerManager",
        "ucenter/widget/LikeTip",
        "tbmall/widget/TbeanSafe",
        "pcommon/widget/ParamsXssHandler"
    ],
    sub: {
        _defaultData: {
            ie: "utf-8",
            kw: "",
            fid: "",
            tid: "",
            vcode_md5: "",
            floor_num: 0,
            rich_text: 1,
            tbs: 0,
            content: ""
        },
        posting: !1,
        submitUrl: {
            thread: "/f/commit/thread/add",
            reply: "/f/commit/post/add",
            vpostThread: "/vpost/addthread",
            vpostReply: "/vpost/addpost",
            timeaxisThread: "/frsstar/commit/agency/addTimeline",
            timeaxisVpostThread: "",
            repost: "/relay/commit",
            guessingThreadNew: "/tbmall/guess/add",
            repostNew: "/relay/commitNew"
        },
        initial: function () {
            var t = this;
            this.resultHandlerManager = this.use("PostResultHandlerManager"), this.paramsXssHandler = this.requireInstance("pcommon/widget/ParamsXssHandler"), this.bind("retry", function (e, s) {
                t._retryHandler(s)
            }), this.bind("retryPost", function (e, s) {
                t.retryPost(s)
            }), this.bind("uegPostParameter", function () {
                t.uegPostParameter()
            })
        },
        isPosting: function () {
            return this.posting
        },
        post: function (t, e, s) {
            this.postDataCache = e, this.postContextCache = s, this.postTypeCache = t;
            var r = this;
            if (this.posting)return this;
            this.posting = !0;
            var i = $.extend({}, this._defaultData);
            s && $.extend(i, this._extractDataFromContext(s)), $.extend(i, e), i.__type__ = t;
            var a = this.submitUrl[t];
            return $.ajax({
                type: "post", url: a, data: this.paramsXssHandler.xssFilter(i), success: function (t) {
                    var e = r.resultHandlerManager.getHandler(t.err_code || t.no);
                    e.call(r, t, i)
                }, error: function () {
                    $.tb.alert({
                        title: "\u53D1\u8D34\u5931\u8D25",
                        message: "\u7F51\u901F\u6709\u70B9\u4E0D\u7ED9\u529B\u54E6~\u8BF7\u5C1D\u8BD5\u91CD\u65B0\u63D0\u4EA4\u4E00\u4E0B\u5427\uFF01",
                        buttons: [
                            {
                                text: "\u786E\u5B9A", callback: function () {
                                r.trigger("complete")
                            }
                            }
                        ]
                    })
                }, complete: function () {
                    r.posting = !1
                }, dataType: "json"
            }), this
        },
        _extractDataFromContext: function (t) {
            return {kw: t.forum.name, fid: t.forum.id, tid: t.thread ? t.thread.id : 0, tbs: t.tbs, floor_num: t.floor}
        },
        _retryHandler: function (t) {
            this.post(t.__type__, t)
        },
        success: function (t) {
            return this.bind("success", t), this
        },
        error: function (t) {
            return this.bind("error", t), this
        },
        complete: function (t) {
            return this.bind("complete", t), this
        },
        uegPostParameter: function () {
            $.extend(this._defaultData, {ueg_complain_flag: 1})
        },
        retryPost: function () {
            this.post(this.postTypeCache, this.postDataCache, this.postContextCache)
        },
        retry: function (t) {
            return this._retryHandler = t, this
        }
    }
});
_.Module.define({
    path: "common/component/image_exif", requires: [], sub: {
        initial: function () {
        }, getOrientation: function (t) {
            if (null == t)return 0;
            for (var e = 0, r = 0; e + 3 < t.length && 255 == (255 & t[e++]);) {
                var i = 255 & t[e];
                if (255 != i && (e++, 216 != i && 1 != i)) {
                    if (217 == i || 218 == i)break;
                    if (r = this.pack(t, e, 2, !1), 2 > r || e + r > t.length)return 0;
                    if (225 == i && r >= 8 && 1165519206 == this.pack(t, e + 2, 4, !1) && 0 == this.pack(t, e + 6, 2, !1)) {
                        e += 8, r -= 8;
                        break
                    }
                    e += r, r = 0
                }
            }
            if (r > 8) {
                var a = this.pack(t, e, 4, !1);
                if (1229531648 != a && 1296891946 != a)return 0;
                var n = 1229531648 == a, s = this.pack(t, e + 4, 4, n) + 2;
                if (10 > s || s > r)return 0;
                e += s, r -= s;
                for (var o = this.pack(t, e - 2, 2, n); o-- > 0 && r >= 12;) {
                    if (a = this.pack(t, e, 2, n), 274 == a) {
                        var c = this.pack(t, e + 4, 4, n), h = this.pack(t, e + 8, c, n);
                        switch (h) {
                            case 1:
                                return 0;
                            case 3:
                                return 180;
                            case 6:
                                return 90;
                            case 8:
                                return 270
                        }
                        return 0
                    }
                    e += 12, r -= 12
                }
            }
            return 0
        }, pack: function (t, e, r, i) {
            var a = 1;
            i && (e += r - 1, a = -1);
            for (var n = 0; r-- > 0;)n = n << 8 | 255 & t[e], e += a;
            return n
        }, rotateByorientation: function (t, e) {
            var r = new FileReader, i = this;
            t.size || this.trigger("success", t), r.onload = function () {
                var r = this.result, a = new Uint8Array(r), n = i.getOrientation(a);
                i.trigger("degreeloaded", n), e || i.rotateFile(t, n)
            }, r.readAsArrayBuffer(t)
        }, rotateFile: function (t, e) {
            if (90 != e && 180 != e && 270 != e)return this.trigger("success", t), void 0;
            var r = new FileReader, i = this;
            r.onload = function () {
                var t = this.result, r = new Image;
                r.onload = function () {
                    i.rotateImage(r, e)
                }, r.src = t
            }, r.readAsDataURL(t)
        }, rotateImage: function (t, e) {
            var r = document.createElement("canvas"), i = r.getContext("2d"), a = t.width, n = t.height;
            i.save(), 90 == e || 270 == e ? (r.width = n, r.height = a, 90 == e ? i.translate(r.width, 0) : i.translate(0, r.height)) : (r.width = a, r.height = n, i.translate(r.width, r.height)), i.rotate(e * Math.PI / 180), i.drawImage(t, 0, 0, a, n), i.restore(), this.trigger("success", r)
        }
    }
});
_.Module.define({
    path: "common/component/ImageUploader",
    requires: ["common/component/image_exif"],
    sub: {
        _url: "",
        _xhr: null,
        _active: !1,
        _successFilter: null,
        _variable: null,
        _MAX_SIZE: 3145728,
        initial: function (t, e, i) {
            this._url = t, this._successFilter = e || null, i = i || {}, this._compressWidth = i.maxWidth || 3e3, this._compressHeight = i.maxHeight || 3e3
        },
        _createHXR: function () {
            var t = this, e = this._successFilter;
            this._xhr = new XMLHttpRequest, this._xhr.onload = function () {
                var i;
                try {
                    i = $.parseJSON(t._xhr.responseText)
                } catch (r) {
                    i = t._xhr.responseText
                }
                e ? e(i) ? t.trigger("success", t._xhr, i) : t.trigger("error", t._xhr, i) : t.trigger("success", t._xhr, i)
            }, this._xhr.onerror = function () {
                t.trigger("error", t._xhr)
            }, this._xhr.onabort = function () {
                t.trigger("abort", t._xhr)
            }, this._xhr.upload.onprogress = function (e) {
                t.trigger("progress", e.loaded, e.total)
            }
        },
        _dataURLtoBlob: function (t) {
            for (var e = atob(t.split(",")[1]), i = t.split(",")[0].split(":")[1].split(";")[0], r = new ArrayBuffer(e.length), o = new Uint8Array(r), s = 0; s < e.length; s++)o[s] = e.charCodeAt(s);
            var n = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
            if (n) {
                var a = new n;
                return a.append(r), a.getBlob(i)
            }
            return Blob ? new Blob([r], {type: i}) : null
        },
        _compressFormDataURI: function (t, e) {
            var i = this._dataURLtoBlob(t), r = i.size, o = this;
            if (e >= r)o._uploadBlob(i); else {
                var s = new Image, n = document.createElement("canvas");
                s.onload = function () {
                    var t = o._getCompressSize(s.width, s.height);
                    n.width = t.width, n.height = t.height, n.getContext("2d").drawImage(s, 0, 0, s.width, s.height, 0, 0, t.width, t.height), s.onload = null, s.src = "about:blank", s = null;
                    var a = n.toDataURL("image/jpeg", (e / r).toFixed(1));
                    n.getContext("2d").clearRect(0, 0, t.width, t.height), n.width = n.height = 0, n = null, i = o._dataURLtoBlob(a), i.size > e ? o.trigger("error") : o._uploadBlob(i)
                }, s.src = t
            }
        },
        _uploadBlob: function (t) {
            var e = new FormData, i = this._variables;
            if (i && "object" == typeof i)for (var r in i)e.append(r, i[r]);
            e.append("file", t), this._active = !0, this._xhr || this._createHXR(), this._xhr.open("POST", this._url, !0), this._xhr.withCredentials = !0, this._xhr.send(e), i && i.html5stat && $.stats.sendRequest("fr=tb0&st_type=html5upload&st_value=send")
        },
        _getCompressSize: function (t, e) {
            var i = this._compressWidth, r = this._compressHeight, o = t / e, s = {};
            return t > i || e > r ? o > i / r ? (s.width = i, s.height = i / o) : (s.height = r, s.width = r * o) : s = {
                width: t,
                height: e
            }, s
        },
        setVariable: function (t) {
            this._variables = t
        },
        upload: function (t, e, i) {
            if (t) {
                e = "undefined" == typeof e ? this._MAX_SIZE : e;
                var r, o = this;
                if (t.getContext)r = i ? t.toDataURL(i) : t.toDataURL("image/jpeg", .8), t.getContext("2d").clearRect(0, 0, t.width, t.height), t.width = t.height = 0, t = null, o._compressFormDataURI(r, e); else if (t.size) {
                    var s = this.use("common/component/image_exif");
                    s.bind("success", function (s, n) {
                        if (n.getContext)o.upload(n, e, i); else if (t.size > e) {
                            var a = new FileReader;
                            a.onload = function (t) {
                                a.onload = null, r = t.target.result, o._compressFormDataURI(r, e)
                            }, a.readAsDataURL(n)
                        } else o._uploadBlob(n)
                    }), s.rotateByorientation(t)
                }
            }
        },
        abort: function () {
            this._active && (this._xhr.abort(), this._active = !1)
        },
        distroy: function () {
            this.abort(), this.unbind("success"), this.unbind("error"), this.unbind("abort"), this.unbind("progress"), this._xhr = null
        }
    }
});
_.Module.define({
    path: "common/widget/image_uploader_manager/uploader_flash",
    requires: [],
    sub: {
        initial: function (t) {
            var a = {
                container: null,
                width: 200,
                height: 50,
                isAutoUp: !1,
                queueLen: 10,
                maxParallel: 2,
                maxSize: 3145728,
                maxWidth: 1e3,
                maxHeight: 1e3,
                uploadUrl: "",
                getUploadParams: null
            };
            this._options = $.extend(a, t || {}), this._token = this._makeToken(), this._flashVars = "", this._version = "1_0_1_3", this._EVENTS = [
                "onFileSelected",
                "onStartUpload",
                "onProgressListen",
                "onComplete",
                "onError"
            ], this._reset()
        }, _reset: function () {
            this._initFlashvars(), this._generateCallBack(), this._initUI()
        }, _initFlashvars: function () {
            this._flashVars = [
                "maxSize=" + encodeURIComponent(this._options.maxSize),
                "maxWidth=" + encodeURIComponent(this._options.maxWidth),
                "maxHeight=" + encodeURIComponent(this._options.maxHeight),
                "isAutoUp=" + encodeURIComponent(this._options.isAutoUp),
                "queueLen=" + encodeURIComponent(this._options.queueLen),
                "maxParallel=" + encodeURIComponent(this._options.maxParallel),
                "useWorker=false",
                "uploadURL=" + encodeURIComponent(this._options.uploadUrl),
                "get_upload_params=" + (this._options.get_upload_params ? encodeURIComponent(this._options.get_upload_params) : "")
            ].join("&")
        }, _initUI: function () {
            var t, a = this._flashChecker(), e = a.version, o = "flashUploader" + this._token;
            a.hasFlash || this._flashError(), t = e[0] < 11 || e[1] < 4 ? "http://tb2.bdstatic.com/tb/static-common/img/uploader/uploaderwithoutworker_ade2e66.swf" : "http://tb2.bdstatic.com/tb/static-common/img/uploader/uploader_66720f8.swf";
            var i = '<object id="' + o + '" name="' + o + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + this._options.width + '" height="' + this._options.height + '"><param name="allowScriptAccess" value="always" /><param value="transparent" name="wmode"><param name="flashvars" value="' + this._flashVars + '" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + t + '" /></object>', n = '<object id="' + o + '" type="application/x-shockwave-flash" data="' + t + '" width="' + this._options.width + '" height="' + this._options.height + '"><param name="allowScriptAccess" value="always" /><param value="transparent" name="wmode"><param name="flashvars" value="' + this._flashVars + '" /></object>';
            this._options.container || (this._options.container = $("<div>").appendTo(document.body).css({
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                left: 1,
                bottom: 1
            })), -1 != navigator.appName.indexOf("Microsoft") ? this._options.container.html(i) : this._options.container.html(n), this.flash = document[o] || window[o]
        }, _generateCallBack: function () {
            for (var t = this, a = 0; a < this._EVENTS.length; a++) {
                var e = this._EVENTS[a], o = e + this._token;
                window[o] = function (a) {
                    return function () {
                        var e = Array.prototype.slice.call(arguments, 0);
                        e.unshift(a), t.trigger.apply(t, e)
                    }
                }(e), this._flashVars += "&" + this._decodeCamel(e) + "=" + o
            }
        }, _decodeCamel: function (t) {
            return t.replace(/([A-Z])/g, function (t, a) {
                return "_" + a.toLowerCase()
            })
        }, start: function () {
            this.flash.startUpload()
        }, stop: function () {
            this.flash.pauseUpload()
        }, deleteFile: function (t) {
            this.flash.deleteFile(t)
        }, clearList: function () {
            this.flash.clearList()
        }, reUploadError: function (t) {
            this.flash.resetErrorStatus(t)
        }, _flashChecker: function () {
            var t, a, e = !1, o = $.browser.msie;
            return o ? (a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), a && (e = !0, t = a.GetVariable("$version"))) : navigator.plugins && navigator.plugins.length > 0 && (a = navigator.plugins["Shockwave Flash"], a && (e = !0, t = a.description)), {
                hasFlash: e,
                version: t.match(/\d+/g)
            }
        }, _flashError: function () {
            $.dialog.alert('\u68C0\u6D4B\u5230\u60A8\u7684\u6D4F\u89C8\u5668\u6CA1\u6709\u5B89\u88C5\u6700\u65B0Adobe Flash Player\u63D2\u4EF6\uFF0C\u8FD9\u4F1A\u5F71\u54CD\u60A8\u8BBF\u95EE\u672C\u9875\u9762\u7684\u90E8\u5206\u529F\u80FD\u3002<br /><center>\u8BF7<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">\u70B9\u6B64</a>\u5B89\u88C5</center>')
        }, _makeToken: function () {
            var t = function () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            };
            return t() + t() + "_" + t() + t() + t()
        }, uploadBase64: function (t, a) {
            var e = "flashUploadBase64_" + this._makeToken();
            window[e] = function (t) {
                return function (a) {
                    t(a)
                }
            }(a), this.flash.uploadBase64(t, e)
        }
    }
});
;
_.Module.define({
    path: "common/widget/image_uploader_manager/uploader_html5",
    requires: ["common/component/ImageUploader"],
    sub: {
        initial: function (e) {
            var t = {
                container: null,
                width: 200,
                height: 50,
                isAutoUp: !1,
                queueLen: 10,
                maxParallel: 16,
                maxSize: 3145728,
                limitSize: 10485760,
                maxWidth: 1e3,
                maxHeight: 1e3,
                uploadUrl: "",
                getUploadParams: null
            };
            this._options = $.extend(t, e || {}), this._uploadQueue = [], this._fileStatusArr = [], this._currentUploadNum = 0, this._uploadTimer = null, this._activeTotal = 0, this._typeFilter = "image/jpeg, image/jpg, image/png, image/gif, image/bmp", this._reset()
        }, start: function () {
            this._trigger("onStartUpload"), this._startProgress()
        }, stop: function () {
            this._stopProgress()
        }, deleteFile: function (e) {
            for (var t = 0; t < this._uploadQueue.length; t++) {
                var i = this._uploadQueue[t];
                if (i && i.id == e) {
                    i.uploader.distroy(), i.isStarted && i.percent < 100 && this._activeTotal--, this._uploadQueue.splice(t, 1);
                    break
                }
            }
        }, clearList: function () {
            this._uploadQueue.length = 0
        }, reUploadError: function (e) {
            this._resetErrorStatus(e), this.start()
        }, _reset: function () {
            this._initUI(), this._bindEvents()
        }, _initUI: function () {
            this._fileInput = $('<input type="file" id="multi_file" style="display:none" multiple accept="' + this._typeFilter + '" />').get(0)
        }, _bindEvents: function () {
            var e = this;
            this._fileInput.onclick = function () {
                e._fileInput.value = ""
            }, this._fileInput.onchange = function () {
                e._selectFile(e._fileInput.files)
            }, this._options.container && this._options.container.bind("click", function () {
                e._fileInput.value = "", e._fileInput.click()
            })
        }, _selectFile: function (e) {
            for (var t = [], i = 0, r = e.length; r > i && i < this._options.queueLen; i++) {
                var n = e[i];
                "" != n.type && this._typeFilter.indexOf(n.type) >= 0 && t.push(this._add(n))
            }
            this._trigger("onFileSelected", {imageList: t, percent: 0})
        }, _add: function (e) {
            var t, i = this, r = i._uploadQueue, n = {
                name: e.name,
                size: e.size,
                id: "img_" + this._makeToken() + "_" + r.length + "_" + e.type,
                percent: 0,
                status: "",
                errorCode: 0,
                errorMessage: null,
                source: e,
                isStarted: !1
            };
            return r.push(n), e.size > this._options.limitSize ? (n.errorCode = 1, n.errorMessage = "\u6587\u4EF6\u5927\u5C0F\u8D85\u51FA\u9650\u5236", this._trigger("error", n), n.percent = 100, n.isStarted = !0, n) : (t = i.use("common/component/ImageUploader", this._options.uploadUrl, null, {
                maxWidth: this._options.maxWidth,
                maxHeight: this._options.maxHeight
            }), n.uploader = t, t.id = n.id, t.bind("success", this._uploadedHandler, this), t.bind("error", this._uploadedHandler, this), t.bind("progress", function (e) {
                return function (t, i, r) {
                    e.percent = Math.min(e.percent + parseInt(20 * i / r, 10), 99)
                }
            }(n)), n)
        }, _upload: function () {
            for (var e = 0, t = !0, i = 0; i < this._uploadQueue.length; i++) {
                var r = this._uploadQueue[i];
                r && (r.percent < 100 && (t = !1), this._activeTotal < this._options.maxParallel && !r.isStarted && (r.isStarted = !0, r.percent = 5, this.getUploadParams && r.uploader.setVariable(this.getUploadParams(r.id)), r.uploader.upload(r.source, this._options.maxSize), this._activeTotal++), r.percent < 50 && (r.percent += 5), e += r.percent / this._uploadQueue.length)
            }
            t ? (this._percent = 100, this.stop(), this._trigger("onComplete")) : (this._percent = parseInt(e, 10), this._trigger("onProgressListen"))
        }, _uploadedHandler: function (e, t, i) {
            var r = e.target.id;
            this._activeTotal--;
            var n = this._getFileById(r);
            return n ? ("error" == e.type && (n.errorCode = 2, n.errorMessage = "\u7F51\u7EDC\u9519\u8BEF", this._trigger("error", n), n.percent = 100), "success" == e.type && (n.response = i.data || i || null, n.percent = 100), e.target.unbind("success", this._uploadedHandler), e.target.unbind("error", this._uploadedHandler), void 0) : !1
        }, _trigger: function (e, t) {
            this.trigger(e, t || {imageList: this._uploadQueue, percent: this._percent})
        }, _getFileById: function (e) {
            for (var t = 0; t < this._uploadQueue.length; t++) {
                var i = this._uploadQueue[t];
                if (i && i.id == e)return i
            }
            return null
        }, _resetErrorStatus: function (e) {
            for (var t = 0; t < this._uploadQueue.length; t++) {
                var i = this._uploadQueue[t];
                if (i && 0 !== i.errorCode && (!e || e && i.id == e) && (i.percent = 0, i.errorCode = 0, i.errorMessage = null, i.isStarted = !1, i.response = null, e))break
            }
        }, _startProgress: function () {
            if (!this._uploadTimer) {
                var e = this;
                this._uploadTimer = setInterval(function () {
                    e._upload()
                }, 1e3)
            }
        }, _stopProgress: function () {
            clearInterval(this._uploadTimer), this._uploadTimer = null
        }, _makeToken: function () {
            var e = function () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            };
            return e() + e() + "_" + e() + e() + e()
        }
    }
});
;
_.Module.define({
    path: "common/widget/image_uploader_manager",
    requires: [
        "common/widget/image_uploader_manager/uploader_flash",
        "common/widget/image_uploader_manager/uploader_html5"
    ],
    sub: {
        initial: function (t) {
            var e = {
                container: null,
                width: 200,
                height: 50,
                isAutoUp: !1,
                queueLen: 10,
                needWatermark: !1,
                fid: "",
                maxSize: 3145728,
                maxWidth: 3e3,
                maxHeight: 3e3,
                uploadUrl: "http://upload.tieba.baidu.com/upload/pic",
                getUploadParams: null,
                tbsUrl: "http://tieba.baidu.com/dc/common/imgtbs",
                isFlash: !1,
                save_yun_album: 0
            };
            this._options = $.extend(e, t || {}), this.uploader = null, this.EVENTS = [
                "onFileSelected",
                "onStartUpload",
                "onProgressListen",
                "onComplete",
                "onError"
            ], this._reset()
        }, _initUploadUrl: function (t) {
            var e = this;
            if (this._options.uploadUrl.indexOf("tbs") > 0)return t && t.apply(e), void 0;
            var o = $.ajax({url: this._options.tbsUrl, dataType: "json"});
            o.done(function (o) {
                0 === Number(o.no) ? (e._options.uploadUrl += "?tbs=" + o.data.tbs + (e._options.isWater ? "&is_wm=1" : "") + "&fid=" + (e._options.fid || "") + "&save_yun_album=" + e._options.save_yun_album, t && t.apply(e)) : t && e._error()
            }).fail(function () {
                t && e._error()
            })
        }, _reset: function () {
            var t = navigator.userAgent.toLowerCase().match(/chrome\/([\d]+)/);
            t && parseInt(t[1]) >= 21 || $.browser.mozilla || $.browser.safari || (this._options.isFlash = !0), this._initUploadUrl(this._startImageUploader)
        }, _startImageUploader: function () {
            this._options.isFlash ? this.uploader = this.use("common/widget/image_uploader_manager/uploader_flash", this._options) : this._options.container && (this.uploader = this.use("common/widget/image_uploader_manager/uploader_html5", this._options)), this._options.container && this._generateCallBack()
        }, _generateCallBack: function () {
            for (var t = this, e = 0; e < this.EVENTS.length; e++) {
                var o = this.EVENTS[e];
                this.uploader.bind(o, function (e) {
                    return function (o, a) {
                        t.trigger(e, a || o)
                    }
                }(o))
            }
        }, start: function () {
            this.uploader.start()
        }, startUpload: function () {
            this.uploader.start()
        }, stop: function () {
            this.uploader.stop()
        }, stopUpload: function () {
            this.uploader.stop()
        }, deleteFile: function (t) {
            this.uploader.deleteFile(t)
        }, clearList: function () {
            this.uploader.clearList()
        }, reUploadError: function (t) {
            this.uploader.resetErrorStatus(t)
        }, uploadBase64: function (t, e) {
            var o = this;
            this._options.isFlash ? this._flashUploadBase64(t, e) : this._initUploadUrl(function () {
                o._ajaxUploadBase64(t, e)
            })
        }, _ajaxUploadBase64: function (t, e) {
            var o = this;
            $.ajax({
                url: o._options.uploadUrl + "&_token=" + (new Date).getTime(),
                data: {filetype: "base64", file: t},
                type: "POST",
                success: function (t) {
                    e.call(o, {errorCode: 0, errorMessage: "", response: t})
                },
                error: function (t) {
                    e.call(o, {errorCode: 1, errorMessage: "\u4E0A\u4F20\u5931\u8D25", response: t})
                },
                dataType: "json"
            })
        }, _flashUploadBase64: function (t, e) {
            var o = this;
            this.uploader && this.uploader.uploadBase64 ? this.uploader.uploadBase64(t, e) : setTimeout(function () {
                o._flashUploadBase64(t, e)
            }, 100)
        }, _error: function (t) {
            t = $.extend({
                percent: 0,
                errorCode: 400,
                errorMessage: "\u521D\u59CB\u5316\u51FA\u9519",
                imageList: {}
            }, t || {}), this.trigger("onError", t)
        }
    }
});
_.Module.define({
    path: "common/widget/tchargeDialog", requires: [], sub: {
        initial: function (e) {
            var t = this;
            t.requireInstanceAsync("common/widget/Tdou", [], function (c) {
                e && e.chargeType && "platform" == e.chargeType ? c.factory("payment", e) : (e && (t.consumption_path = e.consumption_path, t.desc = e.desc, t.current_need_tdou = e.current_need_tdou, t.is_direct_cashier = e.is_direct_cashier), e && t.is_direct_cashier ? c.factory("auto_direct", e) : c.factory("get_icon", e))
            })
        }
    }
});
_.Module.define({
    requires: ["user/widget/userApi"], path: "common/widget/MemberApi", sub: {
        initial: function () {
        }, getMemberNameClass: function (e, r) {
            var i = "";
            if (Env.server_time > 13962816e5 && Env.server_time < 1396368e6 && 4 != r)return i = " vip_red ";
            var t = this.requireInstance("user/widget/userApi", []), n = $.getPageData("forum.forum_id", 0), s = {mParr_props: e};
            return t.checkSingleForumMembershipOf(s, n) && (i = " vip_red "), e && e.level && e.level.end_time > Env.server_time / 1e3 && (i = " vip_red "), i
        }
    }
});
_.Module.define({
    path: "common/widget/umoney_query",
    sub: {
        url: {queryCredit: "/tbapp/umoney/queryUserInfo", queryQualification: "/tbapp/umoney/queryQualification"},
        query_umoney_cls: ".j-query-umoney",
        umoneyInfoStatus: {
            s1: "\u672A\u7533\u8BF7",
            s2: "\u5BA1\u6838\u4E2D",
            s3: "\u6B63\u5E38",
            s4: "\u903E\u671F",
            s5: "\u51BB\u7ED3",
            s6: "\u5931\u8D25"
        },
        initial: function () {
            var e = this;
            e.$element = $(".tdou-umoney-query")
        },
        showUmoney: function (e) {
            var n = this, t = $.tb.format('<div class="tdou-umoney-query">          <span class="umoney-user">              #{displayText}:              <a class="j-query-umoney " href="javascript:void(0);"                 title="\u67E5\u770B\u6709\u94B1\u989D\u5EA6"                 locate="userinfo#\u767E\u5EA6\u6709\u94B1">                  \u67E5\u770B              </a>          </span>          <span class="umoney-placeholder">              <a target="_blank" href="/f?ie=utf-8&kw=\u767E\u5EA6\u6709\u94B1\u6D88\u8D39\u91D1\u878D"                 locate="userinfo#\u767E\u5EA6\u6709\u94B1">                  \u767E\u5EA6\u6709\u94B1\u9001T\u8C46              </a>          </span>  </div>', {displayText: e || "\u767E\u5EA6\u6709\u94B1\u989D\u5EA6"});
            return n.getUmoneyDom(t)
        },
        showUmoneyOnGotTdou: function () {
            var e = this, n = '<div class="tdou-umoney-query umoney-query-get-tdou">      <span class="umoney-placeholder">\u63D0\u9192\uFF1A\u60A8\u5728 pc\u53CA\u5B89\u5353\u4E0A\u83B7\u53D6\u7684T\u8C46\u4E0E\u5728ios\u4E0A\u83B7\u53D6\u7684T\u8C46\u4E0D\u901A\u7528\u3002</span>  </div>', t = e.getUmoneyDom(n);
            return t
        },
        showUmoneyMember: function () {
            var e = this, n = '<div class="tdou-umoney-query tshow-tdou-umoney-query">      <a  target="_blank" href="/f?ie=utf-8&kw=\u767E\u5EA6\u6709\u94B1\u6D88\u8D39\u91D1\u878D" locate="tshow-bar#\u767E\u5EA6\u6709\u94B1">          <span class="umoney-logo"></span>\u4F7F\u7528\u767E\u5EA6\u6709\u94B1\u8D2D\u4E70\u8D34\u5427\u4F1A\u5458\u4F18\u60E0          <span class="vip-red vip-discount">5%</span>      </a>  </div>';
            return e.$element = $(n), e.$element
        },
        getUmoneyDom: function (e) {
            var n = this;
            return this.$element = $(e), n.isUmoneyUser(), n.$element
        },
        bindEvents: function () {
            var e = this;
            e.$element.on("click", e.query_umoney_cls, function () {
                e.queryUmoneyCredit()
            })
        },
        queryUmoneyCredit: function () {
            var e = this;
            e._queryUmoneyCredit && e._queryUmoneyCredit.abort(), e._queryUmoneyCredit = $.ajax({
                type: "GET",
                url: e.url.queryCredit,
                data: {},
                cache: !1,
                dataType: "json"
            }).success(function (n) {
                if (e._queryUmoneyCredit = null, 0 == n.no) {
                    var t = n.data && n.data.data;
                    e.showCredit(t)
                }
            })
        },
        isUmoneyUser: function () {
            var e = this;
            e._isUmoneyUser && e._isUmoneyUser.abort(), e._isUmoneyUser = $.ajax({
                type: "GET",
                url: e.url.queryCredit,
                data: {},
                cache: !1,
                dataType: "json"
            }).success(function (n) {
                if (e._isUmoneyUser = null, 0 == n.no) {
                    var t = n.data && n.data.data.status;
                    "1" != t && (e.$element.find(".umoney-placeholder").end().find(".umoney-user").show(), e.bindEvents())
                } else e.$element.find(".umoney-user").hide().end().find(".umoney-placeholder").show()
            })
        },
        showCredit: function (e) {
            if (e) {
                var n = this, t = "";
                if (3 === e.status) {
                    var o = e.credit || 0;
                    t = o + "\u5143 "
                } else t = n.umoneyInfoStatus["s" + e.status];
                var a = t + ",\u70B9\u51FB\u5237\u65B0";
                n.$element.find(n.query_umoney_cls).html(t).addClass("umoney-credit").tbattr("title", a)
            }
        },
        track: function (e, n) {
            $.stats.track(e, "umoney-query", PageData.product + "-" + n, "click")
        }
    }
});
_.Module.define({
    path: "user/widget/myCurrentForum", sub: {
        initial: function (e) {
            this._opt = e, this.forum = PageData.forum, this.bindEvents()
        }, bindEvents: function () {
            var e = this;
            $(".user_level .badge, .user_level .badge_block").bind("click", function () {
                return window.open("/f/like/level?kw=" + e.forum.name_url + "&lv_t=lv_nav_intro"), !1
            }), $(".user_level .exp_bar").bind("click", function () {
                return window.open("/f/like/level?kw=" + e.forum.name_url + "&lv_t=lv_nav_who"), !1
            })
        }
    }
});
_.Module.define({
    path: "user/widget/tbSpam", requires: [], sub: {
        initial: function () {
            $("body").append($("#tb_spam_notice_html").html())
        }
    }
});
_.Module.define({
    path: "user/widget/myTieba",
    requires: ["common/widget/wallet_dialog", "common/widget/Card", "common/widget/tcharge_dialog"],
    sub: {
        config: {
            url: {
                dolike: "/f/like/commit/add",
                undolike: "/f/like/commit/delete",
                closetip: "/f/like/commit/notice/delete"
            }
        }, initial: function (e) {
            var i = this, t = e || {};
            i.user = PageData.user, i.forum = PageData.forum, i.balvInfo = t.balvInfo, i.style = t.style || "", i.isBySys = t.isBySys || !0, i.scoreTip = null, i.daysTofree = 0, i.block_bubble = null, i.product = t.product || null
        }, init: function () {
            var e = this;
            e.user.forbidden ? e.daysTofree = e.user.forbidden.days_to_free : e.user.balv && (e.daysTofree = e.user.balv.days_tofree), -1 != $.inArray(e.product, [
                "frs",
                "pb"
            ]) && (_.Module.use("ueglibs/widget/Ban", [], function (i) {
                e.BanLib = i
            }), this.user.is_login && e.showOfflineCard()), this.user.is_login && (this.bindEvents(), $(".user_profile .sign_highlight").length > 0 && this.show_orange_tip(), this.showNewpropsTip()), this.dolikeEvent()
        }, showOfflineCard: function () {
            var e = this, i = 1 * new Date;
            i > 1408032e6 || $.tb.Storage.get("balv_tdou_update") > i || (this.offline_card = this.use("common/widget/Card", {
                content: '<span style="cursor:pointer;position: absolute;width: 10px; height: 10px; right: 5px; top: 6px;" class="j_close"></span><a target="_blank" class="j_link" href="/p/3199708402"><img style="margin: 4px 4px 0;" src="http://tb1.bdstatic.com/tb/static-ucenter/img/offline1.png"></a>',
                clazz: "doupiao_offline",
                arrow_dir: "left",
                card_css: {width: 172, "z-index": 1010, left: 198, top: 9},
                arrow_pos: {left: -7, top: 20},
                wrap: $(".user_profile"),
                card_leave_display: !0
            }), this.offline_card._j_card.on("click", ".j_close", function () {
                $.tb.Storage.set("balv_tdou_update", i + 864e5), e.offline_card._j_card.remove()
            }).on("click", ".j_link", function () {
                $.tb.Storage.set("balv_tdou_update", i + 864e5), e.offline_card._j_card.remove()
            }), this.offline_card.showCard())
        }, bindEvents: function () {
            var e = this;
            if ($("#user_info").on("click", ".j_score_num", function (i) {
                    i.preventDefault(), e.requireInstance("common/widget/wallet_dialog").show()
                }), $(".userliked_ban_content").on("click.bawuAppealLink", ".j_appealLink", function () {
                    $.stats.track("balvAppealLink", "uegCount", "bawuAppeal", "click")
                }), $(".userlike_blacked").bind("mouseover", function () {
                    e.show_black_tip($(this))
                }), $(".userlike_prisoned").bind("mouseover", function () {
                    e.daysTofree > 0 && e.daysTofree < 360 ? e.show_shortblock_tip($(this), e.daysTofree, e.isBySys ? "\u7CFB\u7EDF" : "\u5427\u4E3B", e.isBySys ? "system" : "bawu") : e.show_block_tip($(this))
                }), $("body").delegate(".tbmall_tip_close", "click", function () {
                    return $("#tbmall_tip_card").remove(), e.tbmallTip = null, $.cookie("close_tbmall_tip", "1", {expires: 365}), !1
                }), $("#j_tcharge_dialog").on("click", function () {
                    $.stats.track(e.formatForm(), "\u4F1A\u5458\u5B98\u7F51\u7EDF\u8BA1"), e.use("common/widget/tcharge_dialog")
                }), this.user.balv && this.user.balv.has_liked || this.user.is_like)if (PageData.is_ipad)$("a.p_balv_btnmanager").show(); else {
                var i = $(".p_balv_btnmanager");
                $(".my_tieba_mod").hover(function () {
                    i.show()
                }, function () {
                    i.hide()
                })
            }
            $("#my_tieba_mod").find(".user_name").find(".icon_tbworld").on("click", function () {
                switch (e.product) {
                    case"frs":
                        e._postTrack("\u7687\u51A0", "\u4F1A\u5458\u5065\u5EB7\u7EDF\u8BA1", "click", {obj_name: "FRS\u6211\u5728\u8D34\u5427\u7687\u51A0\u70B9\u51FB"});
                        break;
                    case"pb":
                        e._postTrack("\u7687\u51A0", "\u4F1A\u5458\u5065\u5EB7\u7EDF\u8BA1", "click", {obj_name: "PB\u53F3\u4FA7\u6211\u5728\u8D34\u5427\u7687\u51A0\u70B9\u51FB"});
                        break;
                    case"index":
                        e._postTrack("\u7687\u51A0", "\u4F1A\u5458\u5065\u5EB7\u7EDF\u8BA1", "click", {obj_name: "\u9996\u9875\u5DE6\u4FA7\u6211\u5728\u8D34\u5427\u7687\u51A0\u70B9\u51FB"})
                }
            })
        }, formatForm: function () {
            var e = this, i = "";
            return i = e.product ? e.product : e.urlFormat(), i + "\u83B7\u53D6T\u8C46"
        }, urlFormat: function () {
            return location.href.split("/").pop()
        }, dolikeEvent: function () {
            var e = this;
            $(".balv_dolike_comforum,.balv_dolike_star").bind("click", function () {
                return e.user.is_login ? e.user.balv && e.user.balv.is_block || e.user.forbidden && e.user.forbidden.isForbid ? e.showAlert(e.BanLib.render("balvLike")) : e.user.balv && e.user.balv.is_black || e.user.is_black ? e.showAlert("\u4F60\u88AB\u5427\u4E3B\u52A0\u5165\u672C\u5427\u9ED1\u540D\u5355\uFF0C\u6682\u65F6\u4E0D\u80FD\u8FDB\u884C\u64CD\u4F5C") : e.dolike() : _.Module.use("common/widget/LoginDialog", [
                    "",
                    "ilike"
                ]), !1
            })
        }, showAlert: function (e) {
            var i = '<div style="padding:20px 20px; text-align:cente; line-height:20px;font-size:13px;">' + e + "</div>";
            $.dialog.open(i, {title: "\u64CD\u4F5C\u5931\u8D25", width: 380})
        }, howtojoin: function () {
            $.dialog.alert("<div style='padding:20px;line-height:30px;padding-bottom:0px;'>\u70B9\u51FB\u53F3\u4FA7\u4E0A\u65B9\u201C<img align='absmiddle' src='" + PageData.staticDomain + "tb/static-member/img/whatlevel.png'></img>\u201D<br/>\u5373\u53EF\u52A0\u5165\u672C\u5427\uFF0C\u70B9\u4EAE\u5934\u8854\uFF0C\u4ECE\u521D\u7EA7\u7C89\u4E1D\u5F00\u59CB\u6210\u957F\uFF01</div>", {
                title: "\u5982\u4F55\u52A0\u5165",
                width: 325
            })
        }, dolike: function () {
            var e = this;
            if (this.user.is_login && this.user.no_un)return TbCom.process("User", "buildUnameFrame", "\u586B\u5199\u7528\u6237\u540D", "\u6709\u7528\u6237\u540D\u624D\u80FD\u70B9\u4EAE\u201C\u6211\u5173\u6CE8\u201D\uFF0C\u8D76\u5FEB\u7ED9\u81EA\u5DF1\u8D77\u4E00\u4E2A\u5427~"), !1;
            var i = {
                fid: this.forum.forum_id,
                fname: $.tb.escapeHTML(this.forum.forum_name),
                uid: this.user.name_url,
                ie: "gbk",
                tbs: PageData.tbs
            };
            $.post(this.config.url.dolike, i, function (i) {
                if (i && 0 == i.no)_.Module.use("ucenter/widget/LikeTip", [
                    "",
                    !1,
                    {
                        index: i.data.ret.index,
                        like_no: i.like_no
                    }
                ]); else {
                    var t = "";
                    t = 8 == i.no || 9 == i.no ? e.BanLib.render("balvLike") : 220 == i.no ? "\u4F60\u88AB\u5427\u4E3B\u52A0\u5165\u9ED1\u540D\u5355\uFF0C\u6682\u65F6\u4E0D\u80FD\u8FDB\u884C\u64CD\u4F5C" : 221 == i.no ? "\u4F60\u5DF2like\u4E86\u672C\u5427,\u8BF7\u4E0D\u8981\u91CD\u590D\u64CD\u4F5C" : "\u62B1\u6B49\uFF0C\u5F02\u5E38\u9519\u8BEF\uFF0C\u5EFA\u8BAE\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u4E00\u4E0B", e.showAlert(t)
                }
            }, "json")
        }, undolike: function () {
            var e = {
                fid: this.forum.forum_id,
                fname: $.tb.escapeHTML(this.forum.forum_name),
                uid: this.user.name_url,
                ie: "utf-8",
                tbs: PageData.tbs
            };
            $.tb.post(this.config.url.undolike, e, function (e) {
                e && 0 == e.no && $.tb.location.reload(!0)
            })
        }, show_shortblock_tip: function (e) {
            this.block_render(e, this.BanLib.render("balvAside"))
        }, show_block_tip: function (e) {
            this.block_render(e, this.BanLib.render("balvAside"))
        }, show_black_tip: function (e) {
            var i = new Array;
            i.push("<div style='width:180px;text-align:left;margin:6px 0px 6px 10px;'>"), i.push("<span>\u4F60\u5DF2\u88AB\u5427\u4E3B\u62C9\u5165\u9ED1\u540D\u5355\uFF0C</span></br><span>\u4F60\u5728\u672C\u5427\u7684\u5934\u8854\u548C\u6743\u9650\u4E5F\u88AB\u6536\u56DE\u3002</span>"), i.push("</div>"), this.block_render(e, i.join(""))
        }, show_lvup_tip: function (e, i) {
            var t = this, o = new Array;
            if (o.push("<div class='lvup_tip_container'>"), o.push("<div class='lvlup_con_msg'>\u5347\u7EA7\u5566!\u4F60\u5DF2\u62E5\u6709\u672C\u5427" + e + "\u7EA7\u5934\u8854!</div>"), o.push('<div class="lvlup_pop_rights">' + i + "</div>"), "\u52A0\u6CB9~\u7EE7\u7EED\u6512\u7ECF\u9A8C\uFF01" == i)o.push("<a style='float:left;' href='/f/like/level?kw=" + this.forum.name_url + "' target='_blank'>\u67E5\u770B\u5347\u7EA7\u79D8\u7B08</a>"); else {
                var s = 'Stats.sendRequest("fr=tb0_forum&st_mod=frs&st_type=balvupguide&lv=' + e + '")';
                o.push("<a href='#sub' style='float:left;' onclick='rich_postor.jumpToTry(" + e + ");" + s + "'>\u73B0\u5728\u53BB\u8BD5\u8BD5~~</a>")
            }
            o.push("</div>");
            var l = o.join(""), n = {
                content: l,
                arrow_dir: "up",
                bubble_css: {top: 4, right: -5, width: 232, "z-index": 9999},
                arrow_pos: {left: 209},
                attr: "lvup_tip_table",
                wrap: $("#userlike_info_tip"),
                closeBtn: !0
            }, r = new UiBubbleTipBase(n);
            r.j_bubble.find(".j_content").css("padding", "2px").addClass("lvup_tip_table"), r.showBubble(), r.bind("onclose", function () {
                t.close_lvup_tip()
            }, !0), this.user.is_block || setTimeout(function () {
                r.closeBubble(), t.close_lvup_tip()
            }, 8e3)
        }, block_render: function (e, i) {
            if (!this.block_bubble) {
                var t = this, o = {
                    content: i,
                    arrow_dir: "up",
                    bubble_css: {top: 36, right: 4, width: 232, "z-index": 9999},
                    arrow_pos: {left: 209},
                    attr: "",
                    wrap: e,
                    closeBtn: !0
                };
                this.block_bubble = new UiBubbleTipBase(o), this.block_bubble.j_bubble.find(".j_content").css("padding", "2px"), this.block_bubble.showBubble(), this.block_bubble.bind("onclose", function () {
                    t.block_bubble.closeBubble(), t.block_bubble = null
                });
                {
                    setTimeout(function () {
                        t.block_bubble && (t.block_bubble.closeBubble(), t.block_bubble = null)
                    }, 5e3)
                }
            }
        }, close_lvup_tip: function () {
            var e = {
                fid: this.forum.forum_id,
                fname: this.forum.name_url,
                uid: this.user.name_url,
                ie: "utf-8",
                tbs: PageData.tbs,
                type: 2
            };
            $.tb.post(this.config.url.closetip, e, function (e) {
                e && 0 == e.no
            })
        }, show_orange_tip: function () {
            if ("false" != $.cookie("close_sign_tip_o")) {
                $.cookie("close_sign_tip_o", !0, {expires: 14});
                var e = {
                    content: "\u8FDE\u7EED\u7B7E\u523030\u5929ID\u5373\u53EF\u9AD8\u4EAE\u5C55\u793A\uFF0C\u4E00\u8D77\u95EA\u8000\u5427\uFF01",
                    arrow_dir: "down",
                    bubble_css: {top: 3, right: 25, width: 145, "z-index": 9999},
                    arrow_pos: {left: 88},
                    attr: " ",
                    wrap: $(".user_profile .user_name"),
                    closeBtn: !0
                }, i = new UiBubbleTipBase(e);
                i.j_bubble.find(".j_body").css("padding-right", "3px"), i.showBubble(), i.bind("onclose", function () {
                    $.cookie("close_sign_tip_o", !1, {expires: 14})
                }, !0);
                {
                    setTimeout(function () {
                        $(".j_wrap .j_close").click()
                    }, 8e3)
                }
            }
        }, showNewpropsTip: function () {
            var e = $.cookie("NEWS_PROPS_NOTICE"), i = this.user.global && this.user.global.tbmall_newprops || "";
            (!e && i > 0 || e && i > e) && this.buildNewpropsTip()
        }, buildNewpropsTip: function () {
            var e = this, i = {
                content: '<a class="j_newprops_tip" href="/tbmall/home?sn=1" target="_blank" style="text-align:center;display:block;">\u6709\u65B0\u9053\u5177\u4E0A\u7EBF\u54E6~</a>',
                arrow_dir: "up",
                arrow_pos: {left: 40},
                bubble_css: {top: -35, left: 100, width: 100},
                wrap: $("#j_profile_pop"),
                closeBtn: !0
            }, t = new UiBubbleTipBase(i), o = "";
            t.bind("onclose", function () {
                t.closeBubble(), o = e.user.global && e.user.global.tbmall_newprops || "", $.cookie("NEWS_PROPS_NOTICE", o, {
                    expires: 30,
                    path: "/"
                })
            }), t.showBubble(), t.j_bubble.find(".j_newprops_tip").on("click", function () {
                $.post("/tbmall/post/addpropstoucenter", null, function () {
                }), t.closeBubble(), o = e.user.global && e.user.global.tbmall_newprops || "", $.cookie("NEWS_PROPS_NOTICE", o, {
                    expires: 30,
                    path: "/"
                })
            })
        }, hasLevel: function () {
            var e = Math.floor((new Date).getTime() / 1e3);
            return this.user.Parr_props && this.user.Parr_props.level && this.user.Parr_props.level.end_time > e
        }, _postTrack: function (e, i, t, o) {
            t = t || "click", o = o || {}, $.stats.track(e, i, "", t, o)
        }
    }
});
_.Module.define({
    path: "pb/widget/pic_act_poster",
    requires: [
        "common/component/force_login",
        "common/widget/PostService",
        "common/widget/image_uploader_manager",
        "user/widget/myTieba"
    ],
    sub: {
        ORIGINAL_PIC_URL_PREFIX: "http://imgsrc.baidu.com/forum/pic/item/",
        THUMBNAIL_PIC_URL_PREFIX: "http://imgsrc.baidu.com/forum/abpic/item/",
        initial: function (t) {
            try {
                this.option = t, this.actDesc = t.act_desc, this.activityId = t.activity_id, this.threadId = t.thread_id, this.threadTitle = t.thread_title, this.myTieba = this.requireInstance("user/widget/myTieba"), this._showPostDialog()
            } catch (e) {
                throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                    msg: e.message || e.description,
                    path: "pb:widget/pic_act_poster/pic_act_poster.js",
                    method: "",
                    ln: 25
                }), e
            }
        },
        _showPostDialog: function () {
            var t = this, e = [
                '<div class="pic_join_dialog">',
                '<p class="pic_act_rule">\u89C4\u5219\uFF1A',
                "<span>" + t.actDesc + "</span>",
                "</p>",
                '<p class="img_bad_tip">\u6CE8\uFF1A\u4E3A\u4FDD\u8BC1\u6548\u679C\uFF0C\u8BF7\u4E0A\u4F20\u5927\u4E8E200&times;200\u7684\u56FE\u7247</p>',
                '<div class="pic_act_photo">',
                '<div class="pic_prev_wrapper">',
                '<div class="pic_act_upload_btn act_red_btn">\u4E0A\u4F20\u56FE\u7247',
                '<div class="photo_up_container"></div>',
                "</div>",
                '<img src="/tb/static-common/editor_img/layer/i.gif" class="pic_previewer ele_hidden" />',
                "</div>",
                '<textarea cols="30" rows="10" class="ui_textfield pic_act_img_desc" maxlength="140" placeholder="\u8BF7\u8F93\u5165\u56FE\u7247\u63CF\u8FF0\uFF08\u9009\u586B\uFF09,140\u5B57\u4EE5\u5185"></textarea>',
                "</div>",
                '<div class="post_btn_group">',
                '<a href="#" id="pic_act_post_btn" class="ui_btn_disable ui_btn_m_disable"><span><em>\u786E\u8BA4</em></span></a>',
                '<a href="#" id="pic_act_cancel_btn" class="ui_btn ui_btn_sub_m"><span><em>\u53D6\u6D88</em></span></a>',
                "</div>",
                "</div>"
            ].join("");
            if (t.dialog = new $.dialog({
                    html: e,
                    title: "\u6652\u56FE\u53C2\u52A0\u6D3B\u52A8",
                    width: 428,
                    draggable: !0,
                    closeable: !0,
                    show: !1
                }), $.browser.msie && _.Module.use("common/widget/Placeholder", [
                    t.dialog.element.find(".pic_act_img_desc"),
                    "\u8BF7\u8F93\u5165\u56FE\u7247\u63CF\u8FF0\uFF08\u9009\u586B\uFF09,140\u5B57\u4EE5\u5185"
                ]), !PageData.user.is_login) {
                var i = $.tb.unescapeHTML($.tb.location.getHref());
                return t.use("common/component/force_login", i, "userbar", "dialog", "pic_act_poster"), !1
            }
            PageData.user.is_like ? (t.dialog.show(), t._uploadImg(t.dialog.element.find(".pic_prev_wrapper")), t.dialog.element.on("click", "#pic_act_post_btn", function (e) {
                try {
                    if (e.preventDefault(), $(this).hasClass("ui_btn_disable"))return !1;
                    t._postPhoto()
                } catch (i) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: i.message || i.description,
                        path: "pb:widget/pic_act_poster/pic_act_poster.js",
                        method: "",
                        ln: 76
                    }), i
                }
            }).on("click", "#pic_act_cancel_btn", function (e) {
                try {
                    e.preventDefault(), t.dialog.close()
                } catch (i) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: i.message || i.description,
                        path: "pb:widget/pic_act_poster/pic_act_poster.js",
                        method: "",
                        ln: 79
                    }), i
                }
            })) : t._doLike()
        },
        _doLike: function () {
            var t = this, e = new $.dialog({
                html: '<p>\u53C2\u4E0E\u6652\u56FE\u9700\u8981\u5148\u5173\u6CE8\u672C\u5427\u54E6~</p><br><a href="#" class="ui_btn ui_btn_m j_like"><span><em>\u5173\u6CE8\u672C\u5427</em></span></a>',
                width: 420,
                holderClassName: "dialog_tip_holder"
            });
            e.element.on("click", ".j_like", function (i) {
                try {
                    i.preventDefault(), t.myTieba.dolike(), $.stats.track("spic", "plat_like", "pb", "click", {obj_id: t.activityId}), e.close()
                } catch (a) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: a.message || a.description,
                        path: "pb:widget/pic_act_poster/pic_act_poster.js",
                        method: "",
                        ln: 97
                    }), a
                }
            })
        },
        _uploadImg: function (t) {
            var e = this, i = $(new Image), a = t.find(".photo_up_container"), o = t.find(".pic_previewer"), c = t.find(".pic_act_upload_btn"), s = $("#pic_act_post_btn"), n = e.use("common/widget/image_uploader_manager", {
                container: a,
                width: a.width(),
                height: a.height(),
                isFlash: !1,
                isAutoUp: !1
            });
            n.bind("onFileSelected", function () {
                n.startUpload()
            }), n.bind("onStartUpload", function () {
                c.css("top", "-9999px"), o.show(), o.tbattr("src", "http://tb1.bdstatic.com/tb/static-pb/img/pic_act/pic_loading.gif")
            }), n.bind("onComplete", function (t, a) {
                var n = a.imageList[a.imageList.length - 1].response;
                if (null != n && 0 == n.error_code) {
                    var _ = n.info, p = _.pic_id_encode, d = _.fullpic_width, l = _.fullpic_height, r = e.THUMBNAIL_PIC_URL_PREFIX + p + ".jpg", h = e.ORIGINAL_PIC_URL_PREFIX + p + ".jpg";
                    if (200 > d || 200 > l)$(".img_bad_tip").css("color", "red"), c.css("top", "38px"), o.hide(); else {
                        var g = new Image;
                        g.src = r, g.onload = function () {
                            o.tbattr("src", "http://tb1.bdstatic.com/tb/static-common/editor_img/layer/i.gif"), o.css("background-image", "url(" + r + ")"), (g.width < 110 || g.height < 100) && o.css("background-size", "auto")
                        }, $(".img_bad_tip").css("color", "#666"), c.css("top", "-9999px"), o.show(), s.removeClass("ui_btn_disable ui_btn_m_disable").addClass("ui_btn ui_btn_m"), i.addClass("BDE_Image"), i.tbattr({
                            width: d > 560 ? 560 : d,
                            height: d > 560 ? parseInt(560 * l / d) : l,
                            src: h,
                            unselectable: "on",
                            pic_type: 0
                        }), e.orgImg = i.get(0).outerHTML, e.pic_encode = p
                    }
                } else c.css("top", "38px"), o.hide(), e._uploadErrorHandler()
            })
        },
        _uploadErrorHandler: function () {
            $.dialog.alert("\u54E6\uFF0C\u7C97\u4E86\u70B9\u95EE\u9898\uFF0C\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\u4E86", {
                title: "\u5931\u8D25\u63D0\u793A",
                acceptValue: "\u518D\u8BD5\u4E00\u6B21",
                holderClassName: "alert_holder",
                onaccept: function () {
                    return !0
                }
            })
        },
        _postPhoto: function () {
            var t = this, e = "", i = PosterContext.getContext(), a = t.use("common/widget/PostService");
            return $(this).hasClass("ui_btn_disable") ? !1 : (a.success(function (e, i) {
                var a = {
                    activity_id: t.activityId,
                    post_id: i.data.post_id,
                    thread_id: t.threadId,
                    user_name: PageData.user.user_name,
                    pic_encode: t.pic_encode,
                    thread_title: t.threadTitle,
                    canva_from: "poster"
                };
                t.dialog.close(), t._showCanvaDialog(a)
            }), e = t.dialog.element.find(".pic_act_img_desc").val(), a.post("reply", {
                tid: t.threadId,
                content: $.tb.escapeHTML(UE.utils.html2ubb(e, !0)) + UE.utils.html2ubb("<br>" + t.orgImg),
                ptype: 4
            }, i), void 0)
        },
        _showCanvaDialog: function (t) {
            var e = this, i = [
                '<div id="poster_canva_dialog" class="canva_dlg_wrap">',
                '<h3 class="canva_msg_title">\u53D1\u8868\u6210\u529F</h3>',
                '<p class="canva_msg_cnt">\u8F6C\u53D1\u5230\u4F60\u5E38\u53BB\u7684\u5427\u62C9\u7968\uFF0C\u8BA9\u5C0F\u4F19\u4F34\u4EEC\u52A9\u4F60\u83B7\u5956\u5427~</p>',
                '<div class="canva_btn_group">',
                '<a href="#" id="canva_repost_btn" ' + $.tb.dataField(t) + ' class="ui_btn ui_btn_m j_pic_act_repost"><span><em>\u8F6C\u53D1\u62C9\u7968</em></span></a>',
                '<a href="#" id="canva_cancel_btn" class="ui_btn ui_btn_sub_m"><span><em>\u4E0B\u6B21\u518D\u8BF4</em></span></a>',
                "</div>",
                "</div>"
            ].join(""), a = new $.dialog({
                html: i,
                width: 380,
                draggable: !0,
                closeable: !0,
                holderClassName: "pat-noTitle"
            });
            a.bind("onclose", function () {
                "pb" == PageData.product ? setTimeout(function () {
                    var t = $.tb.location.getHash(), i = $.tb.location.getPathname();
                    i == "/p/" + e.threadId ? "#pic_sort_new" != t ? ($.tb.location.setHref("/p/" + e.threadId + "#pic_sort_new"), $.tb.location.reload()) : $.tb.location.reload() : $.tb.location.setHref("/p/" + e.threadId + "#pic_sort_new")
                }, 500) : setTimeout(function () {
                    $.tb.location.reload()
                }, 500)
            }), a.element.on("click", "#canva_repost_btn", function (t) {
                try {
                    t.preventDefault(), a.hide()
                } catch (e) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: e.message || e.description,
                        path: "pb:widget/pic_act_poster/pic_act_poster.js",
                        method: "",
                        ln: 248
                    }), e
                }
            }).on("click", "#canva_cancel_btn", function (t) {
                try {
                    t.preventDefault(), a.close()
                } catch (e) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: e.message || e.description,
                        path: "pb:widget/pic_act_poster/pic_act_poster.js",
                        method: "",
                        ln: 251
                    }), e
                }
            })
        }
    }
});
_.Module.define({
    path: "common/component/Follower", sub: {
        initial: function (i) {
            var t = {timeout: 0};
            this.options = $.extend(t, i), this.ctn = this.options.ctn, this.timer = null, $.isFunction(this.options.getLimitTop) || (this.minTop = this.options.getLimitTop.minTop, this.maxTop = this.options.getLimitTop.maxTop), this.ctn && (this.bindScrollEvent(), this.bindResizeEvent())
        }, bindScrollEvent: function () {
            var i = this;
            $(window).scroll(function () {
                0 == i.options.timeout ? i.scroller() : (i.timer && clearTimeout(i.timer), i.timer = setTimeout(function () {
                    i.scroller()
                }, i.options.timeout))
            })
        }, bindResizeEvent: function () {
            var i = this;
            $(window).on("resize", function () {
                i.resizer()
            })
        }, resizer: function () {
        }, scroller: function () {
            var i, t, o = $(window).scrollTop() + 10;
            i = this.minTop ? this.minTop : this.options.getLimitTop().minTop, t = this.maxTop ? this.maxTop : this.options.getLimitTop().maxTop, i > o ? (this.ctn.data("isFixed") && (this.ctn.removeClass("tbui_follow_fixed"), this.ctn.data("isFixed", !1), this.trigger("normal")), this.ctn.show()) : o >= i && t >= o ? (this.ctn.data("isFixed") || (this.ctn.addClass("tbui_follow_fixed"), this.ctn.data("isFixed", !0), this.trigger("fixed")), this.ctn.show()) : (this.trigger("hide"), this.ctn.hide())
        }
    }
});
function showattip(e) {
    var n = $(e), t = "@" == n.text()[0] ? n.text().substring(1) : n.text().substring(), a = ($(e).tbattr("username"), "/home/main?un=" + encodeURIComponent(t) + "&fr=pb&ie=utf-8");
    n.addClass("j_user_card").bindData({un: t}).tbattr("href", a).trigger("mouseenter"), e.onmouseover = null
}
function hideattip(e) {
    e.onmouseout = null
}
_.Module.define({
    path: "user/widget/pbUserBase",
    requires: ["common/widget/Card", "common/widget/UserHead", "common/widget/MemberApi", "user/widget/icons"],
    sub: {
        initial: function () {
            this._userHead = this.getInstance("common/widget/UserHead"), this._memberApi = this.getInstance("common/widget/MemberApi"), this._icons = this.getInstance("user/widget/icons")
        }, face_link: function (e) {
            var n = "", t = "/home/main?un=" + encodeURIComponent(e.user_name) + "&ie=utf-8&fr=pb", a = 'src="' + this._userHead.getHeadUrl(e) + '"', r = "<img " + a + "/>";
            return n = "<a data-field=\"{'un':'" + e.user_name + '\'}" target="_blank" class="j_user_card lzl_p_p" href="' + t + '" username="' + e.user_name + '">' + r + "</a>"
        }, name_link: function (e) {
            var n = e.profession_manager_nick_name || e.nickname;
            return '<a class="at j_user_card ' + this._memberApi.getMemberNameClass(e.mParr_props) + "\" data-field=\"{'un':'" + e.user_name + '\'}" alog-group="p_author" target="_blank" href="/home/main?un=' + encodeURIComponent(e.user_name) + '&ie=utf-8&fr=pb" username="' + e.user_name + '">' + n + "</a>"
        }
    }
});
_.Module.define({
    requires: ["pb/widget/Favthread", "pb/widget/pic_act_poster", "common/component/Follower"],
    path: "pb/widget/ForumTitle",
    sub: {
        initial: function (t) {
            try {
                this.dataObj = t, this.requireInstance("pb/widget/Favthread"), this.bindEvents()
            } catch (e) {
                throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                    msg: e.message || e.description,
                    path: "pb:widget/forum_title/forum_title.js",
                    method: "",
                    ln: 16
                }), e
            }
        }, bindEvents: function () {
            var t = this, e = $("#j_core_title_wrap");
            e.on("click", "#lzonly_cntn", function () {
                try {
                    if (!PageData.user.is_login) {
                        var e = "http://tieba.baidu.com" + $.tb.unescapeHTML($(this).tbattr("href"));
                        return t.requireInstanceAsync("common/component/force_login", [
                            e,
                            "userbar",
                            "dialog",
                            "pb_see_lz"
                        ]), !1
                    }
                } catch (i) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: i.message || i.description,
                        path: "pb:widget/forum_title/forum_title.js",
                        method: "",
                        ln: 27
                    }), i
                }
            }), this.j_core_title_wrap = e, this.j_thread_pager = $("#thread_theme_5"), this.addScrollListener(), t.dataObj.is_pic_act_underway && e.on("click", ".pic_act_join_btn", function (e) {
                try {
                    e.preventDefault(), t.requireInstance("pb/widget/pic_act_poster", $(this).getData())
                } catch (i) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: i.message || i.description,
                        path: "pb:widget/forum_title/forum_title.js",
                        method: "",
                        ln: 38
                    }), i
                }
            })
        }, updateLimitTop: function () {
            var t = this, e = $(".left_section"), i = $(".right_section"), o = e.height() > i.height() ? e.height() : i.height(), r = $("#pb_content"), a = (t.j_core_title_wrap.offset().top + 10, r.offset().top + o - t.j_core_title_wrap.height());
            this.follwer.maxTop = a
        }, addScrollListener: function () {
            var t = this, e = $(".left_section"), i = $("#pb_content"), o = $(".right_section"), r = (t.j_core_title_wrap.height(), t.j_core_title_wrap.offset().top + 10, i.offset().top, e.height() > o.height() ? e.height() : o.height());
            this.follwer = this.requireInstance("common/component/Follower", {
                ctn: t.j_core_title_wrap,
                timer: 30,
                getLimitTop: {
                    minTop: t.j_core_title_wrap.parent().offset().top + 20,
                    maxTop: i.offset().top + r - t.j_core_title_wrap.height()
                }
            }), this.follwer.bind("normal", function () {
                t.j_core_title_wrap.removeClass("core_title_absolute_bright").css({top: 0}), t.j_thread_pager.removeClass("thread_theme_bright_absolute"), t.j_core_title_wrap.find(".pic_act_toolbar").removeClass("toolbar_fixed").hide()
            }), this.follwer.bind("fixed", function () {
                var e = $(".app_forum_top_nav"), i = 0;
                e.length > 0 && (i = 40), t.j_core_title_wrap.addClass("core_title_absolute_bright").css({top: i}), t.j_thread_pager.addClass("thread_theme_bright_absolute"), t.j_core_title_wrap.find(".pic_act_toolbar").addClass("toolbar_fixed").show()
            })
        }
    }
});
_.Module.define({
    path: "encourage/widget/novel_icons", sub: {
        initial: function () {
        }, getMonthlyTicketIcon: function () {
            return "<i class='novel-monthly-ticket-icon'></i>"
        }, getNovelLevelIcon: function (n, e, o) {
            e = e || "", o = o || "";
            var l = "";
            return l = "" === o ? "<i class='novel-level-icon novel-level-" + n + "' title='" + e + "'></i>" : "<a target='_blank' href='" + o + "' class='novel-level-icon novel-level-" + n + "' title='" + e + "'></a>"
        }, getNovelFamousIcon: function (n) {
            return '<span class="novel-famous-icon">' + n + "</span>"
        }, getNovelRankIcon: function () {
            var n = void 0 === arguments[0] ? 1 : arguments[0];
            return "<i class='novel-rank-icon novel-rank-" + n + "'></i>"
        }, getNovelTopFansIcon: function (n) {
            return "<i class='novel-top-fans-icon novel-top-fans-" + n + "'></i>"
        }
    }
});
_.Module.define({
    path: "pb/widget/saveFace",
    requires: [],
    sub: {
        url: "/tbmall/post/useSavefaceProps",
        opt: {tbs: 0, props_id: "", thread_id: "", forum_id: "", target_user_id: "", target_user_name: ""},
        curPost: null,
        ajaxing: !1,
        tmp: [
            '<div class="save_face_dialog">',
            '<div class="save_face_detail clearfix">#{save_cards}</div>',
            '<div class="save_face_use">',
            '<div class="save_face_split"></div>',
            '<p class="save_face_tip"><span>\u8981\u4F7F\u7528\u8FD9\u5F20\u633D\u5C0A\u5361\u5417\uFF1F</span>',
            '<a class="j_save_face_buy" target="_blank" href="/tbmall/propslist?category=117">>>\u7ACB\u5373\u8D2D\u4E70</a>',
            "</p>",
            "<p>",
            '<a href="#" onclick="return false;" class="j_save_face ui_btn ui_btn_m">',
            "<span><em>\u786E\u5B9A</em></span>",
            "</a>",
            '<a href="#" onclick="return false;" class="j_save_face_cancel ui_btn ui_btn_sub_m">',
            "<span><em>\u53D6\u6D88</em></span>",
            "</a>",
            "</p>",
            "</div>",
            "</div>"
        ].join(""),
        initial: function (e) {
            try {
                if (window.Page && Page.checkLoadedModules("saveface"))return;
                this.props = e.props, this.isLogin = e.isLogin, this.dialog = null, this.opt.forum_id = e.forumId, this.opt.thread_id = e.threadId, this.opt.tbs = PageData.tbs, this.bindEvents()
            } catch (a) {
                throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                    msg: a.message || a.description,
                    path: "pb:widget/save_face/save_face.js",
                    method: "",
                    ln: 57
                }), a
            }
        },
        bindEvents: function () {
            var e = this;
            $(".save_face_card").live("click", function () {
                try {
                    if (!e.isLogin)return _.Module.use("common/widget/LoginDialog", [], function () {
                    }), !1;
                    var a = $(this).closest(".j_l_post").getData();
                    e.opt.target_user_id = a.author.user_id, e.opt.target_user_name = a.author.user_name, e.curPost = $(this).closest(".save_face_bg"), e.initDialog()
                } catch (t) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: t.message || t.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 71
                    }), t
                }
            }), $("body").on("mouseenter", ".save_card", function () {
                return $(this).closest(".save_face_detail").find(".save_card").removeClass("hover"), $(this).hasClass("sel") ? !1 : ($(this).addClass("hover"), void 0)
            }).on("mouseleave", ".save_face_detail", function () {
                $(this).find(".save_card").removeClass("hover")
            }).on("click", ".save_card", function () {
                try {
                    var a = !!$(this).getData("data-num"), t = $(".j_save_face_buy").removeClass("emph");
                    return $(this).closest(".save_face_detail").find(".save_card").removeClass("sel").removeClass("unsel"), a ? ($(this).addClass("sel"), t.hide(), e.opt.props_id = $(this).getData("data-id")) : ($(this).addClass("unsel"), t.show(), e.opt.props_id = 0), !1
                } catch (s) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: s.message || s.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 100
                    }), s
                }
            }).on("click", ".j_save_face_cancel", function () {
                try {
                    return e.dialog.close(), e.dialog = null, e.opt.props_id = "", !1
                } catch (a) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: a.message || a.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 105
                    }), a
                }
            }).on("click", ".j_save_face", function () {
                try {
                    e.postHandle()
                } catch (a) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: a.message || a.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 107
                    }), a
                }
            }).on("click", ".j_save_face_buy", function () {
                try {
                    e.showBuyDialog(this.href)
                } catch (a) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: a.message || a.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 109
                    }), a
                }
            }).on("click", ".j_save_face_buy_1", function () {
                try {
                    e.showBuyDialog(this.href)
                } catch (a) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: a.message || a.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 111
                    }), a
                }
            })
        },
        initSaveCards: function () {
            for (var e = 0, a = {}, t = "", s = (this.props, [
                '<div class="save_card" title="#{card_desc}" data-id="#{card_id}" data-num="#{card_num}">',
                '<img src="#{card_img}"/>',
                "<p>x#{card_num}</p>",
                "</div>"
            ].join("")), i = {}, c = [
                {
                    key: "1170001",
                    img: "http://tb1.bdstatic.com/tb/cms/save_face/level_1.png",
                    desc: "\u7834\u65E7\u7684\u633D\u5C0A\u5361(\u589E\u52A0\u7ECF\u9A8C\u503C-1~2)"
                },
                {
                    key: "1170002",
                    img: "http://tb1.bdstatic.com/tb/cms/save_face/level_2.png",
                    desc: "\u666E\u901A\u7684\u633D\u5C0A\u5361(\u589E\u52A0\u7ECF\u9A8C\u503C0~3)"
                },
                {
                    key: "1170003",
                    img: "http://tb1.bdstatic.com/tb/cms/save_face/level_3.png",
                    desc: "\u95EA\u5149\u7684\u633D\u5C0A\u5361(\u589E\u52A0\u7ECF\u9A8C\u503C2~5)"
                },
                {
                    key: "1170004",
                    img: "http://tb1.bdstatic.com/tb/cms/save_face/level_4.png",
                    desc: "\u8000\u773C\u7684\u633D\u5C0A\u5361(\u589E\u52A0\u7ECF\u9A8C\u503C5~8)"
                },
                {
                    key: "1170005",
                    img: "http://tb1.bdstatic.com/tb/cms/save_face/level_5.png",
                    desc: "\u795E\u5723\u7684\u633D\u5C0A\u5361(\u589E\u52A0\u7ECF\u9A8C\u503C10~15)"
                }
            ]; e < c.length; e++)a = c[e], i = {
                card_id: a.key,
                card_img: a.img,
                card_desc: a.desc,
                card_num: this.getPropNum(a.key)
            }, t += $.tb.format(s, i);
            return t
        },
        getPropNum: function (e) {
            var a = this.props;
            return a && a["117"] && a["117"][e] ? a["117"][e].left_num : 0
        },
        initDialog: function () {
            var e = $.tb.format(this.tmp, {save_cards: this.initSaveCards()});
            this.dialog = new $.dialog({
                title: "\u4F7F\u7528\u633D\u5C0A\u5361",
                html: e,
                draggable: !1,
                width: 640
            }), this.dialog.show()
        },
        postHandle: function () {
            var e = this;
            if (!e.ajaxing) {
                if (0 == e.opt.props_id)return $(".j_save_face_buy").show().addClass("emph"), void 0;
                e.ajaxing = !0, $.post(e.url, e.opt, function (a) {
                    e.ajaxing = !1, e.resHandle(a)
                })
            }
        },
        resHandle: function (e) {
            var a = this;
            if (0 == e.no) {
                this.dialog.close();
                var t = setTimeout(function () {
                    a.addScoreAni(e.data.exp), clearTimeout(t), t = null
                }, 200)
            } else {
                var s = {
                    210009: "\u4E0D\u80FD\u5BF9\u81EA\u5DF1\u4F7F\u7528\u633D\u5C0A\u5361\u54E6",
                    2270026: "\u633D\u5C0A\u5361\u53EA\u80FD\u5BF9\u52CB\u7AE0\u7528\u6237\u4F7F\u7528",
                    2190008: "4\u5C0F\u65F6\u5185\u53EA\u80FD\u5BF9\u540C\u4E00\u4E2A\u7528\u6237\u4F7F\u7528\u4E00\u6B21\u633D\u5C0A\u5361",
                    2270019: '\u60A8\u7684\u633D\u5C0A\u5361\u4E0D\u591F\u4E86<a class="j_save_face_buy_1" target="_blank" href="/tbmall/propslist?category=117">>>\u7ACB\u5373\u8D2D\u4E70</a>',
                    "else": "\u670D\u52A1\u5668\u6253\u4E86\u4E2A\u76F9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"
                }, i = [
                    '<p class="save_face_alert">',
                    e && e.no in s ? s[e.no] : s["else"],
                    "</p>",
                    '<p class="save_face_alert">',
                    '<a href="" onclick="return false;" class="j_save_face_cancel ui_btn ui_btn_m">',
                    "<span><em>\u786E\u5B9A</em></span>",
                    "</a>",
                    "</p>"
                ].join("");
                this.dialog.close(), this.dialog = new $.dialog({
                    title: "\u63D0\u793A",
                    html: i,
                    draggable: !1
                }), this.dialog.show()
            }
        },
        addScoreAni: function (e) {
            var a = [
                '<div class="save_face_ani">',
                '<span class="ani_1">@' + $.tb.subByte(this.opt.target_user_name, 10) + "</span>",
                '<span class="ani_2">+' + parseInt(e) + "\u7ECF\u9A8C\u503C</span>",
                "</div>"
            ].join("");
            $(a).css({top: 130, left: 350}).insertAfter(this.curPost).animate({
                top: "-=70",
                left: "-=200",
                opacity: .2
            }, 1500, function () {
                $(this).remove(), $.tb.location.reload()
            })
        },
        showBuyDialog: function (e) {
            var a = '<p class="buy_txt">\u9053\u5177\u8D2D\u4E70\u6210\u529F\u540E\u5373\u53EF\u4F7F\u7528\uFF01</p><div class="buy_dialog_btns"><a href="#" class="ui_btn ui_btn_m btn_success"><span><em>\u8D2D\u4E70\u6210\u529F</em></span></a><a href="#{href}" target="_blank"  class="ui_btn ui_btn_sub_m btn_failure"><span><em>\u8D2D\u4E70\u5931\u8D25\uFF0C\u91CD\u65B0\u8D2D\u4E70</em></span></a></div>', t = new $.dialog({
                title: "\u63D0\u793A",
                html: $.tb.format(a, {href: $.tb.unescapeHTML(e)}),
                width: 400,
                height: 80
            });
            t.bind("onclose", function () {
                $.tb.location.reload()
            }), t.element.find(".btn_success").on("click", function (e) {
                try {
                    e.preventDefault(), $.tb.location.reload()
                } catch (e) {
                    throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                        msg: e.message || e.description,
                        path: "pb:widget/save_face/save_face.js",
                        method: "",
                        ln: 271
                    }), e
                }
            })
        }
    }
});
window.__discarding && __discarding("pcommon/component/login_dialog"), _.Module.define({
    path: "pcommon/component/LoginDialog",
    sub: {
        _config: {
            apiOpt: {
                staticPage: "http://tieba.baidu.com/tb/static-common/html/pass/v3Jump.html",
                product: "tb",
                charset: "GBK",
                u: "",
                memberPass: !0,
                safeFlag: 0
            }, cache: !1, img: "", onLoginSuccess: function (t) {
                t.returnValue = !1, $.stats.sendRequest("st_type=login_succeed&fr=tb0&st_pos="), $.tb.location.reload()
            }, onSubmitStart: function () {
                $.stats.sendRequest("st_type=login_click&fr=tb0&st_pos=")
            }, registerLink: "https://passport.baidu.com/v2/?reg&tpl=tb&u=http://tieba.baidu.com", tangram: !0
        }, initial: function (t, i, s) {
            var o = this, a = 1;
            if (o._config.apiOpt.u = "string" == typeof t && "" != t ? t : $.tb.location.getHref(), "string" == typeof i) {
                switch (i) {
                    case"userBar":
                        a = 1;
                        break;
                    case"editor1":
                    case"lzl":
                        a = 2;
                        break;
                    case"editor":
                        a = 3;
                        break;
                    case"lzonly":
                        a = 4;
                        break;
                    case"ilike":
                        a = 5;
                        break;
                    default:
                        a = 1
                }
                o._config.img = "http://tb2.bdstatic.com/tb/static-common/img/passport/logindlg_pic" + a + ".png"
            } else o._config.img = "http://tb2.bdstatic.com/tb/static-common/img/passport/logindlg_pic" + a + ".png";
            PageData && (o._config.apiOpt.isQuickUser = PageData.is_quick_user || 0), s && (o._config.onLoginSuccess = s), arguments.length > 3 && (o._config.apiOpt.product = arguments[3]), function (t) {
                var i = "undefined" != typeof Env && Env.server_time ? Env.server_time : (new Date).getTime();
                t.JsLoadManager.use([
                    "http://passport.bdimg.com/passApi/js/uni_login_wrapper.js?cdnversion=" + Math.floor(i / 6e4),
                    "http://passport.bdimg.com/passApi/js/wrapper.js?cdnversion=" + Math.floor(i / 6e4)
                ], function () {
                    t.passPopInstance || (t.passPopInstance = passport.pop.init(o._config)), t("#passport-login-pop").find(".pass-login-pop-img img").tbattr("src", o._config.img), t.passPopInstance.show(), setTimeout(function () {
                        t("#passport-login-pop").find("input.pass-button-submit").tbattr("alog-alias", "login")
                    }, 1e3)
                }, !0, "utf-8")
            }(window.jQuery)
        }
    }
});
_.Module.define({
    requires: ["pcommon/component/LoginDialog"], path: "pb/widget/Posts", sub: {
        initial: function () {
            try {
                var e = this;
                e._bindEvents()
            } catch (t) {
                throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                    msg: t.message || t.description,
                    path: "pb:widget/posts/posts.js",
                    method: "",
                    ln: 16
                }), t
            }
        }, _bindEvents: function () {
            if (!Page.checkLoadedModules("pbPost")) {
                var e = this;
                $("#j_p_postlist").delegate(".p_post_del_my", "click", function () {
                    try {
                        var t = $(this), a = t.getData() || {}, o = a.delete_mine, n = a.user_name, s = a.index;
                        if (o && 1 == o) {
                            var i = s && 1 == s ? "\u4E3B\u9898" : "\u56DE\u590D", r = r = $.dialog.confirm('<div style="margin:15px auto 0;text-align:center;">\u786E\u8BA4\u5220\u9664\u8FD9\u6761' + i + "?<div>", {showTitle: !1});
                            s && 1 == s ? r.bind("onaccept", function () {
                                e._delete_thread(n)
                            }) : r.bind("onaccept", function () {
                                var a = e._get_delete_paras(t, !1);
                                a.user_name = n, e._delete_post(a)
                            })
                        }
                        return !1
                    } catch (c) {
                        throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                            msg: c.message || c.description,
                            path: "pb:widget/posts/posts.js",
                            method: "",
                            ln: 46
                        }), c
                    }
                }).delegate(".lzl_jb_in", "click", function () {
                    try {
                        {
                            var t = $(this), a = t.getData() || {}, o = a.user_name;
                            a.delete_mine
                        }
                        if (1 != a.delete_mine) {
                            var n = $(this).parents(".lzl_single_post").getData(), s = $(this).parents(".j_l_post").getData().content.post_id;
                            return window.open("http://tieba.baidu.com/complaint/info?type=0&tid=" + PageData.thread.thread_id + "&pid=" + s + "&cid=" + n.spid, "newwindow", "height=900, width=800, toolbar =no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no"), !1
                        }
                        var i = $.dialog.confirm('<div style="margin:15px auto 0;text-align:center;">\u786E\u8BA4\u5220\u9664\u8FD9\u6761\u56DE\u590D?<div>', {showTitle: !1});
                        return i.bind("onaccept", function () {
                            var a = e._get_delete_paras(t, !0);
                            a.user_name = o, e._delete_post(a, !0)
                        }), !1
                    } catch (r) {
                        throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                            msg: r.message || r.description,
                            path: "pb:widget/posts/posts.js",
                            method: "",
                            ln: 68
                        }), r
                    }
                }).delegate(".apc_src_wrapper a", "mousedown", function (e) {
                    var t = e.currentTarget.href, a = t.replace(/\w*(:\/\/)?([^\/]+).*/g, "$2");
                    $.stats.sendRequest("fr=tb0_forum&st_type=shenqi_pb_link&st_value=" + encodeURIComponent(a))
                }).delegate(".j_user_card", "click", function () {
                    try {
                        if (PageData.user.is_login)return;
                        var e = "";
                        e = $(this).hasClass("lzl_p_p") ? "pb_user_lzl" : "pb_user_lc";
                        var t = "http://tieba.baidu.com" + $.tb.unescapeHTML($(this).tbattr("href"));
                        return window.open("/f/user/passport?jumpUrl=" + t + "&statsInfo=" + e + "#login_anchor"), !1
                    } catch (a) {
                        throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                            msg: a.message || a.description,
                            path: "pb:widget/posts/posts.js",
                            method: "",
                            ln: 79
                        }), a
                    }
                }).delegate(".j_jb_ele", "mouseover", function () {
                    $(this).find(".super_jubao").show()
                }).delegate(".j_jb_ele", "mouseout", function () {
                    $(this).find(".super_jubao").hide()
                }).on("click", ".j-pb-tpoint", function () {
                    try {
                        var t = PageData.user;
                        if (!t.is_login)return e.requireInstance("pcommon/component/LoginDialog"), !1;
                        var a = $(this), o = a.getData();
                        e.tbpointTrack(o.template_id, "BTN_FB");
                        var n = $.dialog.confirm('<div style="margin:15px auto 0;text-align:center;">\u786E\u5B9A\u4E0D\u518D\u770B\u5230\u8BE5\u6761\u5E7F\u544A?<div>', {title: "\u63D0\u793A"});
                        n.bind("onaccept", function () {
                            e.tbpointTrack(o.template_id, "BTN_FBOK"), $.post("/tpoint/submit/mask", {
                                tbs: PageData.tbs,
                                user_id: t.user_id,
                                template_id: o.template_id
                            }, function (t) {
                                0 === t.no ? a.closest(".j_l_post").remove() : e._showTip("\u62B1\u6B49\uFF0C\u7CFB\u7EDF\u7E41\u5FD9\uFF0C\u9690\u85CF\u5931\u8D25\u3002")
                            }, "json")
                        }).bind("oncancel", function () {
                            e.tbpointTrack(o.template_id, "BTN_FBCANCEL")
                        })
                    } catch (s) {
                        throw"undefined" != typeof alog && alog("exception.fire", "catch", {
                            msg: s.message || s.description,
                            path: "pb:widget/posts/posts.js",
                            method: "",
                            ln: 119
                        }), s
                    }
                })
            }
        }, tbpointTrack: function (e, t) {
            var a = PageData;
            $.stats.track("p0248", "tpoint", "PB", "CLICK_FEEDBACK", {
                action_type: "CLICK_FEEDBACK",
                line: "PT",
                loc_param: t,
                obj_id: e,
                obj_name: e,
                obj_cpid: 0,
                obj_good_id: 0,
                obj_throw_type: "BY_POST",
                client_type: "PC_WEB",
                uid: a.user.user_id,
                uname: a.user.user_name,
                fid: a.forum.forum_id,
                fname: a.forum.forum_name,
                err_no: 0,
                tid: a.thread.thread_id,
                timestamp: (new Date).getTime()
            })
        }, _delete_thread: function (e, t) {
            var a = this, o = PageData, n = {
                ie: "utf-8",
                tbs: o.tbs,
                kw: o.forum.forum_name,
                fid: o.forum.forum_id,
                tid: o.thread.thread_id,
                user_name: e,
                delete_my_post: 0,
                delete_my_thread: 1
            };
            t && (n = $.extend(n, a._captcha)), PostHandler.execute("threadDelete", n, function (t) {
                var o = "";
                switch (t.no) {
                    case 0:
                        $.tb.location.setHref("/f?kw=" + PageData.forum.name_encode);
                        break;
                    case 308:
                        o = PageData.user.forbidden ? "\u62B1\u6B49\uFF0C\u60A8\u5DF2\u88AB\u672C\u5427\u5C01\u7981\u6216\u8005\u52A0\u5165\u9ED1\u540D\u5355\uFF0C\u6682\u4E0D\u80FD\u5220\u8D34" : "";
                        break;
                    case 871:
                        o = "\u62B1\u6B49\uFF0C\u4ECA\u5929\u5DF2\u8FBE\u60A8\u5220\u8D34\u7684\u6700\u5927\u9650\u989D\uFF0C\u660E\u5929\u518D\u6765\u8BD5\u8BD5\u5427~";
                        break;
                    case 34:
                        o = "\u4EB2\u7231\u7684\u5C0F\u4F19\u4F34\uFF0C\u4F60\u4ECA\u5929\u7684\u5220\u8D34\u6570\u91CF\u5DF2\u7ECF\u8FBE\u5230\u6700\u5927\u9650\u989D(" + t.data.reason + "\u6761/\u5929\uFF09\uFF0C\u660E\u5929\u518D\u6765\u8BD5\u8BD5\u5427~";
                        break;
                    case 4009:
                        o = "\u8BE5\u8D34\u5B50\u5DF2\u88AB\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u76F4\u63A5\u5220\u9664\uFF0C\u5982\u53D1\u73B0\u8D34\u5B50\u6709\u95EE\u9898\u8BF7\u76F4\u63A5\u4E3E\u62A5";
                        break;
                    case 4011:
                        a._getCaptcha.call(a, t, e);
                        break;
                    default:
                        o = "\u62B1\u6B49\uFF0C\u7CFB\u7EDF\u7E41\u5FD9\uFF0C\u8D34\u5B50\u5220\u9664\u5931\u8D25\u3002"
                }
                "" != o && (a.message ? a.message.showMessage(o, "", !1) : _.Module.getInstance("pb/widget/Message", function (e) {
                    a.message = e, e.showMessage(o, "", !1)
                }))
            })
        }, _delete_post: function (e, t, a) {
            var o = this, n = PageData, s = {
                ie: "utf-8",
                tbs: n.tbs,
                kw: n.forum.forum_name,
                fid: n.forum.forum_id,
                tid: n.thread.thread_id,
                user_name: e.user_name,
                delete_my_post: 1,
                delete_my_thread: 0,
                is_vipdel: n.power.lz_del ? 1 : 0
            };
            a && (s = $.extend(s, o._captcha)), t ? (s.pid = e.spid, s.is_finf = 1) : (s.pid = e.content_id, s.is_finf = !1), PostHandler.execute("postDelete", s, function (a) {
                var n = "";
                switch (a.no) {
                    case 0:
                        $.tb.location.reload();
                        break;
                    case 308:
                        n = "\u62B1\u6B49\uFF0C\u60A8\u5DF2\u88AB\u672C\u5427\u5C01\u7981\u6216\u8005\u52A0\u5165\u9ED1\u540D\u5355\uFF0C\u6682\u4E0D\u80FD\u5220\u8D34";
                        break;
                    case 871:
                        n = "\u62B1\u6B49\uFF0C\u4ECA\u5929\u5DF2\u8FBE\u60A8\u5220\u8D34\u7684\u6700\u5927\u9650\u989D\uFF0C\u660E\u5929\u518D\u6765\u8BD5\u8BD5\u5427~";
                        break;
                    case 877:
                        n = "\u8BE5\u8D34\u4E3A\u4ED8\u8D39\u53EF\u89C1\u8D34\uFF0C\u65E0\u6CD5\u5220\u9664";
                        break;
                    case 34:
                        n = "\u4EB2\u7231\u7684\u5C0F\u4F19\u4F34\uFF0C\u4F60\u4ECA\u5929\u7684\u5220\u8D34\u6570\u91CF\u5DF2\u7ECF\u8FBE\u5230\u6700\u5927\u9650\u989D(" + a.data.reason + "\u6761/\u5929\uFF09\uFF0C\u660E\u5929\u518D\u6765\u8BD5\u8BD5\u5427~";
                        break;
                    case 4009:
                        n = "\u8BE5\u8D34\u5B50\u5DF2\u88AB\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u76F4\u63A5\u5220\u9664\uFF0C\u5982\u53D1\u73B0\u8D34\u5B50\u6709\u95EE\u9898\u8BF7\u76F4\u63A5\u4E3E\u62A5";
                        break;
                    case 4011:
                        o._getCaptcha.call(o, a, e, t);
                        break;
                    default:
                        n = "\u62B1\u6B49\uFF0C\u7CFB\u7EDF\u7E41\u5FD9\uFF0C\u8D34\u5B50\u5220\u9664\u5931\u8D25\u3002"
                }
                "" != n && (o.message ? o.message.showMessage(n, "", !1) : _.Module.getInstance("pb/widget/Message", function (e) {
                    o.message = e, e.showMessage(n, "", !1)
                }))
            })
        }, _captcha: {}, _getCaptcha: function (e, t, a) {
            var o = this, n = 1;
            "string" == typeof t && (n = 0), _.Module.use("common/component/CaptchaDialog", {
                title: "\u5220\u9664\u8D34\u5B50",
                message: "\u5220\u4E86\u90A3\u4E48\u591A\u8D34\u5B50\uFF0C\u8F93\u4E2A\u7801\u9A8C\u8BC1\u4E0B\u8EAB\u4EFD\u5427~",
                vCode: e.data.vcode.captcha_vcode_str,
                vCodeType: e.data.vcode.captcha_code_type,
                forumName: PageData.forum.forum_name,
                forumId: PageData.forum.forum_id,
                postType: "thread",
                paramsCallback: function () {
                    return {}
                }
            }, function (e) {
                o.captchaDialog = e, e.bind("onclose", function () {
                    return e.hide(), !1
                }), e.bind("onaccept", function () {
                    o._captcha.vcode = e.getInputValue(), o._captcha.vcode_md5 = e.getVCode(), n ? o._delete_post.call(o, t, a, 1) : o._delete_thread.call(o, t, 1)
                }), e.show()
            })
        }, _get_delete_paras: function (e, t) {
            var a, o, n = {};
            return t ? (a = e.parents("li.j_lzl_s_p"), n = a.getData()) : (a = e.parents(".j_l_post"), o = a.getData(), n = {
                author_name: o.author.user_name,
                content_id: o.content.post_id
            }), n
        }, _showTip: function (e) {
            var t = '<p style="text-align: center">' + e + "</p>";
            $.dialog.assert(t, function () {
            }, {time: 2e3, title: "\u63D0\u793A"})
        }
    }
});
_.Module.define({
    path: "tbmall/widget/TbeanSafeAjax",
    requires: ["tbmall/widget/TbeanSafe"],
    sub: {
        initial: function (a) {
            this.options = a || {}
        }, ajax: function (a) {
            var t = this, e = a.success || function () {
                }, n = a.data || {}, s = function (s) {
                var i = t.use("tbmall/widget/TbeanSafe", {
                    json: s, sucCallback: function (e) {
                        var s = $.extend({}, n, e), i = $.extend({}, a);
                        i.data = s, t.ajax(i)
                    }, tbeanOptions: t.options
                });
                i.needCheck() || e(s)
            };
            return a.success = s, a.type = a.type || "post", a.dataType = a.dataType || "json", $.ajax(a)
        }, post: function (a, t, e) {
            var n = {url: a, data: t, success: e};
            return this.ajax(n)
        }
    }
});
_.Module.define({
    requires: ["common/widget/Card", "tbmall/widget/TbeanSafeAjax", "common/widget/Tdou/TdouViewPay"],
    path: "encourage/widget/pb_marry",
    sub: {
        URL: {
            getGift: "/marriage/gift/getSceneGiftList",
            sendGift: "/marriage/gift/sendGift",
            sendPostInPb: "/marriage/gift/sendPostInPb",
            sendGiftInPost: "/marriage/gift/sendGiftInPost",
            saveOrder: "/marriage/gift/saveOrder",
            getThreadGiftList: "/marriage/gift/getThreadGiftList",
            accept: "/marriage/accept",
            refuse: "/marriage/refuse"
        }, sceneId: 2000138, initial: function (t) {
            this.opt = t, this.gift = {}, this.loadMarriageGiftList(), this.bindEvent()
        }, bindEvent: function () {
            var t = this;
            $(".marry-post-section").on("click", "[j-marry-post-btn-send]", function () {
                var i = $(this);
                return t.checkLogin() ? (t.gift.user_name = i.tbattr("data-username"), t.buildInFloat(), void 0) : !1
            }).on("click", "[j-marry-post-btn-refuse]", function () {
                var i = $(this);
                return t.checkLogin() ? (t.relation_id = i.tbattr("data-id"), t.post_id = i.tbattr("data-post-id"), t.thread_id = i.tbattr("data-thread-id"), t.user_name = i.tbattr("data-username"), t.showRefuseDialog(t.user_name), void 0) : !1
            }).on("click", "[j-marry-post-btn-agree]", function () {
                var i = $(this);
                return t.checkLogin() ? (t.relation_id = i.tbattr("data-id"), t.post_id = i.tbattr("data-post-id"), t.thread_id = i.tbattr("data-thread-id"), t.user_name = i.tbattr("data-username"), t.showAgreeDialog(t.user_name), void 0) : !1
            })
        }, bindTemplateEvent: function () {
            var t = this, i = 0;
            this.$root.find('[name="gift-selection-gift-word"]').focus(), this.$root.on("click", "[j-gift-selection-gift-list-left]", function () {
                var e = t.$root.find(".gift-selection-gift-list-wrapper ul"), a = e.find("li").first();
                a.animate({marginLeft: -a.width()}, function () {
                    a.appendTo(e), a.css({marginLeft: i})
                })
            }).on("click", "[j-gift-selection-gift-list-right]", function () {
                var e = t.$root.find(".gift-selection-gift-list-wrapper ul"), a = e.find("li").last();
                a.css({marginLeft: -a.width()}), a.prependTo(e);
                var s = e.find("li").first();
                s.animate({marginLeft: i})
            }).on("mouseover", ".gift-selection-gift-item", function () {
                var i = $(this);
                t.buildGiftTipCard(i)
            }).on("mouseout", ".gift-selection-gift-item", function () {
                $(this);
                t._visit_card && t._visit_card.closeCard({type: "delayClose", time: 100}), t._visit_card = null
            }).on("click", ".gift-selection-gift-item", function () {
                var i = $(this);
                t.$root.find(".gift-selection-gift-list-wrapper ul li").removeClass("gift-selection-gift-item-active"), i.addClass("gift-selection-gift-item-active"), t.gift.gift_id = i.tbattr("data-id"), t.gift.price = i.tbattr("data-price")
            }).on("click", "[j-gift-selection-send-gift-btn]", function () {
                var i = $("[j-gift-selection-form]");
                if (!t.checkLogin())return !1;
                var e = i.find('[name="gift-selection-gift-word"]').val();
                if (!t.gift.gift_id)return t.showAlert("\u8BF7\u9009\u62E9\u793C\u7269! "), !1;
                if (!e)return t.showAlert("\u8BF7\u586B\u5199\u56DE\u8D34\u4FE1\u606F! "), !1;
                var a = null == e.match(/[^ -~]/g) ? e.length : e.length + e.match(/[^ -~]/g).length;
                if (a > 280)return t.showAlert("\u795D\u798F\u7684\u8BDD\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7140\u4E2A\u6C49\u5B57,\u73B0\u5728\u662F" + Math.ceil(a / 2) + "\u5B57"), !1;
                var s = {
                    content: e,
                    user_name: t.gift.user_name,
                    gift_id: t.gift.gift_id,
                    forum_id: PageData.forum.forum_id,
                    thread_id: PageData.thread.thread_id,
                    tbs: PageData.tbs
                };
                return $.post(t.URL.sendPostInPb, s, function (i) {
                    if (i)switch (i.no) {
                        case 0:
                            s.post = {}, s.post.thread_id = i.data.thread_id, s.post.post_id = i.data.post_id, t.genOrder(s), t.dialog.close();
                            break;
                        default:
                            t.showAlert("\u793C\u7269\u53D1\u9001\u5931\u8D25! "), setTimeout(function () {
                                $.tb.location.reload()
                            }, 1e3)
                    } else t.showAlert("\u670D\u52A1\u5668\u62BD\u98CE\u4E86! ")
                }), !1
            })
        }, loadMarriageGiftList: function () {
            var t = {
                thread_id: PageData.thread.thread_id,
                user_id: $("[j-marry-post-gift-list]").tbattr("data-userid")
            }, i = $("[j-marry-post-gift-list]");
            $.get(this.URL.getThreadGiftList, t, function (t) {
                if (t)switch (t.no) {
                    case 0:
                        var e = "<ul>", a = t.data || [];
                        if (0 === a.length) {
                            i.html('<span class="marry-post-gift-loading ">\u65E0</span>');
                            break
                        }
                        for (var s in a) {
                            var r = a[s];
                            e += [
                                '<li class="marry-post-gift-item ">',
                                '<a class="marry-post-gift-username">' + r.user_name + "</a> ",
                                "\u9001\u6765\u7684\u793C\u7269",
                                '<a class="marry-post-gift-giftname">' + r.gift_name + "</a>",
                                '<img  class="marry-post-gift-img" src=' + r.img + " />",
                                r.achievement ? '<img class="marry-post-gift-has-achievement" src="http://tb2.bdstatic.com/tb/static-encourage/widget/pb_marry/img/marry_pb_has_achievement_96cc0be.png"' : "",
                                "</li>"
                            ].join("")
                        }
                        e += "</ul>", i.html(e);
                        break;
                    default:
                        i.html('<span class="marry-post-gift-loading ">\u65E0</span>')
                }
            })
        }, loadTemplate: function (t) {
            this.template = '<div id="gift-selection" class="gift-selection" >         <form class="gift-selection-form" j-gift-selection-form>      <div class="gift-selection-wrapper" >          <div class="gift-selection-row gift-selection-gift" >              <div class="gift-selection-gift-list clearfix">                  <% if (giftList.length > 7 ){ %>                      <div class="gift-selection-gift-list-left" j-gift-selection-gift-list-left ></div>                  <% } %>                  <div class="gift-selection-gift-list-wrapper clearfix" >                      <ul>                          <% for (var i in giftList) {                               var item = giftList[i];                          %>                               <li class="gift-selection-gift-item" data-price="<%=item.price %>" data-proportion="<%=item.proportion %>"  data-id="<%=item.gift_id %>" >                                                                    <div class="gift-selection-gift-item-wrapper" >                                      <div  class="gift-selection-gift-item-img" >                                          <img src="<%=item.large_thumbnail_url %>" />                                          <% if (item.proportion != 100) { %> <i class="icon-marry-gift-dou"></i><% } %>                                      </div>                                      <span class="gift-selection-gift-worth orange-text"><i class="icon-tbean"></i><%=item.price %></span>                                      <div  class="gift-selection-gift-item-check" ></div>                                                                                                              </div>                                  <p class="gift-selection-gift-item-name" ><%=item.gift_name %></p>                                                                </li>                          <% } %>                                                                         </ul>                  </div>                  <% if (giftList.length > 7 ){ %>                      <div class="gift-selection-gift-list-right"  j-gift-selection-gift-list-right ></div>                  <% } %>                                </div>          </div>          <div class="gift-selection-row gift-selection-gift-word-wrapper" >              <label class="gift-selection-label" >\u634E\u53E5\u795D\u798F\u7684\u8BDD</label>              <textarea class="gift-selection-gift-word" name=\'gift-selection-gift-word\' placeholder="\u56F4\u89C2\u6C42\u5A5A\uFF0C\u4E5F\u8981\u5406\u559D\u4E24\u53E5,\u4E0D\u8D85\u8FC7140\u5B57"></textarea>              <div class="gift-selection-gift-buttons" >                  <button type="button" class="btn-default btn-middle gift-selection-send-gift-btn " j-gift-selection-send-gift-btn >\u9001\u51FA\u793C\u7269</button>                 <!--  <label class="gift-selection-gift-word-wrapper"><input type="checkbox" name="gift-selection-user-sign" /> \u4F7F\u7528\u7B7E\u540D\u6863</label> -->              </div>              <div class="gift-selection-gift-tip" >                  \u88AB\u6C42\u5A5A\u4EBA\u540C\u610F\u6C42\u5A5A\u7684\u65F6\u523B\uFF0C\u9001\u793C\u7269\u6700\u591A\u7684\u5427\u53CB\u5C06\u83B7\u5F97<a >\u6708\u8001\u6210\u5C31</a>12\u4E2A\u6708\u3002              </div>                        </div>`        </div>        </form>  </div>';
            var i = [], e = this, a = {scene_id: this.sceneId};
            $.get(this.URL.getGift, a, function (a) {
                if (a)switch (a.no) {
                    case 0:
                        i = a.data.gift_list, e.$root = $(_.template(e.template)({giftList: i})), e.bindTemplateEvent(), "function" == typeof t && t();
                        break;
                    default:
                        e.showAlert("\u793C\u7269\u5217\u8868\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5"), i = []
                } else i = []
            })
        }, buildGiftTipCard: function (t) {
            var i = this, e = parseInt(t.tbattr("data-proportion")), a = parseInt(t.tbattr("data-price")), s = Math.floor(a * (1 - e / 100));
            if (0 !== s && !isNaN(s)) {
                i._visit_card && (i._visit_card.closeCard(), i._visit_card = null);
                var r = '<div class="marry-gift-tip-card-content">\u6536\u793C\u4EBA\u53EF\u83B7\u5F97 <i class="icon-tbean"></i><span class="orange-text" >' + s + "</span></div>", o = {
                    content: r,
                    card_css: {width: 200, zIndex: 50002},
                    auto_positon: !0,
                    event_target: t,
                    attr: "id='marry-gift-tip-card'",
                    wrap: $("body")
                };
                i._visit_card = i.requireInstance("common/widget/Card", o), i._visit_card.showCard({
                    type: "delayShow",
                    time: 200
                })
            }
        }, hide: function () {
            this.dialog.hide()
        }, show: function () {
            this.dialog.show()
        }, buildInFloat: function () {
            this.dialog && this.dialog.close();
            var t = this;
            this.loadTemplate(function () {
                t.dialog = new $.dialog({
                    html: t.$root,
                    title: '<img class="gift-selection-dialog-title-img" src="http://tb2.bdstatic.com/tb/static-encourage/widget/pb_marry/img/gift_icon_0a6e722.png" />\u9001\u793C\u7269\uFF0C\u8D62\u6708\u8001\u6210\u5C31',
                    width: 690,
                    holderClassName: "gift-selection-dialog"
                })
            })
        }, checkLogin: function () {
            return PageData.user.is_login ? !0 : (this.requireInstanceAsync("common/widget/LoginDialog"), !1)
        }, genOrder: function (t) {
            var i = this.requireInstance("tbmall/widget/TbeanSafeAjax"), e = this, a = t;
            a.tbs = window.PageData.tbs, i.post(this.URL.sendGiftInPost, a, function (i) {
                if (0 == i.no && i.data) {
                    var a = i.data, s = {
                        order_id: i.data.order_id,
                        thread_id: t.post.thread_id,
                        post_id: t.post.post_id,
                        gift_from: 2,
                        price: e.gift.price,
                        tbs: window.PageData.tbs
                    };
                    $.post(e.URL.saveOrder, s, function () {
                        var t = e.requireInstance("common/widget/Tdou/TdouViewPay", function (t) {
                            t.data && !t.data.no && (e.showAlert("\u793C\u7269\u8D60\u9001\u6210\u529F\uFF01", "\u793C\u7269\u8D60\u9001"), $.tb.location.reload())
                        });
                        t.createMain(a)
                    })
                } else e.showAlert("\u8BA2\u5355\u51FA\u9519\uFF0C\u8BF7\u91CD\u8BD5", "\u793C\u7269\u8D60\u9001"), $.tb.location.reload()
            })
        }, showRefuseDialog: function (t) {
            var i = {
                title: "\u62D2\u7EDD\u6C42\u5A5A",
                content: "\u4F60\u786E\u5B9A\u8981\u62D2\u7EDD" + t + "\u7684\u6C42\u5A5A\uFF1F",
                tip: "",
                btns: '<a class="btn-middle btn-default" j-marry-refuse >\u786E\u5B9A</a>'
            };
            this.showDialog(i);
            var e = this;
            this.marryAttitudeDialog.element.on("click", "[j-marry-refuse]", function () {
                var t = {
                    post_id: e.post_id,
                    thread_id: e.thread_id,
                    forum_id: PageData.forum.forum_id,
                    user_name: e.user_name,
                    tbs: PageData.tbs
                };
                $.post(e.URL.refuse, t, function (t) {
                    if (t) {
                        switch (t.no) {
                            case 0:
                                e.showAlert("\u62D2\u7EDD\u6C42\u5A5A\u6210\u529F! ");
                                break;
                            case 2670010:
                                e.showAlert("\u4F60\u4EEC\u5176\u4E2D\u4E00\u4E2A\u4EBA\u5DF2\u7ECF\u7ED3\u5A5A\uFF0C\u6C42\u5A5A\u5931\u8D25! ");
                                break;
                            default:
                                e.showAlert("\u62D2\u7EDD\u6C42\u5A5A\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5! ")
                        }
                        setTimeout(function () {
                            $.tb.location.reload()
                        }, 1e3)
                    } else e.showAlert("\u670D\u52A1\u5668\u62BD\u98CE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5! ")
                })
            })
        }, showAgreeDialog: function (t) {
            var i = {
                title: "\u63A5\u53D7\u6C42\u5A5A",
                content: "\u60A8\u613F\u610F\u6210\u4E3A" + t + "\u7684\u7231\u4EBA\u5417\uFF1F",
                tip: "\u7B54\u5E94TA\u7684\u6C42\u5A5A\u540E\uFF0C\u5728\u4E2A\u4EBA\u4E2D\u5FC3\u4F1A\u51FA\u73B0\u7231\u4EBA\u6807\u8BC6\uFF0C\u8BC1\u660E\u60A8\u5DF2\u6210\u5A5A\u3002",
                btns: '<a class="btn-middle btn-default"  j-marry-agree >\u6211\u613F\u610F</a>'
            };
            this.showDialog(i);
            var e = this;
            this.marryAttitudeDialog.element.on("click", "[j-marry-agree]", function () {
                var t = {
                    post_id: e.post_id,
                    thread_id: e.thread_id,
                    forum_id: PageData.forum.forum_id,
                    user_name: e.user_name,
                    tbs: PageData.tbs
                };
                $.post(e.URL.accept, t, function (t) {
                    if (t) {
                        switch (t.no) {
                            case 0:
                                e.showAlert("\u63A5\u53D7\u6C42\u5A5A\u6210\u529F! ");
                                break;
                            case 2670010:
                                e.showAlert("\u4F60\u4EEC\u5176\u4E2D\u4E00\u4E2A\u4EBA\u5DF2\u7ECF\u7ED3\u5A5A\uFF0C\u6C42\u5A5A\u5931\u8D25! ");
                                break;
                            default:
                                e.showAlert("\u63A5\u53D7\u6C42\u5A5A\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5! ")
                        }
                        setTimeout(function () {
                            $.tb.location.reload()
                        }, 1e3)
                    } else e.showAlert("\u670D\u52A1\u5668\u62BD\u98CE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5! ")
                })
            })
        }, showDialog: function (t) {
            var i = this;
            this.marryAttitudeDialog && this.marryAttitudeDialog.close(), this.marryAttitudeDialog = null, this.marryAttitudeDialog = new $.dialog({
                title: t.title,
                html: '<p class="marry-dialog-content" >' + t.content + '<p><p class="marry-dialog-tip" >' + t.tip + '</p><div class="marry-dialog-btn-wrapper" ><a class="btn-middle btn-sub" j-marry-dialog-close >\u518D\u60F3\u60F3</a>' + t.btns + "</div>",
                width: 500,
                holderClassName: "marry-dialog"
            }), this.marryAttitudeDialog.element.on("click", "[j-marry-dialog-close]", function () {
                i.marryAttitudeDialog.close()
            })
        }, showAlert: function (t, i) {
            new $.dialog({title: i ? i : "\u63D0\u793A", html: '<p style="text-align:center" >' + t + "</p>"})
        }
    }
});
_.Module.define({
    path: "common/widget/Tdou/TdouViewPay",
    requires: [
        "common/widget/Tdou/TdouBuilder",
        "common/widget/Tdou/TdouData",
        "common/widget/Tdou/TdouViewUtil",
        "common/widget/Tdou/TdouViewAutoRedirect",
        "common/widget/Tdou/TdouViewOperationBootstrap",
        "common/widget/payMember"
    ],
    sub: {
        errors: {
            110000: "\u7528\u6237\u672A\u767B\u9646",
            2320007: "\u7CFB\u7EDF\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
            210009: "\u7CFB\u7EDF\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
            2270044: "\u8D26\u53F7\u5F02\u5E38\uFF0C\u8BF7\u91CD\u65B0\u767B\u9646",
            2270047: "\u652F\u4ED8\u5931\u8D25\u2014\u8BA2\u5355\u5931\u6548",
            2270050: "\u8BA2\u5355\u72B6\u6001\u5F02\u5E38",
            2270049: "\u5546\u54C1\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
            2270015: "\u5546\u54C1\u4E0D\u53EF\u5151\u6362",
            2270051: "\u7CFB\u7EDF\u7EF4\u62A4\u4E2D..."
        },
        order_status: {
            0: "\u652F\u4ED8\u672A\u5B8C\u6210\uFF01",
            1: "\u652F\u4ED8\u6210\u529F\uFF0C\u5546\u54C1\u5151\u6362\u4E2D\uFF01",
            2: "\u5151\u6362\u6210\u529F",
            3: "\u5151\u6362\u5931\u8D25\uFF0CT\u8C46\u5DF2\u9000\u8FD8",
            4: "\u5151\u6362\u8D85\u65F6\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"
        },
        tdou_buy_confirm_tag: "tdou_buy_confirm",
        is_iframe: !0,
        initial: function (e) {
            this.builder = this.requireInstance("common/widget/Tdou/TdouBuilder"), this.dataProxy = this.requireInstance("common/widget/Tdou/TdouData"), this.viewUtil = this.requireInstance("common/widget/Tdou/TdouViewUtil"), this.message = e, this.autoDirect = this.requireInstance("common/widget/Tdou/TdouViewAutoRedirect")
        },
        createMain: function (e) {
            var o = this;
            o.dataProxy.getPayInfo(e, o.onPayInfo, o)
        },
        onPayInfo: function (e) {
            var o = this;
            if (e && 0 === e.no) {
                var t = e.data.goods_info, i = e.data.order_info, r = e.data.user_info;
                o.pay_info = {goods_info: t, order_info: i, user_info: r}, o.createUI(t, i, r)
            } else o.handleError(e.no)
        },
        createUI: function (e, o, t) {
            var i = this, r = "", n = t.Parr_props;
            i.dataProxy.setParrProps(n);
            var a = i.dataProxy.getMemberLevel(), d = 2 == a, _ = t.Parr_scores, u = 0;
            _ && (u = _.scores_money + _.scores_other);
            var s = u >= e.tdou_num, c = 0;
            s || (c = e.tdou_num - u);
            var m = e.free_vip_level;
            if (s && (o.cpath.pay_cashier || void 0 == o.cpath.pay_cashier))return i.pay(!1), void 0;
            if (!s && (o.cpath.gettdou_cashier || void 0 == o.cpath.gettdou_cashier))return i.getTdou(!1), void 0;
            var l = i.confirmCount();
            return s && l > 0 ? (l -= 1, i.confirmCount(l), i.pay(!1), void 0) : (d && m ? r = i.createUI_memberGetTdou_free(s, e, o, c) : d && !m ? r = i.createUI_memberGetTdou(s, e, o, c) : !d && m ? r = i.createUI_nonMemberGetGoodsOwnedMember(s, e, o, c) : d || m || (r = i.createUI_nonMemberGetTdouOwnedMember(s, e, o, c)), i.renderMain(r), i.initUIData(), i.bindMainUIEvents(), void 0)
        },
        directToCrasher: function (e, o, t) {
            var i = this, r = t.Parr_props;
            i.dataProxy.setParrProps(r);
            var n = t.Parr_scores, a = 0;
            n && (a = n.scores_money + n.scores_other);
            var d = a >= e.tdou_num, _ = 0;
            d || (_ = e.tdou_num - a), d ? i.pay(!1) : i.getTdou(!1)
        },
        initUIData: function () {
            var e = this, o = e.confirmCount(), t = $(".j_baidu_tb_tdou_pay_info_box .j_tdou_buy_confirm");
            t.length > 0 && (parseInt(o) > 0 ? t.tbattr("checked", !0) : t.tbattr("checked", !1))
        },
        createUI_nonMemberGetGoodsOwnedMember: function (e, o, t, i) {
            o.tdou_pay_from = t.from;
            var r = this.builder.buildPayTdouMain_nonMemberGetGoodsOwnedMember(e, o, t, i);
            return r
        },
        createUI_nonMemberGetTdouOwnedMember: function (e, o, t, i) {
            o.tdou_pay_from = t.from;
            var r = this.builder.buildPayTdouMain_nonMemberGetTdouOwnedMember(e, o, t, i);
            return r
        },
        createUI_memberGetTdou: function (e, o, t, i) {
            o.tdou_pay_from = t.from;
            var r = this.builder.buildPayTdouMain_memberGetTdou(e, o, t, i);
            return r
        },
        createUI_memberGetTdou_free: function (e, o, t, i) {
            o.tdou_pay_from = t.from;
            var r = this.builder.buildPayTdouMain_memberGetTdou_freeGoods(e, o, t, i);
            return r
        },
        renderMain: function (e) {
            if (!($(".baidu_tb_tdou_payment_dialog").length > 0)) {
                var o = {
                    modal: !0,
                    showTitle: !1,
                    fixed: !0,
                    width: 610,
                    height: 275,
                    holderClassName: "baidu_tb_tdou_payment_dialog",
                    draggable: !0
                };
                o.html = e, this._dialog = new $.dialog(o), this._dialog.element[0].id = "baidu_tb_tdou_payment_dialog", this._dialog.show()
            }
        },
        bindMainUIEvents: function () {
            var e = this;
            if (!e._dialog)return !1;
            var o = e._dialog.element;
            o.find(".j_tdou_pay_header_close").on("click", function () {
                e.closeMain(), e.sendMessage("closed", "");
                var o = e.requireInstance("common/widget/Tdou/TdouViewOperationBootstrap"), t = {actionType: "CLOSE_PAYMENT"};
                o.triggerByScene(t, e.pay_info)
            }), o.delegate(".j_tb_tdou_pay_btn", "click", function () {
                e.pay()
            }).delegate(".j_tb_tdou_get_tdou_btn", "click", function () {
                e.getTdou()
            }).delegate(".j_tdou_enable_member", "click", function () {
                var e = $(".j_baidu_tb_tdou_pay_info_box .j_tb_tdou_get_tdou_btn");
                $(this).tbattr("checked") ? (e.html("\u5F00\u901A\u4F1A\u5458\u5E76\u83B7\u53D6T\u8C46"), e.addClass("tdou_pay_btn_135")) : (e.html("\u83B7\u53D6T\u8C46"), e.removeClass("tdou_pay_btn_135"))
            }).delegate(".j_tdou_buy_confirm", "click", function () {
                $(this).tbattr("checked") ? e.confirmCount(30) : e.confirmCount(0)
            }).delegate(".j_tdou_buy_icon", "click", function () {
                e.getIcon()
            }).delegate(".j_tdou_open_super_member_link", "click", function () {
                e.closeMain();
                var o = e.requireInstance("common/widget/payMember"), t = {fr: "tbui_tdou_view_pay"};
                o.showCashier(t)
            })
        },
        pay: function (e) {
            var o = this, t = e;
            "undefined" == typeof e && (t = !0);
            var i = {no_ui: t};
            o.dataProxy.payGoods(o.onPay, o, i)
        },
        onPay: function (e, o) {
            var t = this;
            o && !o.no_ui ? t.wrap = null : (t.wrap = null, t.closeMain());
            var i = t.dataProxy.getPayInfoCache();
            if (0 === e.no) {
                var r = {
                    from: i.order_info.from,
                    goods_name: $.tb.subByte(i.goods_info.goods_name, 24, ""),
                    order_status: e.data.order_info.status,
                    price: i.goods_info.tdou_num
                };
                t.viewUtil.displayPaymentSuccess(t.wrap, r, function () {
                    t.closeMain(), t.sendMessage("paid", e)
                }, t)
            } else t.viewUtil.displayPaymentFailed(t.wrap, $.tb.subByte(i.goods_info.goods_name, 24, ""), function () {
                t.closeMain(), t.sendMessage("paid", e)
            }, t)
        },
        getTdou: function (e) {
            var o = this, t = !1, i = e;
            "undefined" == typeof e && (i = !0), i ? (t = $(".j_baidu_tb_tdou_pay_info_box .j_tdou_enable_member").tbattr("checked"), this.closeMain()) : t = !1;
            var r = o.dataProxy.getPayInfoCache(), n = r.order_info.cpath, a = {
                consumption_path: r.order_info.scene_id,
                title: "\u7B2C\u4E09\u65B9\u652F\u4ED8:\u83B7\u53D6T\u8C46",
                need_tdou: 0,
                third_order_id: r.order_info.order_id,
                goods_cost_tdou: r.goods_info.tdou_num
            };
            t ? ($.extend(a, {
                title: "\u7B2C\u4E09\u65B9\u652F\u4ED8:\u5F00\u901A\u8D85\u7EA7\u4F1A\u5458,\u83B7\u53D6T\u8C46",
                pay_type: 7,
                tbs: r.tbs
            }), n && "1" == n.purchase && $.extend(a, {
                title: "\u7B2C\u4E09\u65B9\u652F\u4ED8:\u5F00\u901A\u8D85\u7EA7\u4F1A\u5458,\u83B7\u53D6T\u8C46,\u8D2D\u4E70\u5546\u54C1",
                pay_type: 9,
                tbs: r.tbs
            })) : n && "1" == n.purchase && $.extend(a, {
                title: "\u7B2C\u4E09\u65B9\u652F\u4ED8:\u8D2D\u4E70\u5546\u54C1,\u83B7\u53D6T\u8C46",
                pay_type: 8,
                third_order_id: r.order_info.order_id,
                tbs: r.tbs
            }), o.goCashier(a, i)
        },
        goCashier: function (e, o) {
            var t = this, i = {
                consumption_path: e.consumption_path,
                title: e.desc,
                need_tdou: e.current_need_tdou,
                goods_cost_tdou: e.goods_cost_tdou || 0,
                pay_type: e.pay_type || 6,
                tbs: e.tbs,
                order_id: e.third_order_id,
                is_dialog: !o,
                pay_info: t.pay_info
            };
            this.autoDirect.display_type = "third_app", this.autoDirect.third_order_id = e.third_order_id, this.autoDirect.createMain(i)
        },
        getIcon: function () {
            var e = this;
            e.closeMain();
            var o = e.dataProxy.getPayInfoCache();
            e.view = this.requireInstance("common/widget/Tdou/TdouView"), e.view.bind("after_buy_icon", function (t, i) {
                var r = o.goods_info, n = o.order_info, a = o.user_info;
                null != i && (a.Parr_scores = i), e.createUI(r, n, a)
            }, e);
            var t = o.order_info.scene_id, i = "\u7B2C\u4E09\u65B9\u8D2D\u4E70icon", r = o.goods_info.tdou_num;
            e.view.createMain(t, i, r)
        },
        closeMain: function () {
            this._dialog && this._dialog.close(), this.dialog = null
        },
        confirmCount: function () {
            var e = this, o = arguments[0], t = 0, i = new Date, r = i.getFullYear() + "" + (i.getMonth() + 1) + i.getDate();
            if ("undefined" != typeof o) {
                t = parseInt(o);
                var n = r + "#" + t;
                $.tb.Storage.set(e.tdou_buy_confirm_tag, n)
            } else {
                if (o = $.tb.Storage.get(e.tdou_buy_confirm_tag), null == o)return 0;
                var a = o.split("#");
                t = a && 2 == a.length && a[0] == r ? parseInt(a[1]) : 0
            }
            return t
        },
        sendMessage: function (e, o) {
            var t = this, i = null;
            "closed" == e ? i = {
                command: "encourage_dialog_closed",
                data: o
            } : "paid" == e && (i = {command: "encourage_paid", data: o}), t.message && t.message(i)
        },
        handleError: function (e) {
            if (e) {
                var o = this, t = o.errors[e];
                return 11e4 == e ? (o.viewUtil.OpenLoginDialog(), void 0) : (t ? o.viewUtil.displayPaymentError(t) : o.viewUtil.displayPaymentError("\u672A\u77E5\u9519\u8BEF"), void 0)
            }
        }
    }
});
_.Module.define({
    path: "adsense/widget/data_handler_async", requires: [], sub: {
        initial: function () {
        }, addData: function (t) {
            $.extend(this._Storage.data, t)
        }, getData: function () {
            return $.extend(null, this._Storage.data)
        }, _Storage: function () {
            var t = {};
            return {data: t}
        }()
    }
});
_.Module.define({
    path: "adsense/widget/loader",
    requires: ["common/widget/messenger"],
    sub: {
        adStatus: {}, initial: function () {
            this._initMessenger()
        }, _getAdLocName: function (e) {
            return [e.client_type, e.page_name, e.pos_name].join("_")
        }, adDomMap: function () {
            var e = {}, t = function (t, a) {
                e[t] = a
            }, a = function (t) {
                return e[t] || $("")
            };
            return {add: t, get: a}
        }(), loadAD: function (e, t, a) {
            var i = e.adData || {}, o = e.className || "", n = e.asyncHTML || "", d = (e.isProxy || !1, e.isAsync || !1), s = e.isIframe || !1, r = e.needStats || !1;
            $.extend(i, {className: o}), this._track({cuid: "js01_" + i.id + "_" + i.tpl_name + "_" + i.search_id}, "http://als.baidu.com/dalog/logForPC?"), this._logger("media_send", i), "function" == typeof t && (a = t, t = {});
            var _ = null;
            if (this._logger("draw_begin", i), d ? (_ = $(n), this._renderDOM(i, _)) : _ = $("." + o), s) {
                var c = $.getPageData("goods_info.0.iframe_url", "", i), m = this._getIframeParams(i, t);
                this._loadIframe(_, c, m), this.adDomMap.add(i.id, _)
            } else d && _.show();
            "function" == typeof a && a(_), r && this._clickStats(_, i), this._logger("draw_done", i), this._viewStats(_, i)
        }, _logger: function (e, t) {
            var a = this, i = this._getStatsParams(t);
            a._track($.extend({}, i, {locate: t.pos_name, da_locate: t.pos_name, type: e, da_type: e}))
        }, _renderDOM: function (e, t) {
            $(e.locator).length > 0 ? $(e.locator)[e.load_type](t) : this._track(e.id + "\uFF1A\u65E0\u5B9A\u4F4D\u5143\u7D20", "\u5E7F\u544A\u52A0\u8F7D\u5931\u8D25")
        }, _getStatsParams: function (e) {
            var t = "", a = $.getPageData, i = {
                client_type: "pc_web",
                task: "tbda",
                page: a("product", t).toLowerCase(),
                fid: a("forum.forum_id", t),
                tid: a("thread.thread_id", t),
                uid: a("user.user_id", t),
                da_task: "tbda",
                da_fid: a("forum.forum_id", t),
                da_tid: a("thread.thread_id", t),
                da_uid: a("user.user_id", t),
                da_page: a("product", t),
                da_type_id: e.typeid,
                da_obj_id: e.id,
                da_good_id: e.goods_info[0].id,
                da_obj_name: e.name,
                da_first_name: e.first_name,
                da_second_name: e.second_name,
                da_cpid: e.cpid,
                da_abtest: e.abtest,
                da_price: e.price,
                da_verify: e.verify,
                da_plan_id: e.plan_id,
                da_ext_info: e.ext_info,
                da_client_type: e.client_type,
                da_throw_type: e.throw_type,
                da_loc_param: a("goods_info.0.loc_param", t, e),
                da_loc_index: e.loc_index
            };
            return i
        }, _getIframeParams: function (e, t) {
            var a, i, o, n = "", d = $.getPageData, s = {
                dapage: d("product", n).toUpperCase(),
                dafid: d("forum.forum_id", n),
                datid: d("thread.thread_id", n),
                dauid: d("user.user_id", n),
                datypeid: e.typeid,
                daid: e.id,
                dacssclass: e.className,
                dagoodid: e.goods_info[0].id,
                token: e.zhixin_token,
                daname: encodeURIComponent(e.name),
                dafirstname: encodeURIComponent(e.first_name),
                dasecondname: encodeURIComponent(e.second_name),
                dacpid: e.cpid,
                daabtest: e.abtest,
                daprice: e.price,
                daverify: e.verify,
                daextinfo: e.ext_info,
                daplanid: e.plan_id,
                daserid: e.user_id,
                dathrowtype: e.throw_type
            }, r = {}, _ = {}, c = e.goods_info[0].url_query;
            try {
                _ = $.json.decode($.tb.unescapeHTML(c));
                for (a in _)if (_.hasOwnProperty(a))if ("custom" == a) {
                    for (i in _[a])if (_[a].hasOwnProperty(i))switch (i) {
                        case"zhixintoken":
                            o = _[a][i], r[o] = e.zhixintoken;
                            break;
                        case"forumNameGBK":
                            o = _[a][i], r[o] = e.forumNameGBK
                    }
                } else if ("throw_thread" == a)for (i in _[a])_[a].hasOwnProperty(i) && (o = _[a][i], r[o] = e[i]); else for (i in _[a])_[a].hasOwnProperty(i) && (o = _[a][i], r[o] = encodeURIComponent(d(a + "." + i)))
            } catch (m) {
            }
            return $.extend(!0, s, r || {}, t || {}), s
        }, _loadIframe: function (e, t, a) {
            var i = this._addParam(t, a), o = e.find(".iframe_wrapper"), n = '<iframe src="' + i + '" scrolling="no" frameborder="0"></iframe>';
            o.append(n)
        }, _initMessenger: function () {
            var e = $.getPageData("adsense.messenger", null, window);
            e || (e = this.requireInstance("common/widget/messenger", [
                "parent",
                "checkStatus"
            ]), e.registerOrigin(this._getMessengerWhitelist()), e.registerCommand({comforum_adsense: $.proxy(this._handleMessengerData, this)}), window.adsense = {
                messenger: e,
                iframeApiUrl: "http://tb1.bdstatic.com/tb/_/iframe_api_b82f781.js"
            })
        }, _getMessengerWhitelist: function () {
            var e = 0, t = [], a = PageUnit.load("dasense_messenger_whitelist"), i = a.length;
            for (e; i > e; e++)t.push(a[e][0]);
            return t
        }, _handleMessengerData: function (e) {
            var t = this.adDomMap.get(e.id), a = t.find(".iframe_wrapper");
            "success" === e.status ? (e.height < a.height() && a.height(e.height), t.removeClass("hide_style").show()) : t.slideUp()
        }, _addParam: function (e, t) {
            var a = "", i = [], o = -1 === e.indexOf("?") ? "?" : "&";
            for (var n in t)t.hasOwnProperty(n) && i.push(n + "=" + t[n]);
            return a = i.join("&"), e + o + a
        }, _clickStats: function (e, t) {
            var a = this, i = this._getStatsParams(t);
            e.on("click", ".j_click_stats", function () {
                var e = $(this).data("locate") ? "_" + $(this).data("locate") : "", o = t.pos_name + e;
                a._track($.extend({}, i, {
                    locate: o,
                    da_locate: o,
                    type: "click",
                    da_type: "click"
                })), a._track($.extend({}, i, {
                    locate: o,
                    da_locate: o,
                    type: "click",
                    da_type: "click"
                }), "/billboard/pushlog/?")
            })
        }, _viewStats: function (e, t) {
            var a = this, i = !1, o = null, n = this._getStatsParams(t), d = (this._getAdLocName(t), $.extend({}, n, {
                locate: t.pos_name,
                da_locate: t.pos_name,
                type: "show",
                da_type: "show"
            }), function () {
                i || (a._track($.extend({}, n, {
                    locate: t.pos_name,
                    da_locate: t.pos_name,
                    type: "show",
                    da_type: "show"
                })), a._track($.extend({}, n, {
                    locate: t.pos_name,
                    da_locate: t.pos_name,
                    type: "show",
                    da_type: "show"
                }), "/billboard/pushlog/?"), i = !0)
            }), s = function () {
                var t = e.offset().top, a = e.offset().top + e.height(), i = $(window).scrollTop(), o = $(window).height() + i, n = !1;
                return (t > i && o >= t || a > i && o >= a) && (n = !0), n
            }, r = $.getPageData("goods_info.0.statsCommand", null, t);
            r ? this.observe(r, function () {
                s() && (clearTimeout(o), o = setTimeout(d, 200))
            }) : s() ? d() : ($(window).on("scroll", function () {
                s() && (clearTimeout(o), o = setTimeout(d, 200))
            }), s() && (clearTimeout(o), o = setTimeout(d, 200)), $(window).on("scroll"))
        }, _track: function (e, t) {
            if (document.images) {
                var a = new Image;
                window["bd_pv_" + (new Date).getTime()] = a;
                var i = t || "http://static.tieba.baidu.com/tb/img/track.gif?", o = [
                    "t=" + (new Date).getTime(),
                    "r=1" + Math.random().toString().slice(2, 17)
                ];
                for (var n in e)e.hasOwnProperty(n) && o.push(n + "=" + encodeURIComponent(e[n]));
                a.onload = a.onerror = function () {
                    a = null
                }, a.src = i + o.join("&")
            }
        }, loadCustomJS: function (e) {
            var t = null;
            e.js && (t = $.proxy(new Function("$e", "PageData", "window", e.js), {}), t(e.dom, void 0, void 0))
        }
    }
});