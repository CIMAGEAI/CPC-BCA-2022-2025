import React from 'react';

const notices = [
  "📢 Welcome to our AI learning platform!",
  "🔥 New courses launching this week!",
  "🕒 Scheduled maintenance on Saturday at 2 AM.",
  "💡 Tip of the day: Break tasks into small chunks.",
  "🎓 Join our webinar on AI & Education tomorrow!",
];

const Notice: React.FC = () => {
  return (
    <div className="overflow-hidden h-40 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
        {notices.map((notice, index) => (
          <div key={index} className="text-sm text-gray-800">
            {notice}
          </div>
        ))}
      </div>
  );
};

export default Notice;
