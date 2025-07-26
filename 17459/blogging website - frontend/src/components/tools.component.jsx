// importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { lookInSession } from "../common/session";

// Upload image using backend
const uploadImageToServer = async (imageFile) => {
  const user = JSON.parse(lookInSession("user"));
  const token = user?.access_token;

  const formData = new FormData();
  formData.append("banner", imageFile);

  const res = await fetch(import.meta.env.VITE_SERVER_DOMAIN + "/upload-banner", {
    method: "POST",
    headers: {
      Authorization: Bearer `${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await res.json();
  return data.url;
};

const uploadImageByFile = (file) => {
  return uploadImageToServer(file)
    .then((url) => {
      return {
        success: 1,
        file: { url },
      };
    })
    .catch(() => ({
      success: 0,
    }));
};

const uploadImageByURL = (url) => {
  return Promise.resolve({
    success: 1,
    file: { url },
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};