import React from "react";
import Card from "../common/Card";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "test",
      name: "Physics Final Exam",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "upload",
      name: "Chemistry Notes.pdf",
      date: "Yesterday",
      status: "processing",
    },
    {
      id: 3,
      type: "test",
      name: "Mathematics Quiz",
      date: "2 days ago",
      status: "completed",
    },
    {
      id: 4,
      type: "upload",
      name: "Biology Revision.pdf",
      date: "3 days ago",
      status: "completed",
    },
    {
      id: 5,
      type: "test",
      name: "Computer Science Test",
      date: "1 week ago",
      status: "completed",
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {activity.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.type === "test" ? "Exam/Quiz" : "Document Upload"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : activity.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentActivity;
