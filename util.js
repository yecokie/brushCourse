var util = {
    ajax:function(type,url,data,call,errCall,copCall,totCall){
        var param = {};
        if(util.getDataType(data) == 'Function'){
            call = data;
        }else{
            param = data;
        }
        if(url.indexOf('.json') > 0){
            type = 'get';
        }
        $.ajax({  
            type : type,
            url : url,
            data:param,
            timeout:30*1000,
            dataType:'json',
            success : function(result) { 
                call && call(result);
            },
            error:function(result){
                errCall && errCall(result);
            },
            complete:function(XMLHttpRequest,textStatus){
				if(textStatus === 'timeout'){
					totCall && totCall();
				}
				copCall && copCall(XMLHttpRequest, textStatus);
			}
        });
    },
    /**
     * 将 时:分:秒 格式数据转换为秒
     */
    parseTime2Second:function(playTime){
        var timeArr = playTime.split(':');
        var seconds = parseInt(timeArr[0],10)*60*60+parseInt(timeArr[1],10)*60+parseInt(timeArr[2],10);
        return seconds;
    },
	convertToTimestamp:function (dateString) {
	    // 将日期字符串转换为 Date 对象
	    var dateObject = new Date(dateString);
	
	    // 获取时间戳（单位：毫秒）
	    var timestamp = dateObject.getTime();
	
	    return timestamp;
	},
    /**
     * 将秒转换为hh：mm：ss格式
     */
    formatTime:function(leftTime) {
        var resultTime = "";
        if(leftTime < 0){
            leftTime = Math.abs(leftTime);
            resultTime = "-";
        }
        //小时数
        var hours = leftTime / 60 / 60;
        //对小时余
        var hoursRound = Math.floor(hours);
        //剩余分钟数
        var minutes = leftTime / 60  - (60 * hoursRound);
        //对分钟取余
        var minutesRound = Math.floor(minutes);
        //秒数
        var seconds = Math.floor(leftTime - (60 * 60 * hoursRound) - (60 * minutesRound));
        //个位数的小时显示为00:00:00小时的格式
        if(hoursRound < 10){
            hoursRound = "0" + hoursRound;
        }
        //个位数的分钟显示为00:00:00分钟的格式
        if(minutesRound < 10){
            minutesRound = "0" + minutesRound;
        }
        //个位数秒显示为00:00:00分钟的格式
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        //拼接显示格式
        resultTime += hoursRound + ":" + minutesRound + ":" + seconds;
        return resultTime
    },
    getUaAccess:function(){
        var info = new Browser(),accessArr = ['Blink','WebKit','Trident','EdgeHTML'];
        if(accessArr.indexOf(info.engine) > -1  && info.browser != 'Safari'){
            return true;
        }
    },
    getDataType:function(d){
        return Object.prototype.toString.call(d).match(/\[object\s([\S]*?)\]/)[1];
    },
    setLocal:function(name,val){
        if(window.localStorage){
            localStorage.setItem(name,val);
        }
    },
    getLocal:function(name){
        if(window.localStorage){
            return localStorage.getItem(name);
        }
    },
    setSession:function(name,val){
        if(window.sessionStorage){
            sessionStorage.setItem(name,val);
        }
    },
    getSession:function(name){
        if(window.sessionStorage){
            return sessionStorage.getItem(name);
        }
    },
    md5:function(string){
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
    },
    browser:(function (root, factory) {
        if (typeof define === 'function' && (define.amd||define.cmd)) {
            // AMD&CMD
            define(function(){
                return factory(root);
            });
        } else if (typeof exports === 'object') {
            // Node, CommonJS-like
            module.exports = factory(root);
        } else {
            // Browser globals (root is window)
            root.Browser = factory(root);
        }
    }(typeof self !== 'undefined' ? self : this, function (root) {
        var _window = root||{};
        var _navigator = typeof root.navigator!='undefined'?root.navigator:{};
        var _mime = function (option, value) {
            var mimeTypes = _navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        };
    
        return function (userAgent) {
            var u = userAgent || _navigator.userAgent||{};
            var _this = this;
    
            var match = {
                //内核
                'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
                'Presto': u.indexOf('Presto') > -1,
                'WebKit': u.indexOf('AppleWebKit') > -1,
                'Gecko': u.indexOf('Gecko/') > -1,
                'KHTML': u.indexOf('KHTML/') > -1,
                //浏览器
                'Safari': u.indexOf('Safari') > -1,
                'Chrome': u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
                'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
                'Edge': u.indexOf('Edge') > -1||u.indexOf('Edg/') > -1,
                'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
                'Firefox Focus': u.indexOf('Focus') > -1,
                'Chromium': u.indexOf('Chromium') > -1,
                'Opera': u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
                'Vivaldi': u.indexOf('Vivaldi') > -1,
                'Yandex': u.indexOf('YaBrowser') > -1,
                'Arora': u.indexOf('Arora') > -1,
                'Lunascape': u.indexOf('Lunascape') > -1,
                'QupZilla': u.indexOf('QupZilla') > -1,
                'Coc Coc': u.indexOf('coc_coc_browser') > -1,
                'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
                'Iceweasel': u.indexOf('Iceweasel') > -1,
                'Konqueror': u.indexOf('Konqueror') > -1,
                'Iceape': u.indexOf('Iceape') > -1,
                'SeaMonkey': u.indexOf('SeaMonkey') > -1,
                'Epiphany': u.indexOf('Epiphany') > -1,
                '360': u.indexOf('QihooBrowser') > -1||u.indexOf('QHBrowser') > -1,
                '360EE': u.indexOf('360EE') > -1,
                '360SE': u.indexOf('360SE') > -1,
                'UC': u.indexOf('UCBrowser') > -1 || u.indexOf(' UBrowser') > -1,
                'QQBrowser': u.indexOf('QQBrowser') > -1,
                'QQ': u.indexOf('QQ/') > -1,
                'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1|| u.indexOf('baiduboxapp') > -1,
                'Maxthon': u.indexOf('Maxthon') > -1,
                'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
                'Liebao': u.indexOf('LBBROWSER') > -1|| u.indexOf('LieBaoFast') > -1,
                '2345Explorer': u.indexOf('2345Explorer') > -1||u.indexOf('Mb2345Browser') > -1,
                '115Browser': u.indexOf('115Browser') > -1,
                'TheWorld': u.indexOf('TheWorld') > -1,
                'XiaoMi': u.indexOf('MiuiBrowser') > -1,
                'Quark': u.indexOf('Quark') > -1,
                'Qiyu': u.indexOf('Qiyu') > -1,
                'Wechat': u.indexOf('MicroMessenger') > -1,
                'WechatWork': u.indexOf('wxwork/') > -1,
                'Taobao': u.indexOf('AliApp(TB') > -1,
                'Alipay': u.indexOf('AliApp(AP') > -1,
                'Weibo': u.indexOf('Weibo') > -1,
                'Douban': u.indexOf('com.douban.frodo') > -1,
                'Suning': u.indexOf('SNEBUY-APP') > -1,
                'iQiYi': u.indexOf('IqiyiApp') > -1,
                'DingTalk': u.indexOf('DingTalk') > -1,
                'Huawei': u.indexOf('HuaweiBrowser') > -1||u.indexOf('HUAWEI/') > -1,
                'Vivo': u.indexOf('VivoBrowser') > -1,
                //系统或平台
                'Windows': u.indexOf('Windows') > -1,
                'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
                'Mac OS': u.indexOf('Macintosh') > -1,
                'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
                'Ubuntu': u.indexOf('Ubuntu') > -1,
                'FreeBSD': u.indexOf('FreeBSD') > -1,
                'Debian': u.indexOf('Debian') > -1,
                'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone')>-1,
                'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
                'MeeGo': u.indexOf('MeeGo') > -1,
                'Symbian': u.indexOf('Symbian') > -1,
                'iOS': u.indexOf('like Mac OS X') > -1,
                'Chrome OS': u.indexOf('CrOS') > -1,
                'WebOS': u.indexOf('hpwOS') > -1,
                //设备
                'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
                'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
            };
            var is360 = false;
            if(_window.chrome){
                var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                if(_window.chrome.adblock2345||_window.chrome.common2345){
                    match['2345Explorer'] = true;
                }else if(_mime("type", "application/360softmgrplugin")||_mime("type", "application/mozilla-npqihooquicklogin")){
                    is360 = true;
                }else if(chrome_version>36&&_window.showModalDialog){
                    is360 = true;
                }else if(chrome_version>45){
                    is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
                    if(!is360&&chrome_version>=69){
                        is360 = _mime("type", "application/hwepass2001.installepass2001")||_mime("type", "application/asx");
                    }
                }
            }
            //修正
            if (match['Mobile']) {
                match['Mobile'] = !(u.indexOf('iPad') > -1);
            } else if (is360) {
                if(_mime("type", "application/gameplugin")){
                    match['360SE'] = true;
                }else if(_navigator && typeof _navigator['connection'] !== 'undefined' && typeof _navigator['connection']['saveData'] == 'undefined'){
                    match['360SE'] = true;
                }else{
                    match['360EE'] = true;
                }
            }
            if(match['IE']||match['Edge']){
                var navigator_top = window.screenTop-window.screenY;
                switch(navigator_top){
                    case 71: //无收藏栏,贴边
                    case 99: //有收藏栏,贴边
                    case 102: //有收藏栏,非贴边
                        match['360EE'] = true;
                        break;
                    case 75: //无收藏栏,贴边
                    case 105: //有收藏栏,贴边
                    case 104: //有收藏栏,非贴边
                        match['360SE'] = true;
                        break;
                }
            }
            if(match['Baidu']&&match['Opera']){
                match['Baidu'] = false;
            }else if(match['iOS']){
                match['Safari'] = true;
            }
            //基本信息
            var hash = {
                engine: ['WebKit', 'Trident', 'Gecko', 'Presto', 'KHTML'],
                browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', 'XiaoMi','Vivo', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Huawei', 'Baidu', 'Maxthon', 'Sogou', 'Liebao', '2345Explorer', '115Browser', 'TheWorld', 'Quark', 'Qiyu', 'Wechat', 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban','Suning', 'iQiYi', 'DingTalk'],
                os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
                device: ['Mobile', 'Tablet']
            };
            _this.device = 'PC';
            _this.language = (function () {
                var g = (_navigator.browserLanguage || _navigator.language);
                var arr = g.split('-');
                if (arr[1]) {
                    arr[1] = arr[1].toUpperCase();
                }
                return arr.join('_');
            })();
            for (var s in hash) {
                for (var i = 0; i < hash[s].length; i++) {
                    var value = hash[s][i];
                    if (match[value]) {
                        _this[s] = value;
                    }
                }
            }
            //系统版本信息
            var osVersion = {
                'Windows': function () {
                    var v = u.replace(/^Mozilla\/\d.0 \(Windows NT ([\d.]+);.*$/, '$1');
                    var hash = {
                        '10':'10',
                        '6.4': '10',
                        '6.3': '8.1',
                        '6.2': '8',
                        '6.1': '7',
                        '6.0': 'Vista',
                        '5.2': 'XP',
                        '5.1': 'XP',
                        '5.0': '2000'
                    };
                    return hash[v] || v;
                },
                'Android': function () {
                    return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
                },
                'iOS': function () {
                    return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
                },
                'Debian': function () {
                    return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
                },
                'Windows Phone': function () {
                    return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
                },
                'Mac OS': function () {
                    return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
                },
                'WebOS': function () {
                    return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
                }
            };
            _this.osVersion = '';
            if (osVersion[_this.os]) {
                _this.osVersion = osVersion[_this.os]();
                if (_this.osVersion == u) {
                    _this.osVersion = '';
                }
            }
            //浏览器版本信息
            var version = {
                'Safari': function () {
                    return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
                },
                'Chrome': function () {
                    return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
                },
                'IE': function () {
                    return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
                },
                'Edge': function () {
                    return u.replace(/^.*Edge\/([\d.]+).*$/, '$1').replace(/^.*Edg\/([\d.]+).*$/, '$1');
                },
                'Firefox': function () {
                    return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
                },
                'Firefox Focus': function () {
                    return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
                },
                'Chromium': function () {
                    return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
                },
                'Opera': function () {
                    return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
                },
                'Vivaldi': function () {
                    return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
                },
                'Yandex': function () {
                    return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
                },
                'Arora': function () {
                    return u.replace(/^.*Arora\/([\d.]+).*$/, '$1');
                },
                'Lunascape': function(){
                    return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1');
                },
                'QupZilla': function(){
                    return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1');
                },
                'Coc Coc': function(){
                    return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1');
                },
                'Kindle': function () {
                    return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
                },
                'Iceweasel': function () {
                    return u.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1');
                },
                'Konqueror': function () {
                    return u.replace(/^.*Konqueror\/([\d.]+).*$/, '$1');
                },
                'Iceape': function () {
                    return u.replace(/^.*Iceape\/([\d.]+).*$/, '$1');
                },
                'SeaMonkey': function () {
                    return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1');
                },
                'Epiphany': function () {
                    return u.replace(/^.*Epiphany\/([\d.]+).*$/, '$1');
                },
                '360': function(){
                    return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1');
                },
                '360SE': function(){
                    var hash = {'86':'13.0','78':'12.0','69':'11.0','63':'10.0','55':'9.1','45':'8.1','42':'8.0','31':'7.0','21':'6.3'};
                    var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                    return hash[chrome_version]||'';
                },
                '360EE': function(){
                    var hash = {'86':'13.0','78':'12.0','69':'11.0','63':'9.5','55':'9.0','50':'8.7','30':'7.5'};
                    var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                    return hash[chrome_version]||'';
                },
                'Maxthon': function () {
                    return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
                },
                'QQBrowser': function () {
                    return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
                },
                'QQ': function () {
                    return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
                },
                'Baidu': function () {
                    return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1').replace(/^.*baiduboxapp\/([\d.]+).*$/, '$1');
                },
                'UC': function () {
                    return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
                },
                'Sogou': function () {
                    return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
                },
                'Liebao': function(){
                    var version = ''
                    if(u.indexOf('LieBaoFast')>-1){
                        version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
                    }
                    var hash = {'57':'6.5','49':'6.0','46':'5.9','42':'5.3','39':'5.2','34':'5.0','29':'4.5','21':'4.0'};
                    var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                    return version||hash[chrome_version]||'';
                },
                '2345Explorer': function () {
                    var hash = {'69':'10.0','55':'9.9'};
                    var chrome_version = navigator.userAgent.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                    return hash[chrome_version]||u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1').replace(/^.*Mb2345Browser\/([\d.]+).*$/, '$1');
                },
                '115Browser': function(){
                    return u.replace(/^.*115Browser\/([\d.]+).*$/, '$1');
                },
                'TheWorld': function () {
                    return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
                },
                'XiaoMi': function () {
                    return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
                },
                'Vivo': function(){
                    return u.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1');
                },
                'Quark': function () {
                    return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
                },
                'Qiyu': function () {
                    return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
                },
                'Wechat': function () {
                    return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
                },
                'WechatWork': function () {
                    return u.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
                },
                'Taobao': function () {
                    return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
                },
                'Alipay': function () {
                    return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
                },
                'Weibo': function () {
                    return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
                },
                'Douban': function () {
                    return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
                },
                'Suning': function () {
                    return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
                },
                'iQiYi': function () {
                    return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
                },
                'DingTalk': function () {
                    return u.replace(/^.*DingTalk\/([\d.]+).*$/, '$1');
                },
                'Huawei': function () {
                    return u.replace(/^.*Version\/([\d.]+).*$/, '$1').replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1');
                }
            };
            _this.version = '';
            if (version[_this.browser]) {
                _this.version = version[_this.browser]();
                if (_this.version == u) {
                    _this.version = '';
                }
            }
            //修正
            if(_this.browser == 'Chrome'&&u.match(/\S+Browser/)){
                _this.browser = u.match(/\S+Browser/)[0];
                _this.version = u.replace(/^.*Browser\/([\d.]+).*$/, '$1');
            }
            if (_this.browser == 'Edge') {
                if(_this.version>"75"){
                    _this.engine = 'Blink';
                }else{
                    _this.engine = 'EdgeHTML';
                }
            } else if (match['Chrome']&& _this.engine=='WebKit' && parseInt(version['Chrome']()) > 27) {
                _this.engine = 'Blink';
            } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
                _this.engine = 'Blink';
            } else if (_this.browser == 'Yandex') {
                _this.engine = 'Blink';
            }
        };
    })),
    uuid:(function(){
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
           
        Math.uuid = function (len, radix) {
          var chars = CHARS, uuid = [], i;
          radix = radix || chars.length;
       
          if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
          } else {
            // rfc4122, version 4 form
            var r;
       
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
       
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
              if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
              }
            }
          }
       
          return uuid.join('');
        };
       
        // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
        // by minimizing calls to random()
        Math.uuidFast = function() {
          var chars = CHARS, uuid = new Array(36), rnd=0, r;
          for (var i = 0; i < 36; i++) {
            if (i==8 || i==13 ||  i==18 || i==23) {
              uuid[i] = '-';
            } else if (i==14) {
              uuid[i] = '4';
            } else {
              if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
              r = rnd & 0xf;
              rnd = rnd >> 4;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
          return uuid.join('');
        };
       
        // A more compact, but less performant, RFC4122v4 solution:
        Math.uuidCompact = function() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
        };
    }())
}
module.exports = util;