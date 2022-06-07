import {
  faFile,
  faImage,
  faMusic,
  faFileWord,
  faFileLines,
  faFilePowerpoint,
  faFileExcel,
  faFileCsv,
  faFileZipper,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const handleReturnHumanDateFormat = (timestamp) => {
  const CreateMessageDate = new Date(timestamp);

  return (
    monthNames[CreateMessageDate.getMonth()] +
    " " +
    CreateMessageDate.getDate() +
    " " +
    CreateMessageDate.getHours() +
    ":" +
    CreateMessageDate.getMinutes()
  );
};

export const handleReturnFileIcon = (fileType) => {
  switch (fileType) {
    case "image/jpeg":
      return faImage;
    case "image/apng":
      return faImage;
    case "image/avif":
      return faImage;
    case "image/gif":
      return faImage;
    case "image/svg+xml":
      return faImage;
    case "image/bmp":
      return faImage;
    case "image/webp":
      return faImage;
    case "image/png":
      return faImage;
    case "audio/aac":
      return faMusic;
    case "audio/wav":
      return faMusic;
    case "audio/mpeg":
      return faMusic;
    case "application/x-bzip":
      return faFileZipper;
    case "application/x-bzip2":
      return faFileZipper;
    case "application/vnd.ms-powerpoint":
      return faFilePowerpoint;
    case "application/gzip":
      return faFileZipper;
    case "application/vnd.rar":
      return faFileZipper;
    case "application/x-tar":
      return faFileZipper;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return faFileWord;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return faFilePowerpoint;
    case "application/zip":
      return faFileZipper;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return faFileExcel;
    case "application/x-7z-compressed":
      return faFileZipper;
    case "application/pdf":
      return faFilePdf;
    case "application/java-archive":
      return faFileZipper;
    case "text/csv":
      return faFileCsv;
    case "text/plain":
      return faFileLines;
    case "application/x-zip-compressed":
      return faFileZipper;

    default:
      return faFile;
  }
};
