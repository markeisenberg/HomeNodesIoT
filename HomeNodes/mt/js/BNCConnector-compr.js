(function () {
    window.DISABLE_MONITOR = false;
    var am = function (ar) {
        this.data = [];
        if (ar.length > I) {
            throw "Name cannot be longer than " + I + " characters"
        }
        var c = ar.length;
        for (var at = 0; at < I - c; at++) {
            ar = ar + "_"
        }
        for (var at = 0; at < am.PEERS.length; at++) {
            if (am.PEERS[at] === ar) {
                throw "This IP is in use locally!"
            }
        }
        this.name = ar;
        this.init();
        this.BUSY = false;
        this.current = false;
        this.message = "";
        s.start();
        s.register(this.name);
        am.PEERS.push(this.name)
    };
    am.PEERS = [];
    am.prototype.getAllPeers = function () {
        var au = T();
        var ar = [];
        var c = au[2].length;
        for (var at = 0; at < c; at++) {
            ar[at] = au[2][at][0]
        }
        return ar
    };
    am.prototype.init = function () {
        if (getPacket()[W] === this.name) {
            a(n)
        }
        this.process()
    };
    am.prototype.checkPacket = function () {
        if (this.destroyed) {
            return null
        }
        if (this.check_locked) {
            return null
        }
        this.check_locked = true;
        var av = this;
        var au = getPacket();
        if (au[ae] === this.name) {
            if (au[N]) {
                try {
                    a(n);
                    this.recived_timestamp = false;
                    if (this.message === null || this.message === undefined) {
                        try {
                            this.onerror("brokenmessage", this.last_packet)
                        } catch (at) {}
                    } else {
                        this.listen(au[W], this.message)
                    }
                } catch (c) {}
                this.message = ""
            } else {
                if (!au[g]) {
                    if (au[v].charAt(0) === "1") {
                        this.message = ""
                    }
                    var ar = au[v].substring(1, au[v].length);
                    this.message += ar;
                    a(au[ae] + "110" + au[W] + au[v]);
                    this.recived_timestamp = new Date().valueOf();
                    this.check_locked = false;
                    h(function () {
                        av.checkPacket()
                    }, B)
                }
            }
        } else {
            if (au[ae]) {}
        }
        this.check_locked = false;
        return [au, false]
    };
    am.prototype.listen = function (c, ar) {};
    am.prototype.sendData = function (ar, c) {
        if (this.destroyed) {
            return
        }
        this.pushPackets(c, ar)
    };
    am.prototype.transmit = function (av) {
        var ar = this.current;
        if ((window.interrupt || (this._lastPacketTStamp && ((this._lastPacketTStamp + U) < new Date().valueOf())))) {
            try {
                if (window.interrupt) {
                    try {
                        this.onerror("interrupted", this.last_packet)
                    } catch (au) {}
                } else {
                    try {
                        this.onerror("timedout: either peer does not exist or cookie try lower packet size on cookie setting.", this.last_packet)
                    } catch (au) {}
                }
            } catch (c) {}
            this.current = false;
            this._hold_sending_next = false;
            this._lastPacketTStamp = false;
            window.interrupt = false
        }
        ar = this.current;
        var aw = this;
        if (av[o] && (av[W] !== this.name)) {
            return false
        }
        if (ar) {
            var at = ar[0][0];
            if ((av[g] && av[W] === this.name)) {
                this._last_led = av[an];
                if (!at) {
                    this.onsent(this.last_packet);
                    this.last_packet = [];
                    a(ar[1] + "101" + this.name + av[v]);
                    this._hold_sending_next = new Date().valueOf() + Math.ceil(i * (0.5 + (Math.random() * 0.5)));
                    this.current = false;
                    this._lastPacketTStamp = false;
                    return false
                }
                this._lastPacketTStamp = false
            }
            if (!this._lastPacketTStamp) {
                this._lastPacketTStamp = new Date().valueOf();
                if (!at) {
                    at = ""
                }
                a(ar[1] + "100" + this.name + at);
                ar[0].splice(0, 1)
            }
        } else {
            return false
        }
        return true
    };

    function z(c) {
        if (c[W] === c[ae] && (c[N] === 0 && c[g] === 0)) {
            return true
        }
        return false
    }
    am.prototype.onerror = function (ar, c) {};
    am.prototype.onsent = function (c) {};
    am.prototype.TMP_STACK = [];
    am.prototype.process = function () {
        if (this.destroyed) {
            return
        }
        var au = this;
        var at = this.checkPacket()[0];
        var c = z(at);
        if (!this._hold_sending_next || this._hold_sending_next < new Date().valueOf()) {
            if ((!this.current) && (this.data[0]) && c) {
                if (ao || s.peerPresent(this.data[0][1])) {
                    this._hold_sending_next = true;
                    this.current = this.data[0];
                    this._lastPacketTStamp = false;
                    this.last_packet = [this.data[0][0] + "", this.data[0][1] + ""]
                }
                this.data.splice(0, 1)
            }
        }
        var ar = this.transmit(at);
        if (!ar) {
            h(function () {
                au.process()
            }, i)
        } else {
            h(function () {
                au.process()
            }, B)
        }
    };
    am.prototype.pushPackets = function (c, au) {
        var aw = af - 1;
        var at = Math.floor(c.length / aw) + 1;
        var av = [];
        var ax = 1;
        for (var ar = 0; ar < at; ar++) {
            av.push(ax + c.substring(ar * aw, (ar + 1) * aw));
            ax = 0
        }
        this.data.push([av, au])
    };
    am.prototype.destroy = function () {
        s.unregister(this.name);
        for (var c = 0; c < am.PEERS.length; c++) {
            if (am.PEERS[c] === this.name) {
                am.PEERS.splice(c, 1)
            }
        }
        this.destroyed = true
    };
    window.BNCConnector = am;
    var s = function () {
        return s
    };
    s.cleanDeadlocksOnly = false;
    s.singleton = false;
    var aa = false;
    if (navigator.userAgent.toLowerCase().lastIndexOf("opera") != -1) {
        aa = true
    }
    s.start = function () {
        if (window.DISABLE_MONITOR) {
            return false
        }
        if (!j(J) || j(J) === "" || j(J) === null) {
            ai("", true)
        }
        if (s.singleton) {
            return s.singleton
        }
        s.singleton = s;
        u(T(), 1);
        this.stopped = false;
        var at = new Date().valueOf();
        var av = new Date().valueOf();
        var aD = function () {
            if (s.stopped) {
                s.singleton = false;
                return
            }
            var aE = T();
            if (s.isFreezed(aE) !== false) {
                G(aE);
                aE = T();
                u(aE, 0, s.localPeers, 1)
            }
        };
        aD();
        var aB = 110,
            aC = 700;
        if (aa || window.ONUNLOAD_NOT_SUPPORTED) {
            aB = 30;
            aC = 110
        }
        var ar = function () {
            if (s.stopped) {
                s.singleton = false;
                return
            }
            var aE = getPacket();
            var aF = aE[an];
            if (aE[ae] != "00" && (isNaN(aF) || (aF + U * 3) < new Date().valueOf())) {
                a(n);
                m("Deadlock detected. Resetting.")
            }
            if (!s.cleanDeadlocksOnly) {
                var aG = new Date().valueOf();
                if (aG - at > aB) {
                    s.announceAll();
                    at = new Date().valueOf()
                }
                if (aG - av > aC) {
                    aD();
                    av = new Date().valueOf()
                }
            }
            h(ar, 20)
        };
        ar();
        var aA = function () {
            for (var aE = 0; aE < s.localPeers.length; aE++) {
                G(T(), s.localPeers[aE])
            }
        };
        var aw = window.onclose;
        var az = window.onbeforeunload;
        var c = function (aF) {
            aA();
            try {
                aw(aF)
            } catch (aE) {}
        };
        var ax = function (aF) {
            aA();
            try {
                az(aF)
            } catch (aE) {}
        };
        if (!window.ONUNLOAD_NOT_SUPPORTED) {
            function au(aG) {
                var aH = "window.top;";
                var aE = document.createElement("iframe");
                aE.src = "about:blank";
                aG.cleanUpBNCConnector = function () {
                    aA()
                };
                try {
                    document.getElementsByTagName("body")[0].parentNode.appendChild(aE);
                    aE.contentWindow.document.write("<script> var top = " + aH + " window.onclose=function (){top.cleanUpBNCConnector();}; window.onunload=function (){top.cleanUpBNCConnector();}; window.onbeforeunload=function (){top.cleanUpBNCConnector();};<\/script>");
                    aE.style.display = "none";
                    aE.src = "about:blank";
                    aE.contentWindow.onunload = aG.cleanUpBNCConnector;
                    aE.contentWindow.onbeforeunload = aG.cleanUpBNCConnector;
                    aE.contentWindow.onclose = aG.cleanUpBNCConnector
                } catch (aF) {}
            }
            try {
                au(top)
            } catch (ay) {}
            window.onunload = c;
            window.onbeforeunload = ax
        }
    };
    s.announceAll = function () {
        var au = T();
        var ar = "";
        for (var at = 0; at < s.localPeers.length; at++) {
            var c = s.localPeers[at];
            C(au, c, 1)
        }
        ar = P(au);
        ai(ar)
    };
    var X = 400;
    if (aa || window.ONUNLOAD_NOT_SUPPORTED) {
        X = 120
    }
    s.isFreezed = function (c) {
        var ar = c[0] * 1;
        if ((isNaN(ar)) || (ar > 0 && (ar + X) < new Date().valueOf())) {
            return true
        }
        return false
    };
    s.stop = function () {
        this.stopped = true
    };
    s.getAllPeers = function () {
        var aw = T();
        var at = [];
        var c = aw[2].length;
        for (var au = 0; au < c; au++) {
            at[au] = aw[2][au][0]
        }
        for (var ar = 0; ar < s.localPeers.length; ar++) {
            var av = false;
            for (var au = 0; au < c; au++) {
                if (at[au] === s.localPeers[ar]) {
                    av = true;
                    break
                }
            }
            if (!av) {
                at.push(s.localPeers[ar])
            }
        }
        return at
    };
    s.peerPresent = function (au) {
        var aw = T();
        var at = [];
        var c = aw[2].length;
        for (var av = 0; av < c; av++) {
            if (aw[2][av][0] === au) {
                return true
            }
        }
        for (var ar = 0; ar < s.localPeers.length; ar++) {
            if (s.localPeers[ar] === au) {
                return true
            }
        }
        return false
    };
    s.register = function (c) {
        s.localPeers.push(c);
        s.announceAll()
    };
    s.unregister = function (c) {
        for (var ar = 0; ar < s.localPeers.length; ar++) {
            if (s.localPeers[ar] === c) {
                s.localPeers.splice(ar, 1)
            }
        }
        G(T(), c)
    };
    s.localPeers = [];
    window.BNCConnectorMonitor = s;
    var L = false;
    var aa = false;
    if (navigator.appName == "Microsoft Internet Explorer") {
        L = true
    }
    if (navigator.userAgent.toLowerCase().lastIndexOf("opera") != -1) {
        aa = true
    }
    if (L) {
        Array.prototype.push = Array.prototype.push || function (c) {
            return this[this.length] = c
        }
    }
    if (!window.console) {
        window.console = {};
        console.log = function () {}
    }
    var R = function (c) {
        return encodeURIComponent(c)
    };
    var ag = function (c) {
        return decodeURIComponent(c)
    };
    var D = 0;
    var ac = "; expires=" + new Date(new Date().getTime() + 86400000 * 1000).toGMTString();
    var ap = function () {
        return ";"
    };
    var ah = "TCP";
    var t = "";
    var J = "MCP";

    function m(c, ar) {
        if (window.console) {
            console.log(c, ar)
        }
    }

    function j(at) {
        var av = document.cookie;
        var au = av.indexOf(at + "=");
        if (au !== -1) {
            au += at.length + 1;
            var ar = av.indexOf(";", au);
            if (ar === -1) {
                ar = av.length
            }
            return ag(av.substring(au, ar))
        } else {
            return ""
        }
    }

    function r(c, ar) {
        document.cookie = c + "=" + R(ar)
    }
    var x = 0;

    function a(c) {
        x = new Date().valueOf();
        r(ah, x + c)
    }
    var ao = false;
    var ae = 0,
        o = 1,
        g = 2,
        N = 3,
        W = 4,
        v = 5,
        an = 6;
    window.getPacket = function () {
        var ar = j(ah);
        var c = [];
        c[ae] = ar.substring(13, Z);
        c[o] = ar.charAt(Z) * 1;
        c[g] = ar.charAt(q) * 1;
        c[N] = ar.charAt(w) * 1;
        c[W] = ar.substring(aj, V);
        c[v] = ar.substring(S, ar.length);
        c[an] = ar.substring(0, 13) * 1;
        return c
    };
    var B = 0;
    var i = 4;
    var U = (L ? 500 : 385);
    var af = window.PACKET_SIZE || (2000 + 4 + 11);
    var al = window.RECEIVERS_LIMIT || 128;
    var I = window.IP_LIMIT || 2;
    var Z = I + 13;
    var q = Z + 1;
    var w = q + 1;
    var aj = w + 1;
    var V = aj + I;
    var S = V;
    var n = "00000000000000000000";
    var p = "##000##0000000000000";
    var Q = al * (I + 1);
    if (!j(ah) || j(ah) == null || j(ah) == "") {
        a(n)
    }
    var ad = 3;

    function T() {
        var au = j(J);
        var aw = au.substring(13);
        var at = au.substring(0, 13);
        var c = [];
        if (aw !== null) {
            var av = aw.length / ad;
            for (var ar = 0; ar < av; ar++) {
                c[ar] = [aw.substring(ar * 3, ar * 3 + 2), aw.charAt(ar * 3 + 2)]
            }
        }
        return [at, aw, c]
    }

    function ai(at, c) {
        var ar = new Date().valueOf();
        if (!c) {
            ar = T()[0]
        }
        r(J, ar + at)
    }

    function O(av, ar) {
        if (!av || av === "") {
            return true
        }
        var c = av[2].length;
        var au = false;
        var at = 0;
        for (; at < c; at++) {
            var aw = av[2][at][0];
            if (aw === ar) {
                au = true;
                break
            }
        }
        if (au) {
            return true
        } else {
            return false
        }
    }
    var y = {};
    var d = window.ERROR_TIMEOUT_MONITOR_MAX_AMOUNT || 2;
    var M = window.DELAY_ALLOWED || 700;
    if (aa || window.ONUNLOAD_NOT_SUPPORTED) {
        d = 1;
        M = 150
    }

    function G(aw, av) {
        var at = "";
        var ar = aw[2].length;
        for (var au = 0; au < ar; au++) {
            var ax = aw[2][au][1];
            var c = aw[2][au][0];
            if (ax * 1 !== 0 || c === av) {
                if (c !== av) {
                    y[c] = [new Date().valueOf(), 0];
                    at += c + ax
                } else {
                    y[c] = undefined
                }
            } else {
                if (!av) {
                    if (y[c] !== undefined) {
                        if ((y[c][0] + M) < new Date().valueOf()) {
                            if (y[c][1] > d) {
                                y[c] = undefined
                            } else {
                                if (d) {
                                    y[c] = [new Date().valueOf(), y[c][1] + 1];
                                    y[c][1]++;
                                    at += c + ax
                                }
                            }
                        } else {
                            at += c + ax
                        }
                    } else {
                        if (y[c] === undefined) {
                            y[c] = [new Date().valueOf(), 1]
                        }
                        at += c + ax
                    }
                }
            }
        }
        ai(at, true);
        return aw
    }

    function u(ar, aw, ay, at) {
        var az = "";
        var ax = ar[2].length;
        for (var av = 0; av < ax; av++) {
            ar[2][av][1] = aw
        }
        var aA = 0;
        if (ay) {
            for (var au = aA; au < ay.length; au++) {
                var c = false;
                ax = ar[2].length;
                for (var av = 0; av < ax; av++) {
                    if (ay[au] == ar[2][av][0]) {
                        ar[2][av][1] = at;
                        aA++;
                        c = true;
                        break
                    }
                }
                if (!c) {
                    ar[2].push([ay[aA] + "", 1]);
                    aA++
                }
            }
        }
        ax = ar[2].length;
        for (var av = 0; av < ax; av++) {
            az += ar[2][av][0] + ar[2][av][1]
        }
        ai(az);
        return az
    }

    function K(aw, au, at) {
        var ar = "";
        var c = aw[2].length;
        for (var av = 0; av < c; av++) {
            if (aw[2][av][0] === au) {
                aw[2][av][1] = at
            }
            ar += aw[2][av][0] + aw[2][av][1]
        }
        ai(ar);
        return ar
    }

    function C(aw, at, ar) {
        var c = aw[2].length;
        var av = false;
        for (var au = 0; au < c; au++) {
            if (aw[2][au][0] === at) {
                aw[2][au][1] = ar;
                av = true
            }
        }
        if (!av) {
            aw[2][aw[2].length] = [];
            aw[2][aw[2].length - 1][0] = at;
            aw[2][aw[2].length - 1][1] = ar
        }
        return aw
    }

    function P(au) {
        var ar = "";
        var c = au[2].length;
        for (var at = 0; at < c; at++) {
            ar += au[2][at][0] + au[2][at][1]
        }
        return ar
    }
    var ab = "data:image/png;base64,";
    var b = function (c) {
        this.obj = c
    };
    b.prototype.remove = function () {
        if (this.prev) {
            this.prev.next = this.next
        }
        if (this.next) {
            this.next.prev = this.prev
        }
        delete this.obj;
        this.obj = undefined
    };
    var F = function () {
        this.length = 0
    };
    F.prototype.push = function (ar) {
        var c = new b(ar);
        if (this.last) {
            this.last.next = c;
            this.last.next.prev = this.last
        } else {
            this.first = c
        }
        this.last = c;
        this.length++
    };
    F.prototype.rm = function (c) {
        if (c === this.last) {
            this.last = this.last.prev
        }
        if (c === this.first) {
            this.first = this.first.next
        }
        c.remove();
        this.length--;
        if (this.length === 0) {
            this.last = this.first = undefined
        }
    };
    window.MAX_TIMEOUT_GRAN = window.MAX_TIMEOUT_GRAN || 1;
    window.FORCE_NOT_USING_NORMAL_TIMEOUT = window.FORCE_NOT_USING_NORMAL_TIMEOUT === undefined ? (true && !L) : window.FORCE_NOT_USING_NORMAL_TIMEOUT;
    window.BNCReady = function () {};
    var Y = new F();
    var l = MAX_TIMEOUT_GRAN;
    var k = false;
    var A = true;
    var H = function () {
        if (k) {
            return
        }
        k = true;
        var c = new Date().valueOf();
        var aw = Y.length;
        if (A) {
            A = false;
            try {
                window.BNCReady()
            } catch (at) {}
        }
        if (aw > 0) {
            var av = Y.first;
            var au;
            for (var ar = 0; ar < aw; ar++) {
                au = av.next;
                if (av.obj[0] && av.obj[1] < c) {
                    try {
                        av.obj[0]();
                        Y.rm(av)
                    } catch (at) {}
                }
                av = au
            }
        }
        k = false
    };
    var f = new Date().valueOf();

    function aq() {
        var c = document.createElement("img");
        c.onerror = function () {
            try {
                if ((f + (l - 1)) < new Date().valueOf()) {
                    f = new Date().valueOf();
                    H()
                }
            } catch (ar) {}
            aq()
        };
        c.src = ab
    }
    var E = function () {
        if (FORCE_NOT_USING_NORMAL_TIMEOUT) {
            for (var ar = 0; ar < 1000 / l; ar++) {
                setTimeout(H, 1000 + l * ar)
            }
        }
        setTimeout(E, 1000)
    };

    function h(c, ar) {
        if (FORCE_NOT_USING_NORMAL_TIMEOUT) {
            return Y.push([c, (new Date().valueOf()) + ar])
        } else {
            return setTimeout(c, ar)
        }
    }
    var e = !!window.chrome || !!window.safari;
    if (FORCE_NOT_USING_NORMAL_TIMEOUT) {
        if (e) {
            aq()
        } else {
            for (var ak = 0; ak < 1000 / l; ak++) {
                setTimeout(H, 0 + l * ak)
            }
            E()
        }
    }
})();
