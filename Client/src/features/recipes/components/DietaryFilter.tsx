import { FilterTabs } from "@/components/FilterTabs";
import type { DietaryRequirement } from "@/lib/api/generated";
import { DIETARY_REQUIREMENTS, humanize } from "@/lib/enums";

const options = DIETARY_REQUIREMENTS.map(value => ({ value, label: humanize(value) }));

type DietaryFilterProps = {
  selected: DietaryRequirement[];
  onChange: (selected: DietaryRequirement[]) => void;
};

export function DietaryFilter({ selected, onChange }: DietaryFilterProps) {
  return <FilterTabs label="Dietary" options={options} selected={selected} onChange={onChange} />;
}
