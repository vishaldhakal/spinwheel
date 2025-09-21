"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { FormData } from "./types";
import { ChevronDown, Search } from "lucide-react";
import { citiesOptions } from "./citiesOptions";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      {...props}
      className="w-full px-3 py-4 bg-green-50 rounded border border-green-200 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300 appearance-none"
    >
      {children}
    </select>
    <ChevronDown
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      size={20}
    />
  </div>
));

Select.displayName = "Select";

interface Option {
  value: string;
  label: string;
  region: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string, region: string) => void;
  placeholder: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-3 py-4 bg-green-50 rounded border border-green-200 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={20} className="text-gray-400 flex-shrink-0 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded pr-10"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer truncate"
                onClick={() => {
                  onChange(option.value, option.region);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const campaignSources = [
  "Facebook Ads",
  "Retail Shop",
  "Google Ads",
  "Youtube",
  "Friend Recommended",
  "Other",
];
const professions = [
  "Service",
  "Business",
  "Self Employed",
  "Student",
  "Other",
];

interface FormFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  watch: UseFormWatch<FormData>;
}

const FormFields: React.FC<FormFieldsProps> = ({
  register,
  errors,
  control,
  watch,
}) => {
  const campaignSource = watch("how_know_about_campaign");
  const profession = watch("profession");

  const RequiredStar = () => <span className="text-red-500">*</span>;

  return (
    <>
      {[
        { label: "Customer Name", id: "customer_name", required: true },
        {
          label: "Contact Number",
          id: "phone_number",
          type: "tel",
          required: true,
        },
        {
          label: "Email",
          id: "email",
          type: "email",
          required: false,
        },
        { label: "Shop Name", id: "shop_name", required: true },
        { label: "IMEI Number", id: "imei", required: true },
      ].map(({ label, id, type = "text", required }) => (
        <div key={id} className="mb-4">
          <label
            htmlFor={id}
            className="block text-sm font-medium mb-1"
            style={{ color: "black" }}
          >
            {label} {required && <RequiredStar />}
          </label>
          <input
            type={type}
            id={id}
            {...register(id as keyof FormData)}
            className="w-full px-3 py-3 bg-green-50 rounded border border-green-400 transition duration-300"
          />
          {errors[id as keyof FormData] && (
            <p className="mt-1 text-xs text-red-500">
              {errors[id as keyof FormData]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="mb-4">
        <label
          htmlFor="sold_area"
          className="block text-sm font-medium mb-1"
          style={{ color: "#6B3D2E" }}
        >
          City <RequiredStar />
        </label>
        <Controller
          name="sold_area"
          control={control}
          render={({ field }) => (
            <SearchableDropdown
              options={citiesOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a city"
            />
          )}
        />
        {errors.sold_area && (
          <p className="mt-1 text-xs text-red-500">
            {errors.sold_area.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="how_know_about_campaign"
          className="block text-sm font-medium mb-1"
          style={{ color: "#6B3D2E" }}
        >
          How did you know about the campaign? <RequiredStar />
        </label>
        <Controller
          name="how_know_about_campaign"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <option value="">Select an option</option>
              {campaignSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.how_know_about_campaign && (
          <p className="mt-1 text-xs text-red-500">
            {errors.how_know_about_campaign.message}
          </p>
        )}
      </div>

      {campaignSource === "Other" && (
        <div className="mb-4">
          <label
            htmlFor="other_campaign_source"
            className="block text-sm font-medium mb-1"
            style={{ color: "#6B3D2E" }}
          >
            Please specify <RequiredStar />
          </label>
          <input
            type="text"
            id="other_campaign_source"
            {...register("other_campaign_source")}
            className="w-full px-3 py-2 bg-green-50 rounded border border-green-200 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            placeholder="Enter how you knew about the campaign"
          />
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="profession"
          className="block text-sm font-medium mb-1"
          style={{ color: "#6B3D2E" }}
        >
          Profession <RequiredStar />
        </label>
        <Controller
          name="profession"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <option value="">Select a profession</option>
              {professions.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.profession && (
          <p className="mt-1 text-xs text-red-500">
            {errors.profession.message}
          </p>
        )}
      </div>

      {profession === "Other" && (
        <div className="mb-4">
          <label
            htmlFor="other_profession"
            className="block text-sm font-medium mb-1"
            style={{ color: "#6B3D2E" }}
          >
            Please specify your profession <RequiredStar />
          </label>
          <input
            type="text"
            id="other_profession"
            {...register("other_profession")}
            className="w-full px-3 py-2 bg-green-50 rounded border border-green-200 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            placeholder="Enter your profession"
          />
        </div>
      )}
    </>
  );
};

export default FormFields;
