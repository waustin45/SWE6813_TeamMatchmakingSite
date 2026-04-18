import { getMessageInstances } from "./actions";
import MessagesClient from "./MessagesClient";

const MessagesPage = async () => {
  const { instances, currentUserId, error } = await getMessageInstances();

  if (error || !currentUserId) {
    return (
      <div className="container mt-4">
        You must be logged in to view messages.
      </div>
    );
  }

  return <MessagesClient instances={instances} currentUserId={currentUserId} />;
};

export default MessagesPage;
