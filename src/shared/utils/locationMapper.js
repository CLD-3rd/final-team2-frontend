import { locationOptions } from "@/shared";

export const getLocationLabel = (value) => {
  const location = locationOptions.find((r) => r.value === value);
  return location ? location.label : value; // 없으면 그대로 출력
};
