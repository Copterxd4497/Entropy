import { useEffect, useState } from "react";
import { fetchTopicTags } from "../../data/TopicsTagsData";

export default function TopicTags({ activeTags, setActiveTags }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchTopicTags()
      .then((data) => {
        if (!cancelled) setTags(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (label) => {
    setActiveTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  };

  if (loading && tags.length === 0) {
    return (
      <div className="topic-tags">
        <span className="tag-pill" style={{ opacity: 0.6 }}>
          Loading topics…
        </span>
      </div>
    );
  }

  return (
    <div className="topic-tags">
      {tags.map((tag) => {
        const selected = activeTags.includes(tag.label);
        return (
          <span
            key={tag.label}
            className="tag-pill"
            onClick={() => toggle(tag.label)}
            style={
              selected
                ? { background: "rgba(255,192,30,0.18)", color: "#ffc01e" }
                : {}
            }
          >
            {tag.label}
            <span className="tag-pill__count">{loading ? "…" : tag.count}</span>
          </span>
        );
      })}
    </div>
  );
}
