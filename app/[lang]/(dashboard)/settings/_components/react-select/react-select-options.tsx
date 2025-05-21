"use client";

import { useSettingStore } from "@/store/setting/settingStore";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

const styles = {
  option: (provided: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

type OptionType = {
  value: any;
  label: string;
};

type Props = {
  selected?: { value: any };
};

const ReactSelectOption = ({ selected }: Props) => {
  const { roles, setRolesSelected } = useSettingStore();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const roleOption: OptionType[] = roles.map((role: any) => ({
    value: role.role_id,
    label: role.role_name,
  }));

  useEffect(() => {
    if (selected?.value) {
      const defaultSelected = roleOption.find(option => selected.value?.role_id === option.value) || null;
      setSelectedOption(defaultSelected);
    }
  }, [selected, roles]);

  const handleChange = (option: SingleValue<OptionType>) => {
    setSelectedOption(option);

    if (option) {
      setRolesSelected(option.value); // just the role ID
    } else {
      setRolesSelected(0); // or 0, depending on your logic
    }
  };

  return (
    <div>
      <Select isClearable={false} defaultValue={selectedOption}  styles={styles} name="roles" options={roleOption} className="react-select" classNamePrefix="select" onChange={handleChange} />
    </div>
  );
};

export default ReactSelectOption;
