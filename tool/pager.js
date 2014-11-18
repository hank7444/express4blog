var pager = {
    calculatePager: function(nowPagerIndex, total, limit) {

        nowPagerIndex = +nowPagerIndex;
        total = total || 0;
        limit = limit || 10;

        var pagerIndex = nowPagerIndex - 1;
        var from = pagerIndex * limit;
        var pagerTotal = Math.ceil(total / limit);
        var pagerPrev = nowPagerIndex === 1 ? '' : nowPagerIndex - 1;
        var pagerNext = nowPagerIndex === pagerTotal ? '' : nowPagerIndex + 1;
        var pagerData = {
            'now': nowPagerIndex,
            'total': Math.ceil(total / limit),
            'begin': 1,
            'end': pagerTotal,
            'prev': pagerPrev,
            'next': pagerNext,
            'from': from
        };

        return pagerData;
    }
};
module.exports = pager;
