import InboxMenu from "../components/InboxMenu";
import ConversationBox from "../components/ConversationBox";

const Inbox = () => {
  return (
    <div className="h-[100vh] flex px-4">
      <InboxMenu />
      <ConversationBox />
    </div>
  );
};

export default Inbox;
