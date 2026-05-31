// Languauges
export const KR_LANGUAGE = "kr";
export const CN_LANGUAGE = "cn";
// Quiz Status
export const START_STATUS = "start";
export const END_STATUS = "end";
// Quiz Format
export const TEXT_FORMAT = "tx";
export const MCQ_FORMAT = "mcq";

// Options
export const LEVEL_OPTIONS = {
  cn: [{ label: "Level 1", value: 1 }],
  kr: [
    { label: "Level 1", value: 1 },
    { label: "Level 2", value: 2 },
    { label: "Level 3", value: 3 },
    { label: "Level 4", value: 4 },
    { label: "Level 5", value: 5 },
    { label: "Level 6", value: 6 },
  ],
};
export const DIRECTION_OPTIONS = {
  cn: [
    {
      label: "English to Chinese",
      value: "e2c",
    },
    {
      label: "Chinese to English",
      value: "c2e",
    },
  ],
  kr: [
    {
      label: "English to Korean",
      value: "e2k",
    },
    {
      label: "Korean to English",
      value: "k2e",
    },
  ],
};
export const LANGUAGE_OPTIONS = [
  {
    label: "Chinese",
    value: CN_LANGUAGE,
  },
  {
    label: "Korean",
    value: KR_LANGUAGE,
  },
];
export const FORMAT_OPTIONS = [
  {
    label: "MCQ",
    value: MCQ_FORMAT,
  },
  {
    label: "Text",
    value: TEXT_FORMAT,
  },
];
export const COLUMN_OPTIONS = {
  cn: [
    { title: "English", key: "english" },
    { title: "Pinyin", key: "pinyin" },
  ],

  kr: [
    { title: "English", key: "english" },
    { title: "Korean", key: "korean" },
  ],
};
