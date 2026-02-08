import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Feedback = ({ feedback }: any) => {

  const reviewTags = ["Poor", "Average", "Good", "Very Good", "Excellent"];

  const formatedDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="bg-white rounded-sm shadow-xs border border-gray-200 p-6 sm:p-8 mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 gap-5">
        {feedback.map((feedback: any) => {
          return (
            <div
              className="p-5 rounded-sm border border-border bg-muted transition-all space-y-2"
              key={feedback.id}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-foreground flex items-center gap-2">
                    {feedback?.username}
                  </h3>
                  <div className="flex items-center gap-4 font-semibold text-sm">
                    <span className="flex flex-wrap">
                      {[...Array(5)].map((_, index) => (
                        <span key={index}>
                          {index < feedback?.rating ? (
                            <Star
                              fill="orange"
                              strokeWidth={0}
                              className="w-4 h-4"
                            />
                          ) : (
                            <Star
                              fill="lightgray"
                              strokeWidth={0}
                              className="w-4 h-4"
                            />
                          )}
                        </span>
                      ))}
                    </span>
                    <p className=" bg-gray-200 px-3 rounded-sm">{reviewTags[feedback?.rating]}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">
                  {formatedDate(feedback?.createdAt.split("T")[0])}
                </span>
              </div>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>
                  {feedback?.comment.slice(0, 1).toUpperCase() +
                    feedback?.comment.slice(1)}
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Feedback;
