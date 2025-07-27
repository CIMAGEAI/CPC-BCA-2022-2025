import React from 'react';

const notices: string[] = [
  "📢 Admissions are open for the 2025 batch!",
  "🎓 Join our AI & Robotics Certification Program.",
  "📅 Seminar on 'Future of EdTech' this Friday.",
  "🏆 Congratulations to our Hackathon winners!",
  "🚌 College trip to ISRO scheduled next month.",
];

const MarqueNotice: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white overflow-hidden h-40 rounded-lg shadow-md px-6 py-4">
      <div className="animate-marquee space-y-3">
        {notices.map((notice, index) => (
          <div key={index} className="text-base font-medium">
            {notice}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueNotice;
