export const codeTemplates = {
  "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
  Python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
  TypeScript: `function twoSum(nums: number[], target: number): number[] {
    
};`,
  Go: `func twoSum(nums []int, target int) []int {
    
}`,
  Rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        
    }
}`,
};

export const languages = Object.keys(codeTemplates);
