String.prototype.parseToArray = function(bit, s) {
    var ret = this.split(s || "|");
    return bit ? function(l, n) {
        for (; l--;) ret[l] = parseInt(ret[l], bit);
        return ret;
    }(ret.length) : ret;
}

var map = {

    //公历天数集合
    days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    //公历节日
    feast: {
        "1-1": "元旦节",
        "2-14": "情人节",
        "3-5": "雷锋日",
        "3-8": "妇女节",
        "3-12": "植树节",
        "3-15": "消费日",
        "4-1": "愚人节",
        "5-1": "劳动节",
        "5-4": "青年节",
        "6-1": "儿童节",
        "7-1": "建党节",
        "8-1": "建军节",
        "9-10": "教师节",
        "10-1": "国庆节",
        "12-24": "平安夜",
        "12-25": "圣诞节"
    },

    //农历
    lunar: {

        //template
        tpl: "#{y}-#{m}-#{d} 星期#{W} 农历 #{CM}#{CD} #{gy}(#{sx}) #{gm} #{gd} #{so} #{cf} #{gf}",


        //闰月: leap[y-1900] & 0xf，闰月天数: leap[y-1900] & 0x10000
        leap: "ezc|esg|wog|gr9|15k0|16xc|1yl0|h40|ukw|gya|esg|wqe|wk0|15jk|2k45|zsw|16e8|yaq|tkg|1t2v|ei8|wj4|zp1|l00|lkw|2ces|8kg|tio|gdu|ei8|k12|1600|1aa8|lud|hxs|8kg|257n|t0g|2i8n|13rk|1600|2ld2|ztc|h40|2bas|7gw|t00|15ma|xg0|ztj|lgg|ztc|1v11|fc0|wr4|1sab|gcw|xig|1a34|l28|yhy|xu8|ew0|xr8|wog|g9s|1bvn|16xc|i1j|h40|tsg|fdh|es0|wk0|161g|15jk|1654|zsw|zvk|284m|tkg|ek0|xh0|wj4|z96|l00|lkw|yme|xuo|tio|et1|ei8|jw0|n1f|1aa8|l7c|gxs|xuo|tsl|t0g|13s0|16xg|1600|174g|n6a|h40|xx3|7gw|t00|141h|xg0|zog|10v8|y8g|gyh|exs|wq8|1unq|gc0|xf4|nys|l28|y8g|i1e|ew0|wyu|wkg|15k0|1aat|1640|hwg|nfn|tsg|ezb|es0|wk0|2jsm|15jk|163k|17ph|zvk|h5c|gxe|ek0|won|wj4|xn4|2dsl|lk0|yao".parseToArray(36),

        //节气
        jqmap: "0|gd4|wrn|1d98|1tuh|2akm|2rfn|38g9|3plp|46vz|4o9k|55px|5n73|64o5|6m37|73fd|7kna|81qe|8io7|8zgq|9g4b|9wnk|ad3g|ath2|".parseToArray(36),
        jqnames: "小寒|大寒|立春|雨水|惊蛰|春分|清明|谷雨|立夏|小满|芒种|夏至|小暑|大暑|立秋|处暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至".parseToArray(),

        //中文数字
        c1: "|一|二|三|四|五|六|七|八|九|十".parseToArray(),
        c2: "初|十|廿|卅|".parseToArray(),

        //中文星期
        wk: "日一二三四五六",

        //天干
        tg: "癸甲乙丙丁戊己庚辛壬",

        //地支
        dz: "亥子丑寅卯辰巳午未申酉戌",

        //生肖
        sx: "鼠牛虎兔龙蛇马羊猴鸡狗猪",

        //农历节日
        feast: {
            "1-1": "春节",
            "1-15": "元宵节",
            "5-5": "端午节",
            "8-15": "中秋节",
            "9-9": "重阳节",
            "12-8": "腊八节"
        },

        // 日期修正数组
        // ~表示日期范围
        // = 前面是日期, 后面对应的分别是年月日的修正值
        // 例: fixDate: ["2013-1-1=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
        fixDate: ["2013-1-1~2013-1-11=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
    }
};
var MAX_LUNAR_YEAY = 2100;
var MIN_LUNAR_YEAY = 1900;

class Calendar {
    constructor(context, changeCallBack) {
            this.pageCtx = context;
            this.data = {
                selectDateType: 1
            };
            this.changeCallBack = changeCallBack;
            this.initCalendar();
            this.pageCtx.setData({
                'calendar_data.selectDateType': 1
            });

        }
        /**
         *获取日期
         *@method: getDate
         *@param: {Date} || new Date()
         *@return: {y: 年, m: 月, d: 日}
         */
    getDate(date) {
            !_.isDate(date) && (date = new Date());
            return {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate()
            };
        }
        /**
    }
    *检查是否date对象
    *@method: isDate
    *@param: {Date}
    *@return: {Bool}
    */
    isDate(date) {
            return date instanceof Date && !isNaN(date);
        }
        /**
         *返回返回农历月份天数
         *@method: getDaysByLunarMonth
         *@param: {Num} lunar year
         *@param: {Num} lunar month
         *@return: {Num}
         */
    getDaysByLunarMonth(y, m) {
            return map.lunar.leap[y - 1900] & (0x10000 >> m) ? 30 : 29;
        }
        /**
         *返回公历年份的闰月月份
         *@method: getLeapMonth
         *@param: {Num} year
         *@return: {Num} || 0
         */
    getLeapMonth(y) {
            return map.lunar.leap[y - 1900] & 0xf;
        }
        /**
         *根据序号返回干支组合名
         *@method: cyclical
         *@param: {Num} 序号 (0 --> 甲子，以60进制循环)
         *@return: {String}
         */
    cyclical(n) {
        return (map.lunar.tg.charAt(n % 10) + map.lunar.dz.charAt(n % 12));
    }
    initCalendar() {
        this.initNormalCalendar();
        this.initLunarCalendar();

        this.bindEvent();
    }
    getDaysBetweenSolar(year, month, day, year1, month1, day1) {
            var date = new Date(year, month, day).getTime();
            var date1 = new Date(year1, month1, day1).getTime();
            return (date1 - date) / 86400000;
        }
        /**
         *根据公历日期返回农历日期
         *@method: toLunar
         *@param: {Num} year
         *@param: {Num} month
         *@param: {Num} day
         *@return: {cy: 农历年, cm: 农历月, cd: 农历日, CM: 农历月（中文）, CD: 农历日（中文）, isleap: 是否闰月}
         *@notice: 遵从农历习惯表达方式，如一月 --> 正月，十二月 --> 腊月，闰月等
         */
    toLunar(Y, M, D) {
            var m = 1900, //起始年份
                n = 0,
                d = (new Date(Y, M - 1, D) - new Date(1900, 0, 31)) / 86400000, //起始date
                leap = this.getLeapMonth(Y), //当年闰月
                isleap = false, //标记闰月
                _y;

            for (; m < 2050 && d > 0; m++) {
                n = this.getDaysByYear(m);
                d -= n
            };

            if (d < 0) {
                d += n, m--
            };

            _y = m;

            for (m = 1; m < 13 && d > 0; m++) {

                if (leap > 0 && m == leap + 1 && isleap === false) {
                    --m;
                    isleap = true;
                    n = this.getLeapDays(_y)
                } else {
                    n = this.getDaysByLunarMonth(_y, m)
                };

                if (isleap == true && m == (leap + 1)) isleap = false;

                d -= n;
            };

            if (d == 0 && leap > 0 && m == leap + 1 && !isleap) --m;

            if (d < 0) {
                d += n;
                --m
            };

            //修正闰月下一月第一天为非闰月
            if (d == 0) isleap = m == leap;

            //转换日期格式为1开始
            d = d + 1;

            var _fixDate = this.fixResult(map.lunar.fixDate,
                Y, M, D,

                // BUG?
                Y - (M < m ? 1 : 0), //如果公历月份小于农历就是跨年期，农历年份比公历-1
                m, d);
            return {
                cy: _fixDate.y,
                cm: _fixDate.m,
                cd: _fixDate.d,
                CM: (isleap ? "闰" : "") + ((_fixDate.m > 9 ? '十' : '') + map.lunar.c1[_fixDate.m % 10]).replace('十二', '腊').replace(/^一/, '正') + '月',
                CD: {
                    '10': '初十',
                    '20': '二十',
                    '30': '三十'
                }[_fixDate.d] || (map.lunar.c2[Math.floor(_fixDate.d / 10)] + map.lunar.c1[~~_fixDate.d % 10]),
                isleap: isleap
            }
        }
        /**
         * 对异常日期结果进行修正
         * @param  {Array} data 配置修复数据
         * @param  {Number} y    年
         * @param  {Number} m    月
         * @param  {Number} d    日
         * @return {Object}      {y, m, d}
         * fixDate: ["2013-1-11=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
         */
    fixResult(data, Y, M, D, y, m, d) {
        if (data && data.length) {
            var l = data.length,
                _match = function(y, m, d, str, pre, suf) {
                    str = str.split("~");
                    str[1] = str[1] || str[0];
                    pre = str[0].split("-");
                    suf = str[1].split("-");
                    return new Date(y, m, d) >= new Date(pre[0], pre[1], pre[2]) && new Date(y, m, d) <= new Date(suf[0], suf[1], suf[2])
                },
                val,
                li;
            while (l--) {
                li = data[l].split("=");
                val = li[1].split("|");
                _match(Y, M, D, li[0]) && (y = y + ~~(val[0]), m = m + ~~(val[1]), d = d + ~~(val[2]));
            }
        }
        return {
            y: ~~y,
            m: ~~m,
            d: ~~d
        }
    }
    initNormalCalendar() {
        var year = [];
        for (var i = MIN_LUNAR_YEAY; i < MAX_LUNAR_YEAY; i++) {
            year.push({
                id: i,
                name: i + '年'
            });
        }
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();

        this.pageCtx.setData({
            'calendar_data.years': year
        });
        this.data.years = year;
        this.getMonths(y);
        this.getDayCount(m);

        this.pageCtx.setData({
            'calendar_data.selected_value': [y - MIN_LUNAR_YEAY, m, d - 1]
        });
        this.data.selected_value = [y - MIN_LUNAR_YEAY, m, d - 1];
    }
    getMonths(y) {
        var month = [];

        for (var i = 0; i < 12; i++) {
            month.push({
                id: i,
                name: i + 1 + '月'
            })
        }

        this.pageCtx.setData({
            'calendar_data.month': month
        });
        this.data.month = month;
    }
    getDayCount(m) {
        var days = [];
        for (var i = 0; i < map.days[m]; i++) {
            days.push({
                id: i,
                name: i + 1 + '日'
            })
        }
        this.pageCtx.setData({
            'calendar_data.days': days
        });
        this.data.days = days;
    }
    initLunarCalendar() {
            var year = [];
            for (var i = MIN_LUNAR_YEAY; i < MAX_LUNAR_YEAY; i++) {
                year.push({
                    id: i,
                    name: i + ' ' + this.cyclical(i - 3)
                });
            }
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate();

            var lunar = this.toLunar(y, m + 1, d);

            this.pageCtx.setData({
                'calendar_data.lunar_years': year
            });
            this.data.lunar_years = year;

            this.getLunarMonths(y);

            this.getLunarDayCount(y, m);

            this.pageCtx.setData({
                'calendar_data.lunar_selected_value': [lunar.cy - MIN_LUNAR_YEAY, lunar.cm - 1, lunar.cd - 1]
            });
            this.data.lunar_selected_value = [lunar.cy - MIN_LUNAR_YEAY, lunar.cm - 1, lunar.cd - 1];
        }
        /**
         *返回公历年份天数
         *@method: getDaysByYear
         *@param: {Num} year
         *@return: {Num}
         */
    getDaysByYear(y) {
            for (var i = 0x8000, sum = 348; i > 0x8; i >>= 1) sum += (map.lunar.leap[y - 1900] & i) ? 1 : 0;
            return sum + this.getLeapDays(y);
        }
        /**
         *返回农历年份的闰月月份
         *@method: getLeapMonth
         *@param: {Num} year
         *@return: {Num} || 0
         */
    getLeapMonth(y) {
        return map.lunar.leap[y - 1900] & 0xf;
    }

    /**
     *返回农历年份的闰月天数
     *@method: getLeapDays
     *@param: {Num} year
     *@return: {Num} || 0
     */
    getLeapDays(y) {
        return this.getLeapMonth(y) ? (map.lunar.leap[y - 1900] & 0x10000) ? 30 : 29 : 0;
    }
    getLunarMonths(y) {
        var month = [];
        var c1 = '一|二|三|四|五|六|七|八|九|十|冬|腊'.split('|');
        for (var i = 0; i < 12; i++) {
            month.push({
                id: i + 1,
                name: c1[i] + '月'
            })
        }
        var num = this.getLeapMonth(y);
        if (num) {
            month.splice(num, 0, {
                id: num,
                name: '闰' + c1[num - 1] + '月',
                isleap: 1
            });
        }

        this.pageCtx.setData({
            'calendar_data.lunar_month': month
        });
        this.data.lunar_month = month;
    }

    getLunarDayCount(y, m, isleap) {
        var days = [];
        var num = isleap ? this.getLeapDays(y) : this.getDaysByLunarMonth(y, m + 1);
        for (var i = 0; i < num; i++) {
            days.push({
                id: i + 1,
                name: this.getLunarDayName(i)
            })
        }
        this.pageCtx.setData({
            'calendar_data.lunar_days': days
        });
        this.data.lunar_days = days;
    }
    getLunarDayName(day) {
        var a = Math.floor(day / 10);
        var str = '';
        if (day < 10) {
            str = map.lunar.c2[0];
        } else if (day < 19) {
            str = map.lunar.c2[1];
        } else if (day < 29) {
            str = map.lunar.c2[2];
        } else {
            str = map.lunar.c2[3];
        }

        return str + map.lunar.c1[day % 10 + 1]
    }
    bindEvent() {
        this.pageCtx.changeCalendarTab = this.changeCalendarTab.bind(this);
        this.pageCtx.changeLunarDate = this.changeLunarDate.bind(this);
        this.pageCtx.changeDate = this.changeDate.bind(this);
    }
    changeDate(e) {
        var value = e.detail.value;

        var year = MIN_LUNAR_YEAY + value[0];
        var oldValue = this.data.selected_value.slice(0, 3);

        this.data.selected_value = value;

        if (value[0] !== oldValue[0]) {
            this.getMonths(year);
            this.getDayCount(value[1]);
        }

        if (value[1] !== oldValue[1]) {
            this.getDayCount(value[1]);
        }

        this.changeCallBack && this.changeCallBack(this.getCurrentSelectDate());

    }
    changeLunarDate(e) {
        var value = e.detail.value;

        var year = MIN_LUNAR_YEAY + value[0];
        var oldValue = this.data.lunar_selected_value.slice(0, 3);

        this.data.lunar_selected_value = value;

        if (value[0] !== oldValue[0]) {
            this.getLunarMonths(year);
            var month = this.data.lunar_month[value[1]];
            this.getLunarDayCount(year, month.id - 1, month.isleap);
        }

        if (value[1] !== oldValue[1]) {
            var month = this.data.lunar_month[value[1]];

            this.getLunarDayCount(year, month.id - 1, month.isleap);
        }

        this.changeCallBack && this.changeCallBack(this.getCurrentSelectDate());
    }
    getCurrentSelectDate() {
        if (this.data.selectDateType === 1) {
            return {
                name: this.getDayName(),
                type: this.data.selectDateType,
                year: this.data.years[this.data.selected_value[0]].id,
                month: this.data.month[this.data.selected_value[1]].id + 1,
                day: this.data.days[this.data.selected_value[2]].id + 1,
            }
        } else {
            return {
                name: this.getLunarName(),
                type: this.data.selectDateType,
                year: this.data.lunar_years[this.data.lunar_selected_value[0]].id,
                month: this.data.lunar_month[this.data.lunar_selected_value[1]].id,
                day: this.data.lunar_days[this.data.lunar_selected_value[2]].id
            }
        }
    }
    getDayName(){
        return [this.data.years[this.data.selected_value[0]].name,
                this.data.month[this.data.selected_value[1]].name,
                this.data.days[this.data.selected_value[2]].name
            ].join('');
    }
    getLunarName(){
        return [this.data.lunar_years[this.data.lunar_selected_value[0]].id,
                this.data.lunar_month[this.data.lunar_selected_value[1]].name,
                this.data.lunar_days[this.data.lunar_selected_value[2]].name
            ].join(' ')
    }
    changeCalendarTab(e) {
        this.pageCtx.setData({
            'calendar_data.selectDateType':
                +e.target.dataset.tap
        });
        this.data.selectDateType = +e.target.dataset.tap;
        this.changeCallBack && this.changeCallBack(this.getCurrentSelectDate());
    }
};

module.exports = Calendar;