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

export const handleReturnFileIcon = (fileType) => {
  switch (fileType) {
    case 1:
      return faImage;
    case 2:
      return faImage;
    case 3:
      return faImage;
    case 4:
      return faImage;
    case 5:
      return faImage;
    case 6:
      return faImage;
    case 7:
      return faImage;
    case 8:
      return faImage;
    case 10:
      return faMusic;
    case 11:
      return faMusic;
    case 12:
      return faMusic;
    case 18:
      return faFileZipper;
    case 19:
      return faFileZipper;
    case 20:
      return faFilePowerpoint;
    case 25:
      return faFileZipper;
    case 26:
      return faFileZipper;
    case 30:
      return faFileZipper;
    case 31:
      return faFileWord;
    case 32:
      return faFilePowerpoint;
    case 35:
      return faFileZipper;
    case 33:
      return faFileExcel;
    case 36:
      return faFileZipper;
    case 37:
      return faFilePdf;
    case 39:
      return faFileZipper;
    case 41:
      return faFileCsv;
    case 42:
      return faFileLines;
    case 50:
      return faFileZipper;

    default:
      return faFile;
  }
};
