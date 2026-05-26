export const topicTags = [
  { label: "Array", count: 2171 },
  { label: "String", count: 874 },
  { label: "Hash Table", count: 815 },
  { label: "Math", count: 678 },
  { label: "Dynamic Programming", count: 656 },
  { label: "Sorting", count: 518 },
  { label: "Greedy", count: 464 },
  { label: "Binary Search", count: 340 },
  { label: "Depth-First Search", count: 230 },
];

export function fetchTopicTags() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(topicTags), 0);
  });
}
