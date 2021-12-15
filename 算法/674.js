var findLengthOfLCIS = function(nums) {
    if (!nums.length) return 0;
    let res = 1,
        count = 1;

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] < nums[i + 1]) {
            count++;
        } else {
            count = 1;
        }
        res = res > count ? res : count;
    }
    return res;
}