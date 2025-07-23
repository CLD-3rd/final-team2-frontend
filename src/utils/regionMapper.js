import regionOptions from "@/constants/regionOptions";

export const getRegionLabel = (value) => {
  const region = regionOptions.find((r) => r.value === value);
  return region ? region.label : value; // 없으면 그대로 출력
};
