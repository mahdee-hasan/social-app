import { useChatStore } from "@/app/store";
import { SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";

const MessageBody = () => {
  const [message, setMessage] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const conId = useChatStore((s) => s.openedChat);
  const bottomRef = useRef(null);
  const [text, setText] = useState("");
  const addMessage = () => {
    const bodyObject = { text, conId };
  };
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) return alert("You can upload up to 5 files only.");
    setFiles(selected);
  };
  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviews(objectUrls);

    // Revoke URLs when component unmounts or files change
    return () => objectUrls.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);
  const handleSubmit = async () => {
    try {
    } catch (error) {}
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  console.log(files, previews);
  return (
    <>
      <div className="h-9/10 max-h-9/10 flex flex-col justify-end">
        <div className="flex flex-col scrollbar-hide overflow-y-scroll gap-2">
          {message.map((i, _, arr) => (
            <div
              key={i}
              className={`flex items-center gap-2 mx-1 animate-pulse ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {i % 2 === 0 && (
                <FaUser className="rounded-full ring text-2xl drop-down" />
              )}
              <div
                className="w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600 drop-down"
                style={{
                  animationDelay: `${(arr.length - 1 - i) * 0.1}s`, // reverse delay
                }}
              ></div>
              {i % 2 !== 0 && (
                <FaUser className="rounded-full ring text-gray-400 drop-down text-2xl" />
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="h-1/10 p-5  rounded-b-xl bg-gray-400 flex items-center">
        <form
          action=""
          className="justify-between gap-2 items-center flex w-full"
          onSubmit={handleSubmit}
        >
          <label htmlFor="file" className="">
            <input
              type="file"
              name="file"
              id="file"
              className="hidden
            "
              multiple
              onChange={handleFileChange}
            />
            <IoAttach className="text-2xl" />
          </label>
          <div>hello</div>
          {previews?.map((p) => (
            <div className="">
              <img key={p} src={p.url} alt="images" />
            </div>
          ))}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg w-full bg-gray-100 p-1"
          />
          <SendHorizonal onClick={addMessage} className="cursor-pointer" />
        </form>
      </div>
    </>
  );
};

export default MessageBody;
