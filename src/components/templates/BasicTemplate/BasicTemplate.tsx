import React, { useState } from 'react';
import { FormConfig } from '../../../types/form.types';

interface TemplateProps {
  config: FormConfig;
  styling: any;
}

const BasicTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: any, value: any) => {
    const fieldErrors: string[] = [];

    if (field.required && !value) {
      fieldErrors.push(`${field.label} is required`);
    }

    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      fieldErrors.push(field.validation.customMessage || `${field.label} is invalid`);
    }

    if (field.validation?.minLength && value.length < field.validation.minLength) {
      fieldErrors.push(field.validation.customMessage || `${field.label} is too short`);
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      fieldErrors.push(field.validation.customMessage || `${field.label} is too long`);
    }

    if (field.type === "number") {
      if (isNaN(Number(value))) {
        fieldErrors.push(`${field.label} must be a number`);
      } else {
        if (field.validation?.minValue !== undefined && Number(value) < field.validation.minValue) {
          fieldErrors.push(`${field.label} should be at least ${field.validation.minValue}`);
        }
        if (field.validation?.maxValue !== undefined && Number(value) > field.validation.maxValue) {
          fieldErrors.push(`${field.label} should be at most ${field.validation.maxValue}`);
        }
      }
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    config.fields.forEach((field) => {
      const value = formData[field.name] || "";
      const fieldErrors = validateField(field, value);
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors.join(" ");
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const renderRadioGroups = (field: any) => (
    <>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#4a4a4a' }}>
        {field.label}
      </label>
      {field.groups?.map((group: any, index: number) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: group.layout === "inline" ? "row" : "column", gap: '16px' }}>
            {group.options.map((option: string, idx: number) => (
              <label key={idx} style={{ fontSize: '14px', color: '#4a4a4a' }}>
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
          {errors[field.name] && (
            <p style={{ color: '#f56565', fontSize: '12px', fontStyle: 'italic' }}>{errors[field.name]}</p>
          )}
        </div>
      ))}
    </>
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    } else {
      console.log("Validation failed. Check errors.");
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '300px', margin: 'auto' }}>
      <form
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '24px 32px',
          marginBottom: '16px'
        }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}>
          {config.formName}
        </h2>
        {config.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            {field.type === "radio" ? (
              renderRadioGroups(field)
            ) : (
              <>
                <label
                  style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#4a4a4a' }}
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <input
                  style={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                    border: '1px solid',
                    borderRadius: '4px',
                    width: '100%',
                    padding: '8px 12px',
                    color: '#4a4a4a',
                    fontSize: '14px',
                    outline: 'none',
                    ...(errors[field.name] && { borderColor: '#f56565' })
                  }}
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <p style={{ color: '#f56565', fontSize: '12px', fontStyle: 'italic' }}>{errors[field.name]}</p>
                )}
              </>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicTemplate;
