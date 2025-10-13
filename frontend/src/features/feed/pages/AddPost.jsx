import React, { useState, useRef } from "react";
import Switch from "@/components/ui/switch";
import createPost from "../services/createPost";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { LexicalEditor } from "@/components/lexical/components/LexicalEditor";

const AddPost = () => {
  const [text, setText] = useState("");
  const [contentArray, setContentArray] = useState([]);
  const [mentionedUid, setMentionedUid] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [privacy, setPrivacy] = useState("public");
  const [isEnableComments, setIsEnableComments] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  console.log(contentArray, mentionedUid, hashtags);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const mappedFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(mappedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    if (files.length < 1 && !text.trim()) return;

    const formData = new FormData();
    files.forEach((item) => formData.append("files", item.file));
    if (text) formData.append("text", text);
    if (mentionedUid.length) formData.append("mentionedUid", mentionedUid);
    formData.append("privacy", privacy);
    formData.append("isEnableComments", isEnableComments);

    try {
      const feedback = await createPost(formData);
      if (feedback.success) location.replace("/");
      else {
        setErrors(feedback.error);
        throw new Error(feedback.error.general || "Unexpected error");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>

      <div className="w-[50vw]">
        <LexicalEditor
          setMentionedUid={setMentionedUid}
          setContentArray={setContentArray}
          setHashtags={setHashtags}
        />
      </div>
      {errors.text && <p className="text-red-500">{errors.text}</p>}

      {/* File Upload */}
      <label className="w-full max-w-lg p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-blue-400 transition mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-gray-500 text-center">
          Click or drag & drop files here
        </p>
      </label>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-3xl">
          {files.map((item, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={item.preview}
                alt="preview"
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
              >
                ✕
              </button>
              <p className="text-xs text-center p-2 truncate">
                {item.file.name}
              </p>
            </div>
          ))}
        </div>
      )}
      {errors.attachment && <p className="text-red-500">{errors.attachment}</p>}

      {/* Privacy */}
      <div className="mt-6 flex items-center gap-4">
        <label htmlFor="privacy" className="font-medium">
          Privacy:
        </label>
        <select
          id="privacy"
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="border rounded p-2"
        >
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Private</option>
        </select>
      </div>
      {errors.privacy && <p className="text-red-500">{errors.privacy}</p>}

      {/* Comments toggle */}
      <div className="mt-4 flex items-center gap-2">
        <p>Allow comments</p>
        <Switch func={setIsEnableComments} />
      </div>
      {errors.isEnableComments && (
        <p className="text-red-500">{errors.isEnableComments}</p>
      )}

      {/* Submit button */}
      <div className="mt-6">
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? (
            <>
              <Spinner /> Posting...
            </>
          ) : (
            "Add Post"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddPost;
