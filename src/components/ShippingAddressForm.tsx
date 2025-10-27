"use client";

import React from 'react';
import { ShippingAddress } from '@/types/user';

interface ShippingAddressFormProps {
  value: Partial<ShippingAddress>;
  onChange: (address: Partial<ShippingAddress>) => void;
  errors?: string[];
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  value,
  onChange,
  errors = [],
}) => {
  const handleChange = (field: keyof ShippingAddress, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-[12px] border border-[rgba(0,0,0,0.1)] font-inter text-[14px] text-black placeholder-[#7c7c7c] focus:outline-none focus:border-[rgba(0,0,0,0.2)] focus:ring-1 focus:ring-[rgba(0,0,0,0.1)] transition-all";
  const selectClass = "w-full px-4 py-3 pr-10 rounded-[12px] border border-[rgba(0,0,0,0.1)] font-inter text-[14px] text-black focus:outline-none focus:border-[rgba(0,0,0,0.2)] focus:ring-1 focus:ring-[rgba(0,0,0,0.1)] transition-all appearance-none bg-white cursor-pointer";
  const labelClass = "block font-inter font-medium text-[14px] text-black mb-2";
  const errorClass = "text-red-500 text-[12px] mt-1";

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="addressee" className={labelClass}>
          Full Name *
        </label>
        <input
          id="addressee"
          type="text"
          placeholder="John Doe"
          value={value.addressee || ''}
          onChange={(e) => handleChange('addressee', e.target.value)}
          className={inputClass}
          required
        />
      </div>

      {/* Street Address & Apartment - Same Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Street Address - Takes 2 columns */}
        <div className="md:col-span-2">
          <label htmlFor="addr1" className={labelClass}>
            Street Address *
          </label>
          <input
            id="addr1"
            type="text"
            placeholder="123 Main Street"
            value={value.addr1 || ''}
            onChange={(e) => handleChange('addr1', e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {/* Apartment - Takes 1 column */}
        <div>
          <label htmlFor="addr2" className={labelClass}>
            Apt / Suite
          </label>
          <input
            id="addr2"
            type="text"
            placeholder="Apt 4B"
            value={value.addr2 || ''}
            onChange={(e) => handleChange('addr2', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="city" className={labelClass}>
            City *
          </label>
          <input
            id="city"
            type="text"
            placeholder="Los Angeles"
            value={value.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className={labelClass}>
            State *
          </label>
          <div className="relative">
            <select
              id="state"
              value={value.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </option>
              ))}
            </select>
            {/* Custom Chevron Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ZIP */}
        <div>
          <label htmlFor="zip" className={labelClass}>
            ZIP Code *
          </label>
          <input
            id="zip"
            type="text"
            placeholder="90210"
            value={value.zip || ''}
            onChange={(e) => handleChange('zip', e.target.value.replace(/[^\d-]/g, ''))}
            className={inputClass}
            maxLength={10}
            required
          />
        </div>
      </div>

      {/* Country (defaults to US) */}
      <div>
        <label htmlFor="country" className={labelClass}>
          Country *
        </label>
        <div className="relative">
          <select
            id="country"
            value={value.country || 'US'}
            onChange={(e) => handleChange('country', e.target.value)}
            className={selectClass}
            required
          >
            <option value="US">United States</option>
            {/* Add more countries if needed */}
          </select>
          {/* Custom Chevron Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
          <p className="font-inter font-semibold text-[14px] text-red-800 mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className={errorClass}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

